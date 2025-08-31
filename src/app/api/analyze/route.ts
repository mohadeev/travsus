import { type NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { chromium } from 'playwright'

export async function POST(request: NextRequest) {
	try {
		const { url } = await request.json()

		if (!url) {
			return NextResponse.json({ error: 'URL is required' }, { status: 400 })
		}

		// Validate URL format
		let targetUrl: URL
		try {
			targetUrl = new URL(url.startsWith('http') ? url : `https://${url}`)
		} catch {
			return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
		}

		let html: string
		let browser

		try {
			browser = await chromium.launch({ headless: true })
			const page = await browser.newPage()

			// Set user agent to avoid bot detection
			await page.setUserAgent(
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
			)

			// Navigate to the page and wait for it to load completely
			await page.goto(targetUrl.toString(), {
				waitUntil: 'networkidle',
				timeout: 30000,
			})

			// Wait a bit more for any dynamic content to load
			await page.waitForTimeout(2000)

			// Get the fully rendered HTML
			html = await page.content()
		} catch (error) {
			console.error('Browser error:', error)
			return NextResponse.json(
				{ error: 'Failed to render website' },
				{ status: 400 },
			)
		} finally {
			if (browser) {
				await browser.close()
			}
		}

		console.log('[v0] Successfully got rendered HTML, length:', html.length)

		// Parse HTML and analyze
		const analysis = await analyzeWebsite(html, targetUrl.toString())

		return NextResponse.json(analysis)
	} catch (error) {
		console.error('Analysis error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}

async function analyzeWebsite(html: string, url: string) {
	const $ = cheerio.load(html)

	// Extract title - try multiple approaches
	let title = $('title').first().text().trim()
	if (!title) {
		// Try to find title in meta tags or JSON-LD
		title = $('meta[property="og:title"]').attr('content')?.trim() || ''
		if (!title) {
			title = $('meta[name="twitter:title"]').attr('content')?.trim() || ''
		}
	}

	// Extract meta description - try multiple approaches
	let metaDescription =
		$('meta[name="description"]').attr('content')?.trim() || ''
	if (!metaDescription) {
		metaDescription =
			$('meta[property="og:description"]').attr('content')?.trim() || ''
		if (!metaDescription) {
			metaDescription =
				$('meta[name="twitter:description"]').attr('content')?.trim() || ''
		}
	}

	// Remove all script tags, style tags, and other non-content elements
	$('script').remove()
	$('style').remove()
	$('noscript').remove()
	$('link').remove()
	$('meta').remove()
	$('head').remove()
	$('svg').remove()
	$('iframe').remove()

	// Remove comments and other noise
	$('*')
		.contents()
		.filter(function () {
			return this.type === 'comment'
		})
		.remove()

	// Focus on main content areas - try to find the actual content
	let contentArea = $('main').first()
	if (contentArea.length === 0) {
		contentArea = $('article').first()
	}
	if (contentArea.length === 0) {
		contentArea = $('[role="main"]').first()
	}
	if (contentArea.length === 0) {
		contentArea = $('#content, .content, #main-content, .main-content').first()
	}
	if (contentArea.length === 0) {
		contentArea = $('body')
	}

	// Count headings in the content area
	const headings = {
		h1: contentArea.find('h1').length,
		h2: contentArea.find('h2').length,
		h3: contentArea.find('h3').length,
		h4: contentArea.find('h4').length,
		h5: contentArea.find('h5').length,
		h6: contentArea.find('h6').length,
	}

	// If no headings found, try the whole document
	if (Object.values(headings).every((count) => count === 0)) {
		headings.h1 = $('h1').length
		headings.h2 = $('h2').length
		headings.h3 = $('h3').length
		headings.h4 = $('h4').length
		headings.h5 = $('h5').length
		headings.h6 = $('h6').length
	}

	// Count images and alt tags
	const $images = $('img')
	const totalImages = $images.length
	const imagesWithAlt = $images.filter((_, img) => {
		const altText = $(img).attr('alt')
		return altText && altText.trim().length > 0
	}).length

	// Count links more accurately
	const $allLinks = $('a[href]')
	const baseUrl = new URL(url)

	let internalLinks = 0
	let externalLinks = 0

	$allLinks.each((_, link) => {
		const href = $(link).attr('href')
		if (!href) return

		try {
			if (href.startsWith('/') || href.startsWith('#')) {
				internalLinks++
			} else if (href.startsWith('http')) {
				const linkUrl = new URL(href)
				if (linkUrl.hostname === baseUrl.hostname) {
					internalLinks++
				} else {
					externalLinks++
				}
			}
		} catch {
			// Invalid URL, skip
		}
	})

	// Extract text content more aggressively
	let textContent = ''

	// Try to get text from main content areas first
	if (contentArea.length > 0) {
		textContent = contentArea.text()
	} else {
		textContent = $('body').text()
	}

	// Clean up the text content
	textContent = textContent
		.replace(/\s+/g, ' ') // Replace multiple whitespace with single space
		.replace(/\n+/g, ' ') // Replace newlines with spaces
		.replace(/\t+/g, ' ') // Replace tabs with spaces
		.trim()

	// If still no meaningful content, try to extract from specific elements
	if (textContent.length < 50) {
		const textElements = $('p, div, span, article, section').filter((_, el) => {
			const text = $(el).text().trim()
			return text.length > 20 && !$(el).find('script, style').length
		})

		textContent = textElements
			.map((_, el) => $(el).text().trim())
			.get()
			.join(' ')
		textContent = textContent.replace(/\s+/g, ' ').trim()
	}

	// Calculate word count from cleaned text
	const words = textContent.split(/\s+/).filter((word) => word.length > 2)
	const wordCount = words.length

	// Check technical aspects
	const httpsEnabled = url.startsWith('https://')
	const hasViewportMeta = $('meta[name="viewport"]').length > 0
	const hasStructuredData =
		$('script[type="application/ld+json"]').length > 0 ||
		$('[itemscope]').length > 0 ||
		$('[property^="og:"]').length > 0

	// Check for Open Graph tags
	const hasOpenGraph = $('meta[property^="og:"]').length > 0

	// Check for Twitter Card tags
	const hasTwitterCard = $('meta[name^="twitter:"]').length > 0

	// Check for canonical URL
	const hasCanonical = $('link[rel="canonical"]').length > 0

	// Check for robots.txt and sitemap
	let robotsTxt = false
	let sitemap = false

	try {
		const robotsResponse = await fetch(`${baseUrl.origin}/robots.txt`)
		robotsTxt = robotsResponse.ok
	} catch {}

	try {
		const sitemapResponse = await fetch(`${baseUrl.origin}/sitemap.xml`)
		sitemap = sitemapResponse.ok
	} catch {}

	// Calculate scores and generate recommendations
	let score = 0
	const recommendations: string[] = []

	// Technical SEO scoring
	if (httpsEnabled) score += 10
	else recommendations.push('Enable HTTPS for better security and SEO ranking')

	if (hasViewportMeta) score += 10
	else recommendations.push('Add viewport meta tag for mobile responsiveness')

	if (robotsTxt) score += 5
	else
		recommendations.push(
			'Create a robots.txt file to guide search engine crawlers',
		)

	if (sitemap) score += 5
	else
		recommendations.push(
			'Create an XML sitemap to help search engines index your pages',
		)

	if (hasStructuredData) score += 10
	else
		recommendations.push('Add structured data markup to enhance search results')

	if (hasCanonical) score += 5
	else
		recommendations.push(
			'Add a canonical URL to prevent duplicate content issues',
		)

	if (hasOpenGraph) score += 5
	else
		recommendations.push(
			'Add Open Graph meta tags for better social media sharing',
		)

	if (hasTwitterCard) score += 5
	else
		recommendations.push(
			'Add Twitter Card meta tags for better Twitter sharing',
		)

	// On-page SEO scoring
	if (title && title.length >= 30 && title.length <= 60) score += 15
	else if (title) {
		score += 5
		if (title.length < 30)
			recommendations.push('Title tag is too short, aim for 30-60 characters')
		if (title.length > 60)
			recommendations.push('Title tag is too long, aim for 30-60 characters')
	} else recommendations.push('Add a descriptive title tag to your page')

	if (
		metaDescription &&
		metaDescription.length >= 120 &&
		metaDescription.length <= 160
	)
		score += 10
	else if (metaDescription) {
		score += 5
		if (metaDescription.length < 120)
			recommendations.push(
				'Meta description is too short, aim for 120-160 characters',
			)
		if (metaDescription.length > 160)
			recommendations.push(
				'Meta description is too long, aim for 120-160 characters',
			)
	} else
		recommendations.push(
			'Add a compelling meta description to improve click-through rates',
		)

	if (headings.h1 === 1) score += 10
	else if (headings.h1 === 0)
		recommendations.push('Add exactly one H1 tag to your page')
	else
		recommendations.push(
			'Use only one H1 tag per page for better SEO structure',
		)

	if (headings.h2 > 0) score += 5
	else recommendations.push('Use H2 tags to structure your content hierarchy')

	// Image optimization
	if (totalImages > 0) {
		const altPercentage = (imagesWithAlt / totalImages) * 100
		if (altPercentage >= 90) score += 10
		else if (altPercentage >= 70) score += 5
		else
			recommendations.push(
				'Add alt text to all images for better accessibility and SEO',
			)
	}

	// Content scoring
	if (wordCount >= 300) score += 10
	else if (wordCount > 0)
		recommendations.push(
			`Increase content length to at least 300 words (currently ${wordCount} words)`,
		)
	else recommendations.push('Add meaningful text content to your page')

	if (internalLinks > 0) score += 5
	else
		recommendations.push(
			'Add internal links to improve site navigation and SEO',
		)

	// Ensure score doesn't exceed 100
	score = Math.min(score, 100)

	console.log('[v0] Content extraction debug:', {
		titleFound: !!title,
		titleLength: title.length,
		metaDescFound: !!metaDescription,
		metaDescLength: metaDescription.length,
		wordCount,
		textContentLength: textContent.length,
		headingsFound: Object.values(headings).reduce((a, b) => a + b, 0),
		imagesFound: totalImages,
		linksFound: internalLinks + externalLinks,
	})

	return {
		url,
		score,
		technical: {
			robotsTxt,
			sitemap,
			httpsEnabled,
			mobileResponsive: hasViewportMeta,
			pageSpeed: Math.floor(Math.random() * 40) + 60, // Simulated score
			structuredData: hasStructuredData,
			canonical: hasCanonical,
			openGraph: hasOpenGraph,
			twitterCard: hasTwitterCard,
		},
		onPage: {
			titleTag: title,
			titleLength: title.length,
			metaDescription,
			metaDescriptionLength: metaDescription.length,
			headings,
			images: {
				total: totalImages,
				withAlt: imagesWithAlt,
				optimized: Math.floor(imagesWithAlt * 0.8), // Simulated
			},
			internalLinks,
			externalLinks,
		},
		content: {
			wordCount,
			readabilityScore: Math.floor(Math.random() * 30) + 70, // Simulated
			keywordDensity: Math.round((Math.random() * 3 + 1) * 10) / 10, // Simulated
			freshness: 'Recent', // Simulated
		},
		recommendations,
	}
}
