import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id')
		const tour = await prisma.tour.findUnique({
			where: {
				id,
			},
		})

		// Default to 3 if no days parameter is provided
		const daysNumber = tour ? parseInt(tour.days.length) : 3

		const toursQuery = await prisma.$runCommandRaw({
			find: 'tours',
			filter: {
				$and: [
					{ days: { $exists: true } }, // Ensure days field exists
					{ days: { $type: 'array' } }, // Ensure days is an array
					{ $expr: { $eq: [{ $size: '$days' }, daysNumber] } }, // Filter by dynamic days array length
				],
			},
			limit: 20,
		})

		const tours = toursQuery.cursor.firstBatch
		const cleanedTours = tours.map(cleanTourIds)

		// Filter out the current tour in JavaScript
		const filteredTours = cleanedTours.filter((t) => t.id !== id)

		return NextResponse.json({ allToursData: filteredTours, days: daysNumber })
	} catch (error: any) {
		console.error('Search error:', error)
		return NextResponse.json(
			{ error: 'Failed to search tours' },
			{ status: 500 },
		)
	}
}

function cleanTourIds(tour: any): any {
	if (!tour) return tour

	// Convert _id to id
	if (tour._id && tour._id.$oid) {
		tour.id = tour._id.$oid
		delete tour._id
	}

	// Convert other ObjectId fields to simple strings
	const objectIdFields = [
		'creatorId',
		'businessId',
		'startAddressId',
		'endAddressId',
		'nameContentId',
		'overviewContentId',
	]

	objectIdFields.forEach((field) => {
		if (tour[field] && tour[field].$oid) {
			tour[field] = tour[field].$oid
		}
	})

	// Clean days array ObjectId fields
	if (tour.days && Array.isArray(tour.days)) {
		tour.days = tour.days.map((day: any) => {
			if (day.nameContentId && day.nameContentId.$oid) {
				day.nameContentId = day.nameContentId.$oid
			}
			if (day.descriptionContentId && day.descriptionContentId.$oid) {
				day.descriptionContentId = day.descriptionContentId.$oid
			}
			return day
		})
	}

	return tour
}
