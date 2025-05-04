import { placesClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI
const openai = new OpenAI({
	apiKey:
		'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',
})

/**
 * Generate a concise description for a country using OpenAI
 */
async function generateCountryDescription(countryName: string) {
	const prompt = `Write a concise, engaging description of ${countryName} in about 150-180 words.
    
  Focus on:
  - Key attractions, geography, and characteristics
  - Cultural highlights and famous features
  - Practical information for visitors
  - Notable cities or regions
  
  Use a lively, descriptive style similar to this example about France:
  "France seduces travelers with its unfalteringly familiar culture, woven around café terraces, village-square markets and lace-curtained bistros. Iconic landmarks, glorious food, and fine wines provide just a few reasons to visit this diverse country. From the gothic grandeur of Notre-Dame Cathedral to the Eiffel Tower and the Palace of Versailles, France's cultural treasures are extraordinary. The country's natural scenery is equally diverse, with glittering coastlines, dramatic mountain ranges, and lush valleys. Paris, the cosmopolitan capital, is home to countless museums, galleries, and architectural marvels. Beyond the capital, regions like Provence offer lavender fields and olive groves, while the French Riviera boasts glamorous beaches and coastal towns. The Alps attract skiers and hikers, and wine regions like Bordeaux and Burgundy welcome oenophiles. French cuisine is legendary, with each region offering its own specialties and traditions."
  
  Make it informative but concise, with vivid details that capture the essence of ${countryName}.`

	try {
		const completion = await openai.chat.completions.create({
			model: 'gpt-4-turbo',
			messages: [{ role: 'user', content: prompt }],
			max_tokens: 300, // Slightly higher token limit for countries
			temperature: 0.7, // Keep this for creative descriptions
		})

		return completion.choices[0].message.content.trim()
	} catch (error) {
		console.error(`Error generating description for ${countryName}:`, error)

		// Fallback to a generic description if API fails
		return `${countryName} offers visitors a rich tapestry of experiences, from its distinctive landscapes to its vibrant cultural heritage. The country features diverse geography, including mountains, coastlines, and picturesque countryside. Historic architecture and monuments stand as testaments to the nation's past, while modern cities showcase contemporary life and innovation. ${countryName} is known for its unique cuisine, traditional arts, and cultural festivals that celebrate local customs. Visitors can explore museums, historical sites, and natural wonders throughout the country. The people are known for their hospitality and pride in their cultural identity. Whether seeking adventure, relaxation, or cultural immersion, ${countryName} provides travelers with memorable experiences and insights into its unique character and traditions.`
	}
}

export async function GET(
	request: Request,
	{ params }: { params: { code: string } },
) {
	try {
		const countryId = params.code
		console.log('Searching for country with ID:', countryId)

		if (!countryId) {
			return NextResponse.json(
				{ error: 'Country ID is required' },
				{ status: 400 },
			)
		}

		// Get the country by ID with its content and translations
		const country = await placesClient.country.findUnique({
			where: {
				id: countryId,
			},
			include: {
				content: {
					include: {
						translations: {
							where: {
								language: 'en',
							},
						},
					},
				},
			},
		})

		if (!country) {
			return NextResponse.json({ error: 'Country not found' }, { status: 404 })
		}

		// Extract the name and description from translations
		let name = ''
		let description = ''

		if (country.content && country.content.translations) {
			// Find name translation (type = "country")
			const nameTranslation = country.content.translations.find(
				(t) => t.type === 'country',
			)

			// Find description translation
			const descriptionTranslation = country.content.translations.find(
				(t) => t.type === 'description',
			)

			if (nameTranslation) {
				name = nameTranslation.text
			} else if (country.content.translations.length > 0) {
				// Fallback to first translation if specific type not found
				name = country.content.translations[0].text
			}

			if (descriptionTranslation) {
				description = descriptionTranslation.text
			} else {
				// No description found, generate one
				console.log(`No description found for ${name}, generating one...`)

				// Generate description
				description = await generateCountryDescription(name)

				// Save the generated description to the database
				try {
					await placesClient.translatedText.create({
						data: {
							contentId: country.content.id,
							language: 'en',
							text: description,
							type: 'description',
							code3: country.code3 || null,
						},
					})
					console.log(`Saved generated description for ${name}`)
				} catch (error) {
					console.error(`Error saving description for ${name}:`, error)
					// Continue with the generated description even if saving fails
				}
			}
		}

		// Prepare the response data
		const countryData = {
			id: country.id,
			code: country.code,
			code3: country.code3,
			name: name,
			description: description,
			image: country.image?.url,
			geo: country.geo,
		}

		// Return the data without cache control headers
		return NextResponse.json(countryData)
	} catch (error) {
		console.error('Error fetching country:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch country data' },
			{ status: 500 },
		)
	}
}
