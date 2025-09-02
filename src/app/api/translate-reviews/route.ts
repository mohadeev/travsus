import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SUPPORTED_LANGUAGES = [
	'en-US',
	'es-ES',
	'de-DE',
	'ja-JP',
	'pt-PT',
	'it-IT',
	'fr-FR',
	'ru-RU',
	'zh-CN',
	'ko-KR',
]

const CONFIG = {
	V0_API_KEY: process.env.V0_API_KEY,
}

interface TranslationResponse {
	choices: Array<{
		message: {
			content: string
		}
	}>
}

async function translateText(
	text: string,
	targetLanguage: string,
): Promise<string> {
	try {
		const response = await fetch('https://api.v0.dev/v1/chat/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${CONFIG.V0_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: 'gpt-4',
				messages: [
					{
						role: 'system',
						content: `You are a professional translator. Translate the given text to ${targetLanguage}. Return only the translated text, no explanations or additional content.`,
					},
					{
						role: 'user',
						content: text,
					},
				],
				max_tokens: 1000,
				temperature: 0.3,
			}),
		})

		if (!response.ok) {
			throw new Error(`Translation API error: ${response.status}`)
		}

		const data: TranslationResponse = await response.json()
		return data.choices[0]?.message?.content || text
	} catch (error) {
		console.error(`Translation error for ${targetLanguage}:`, error)
		return text // Return original text if translation fails
	}
}

async function getOrCreateTranslatableContent(
	contentType: string,
	entityId: string,
	originalText: string,
) {
	// Try to find existing translatable content
	let translatableContent = await prisma.translatableContent.findFirst({
		where: {
			contentType,
			entityId,
		},
		include: {
			translations: true,
		},
	})

	// Create if doesn't exist
	if (!translatableContent) {
		translatableContent = await prisma.translatableContent.create({
			data: {
				contentType,
				entityId,
				translations: {
					create: {
						languageCode: 'en-US', // Assuming original is English
						text: originalText,
					},
				},
			},
			include: {
				translations: true,
			},
		})
	}

	return translatableContent
}

async function translateReviewField(
	review: any,
	fieldName: 'title' | 'content',
	contentType: string,
) {
	const originalText = review[fieldName]
	if (!originalText) return { translated: 0, skipped: 0 }

	console.log(`Processing ${fieldName} for review ${review.id}`)

	// Get or create translatable content
	const translatableContent = await getOrCreateTranslatableContent(
		contentType,
		review.id,
		originalText,
	)

	// Get existing translations
	const existingTranslations = translatableContent.translations.map(
		(t) => t.languageCode,
	)
	const missingLanguages = SUPPORTED_LANGUAGES.filter(
		(lang) => !existingTranslations.includes(lang),
	)

	let translatedCount = 0
	const skippedCount = existingTranslations.length

	// Translate missing languages one by one
	for (const language of missingLanguages) {
		console.log(
			`Translating ${fieldName} to ${language} for review ${review.id}`,
		)

		const translatedText = await translateText(originalText, language)

		// Save translation immediately
		await prisma.translatedText.create({
			data: {
				contentId: translatableContent.id,
				languageCode: language,
				text: translatedText,
			},
		})

		translatedCount++
		console.log(
			`✅ Saved ${fieldName} translation (${language}) for review ${review.id}`,
		)
	}

	// Update review with translatable content ID if not already set
	const contentIdField =
		fieldName === 'title' ? 'titleContentId' : 'contentContentId'
	if (!review[contentIdField]) {
		await prisma.review.update({
			where: { id: review.id },
			data: {
				[contentIdField]: translatableContent.id,
			},
		})
	}

	return { translated: translatedCount, skipped: skippedCount }
}

export async function GET(request: NextRequest) {
	try {
		console.log('🚀 Starting review translation process...')
		console.log('CONFIG.V0_API_KEY', CONFIG.V0_API_KEY)
		// Check if V0 API key is configured
		if (!CONFIG.V0_API_KEY) {
			return NextResponse.json(
				{ error: 'V0_API_KEY environment variable is not configured' },
				{ status: 500 },
			)
		}

		// Get all reviews
		const reviews = await prisma.review.findMany({
			select: {
				id: true,
				title: true,
				content: true,
				titleContentId: true,
				contentContentId: true,
				user: {
					select: {
						name: true,
						email: true,
					},
				},
			},
		})

		console.log(`Found ${reviews.length} reviews to process`)

		let totalTranslated = 0
		let totalSkipped = 0
		const processedReviews = []

		// Process each review one by one
		for (const review of reviews) {
			console.log(`\n📝 Processing review ${review.id}`)

			const reviewResult = {
				reviewId: review.id,
				user: review.user.name || review.user.email,
				titleTranslated: 0,
				titleSkipped: 0,
				contentTranslated: 0,
				contentSkipped: 0,
			}

			// Translate title if exists
			if (review.title) {
				const titleResult = await translateReviewField(
					review,
					'title',
					'review_title',
				)
				reviewResult.titleTranslated = titleResult.translated
				reviewResult.titleSkipped = titleResult.skipped
				totalTranslated += titleResult.translated
				totalSkipped += titleResult.skipped
			}

			// Translate content if exists
			if (review.content) {
				const contentResult = await translateReviewField(
					review,
					'content',
					'review_content',
				)
				reviewResult.contentTranslated = contentResult.translated
				reviewResult.contentSkipped = contentResult.skipped
				totalTranslated += contentResult.translated
				totalSkipped += contentResult.skipped
			}

			processedReviews.push(reviewResult)
			console.log(`✅ Completed review ${review.id}`)
		}

		console.log('🎉 Translation process completed!')

		return NextResponse.json({
			success: true,
			summary: {
				totalReviews: reviews.length,
				totalTranslations: totalTranslated,
				totalSkipped: totalSkipped,
				supportedLanguages: SUPPORTED_LANGUAGES,
			},
			processedReviews,
		})
	} catch (error) {
		console.error('Translation process error:', error)
		return NextResponse.json(
			{
				error: 'Translation process failed',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
