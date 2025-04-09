'use client'

import React, { useEffect, useState } from 'react'
import Page from './page'

// Create a wrapper component to pass props to children
export default function DestinationLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: { code: string }
}) {
	// Extract the country code from the URL parameters
	const { code } = params

	// State for country data, loading state, and errors
	const [countryData, setCountryData] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		// Reset states when country code changes
		setIsLoading(true)
		setError(null)

		const fetchCountryData = async () => {
			try {
				// Make sure the URL is correct
				const apiUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/countries/${code}`
				console.log('Fetching from:', apiUrl)

				const res = await fetch(apiUrl, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					cache: 'no-store', // Prevent caching
				})

				console.log('API response status:', res.status)

				if (!res.ok) {
					throw new Error(`Failed to fetch data for country code: ${code}`)
				}

				const data = await res.json()
				console.log('Successfully fetched data:', data)
				setCountryData(data)
			} catch (err) {
				console.error('Error fetching country data:', err)
				setError(err.message)
			} finally {
				setIsLoading(false)
			}
		}

		fetchCountryData()
	}, [code]) // Re-run when country code changes

	// Show loading state
	if (isLoading) {
		return (
			<div className="destination-layout">
				<main>
					<div className="p-8 text-center">
						<h1 className="mb-4 text-2xl font-bold">Loading...</h1>
						<p>Fetching information for {code.toUpperCase()}</p>
					</div>
				</main>
			</div>
		)
	}

	// Show error state
	if (error) {
		return (
			<div className="destination-layout">
				<main>
					<div className="p-8 text-center">
						<h1 className="mb-4 text-2xl font-bold">Country Not Found</h1>
						<p>
							Sorry, we couldn't find information for the country code: {code}
						</p>
						<p className="mt-4 text-sm text-gray-500">
							Please check that the country code is correct and try again.
						</p>
					</div>
				</main>
			</div>
		)
	}

	// Show data when available
	return (
		<div className="destination-layout p-0">
			<main className="p-0">
				<Page countryData={countryData} />
			</main>
		</div>
	)
}
