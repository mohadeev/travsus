import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const tourId = params.id

		// Get the tour with all translation content
		const tour = await prisma.tour.findUnique({
			where: { id: tourId },
			include: {
				// Include all translation content
				nameContent: {
					include: {
						translations: true,
					},
				},
				subtitleContent: {
					include: {
						translations: true,
					},
				},
				overviewContent: {
					include: {
						translations: true,
					},
				},
				conclusionContent: {
					include: {
						translations: true,
					},
				},
				highlightsContent: {
					include: {
						translations: true,
					},
				},
				faqsContent: {
					include: {
						translations: true,
					},
				},
				inclusionsContent: {
					include: {
						translations: true,
					},
				},
				days: {
					include: {
						nameContent: {
							include: {
								translations: true,
							},
						},
						descriptionContent: {
							include: {
								translations: true,
							},
						},
					},
				},
			},
		})

		if (!tour) {
			return NextResponse.json(
				{ success: false, message: 'Tour not found' },
				{ status: 404 },
			)
		}

		// Default structure for features
		const defaultFeatures = {
			highlights: [''],
			faqs: [{ question: '', answer: '' }],
			inclusions: {
				luxury: { private: [''], shared: [''] },
				standard: { private: [''], shared: [''] },
			},
		}

		// Process translations for all languages
		const translations: Record<string, any> = {}
		const supportedLanguages = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT']

		// Initialize all languages with default structure
		supportedLanguages.forEach((lang) => {
			translations[lang] = { ...defaultFeatures }
		})

		// Process highlights translations
		tour.highlightsContent?.translations.forEach((trans) => {
			if (supportedLanguages.includes(trans.languageCode)) {
				try {
					translations[trans.languageCode].highlights = JSON.parse(trans.text)
				} catch (error) {
					console.error('Error parsing highlights translation:', error)
					translations[trans.languageCode].highlights = ['']
				}
			}
		})

		// Process FAQs translations
		tour.faqsContent?.translations.forEach((trans) => {
			if (supportedLanguages.includes(trans.languageCode)) {
				try {
					translations[trans.languageCode].faqs = JSON.parse(trans.text)
				} catch (error) {
					console.error('Error parsing FAQs translation:', error)
					translations[trans.languageCode].faqs = [{ question: '', answer: '' }]
				}
			}
		})

		// Process inclusions translations
		tour.inclusionsContent?.translations.forEach((trans) => {
			if (supportedLanguages.includes(trans.languageCode)) {
				try {
					translations[trans.languageCode].inclusions = JSON.parse(trans.text)
				} catch (error) {
					console.error('Error parsing inclusions translation:', error)
					translations[trans.languageCode].inclusions = {
						luxury: { private: [''], shared: [''] },
						standard: { private: [''], shared: [''] },
					}
				}
			}
		})

		// Get available languages that have translations
		const availableLanguages = Array.from(
			new Set([
				...(tour.highlightsContent?.translations.map((t) => t.languageCode) ||
					[]),
				...(tour.faqsContent?.translations.map((t) => t.languageCode) || []),
				...(tour.inclusionsContent?.translations.map((t) => t.languageCode) ||
					[]),
			]),
		).filter((lang) => supportedLanguages.includes(lang))

		return NextResponse.json({
			success: true,
			data: {
				translations,
				availableLanguages:
					availableLanguages.length > 0 ? availableLanguages : ['en-US'],
				tour: {
					id: tour.id,
					name: tour.name,
					subtitle: tour.subtitle,
					// Add other basic tour info if needed
				},
			},
		})
	} catch (error) {
		console.error('Error loading tour features:', error)
		return NextResponse.json(
			{ success: false, message: 'Failed to load tour features' },
			{ status: 500 },
		)
	}
}
