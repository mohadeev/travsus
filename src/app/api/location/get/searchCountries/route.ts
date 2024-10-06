import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

// This function handles the GET request for city and country data
export const dynamic = 'force-dynamic' // This ensures the route is always dynamic

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const name = searchParams.get('name')

		if (!name) {
			return NextResponse.json(
				{ message: 'Search name is required' },
				{ status: 400 },
			)
		}

		// Get the Mapbox access token from environment variables
		const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN

		if (!mapboxAccessToken) {
			return NextResponse.json(
				{ message: 'Mapbox access token is missing' },
				{ status: 500 },
			)
		}

		// Fetch data from the Mapbox Geocoding API
		const response = await axios.get(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(name)}.json`,
			{
				params: {
					access_token: mapboxAccessToken,
					types: 'place,country', // Filter for cities and countries
					limit: 6, // Limit the number of results
				},
			},
		)

		const resData = response.data.features

		// Extract and format the relevant data from the response
		const locationData = resData.map((feature: any) => ({
			name: feature.text,
			place_name: feature.place_name,
			type: feature.place_type[0], // 'place' for cities, 'country' for countries
			coordinates: feature.center, // Longitude and Latitude
		}))
		console.log('locationData', locationData)
		// Return the fetched data as a JSON response
		return NextResponse.json(locationData)
	} catch (error) {
		console.error('Error fetching location data:', error)
		return NextResponse.json(
			{ message: 'Error fetching location data' },
			{ status: 500 },
		)
	}
}
