export const dynamic = "force-dynamic";
import prisma from '@/prisma'
import { tripadvisorApi } from './../../../api-utils/tripadvisorApi'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import interstingPlaces from './interstingPlaces.json'
// This function handles the GET request for city and country data

export async function GET(request: NextRequest) {
	try {
		// Await the response to be converted to JSON

		// Log the response data
		// console.log('Response data:', data)
		// data?.data?.map((loca) => {
		// 	console.log('loca', loca)
		// })

		// Return the response data

		// const newTripadvisorApi = await tripadvisorApi(obj)
		interstingPlaces.map(async ({ name }) => {
			// const existingPlace = await prisma.place.findMany()
			const places: any = await prisma.place.findMany()
			// console.log('places', places)
			// Filter the places array to find the exact match within the nested JSON
			const existingPlace = places.find(
				(place: any) => place.tripadvisorData?.locationDetails?.name === name,
			)

			if (existingPlace) {
				console.log(`Place "${name}" already exists, skipping creation.`)
				return existingPlace // Return the existing place if found
			}

			if (existingPlace) {
				console.log('Place already exists, skipping creation.')
				return existingPlace // Optionally return the existing place
			}

			// If the place doesn't exist, create a new one

			const newTripadvisorApi = await tripadvisorApi({
				method: 'search',
				params: { searchQuery: name },
			})
			const firstRecommendedpPlace = newTripadvisorApi?.data?.data?.[0]
			const locationDetails = await tripadvisorApi({
				method: 'details',
				locationId: firstRecommendedpPlace?.location_id,
				params: { searchQuery: firstRecommendedpPlace },
			})
			const placeFotos = await tripadvisorApi({
				method: 'photos',
				locationId: firstRecommendedpPlace?.location_id,
				params: { searchQuery: firstRecommendedpPlace },
			})

			// console.log('placeFotos', placeFotos.data.data)
			const placeData = {
				locationPhotos: placeFotos.data.data,
				locationDetails: locationDetails.data,
			}
			const newPlace = await prisma.place.create({
				data: {
					tripadvisorData: placeData, // Pass the JSON object as-is
				},
			})
			// console.log('placeData', newPlace)
		})

		return NextResponse.json({})
	} catch (error) {
		console.error('Error fetching location data:', error)

		// Return error message
		return NextResponse.json(
			{ message: 'Error fetching location data' },
			// { status: 500 },
		)
	}
}
