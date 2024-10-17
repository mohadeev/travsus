import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateListing(tourId: string, newTourData: any) {
	console.log('address  is here: ', newTourData.address)
	const address = {
		streetAddress: '123 Main St',
		buildingNumber: '5A',
		suiteNumber: 'Suite 200',
		postOfficeBox: 'PO Box 123',
		city: 'New York',
		state: 'NY',
		postalCode: '10001',
		country: 'USA',
		addressType: 'Business',
		landmark: 'Near Central Park',
		subdivision: 'Upper East Side',
		timeZone: 'America/New_York',
		isPrimary: true,
		notes: 'Main office location',
		geoCoordinates: {
			latitude: 40.7128,
			longitude: -74.006,
		},
	}
	// newTourData.address = address
	try {
		const updatedTour = await prisma.tour.update({
			where: { id: tourId },
			data: {
				name: newTourData.name,
				subtitle: newTourData.subtitle,
				overview: newTourData.overview,
				slug: newTourData.slug,
				images: newTourData.images,
				people: newTourData.people,
				services: newTourData.services,
				places: newTourData.places,
				highlights: newTourData.highlights,
				days: newTourData.days,
				paths: newTourData.paths,
				price: newTourData.price,
				discount: newTourData.discount, // Fixed typo
				start: newTourData.start,
				end: newTourData.end,
				reviews: newTourData.reviews,
				lang: newTourData.lang,
				tourfor: newTourData.tourfor,
				updated: newTourData.updated,
				conclusion: newTourData.conclusion,
				tags: newTourData.tags,
				keyphrase: newTourData.keyphrase,
				productCategory: newTourData.productCategory,

				// Address handling with `upsert`
				address: newTourData.address
					? {
							upsert: {
								create: {
									streetAddress: newTourData.address.streetAddress,
									buildingNumber: newTourData.address.buildingNumber,
									suiteNumber: newTourData.address.suiteNumber,
									postOfficeBox: newTourData.address.postOfficeBox,
									city: newTourData.address.city,
									state: newTourData.address.state,
									postalCode: newTourData.address.postalCode,
									country: newTourData.address.country,
									addressType: newTourData.address.addressType,
									landmark: newTourData.address.landmark,
									subdivision: newTourData.address.subdivision,
									timeZone: newTourData.address.timeZone,
									isPrimary: newTourData.address.isPrimary,
									notes: newTourData.address.notes,

									// Handle GeoCoordinates if provided
									geoCoordinates: newTourData.address.geoCoordinates
										? {
												create: {
													latitude: newTourData.address.geoCoordinates.latitude,
													longitude:
														newTourData.address.geoCoordinates.longitude,
												},
											}
										: undefined,
								},
								update: {
									streetAddress: newTourData.address.streetAddress,
									buildingNumber: newTourData.address.buildingNumber,
									suiteNumber: newTourData.address.suiteNumber,
									postOfficeBox: newTourData.address.postOfficeBox,
									city: newTourData.address.city,
									state: newTourData.address.state,
									postalCode: newTourData.address.postalCode,
									country: newTourData.address.country,
									addressType: newTourData.address.addressType,
									landmark: newTourData.address.landmark,
									subdivision: newTourData.address.subdivision,
									timeZone: newTourData.address.timeZone,
									isPrimary: newTourData.address.isPrimary,
									notes: newTourData.address.notes,

									// Handle GeoCoordinates update
									geoCoordinates: newTourData.address.geoCoordinates
										? {
												upsert: {
													create: {
														latitude:
															newTourData.address.geoCoordinates.latitude,
														longitude:
															newTourData.address.geoCoordinates.longitude,
													},
													update: {
														latitude:
															newTourData.address.geoCoordinates.latitude,
														longitude:
															newTourData.address.geoCoordinates.longitude,
													},
												},
											}
										: undefined,
								},
							},
						}
					: undefined,
			},
			include: {
				address: {
					include: {
						geoCoordinates: true, // Ensure geoCoordinates are returned in the query
					},
				},
			},
		})

		console.log('Tour updated successfully:', updatedTour.id)
		return updatedTour
	} catch (error) {
		console.error('Error updating tour:', error)
		throw error
	}
}

export default updateListing
