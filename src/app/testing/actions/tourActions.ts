'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { getUserData } from '@/app/api/user/getUserData'

const prisma = new PrismaClient()

export async function updateTour(tourId: string, newTourData: any) {
	try {
		// Make API call to update tour
		const response = await fetch(
			`/api/dashboard/tours/${tourId}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: newTourData.name,
					subtitle: newTourData.subtitle,
					overview: newTourData.overview,
					slug: newTourData.slug,
					highlights: newTourData.highlights,
					days: newTourData.days,
					price: newTourData.price,
					discount: newTourData.discount,
					images: newTourData.images,
					tags: newTourData.tags,
					lang: newTourData.lang,
					people: newTourData.people,
					services: newTourData.services,
					places: newTourData.places,
					paths: newTourData.paths,
					reviews: newTourData.reviews,
					tourfor: newTourData.tourfor,
					updated: true,
					conclusion: newTourData.conclusion,
					keyphrase: newTourData.keyphrase,
					productCategory: newTourData.productCategory,
					pricingTiers: newTourData.pricingTiers, // Transportation pricing tiers
					accommodations: newTourData.accommodations, // Accommodations data
				}),
			},
		)

		if (!response.ok) {
			const errorData = await response.json()
			return {
				success: false,
				error: errorData.message || 'Failed to update tour',
			}
		}

		const data = await response.json()
		return { success: true, data }
	} catch (error) {
		console.error('Error updating tour:', error)
		return {
			success: false,
			error:
				(error as Error).message || 'An error occurred while updating the tour',
		}
	}
}

export async function createTour(tourData: any) {
	try {
		// Make API call to create tour
		const response = await fetch('/api/dashboard/tours/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: tourData.name,
				subtitle: tourData.subtitle,
				overview: tourData.overview,
				slug: tourData.slug,
				highlights: tourData.highlights || [],
				days: tourData.days || [],
				price: tourData.price,
				discount: tourData.discount,
				images: tourData.images || [],
				tags: tourData.tags || [],
				lang: tourData.lang || 'EN',
				people: tourData.people || [],
				services: tourData.services || [],
				places: tourData.places || [],
				paths: tourData.paths || [],
				reviews: tourData.reviews || [],
				tourfor: tourData.tourfor || '',
				updated: true,
				conclusion: tourData.conclusion || '',
				keyphrase: tourData.keyphrase || [],
				productCategory: tourData.productCategory || '',
				pricingTiers: tourData.pricingTiers || [], // Transportation pricing tiers
				accommodations: tourData.accommodations || [], // Accommodations data
			}),
		})

		if (!response.ok) {
			const errorData = await response.json()
			return {
				success: false,
				error: errorData.message || 'Failed to create tour',
			}
		}

		const data = await response.json()
		return { success: true, data }
	} catch (error) {
		console.error('Error creating tour:', error)
		return {
			success: false,
			error:
				(error as Error).message || 'An error occurred while creating the tour',
		}
	}
}

export async function getTour(tourId: string) {
	try {
		const tour = await prisma.tour.findUnique({
			where: { id: tourId },
			// Address include removed
		})
		console.log('accommodationTypes', JSON.stringify(tour?.accommodations))

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

export const initiateTour = () => {}
