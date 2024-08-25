import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'

// This function handles the GET request for city and country data
export async function GET(request: NextRequest) {
	const subcategoryNames = ['city', 'municipality']
	const places = await prisma.$runCommandRaw({
		aggregate: 'places',
		pipeline: [
			{
				$match: {
					'tripadvisorData.locationDetails.subcategory': {
						$elemMatch: {
							$or: subcategoryNames.map((name) => ({ name })),
						},
					},
				},
			},
			{
				$limit: 8, // Limit the results to the first 8 documents
			},
		],
		cursor: {}, // Required cursor option
	})

	console.log('places', places)
	return NextResponse.json({ places: places?.cursor?.firstBatch || [] })
}
