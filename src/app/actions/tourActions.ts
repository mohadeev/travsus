'use server'

import { revalidatePath } from 'next/cache'
import { getUserData } from '@/app/api/user/getUserData'
import { getBusinessId } from '@/app/api/dashboard/tours/ownTour'
import { db, T, must, withMeta, asDate, EMPTY_TOUR_LISTS } from '@/lib/db'

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
		const tour = must(await db.from(T.tours).select('*').eq('id', tourId).maybeSingle())

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
		const userData = await getUserData()
		if (!userData || !userData.id) {
			return { success: false, error: 'User not found or not authenticated' }
		}

		const businessId = await getBusinessId(userData.id)
		if (!businessId) {
			return { success: false, error: 'No business found for this user' }
		}

		const blankTour = must(
			await db
				.from(T.tours)
				.insert(
					withMeta({
						...EMPTY_TOUR_LISTS,
						name: 'Untitled Tour',
						updated: false,
						lang: 'EN',
						creatorId: userData.id,
						businessId,
					}),
				)
				.select('*')
				.single(),
		)

		revalidatePath('/dashboard/tours')
		return { success: true, tour: blankTour }
	} catch (error) {
		console.error('Error initializing blank tour:', error)
		return { success: false, error: (error as Error).message }
	}
}

/** The signed-in user's business tours, optionally filtered by name. */
export async function getTours(searchQuery = '') {
	try {
		const userData = await getUserData()
		if (!userData || !userData.id) {
			return {
				success: false,
				error: 'User not found or not authenticated',
				tours: [],
			}
		}

		const businessId = await getBusinessId(userData.id)
		if (!businessId) {
			return { success: true, tours: [] }
		}

		let query = db
			.from(T.tours)
			.select(`id, name, price, updated, createdAt, bookings:${T.bookings}(count)`)
			.eq('businessId', businessId)
			.order('createdAt', { ascending: false })
		if (searchQuery) query = query.ilike('name', `%${searchQuery.replace(/[%_]/g, '\\$&')}%`)

		const tours: any[] = must(await query) ?? []

		const formattedTours = tours.map((tour) => ({
			id: tour.id,
			name: tour.name || 'Untitled Tour',
			price: tour.price || '$0',
			status: tour.updated ? 'active' : 'draft',
			updated: tour.updated,
			createdAt: asDate(tour.createdAt)?.toISOString().split('T')[0],
			bookings: tour.bookings?.[0]?.count ?? 0,
		}))

		return { success: true, tours: formattedTours }
	} catch (error) {
		console.error('Error fetching tours:', error)
		return { success: false, error: (error as Error).message, tours: [] }
	}
}

export const initiateTour = () => {}
