import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateListing(tourId: string, newTourData: any) {
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
				discount: newTourData.discount, // Note: changed from 'descount' to 'discount'
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
						geoCoordinates: true,
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
