export const dynamic = "force-dynamic";
import { db, T, must, newId } from '@/lib/db'
import { GEO_CONTENT } from '@/lib/geo'
import { adminOnly } from '@/lib/guards'
import { type NextRequest, NextResponse } from 'next/server'


export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const type = new URL(request.url).searchParams.get('type') || 'country'

		const location: any = must(
			await db
				.from(geoTable(type))
				.select(`id, ${GEO_CONTENT}`)
				.eq('id', params.id)
				.maybeSingle(),
		)

		if (!location) {
			return NextResponse.json(
				{ success: false, message: 'Location not found' },
				{ status: 404 },
			)
		}

		const translationsByLanguage: any = {}
		const availableLanguages: string[] = []

		location.content?.translations.forEach((translation: any) => {
			if (!translationsByLanguage[translation.language]) {
				translationsByLanguage[translation.language] = {
					name: '',
					description: '',
				}
				availableLanguages.push(translation.language)
			}

			// Handle different translation types
			if (translation.type === type) {
				translationsByLanguage[translation.language].name = translation.text
			} else if (translation.type === 'description') {
				translationsByLanguage[translation.language].description =
					translation.text
			}
		})

		return NextResponse.json({
			success: true,
			translations: translationsByLanguage,
			availableLanguages: [...new Set(availableLanguages)],
		})
	} catch (error) {
		console.error('Error fetching location translations:', error)
		return NextResponse.json(
			{ success: false, message: 'Failed to fetch translations' },
			{ status: 500 },
		)
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const denied = await adminOnly()
		if (denied) return denied

		const { translations } = await request.json()
		const type = new URL(request.url).searchParams.get('type') || 'country'

		const location = must(
			await db.from(geoTable(type)).select('contentId').eq('id', params.id).maybeSingle(),
		)

		if (!location || !location.contentId) {
			return NextResponse.json(
				{ success: false, message: 'Location not found' },
				{ status: 404 },
			)
		}

		const results: string[] = []
		const errors: string[] = []

		for (const [language, translationData] of Object.entries<any>(translations)) {
			if (!translationData || typeof translationData !== 'object') continue

			const { name, description } = translationData as {
				name: string
				description: string
			}

			// Handle name translation
			if (name && name.trim()) {
				try {
					await setGeoText(location.contentId, language, type, name.trim())

					results.push(`${language} name: Updated successfully`)
				} catch (error) {
					console.error(`Error updating ${language} name:`, error)
					errors.push(`${language} name: ${(error as Error).message}`)
				}
			}

			// Handle description translation
			if (description && description.trim()) {
				try {
					await setGeoText(location.contentId, language, 'description', description.trim())

					results.push(`${language} description: Updated successfully`)
				} catch (error) {
					console.error(`Error updating ${language} description:`, error)
					errors.push(`${language} description: ${(error as Error).message}`)
				}
			}
		}

		return NextResponse.json({
			success: errors.length === 0,
			message: `Processed ${Object.keys(translations).length} languages`,
			results,
			errors: errors.length > 0 ? errors : undefined,
		})
	} catch (error) {
		console.error('Error updating location translations:', error)
		return NextResponse.json(
			{ success: false, message: 'Failed to update translations' },
			{ status: 500 },
		)
	}
}

/** country | city | anything else (place) -> table name */
function geoTable(type: string) {
	return type === 'country' ? T.countries : type === 'city' ? T.cities : T.places
}

/** Creates or updates one translated text (by content, language and type). */
async function setGeoText(contentId: string, language: string, type: string, text: string) {
	const existing = must(
		await db
			.from(T.geoTexts)
			.select('id')
			.match({ contentId, language, type })
			.limit(1)
			.maybeSingle(),
	)
	if (existing) {
		must(await db.from(T.geoTexts).update({ text }).eq('id', existing.id))
	} else {
		must(await db.from(T.geoTexts).insert({ id: newId(), contentId, language, text, type }))
	}
}
