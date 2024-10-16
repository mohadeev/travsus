import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateListing(tourId: string, newTourData: any) {
	try {
		const updatedTour = await prisma.tour.update({
			where: { id: tourId }, // The document to be updated
			data: {
				// Update all fields (even if some are unchanged)
				// creator: newTourData.creator,
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
				region: newTourData.region,
				descount: newTourData.descount,
				start: newTourData.start,
				end: newTourData.end,
				reviews: newTourData.reviews,
				lang: newTourData.lang,
				tourfor: newTourData.tourfor,
				updated: newTourData.updated,
				conclusion: newTourData.conclusion,
				tags: newTourData.tags,
				keyphrase: newTourData.keyphrase,
				...(newTourData?.productCategory && {
					productCategory: newTourData.productCategory,
				}),
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
