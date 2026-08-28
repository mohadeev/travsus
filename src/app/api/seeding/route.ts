export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { placesClient } from '@/lib/prisma'

const prisma = placesClient

const cityProvinceMapping: { [key: string]: string } = {
	Agadir: '09', // Souss-Massa
	Casablanca: '06', // Casablanca-Settat
	Fes: '03', // Fès-Meknès
	Tangier: '01', // Tanger-Tétouan-Al Hoceïma
	Ouarzazate: '08', // Drâa-Tafilalet
	Essaouira: '07', // Marrakesh-Safi
	Marrakech: '07', // Marrakesh-Safi
	Chefchaouen: '01', // Tanger-Tétouan-Al Hoceïma
	Merzouga: '08', // Drâa-Tafilalet
	'Boumalne Dades': '08', // Drâa-Tafilalet
	'Ait Benhaddou': '08', // Drâa-Tafilalet
}

export async function GET(request: NextRequest) {
	try {
		// Get all Moroccan provinces
		const morocco = await prisma.country.findUnique({
			where: { code: 'MA' },
			select: { id: true },
		})

		if (!morocco) {
			return NextResponse.json(
				{
					success: false,
					message: 'Morocco country not found in database',
				},
				{ status: 404 },
			)
		}

		const provinces = await prisma.state.findMany({
			where: {
				countryId: morocco.id,
			},
			select: {
				id: true,
				code: true,
			},
		})

		const provinceMap = new Map(provinces.map((p) => [p.code, p.id]))

		// Get all Moroccan cities
		const cities = await prisma.city.findMany({
			where: {
				countryId: morocco.id,
			},
			include: {
				content: {
					include: {
						translations: {
							where: {
								language: 'en-US',
							},
						},
					},
				},
			},
		})

		let updatedCount = 0
		const results = []

		for (const city of cities) {
			const cityName = city.content.translations[0]?.text

			if (!cityName) {
				console.log(`City ${city.id} has no English name`)
				continue
			}

			const provinceCode = cityProvinceMapping[cityName]

			if (!provinceCode) {
				console.log(`No province mapping found for city: ${cityName}`)
				continue
			}

			const provinceId = provinceMap.get(provinceCode)

			if (!provinceId) {
				console.log(`Province not found for code: ${provinceCode}`)
				continue
			}

			// Skip if already connected to the correct province
			if (city.stateId === provinceId) {
				console.log(
					`City ${cityName} already connected to province ${provinceCode}`,
				)
				continue
			}

			// Update the city with provinceId
			const updatedCity = await prisma.city.update({
				where: { id: city.id },
				data: { stateId: provinceId },
				include: {
					content: {
						include: {
							translations: {
								where: { language: 'en-US', type: 'name' },
							},
						},
					},
					state: {
						select: {
							code: true,
							content: {
								include: {
									translations: {
										where: { language: 'en-US', type: 'name' },
									},
								},
							},
						},
					},
				},
			})

			updatedCount++
			results.push({
				city: updatedCity.content.translations[0]?.text,
				province: updatedCity.state?.content.translations[0]?.text,
				provinceCode: updatedCity.state?.code,
			})

			console.log(
				`Connected ${updatedCity.content.translations[0]?.text} to ${updatedCity.state?.content.translations[0]?.text}`,
			)
		}

		return NextResponse.json({
			success: true,
			message: `Connected ${updatedCount} cities to provinces`,
			updatedCount,
			results,
		})
	} catch (error) {
		console.error('Error connecting cities to provinces:', error)
		return NextResponse.json(
			{
				success: false,
				message: 'Failed to connect cities to provinces',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
