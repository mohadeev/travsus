'use client'
import React, { useEffect } from 'react'
import axios from 'axios'
const TestAnything = () => {
	const country = 'United States'

	async function getFamousCities(country) {
		try {
			const response = await axios.get(
				'https://nominatim.openstreetmap.org/search',
				{
					params: {
						country: country,
						city: '', // Leave blank to get all cities
						format: 'json',
						addressdetails: 1,
						limit: 10, // Adjust the limit as needed
					},
				},
			)

			const cities = response.data

			if (cities.length > 0) {
				console.log(`Famous cities in ${country}:`)
				cities.forEach((city) => {
					console.log(city)
					console.log(`${city.display_name}`)
				})
			} else {
				console.log(`No cities found for ${country}.`)
			}
		} catch (error) {
			console.error('Error fetching cities:', error)
		}
	}

	useEffect(() => {
		// Using fetch in a browser environment
		// const apiKey = process.env.TRIPADVISOR_ACCESS_TOKEN
		// const countryCode = 'US' // Replace with the country code you want to query

		// // const url = `https://api.tripadvisor.com/api/partner/2.0/location_search?query=top+cities+in+${countryCode}&key=${apiKey}`
		// const url =
		// 	'https://api.content.tripadvisor.com/api/v1/location/13814149/details?key=B3CF9FC7B8884A9AA39A215C9D9E286E&language=en&currency=USD'
		// const options = { method: 'GET', headers: { accept: 'application/json' } }

		// fetch(url)
		// 	.then((response) => {
		// 		if (!response.ok) {
		// 			throw new Error(`HTTP error! Status: ${response.status}`)
		// 		}
		// 		return response.json()
		// 	})
		// 	.then((data) => {
		// 		// Process and log the data
		// 		console.log(data)
		// 	})
		// 	.catch((error) => {
		// 		console.error('Error:', error)
		// 	})
		return () => {}
	}, [])

	return <div>TestAnything</div>
}

export default TestAnything
