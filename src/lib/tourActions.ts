'use server'

// import { getUserData } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import getUserData from '@/app/api/user/getUserData'

const prisma = new PrismaClient()

export async function updateTour(tourId: string, newTourData: any) {
	console.log('address is here: ', newTourData.address)

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

		// Revalidate the tours page to reflect the changes
		revalidatePath('/dashboard/tours')

		return { success: true, tour: updatedTour }
	} catch (error) {
		console.error('Error updating tour:', error)
		return { success: false, error: (error as Error).message }
	}
}

export async function createTour(tourData: any) {
	try {
		const newTour = await prisma.tour.create({
			data: {
				name: tourData.name || 'Untitled Tour',
				subtitle: tourData.subtitle,
				overview: tourData.overview,
				slug:
					tourData.slug ||
					tourData.name?.toLowerCase().replace(/\s+/g, '-') ||
					`tour-${Date.now()}`,
				images: tourData.images || [],
				people: tourData.people,
				services: tourData.services,
				places: tourData.places,
				highlights: tourData.highlights || [],
				days: tourData.days || [],
				paths: tourData.paths,
				price: tourData.price,
				discount: tourData.discount,
				start: tourData.start,
				end: tourData.end,
				reviews: tourData.reviews || [],
				lang: tourData.lang || 'EN',
				tourfor: tourData.tourfor,
				updated: true,
				conclusion: tourData.conclusion,
				tags: tourData.tags || [],
				keyphrase: tourData.keyphrase,
				productCategory: tourData.productCategory,

				// Create address if provided
				address: tourData.address
					? {
							create: {
								streetAddress: tourData.address.streetAddress,
								buildingNumber: tourData.address.buildingNumber,
								suiteNumber: tourData.address.suiteNumber,
								postOfficeBox: tourData.address.postOfficeBox,
								city: tourData.address.city,
								state: tourData.address.state,
								postalCode: tourData.address.postalCode,
								country: tourData.address.country,
								addressType: tourData.address.addressType || '',
								landmark: tourData.address.landmark,
								subdivision: tourData.address.subdivision,
								timeZone: tourData.address.timeZone,
								isPrimary: tourData.address.isPrimary || false,
								notes: tourData.address.notes,

								// Create geoCoordinates if provided
								geoCoordinates: tourData.address.geoCoordinates
									? {
											create: {
												latitude: tourData.address.geoCoordinates.latitude,
												longitude: tourData.address.geoCoordinates.longitude,
											},
										}
									: undefined,
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

		console.log('Tour created successfully:', newTour.id)

		// Revalidate the tours page to reflect the changes
		revalidatePath('/dashboard/tours')

		return { success: true, tour: newTour }
	} catch (error) {
		console.error('Error creating tour:', error)
		return { success: false, error: (error as Error).message }
	}
}

export async function getTour(tourId: string) {
	try {
		const tour = await prisma.tour.findUnique({
			where: { id: tourId },
			include: {
				address: {
					include: {
						geoCoordinates: true,
					},
				},
			},
		})

		if (!tour) {
			return { success: false, error: 'Tour not found' }
		}

		return { success: true, tour }
	} catch (error) {
		console.error('Error fetching tour:', error)
		return { success: false, error: (error as Error).message }
	}
}

export async function initializeBlankTour() {
	try {
		// Get the current user
		const userData = await getUserData()

		// Check if user is authenticated
		if (!userData || !userData.id) {
			return { success: false, error: 'User not found or not authenticated' }
		}

		// Get the business associated with this user
		const business = await prisma.business.findFirst({
			where: {
				creatorId: userData.id,
			},
		})

		// If no business found, return error
		if (!business) {
			return { success: false, error: 'No business found for this user' }
		}

		const blankTour = await prisma.tour.create({
			data: {
				name: 'Untitled Tour',
				slug: `untitled-tour-${Date.now()}`,
				updated: false,
				lang: 'EN',
				// Connect to the creator (user)
				creator: {
					connect: {
						id: userData.id,
					},
				},
				// Connect to the business
				business: {
					connect: {
						id: business.id,
					},
				},
			},
		})

		console.log('Blank tour initialized successfully:', blankTour.id)
		revalidatePath('/dashboard/tours')

		return { success: true, tour: blankTour }
	} catch (error) {
		console.error('Error initializing blank tour:', error)
		return { success: false, error: (error as Error).message }
	}
}

// Add the getTours function to the existing file
export async function getTours(searchQuery = '') {
	try {
		// Get the current user
		const userData = await getUserData()

		// Check if user is authenticated
		if (!userData || !userData.id) {
			return {
				success: false,
				error: 'User not found or not authenticated',
				tours: [],
			}
		}

		// Get the business associated with this user
		const business = await prisma.business.findFirst({
			where: {
				creatorId: userData.id,
			},
		})

		// If no business found, return empty array
		if (!business) {
			return { success: true, tours: [] }
		}

		// Get all tours associated with this business
		const tours = await prisma.tour.findMany({
			where: {
				businessId: business.id,
				...(searchQuery
					? {
							name: {
								contains: searchQuery,
								mode: 'insensitive',
							},
						}
					: {}),
			},
			include: {
				bookings: {
					select: {
						id: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		// Format the tours data for the frontend
		const formattedTours = tours.map((tour) => ({
			id: tour.id,
			name: tour.name || 'Untitled Tour',
			price: tour.price || '$0',
			status: tour.updated ? 'active' : 'draft',
			updated: tour.updated,
			createdAt: tour.createdAt.toISOString().split('T')[0],
			bookings: tour.bookings.length,
		}))

		return { success: true, tours: formattedTours }
	} catch (error) {
		console.error('Error fetching tours:', error)
		return { success: false, error: (error as Error).message, tours: [] }
	}
}
