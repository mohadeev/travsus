'use server'

import prisma from '@/lib/prisma'
import getUserData from '@/app/api/user/getUserData'
import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient()

export async function initiateTour() {
	try {
		const { id: userId }: any = await getUserData()
		if (!userId) {
			throw new Error('User not found')
		}

		const tour = await prismaClient.tour.create({
			data: {
				name: '',
				subtitle: '',
				overview: '',
				highlights: [],
				days: [],
				pricingTiers: [],
				accommodations: [],
				images: [],
				lang: 'EN',
				tags: [],
				productCategory: null,
				slug: null,
				people: [],
				services: [],
				places: [],
				paths: [],
				price: null,
				discount: null,
				reviews: [],
				tourfor: null,
				updated: false,
				conclusion: null,
				keyphrase: [],
				creator: {
					connect: { id: userId },
				},
			},
		})

		return tour.id
	} catch (error) {
		console.error('Error initiating tour:', error)
		throw error
	}
}

export async function getTourById(id: string) {
	try {
		const tour = await prismaClient.tour.findUnique({
			where: { id },
		})
		return tour
	} catch (error) {
		console.error('Error fetching tour:', error)
		throw error
	}
}

export async function updateTour(tourId: string, newTourData: any) {
	try {
		const updatedTour = await prismaClient.tour.update({
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
				discount: newTourData.discount,
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
				pricingTiers: newTourData.pricingTiers,
				accommodations: newTourData.accommodations,

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
									addressType: newTourData.address.addressType || '',
									landmark: newTourData.address.landmark,
									subdivision: newTourData.address.subdivision,
									timeZone: newTourData.address.timeZone,
									isPrimary: newTourData.address.isPrimary || false,
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
									addressType: newTourData.address.addressType || '',
									landmark: newTourData.address.landmark,
									subdivision: newTourData.address.subdivision,
									timeZone: newTourData.address.timeZone,
									isPrimary: newTourData.address.isPrimary || false,
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
