export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
	Loader2,
	Search,
	CheckCircle,
	XCircle,
	AlertTriangle,
	Globe,
	Smartphone,
	Zap,
	Shield,
} from 'lucide-react'

interface SEOAnalysis {
	url: string
	score: number
	technical: {
		robotsTxt: boolean
		sitemap: boolean
		httpsEnabled: boolean
		mobileResponsive: boolean
		pageSpeed: number
		structuredData: boolean
	}
	onPage: {
		titleTag: string
		metaDescription: string
		headings: {
			h1: number
			h2: number
			h3: number
			h4: number
			h5: number
			h6: number
		}
		images: { total: number; withAlt: number; optimized: number }
		internalLinks: number
		externalLinks: number
	}
	content: {
		wordCount: number
		readabilityScore: number
		keywordDensity: number
		freshness: string
	}
	recommendations: string[]
}

export default function page() {
	const [url, setUrl] = useState('')
	const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const analyzeWebsite = async () => {
		if (!url) return

		setLoading(true)
		setError('')
		setAnalysis(null)

		try {
			const response = await fetch('/api/analyze', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url }),
			})

			if (!response.ok) {
				throw new Error('Failed to analyze website')
			}

			const data = await response.json()
			setAnalysis(data)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred')
		} finally {
			setLoading(false)
		}
	}

	const getScoreColor = (score: number) => {
		if (score >= 80) return 'text-green-600'
		if (score >= 60) return 'text-yellow-600'
		return 'text-red-600'
	}

	const getScoreBadge = (score: number) => {
		if (score >= 80)
			return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
		if (score >= 60)
			return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
		return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
	}

	return (
		<div className="bg-background min-h-screen p-4">
			<div className="mx-auto max-w-6xl space-y-8">
				{/* Header */}
				<div className="space-y-4 text-center">
					<h1 className="text-balance text-4xl font-bold">
						SEO Website Analyzer
					</h1>
					<p className="text-muted-foreground text-pretty text-xl">
						Get a comprehensive SEO analysis of any website with actionable
						recommendations
					</p>
				</div>

				{/* URL Input */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Globe className="h-5 w-5" />
							Website Analysis
						</CardTitle>
						<CardDescription>
							Enter a website URL to get a detailed SEO analysis report
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex gap-4">
							<Input
								placeholder="https://example.com"
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								className="flex-1"
								onKeyPress={(e) => e.key === 'Enter' && analyzeWebsite()}
							/>
							<Button onClick={analyzeWebsite} disabled={loading || !url}>
								{loading ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Search className="mr-2 h-4 w-4" />
								)}
								Analyze
							</Button>
						</div>
						{error && (
							<Alert className="mt-4">
								<AlertTriangle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
					</CardContent>
				</Card>

				{/* Analysis Results */}
				{analysis && (
					<div className="space-y-6">
						{/* Overall Score */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<span>Overall SEO Score</span>
									{getScoreBadge(analysis.score)}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center gap-4">
										<div
											className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}
										>
											{analysis.score}/100
										</div>
										<Progress value={analysis.score} className="flex-1" />
									</div>
									<p className="text-muted-foreground text-sm">
										Analyzed: {analysis.url}
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Technical SEO */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Zap className="h-5 w-5" />
									Technical SEO
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
									<div className="flex items-center gap-2">
										{analysis.technical.robotsTxt ? (
											<CheckCircle className="h-4 w-4 text-green-600" />
										) : (
											<XCircle className="h-4 w-4 text-red-600" />
										)}
										<span className="text-sm">Robots.txt</span>
									</div>
									<div className="flex items-center gap-2">
										{analysis.technical.sitemap ? (
											<CheckCircle className="h-4 w-4 text-green-600" />
										) : (
											<XCircle className="h-4 w-4 text-red-600" />
										)}
										<span className="text-sm">XML Sitemap</span>
									</div>
									<div className="flex items-center gap-2">
										{analysis.technical.httpsEnabled ? (
											<CheckCircle className="h-4 w-4 text-green-600" />
										) : (
											<XCircle className="h-4 w-4 text-red-600" />
										)}
										<span className="text-sm">HTTPS Enabled</span>
									</div>
									<div className="flex items-center gap-2">
										{analysis.technical.mobileResponsive ? (
											<CheckCircle className="h-4 w-4 text-green-600" />
										) : (
											<XCircle className="h-4 w-4 text-red-600" />
										)}
										<span className="text-sm">Mobile Responsive</span>
									</div>
									<div className="flex items-center gap-2">
										<Smartphone className="h-4 w-4" />
										<span className="text-sm">
											Page Speed: {analysis.technical.pageSpeed}/100
										</span>
									</div>
									<div className="flex items-center gap-2">
										{analysis.technical.structuredData ? (
											<CheckCircle className="h-4 w-4 text-green-600" />
										) : (
											<XCircle className="h-4 w-4 text-red-600" />
										)}
										<span className="text-sm">Structured Data</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* On-Page SEO */}
						<Card>
							<CardHeader>
								<CardTitle>On-Page SEO</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<h4 className="mb-2 font-medium">Title Tag</h4>
										<p className="text-muted-foreground bg-muted rounded p-2 text-sm">
											{analysis.onPage.titleTag || 'No title tag found'}
										</p>
									</div>
									<div>
										<h4 className="mb-2 font-medium">Meta Description</h4>
										<p className="text-muted-foreground bg-muted rounded p-2 text-sm">
											{analysis.onPage.metaDescription ||
												'No meta description found'}
										</p>
									</div>
									<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
										<div className="text-center">
											<div className="text-2xl font-bold">
												{analysis.onPage.headings.h1}
											</div>
											<div className="text-muted-foreground text-xs">
												H1 Tags
											</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold">
												{analysis.onPage.headings.h2}
											</div>
											<div className="text-muted-foreground text-xs">
												H2 Tags
											</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold">
												{analysis.onPage.headings.h3}
											</div>
											<div className="text-muted-foreground text-xs">
												H3 Tags
											</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold">
												{analysis.onPage.images.total}
											</div>
											<div className="text-muted-foreground text-xs">
												Images
											</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold">
												{analysis.onPage.internalLinks}
											</div>
											<div className="text-muted-foreground text-xs">
												Internal Links
											</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold">
												{analysis.onPage.externalLinks}
											</div>
											<div className="text-muted-foreground text-xs">
												External Links
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Content Analysis */}
						<Card>
							<CardHeader>
								<CardTitle>Content Analysis</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
									<div className="text-center">
										<div className="text-2xl font-bold">
											{analysis.content.wordCount}
										</div>
										<div className="text-muted-foreground text-xs">
											Word Count
										</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold">
											{analysis.content.readabilityScore}/100
										</div>
										<div className="text-muted-foreground text-xs">
											Readability
										</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold">
											{analysis.content.keywordDensity}%
										</div>
										<div className="text-muted-foreground text-xs">
											Keyword Density
										</div>
									</div>
									<div className="text-center">
										<div className="text-sm font-bold">
											{analysis.content.freshness}
										</div>
										<div className="text-muted-foreground text-xs">
											Content Freshness
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Recommendations */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Shield className="h-5 w-5" />
									Recommendations
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									{analysis.recommendations.map((recommendation, index) => (
										<div key={index} className="flex items-start gap-2">
											<AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
											<span className="text-sm">{recommendation}</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</div>
	)
}
