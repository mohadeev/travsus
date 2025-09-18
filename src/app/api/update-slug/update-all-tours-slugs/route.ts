// app/api/regenerate-tour-slugs/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/prisma'
import { placesClient } from '@/lib/prisma'
import { slugify } from 'transliteration'
import slugifySecond from '@/utils/slugify'
import { useTranslations } from '@/lib/i18n'

// ✅ simplified translation extractor
function createLocationObject(city: any, language: string) {
	const cityTr = city.translations?.find((t: any) => t.language === language)
	const countryTr = city.country?.translations?.find(
		(t: any) => t.language === language,
	)
	return {
		cityName: cityTr?.name || '',
		countryName: countryTr?.name || '',
	}
}

export async function GET() {
	console.log('🔄 Regenerating tour slugs...')

	try {
		const tours = await prisma.tour.findMany({
			include: {
				translations: true,
				days: true,
			},
		})

		console.log(`📊 Processing ${tours.length} tours...`)

		const results: { id: string; slugs: string[] }[] = []

		for (const tour of tours) {
			const slugs: string[] = []

			for (const translation of tour.translations) {
				const languageCode = translation.language
				const translatedName = translation.name || `tour-${tour.id}`

				// ✅ get localized "tours" label
				const t = useTranslations('Jan03_TourHeader_x9k2', languageCode)
				const toursLabel = t('tours_slug')

				// default fallback location
				let countryName = 'morocco'
				let cityName = 'marrakech'

				// try to resolve first city from days
				const firstDayWithCity = tour.days.find(
					(day) => day.cityId && day.cityId !== 'undefined',
				)

				if (firstDayWithCity) {
					try {
						const city = await placesClient.city.findUnique({
							where: { id: firstDayWithCity.cityId },
							select: {
								id: true,
								translations: true,
								country: { select: { translations: true } },
							},
						})

						if (city) {
							const location = createLocationObject(city, languageCode)
							countryName = location.countryName || countryName
							cityName = location.cityName || cityName
						}
					} catch (err) {
						console.error(`⚠️ Failed fetching city for tour ${tour.id}:`, err)
					}
				}

				// 🔑 build slug (same style as generateTourLink)
				const rawPath = `/${slugify(countryName)}/${slugify(cityName)}/${slugify(
					toursLabel,
				)}/${slugify(translatedName)}/${tour.id}`

				const fullSlug = `/${languageCode}${slugifySecond(rawPath)}`
				slugs.push(fullSlug)
				console.log(`  ✅ ${languageCode}: ${fullSlug}`)
			}

			if (slugs.length === 0) {
				const fallbackName = tour.name || `tour-${tour.id}`
				const t = useTranslations('Jan03_TourHeader_x9k2', 'en-US')
				const toursLabel = t('tours_slug')

				const fallbackPath = `/${slugify('morocco')}/${slugify(
					'marrakech',
				)}/${slugify(toursLabel)}/${slugify(fallbackName)}/${tour.id}`

				const fallbackSlug = `/en-US${slugifySecond(fallbackPath)}`
				slugs.push(fallbackSlug)
				console.log(`  ⚠️  Fallback: ${fallbackSlug}`)
			}

			results.push({ id: tour.id, slugs })

			// Uncomment to persist into DB:
			// await prisma.tour.update({
			//   where: { id: tour.id },
			//   data: { slugs },
			// })
		}

		console.log('🎉 Tour slugs regeneration completed!')
		return NextResponse.json({ success: true, count: results.length, results })
	} catch (error) {
		console.error('❌ Error:', error)
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
		await placesClient.$disconnect()
	}
}
