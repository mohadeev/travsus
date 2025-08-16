import { placesClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI
const openai = new OpenAI({
	apiKey:
		'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',
})

/**
 * Generate a concise description for a location using OpenAI
 */
async function generateDescription(
	entityName: string,
	entityType: string,
	countryName?: string,
) {
	const locationName =
		entityType === 'city' && countryName
			? `${entityName} in ${countryName}`
			: entityName

	const prompt = `Write a concise, engaging description of ${locationName} as a ${entityType} in about 110-120 words.
    
  Focus on:
  - Key attractions and characteristics
  - Cultural highlights and famous features
  - Practical information for visitors
  
  Use a lively, descriptive style similar to this example about Cannes:
  "Galas, regattas, the Film Festival and an outrageously attractive and affluent set characterize Cannes. Vast yachts obscure the view and the town lives up to its motto, 'Life is a festival.' People-watching is the activity that brings most visitors to Cannes, and hotel-lined La Croisette provides a fine promenade. First popularized by Coco Chanel, Cannes beaches are a huge draw. Get expensive seaside food and drinks service on hotel sand or opt for the free public beaches, Plages du Midi and de la Boca."
  
  Make it informative but concise, with vivid details that capture the essence of ${entityName}.`

	try {
		const completion = await openai.chat.completions.create({
			model: 'gpt-4-turbo',
			messages: [{ role: 'user', content: prompt }],
			max_tokens: 250, // Reduced token limit for shorter responses
			temperature: 0.7, // Keep this for creative descriptions
		})

		return completion.choices[0].message.content.trim()
	} catch (error) {
		console.error(`Error generating description for ${entityName}:`, error)

		// Fallback to a generic description if API fails
		if (entityType === 'country') {
			return `${entityName} captivates visitors with its blend of cultural treasures and natural beauty. Historic sites dot the landscape, while vibrant cities pulse with energy and tradition. Renowned for its distinctive cuisine and warm hospitality, the country offers experiences ranging from bustling markets to serene countryside retreats. Travelers can explore ancient monuments, sample local delicacies, and immerse themselves in festivals that showcase the nation's rich heritage.`
		} else {
			return `${entityName} charms visitors with its distinctive character and vibrant atmosphere. Historic architecture stands alongside modern developments, while local markets and cafés offer authentic cultural experiences. The city is known for its unique cuisine and lively arts scene. Visitors can explore museums, stroll through picturesque neighborhoods, and enjoy seasonal festivals that showcase local traditions.`
		}
	}
}

export async function POST(request: Request) {
	try {
		const { id, type, imageUrl } = await request.json()

		if (!id || !type || !imageUrl) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 },
			)
		}

		// Validate that type is either country or city
		if (type !== 'country' && type !== 'city') {
			return NextResponse.json(
				{ error: "Type must be either 'country' or 'city'" },
				{ status: 400 },
			)
		}

		const prisma = placesClient

		if (type === 'country') {
			// Get the current country data with content and translations
			const country = await prisma.country.findUnique({
				where: { id },
				include: {
					content: {
						include: {
							translations: true,
						},
					},
				},
			})

			if (!country) {
				return NextResponse.json(
					{ error: 'Country not found' },
					{ status: 404 },
				)
			}

			// Update the country with the new image
			// For MongoDB embedded documents, we need to use the `set` operation
			await prisma.country.update({
				where: { id },
				data: {
					image: {
						set: {
							url: '',
							public_id: '',
							uploadFrom: imageUrl,
							// url and public_id will be added later by the background process
						},
					},
				},
			})

			// Check if the country has a description
			const hasDescription = country.content?.translations?.some(
				(t) => t.type === 'description',
			)

			// If no description, generate one
			if (!hasDescription && country.content) {
				// Get the country name
				let countryName = 'Unknown Country'
				if (
					country.content.translations &&
					country.content.translations.length > 0
				) {
					// Find name translation or use first available
					const nameTranslation =
						country.content.translations.find((t) => t.type === 'country') ||
						country.content.translations[0]
					countryName = nameTranslation.text
				}

				// Generate description
				const description = await generateDescription(countryName, 'country')

				// Save the description
				await prisma.translatedText.create({
					data: {
						contentId: country.content.id,
						language: 'en-US',
						text: description,
						type: 'description',
						code3: country.code3,
					},
				})

				console.log(
					`Generated and saved description for country: ${countryName}`,
				)
			}
		} else if (type === 'city') {
			// Get the current city data with content, translations, and country info
			const city = await prisma.city.findUnique({
				where: { id },
				include: {
					content: {
						include: {
							translations: true,
						},
					},
					country: {
						select: {
							code3: true,
							content: {
								include: {
									translations: {
										where: {
											language: 'en-US',
											type: 'country',
										},
									},
								},
							},
						},
					},
				},
			})

			if (!city) {
				return NextResponse.json({ error: 'City not found' }, { status: 404 })
			}

			// Update the city with the new image
			// For MongoDB embedded documents, we need to use the `set` operation
			await prisma.city.update({
				where: { id },
				data: {
					image: {
						set: {
							uploadFrom: imageUrl,
							// url and public_id will be added later by the background process
						},
					},
				},
			})

			// Check if the city has a description
			const hasDescription = city.content?.translations?.some(
				(t) => t.type === 'description',
			)

			// If no description, generate one
			if (!hasDescription && city.content) {
				// Get the city name
				let cityName = 'Unknown City'
				if (city.content.translations && city.content.translations.length > 0) {
					// Find name translation or use first available
					const nameTranslation =
						city.content.translations.find((t) => t.type === 'city') ||
						city.content.translations[0]
					cityName = nameTranslation.text
				}

				// Get country name for context
				let countryName = 'Unknown Country'
				if (
					city.country?.content?.translations &&
					city.country.content.translations.length > 0
				) {
					countryName = city.country.content.translations[0].text
				}

				// Generate description
				const description = await generateDescription(
					cityName,
					'city',
					countryName,
				)

				// Save the description
				await prisma.translatedText.create({
					data: {
						contentId: city.content.id,
						language: 'en-US',
						text: description,
						type: 'description',
						code3: city.country?.code3 || null,
					},
				})

				console.log(`Generated and saved description for city: ${cityName}`)
			}
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error updating image:', error)
		return NextResponse.json(
			{ error: 'Failed to update image' },
			{ status: 500 },
		)
	}
}
