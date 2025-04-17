'use client'

import { useEffect, useState } from 'react'
import CountryCardList from '@/components/LocationCardList'
import type { CountryDataType } from '@/components/CountryCard'

export default function DestinationsPage() {
	const [countries, setCountries] = useState<CountryDataType[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchCountries = async () => {
			try {
				setLoading(true)
				const response = await fetch('/api/countries')

				if (!response.ok) {
					throw new Error('Failed to fetch countries')
				}

				const data = await response.json()

				// Transform API data to match CountryDataType
				const formattedCountries = data.countries.map((country: any) => ({
					id: country.id,
					name: country.name,
					image: country.image,
					featured: country.featured,
					year: '2025',
					url: `/destinations/${country.code3.toLowerCase()}`,
				}))

				setCountries(formattedCountries)
			} catch (err) {
				console.error('Error fetching countries:', err)
				setError('Failed to load destinations. Please try again later.')
			} finally {
				setLoading(false)
			}
		}

		fetchCountries()
	}, [])

	if (loading) {
		return (
			<div className="container mx-auto flex min-h-[50vh] items-center justify-center py-16">
				<div className="text-center">
					<div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
					<p>Loading destinations...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="container mx-auto py-16 text-center">
				<div className="rounded-lg bg-red-50 p-6 text-red-700 dark:bg-red-900/20 dark:text-red-400">
					<h2 className="mb-2 text-xl font-semibold">Error</h2>
					<p>{error}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-16">
			<div className="mb-10 text-center">
				<h1 className="mb-2 text-3xl font-bold md:text-4xl">
					2025's Travelers' Choice Awards
				</h1>
				<h2 className="text-xl text-neutral-500 dark:text-neutral-400">
					Best of the Best Destinations
				</h2>
			</div>

			<CountryCardList data={countries} className="mb-16" cardSize="large" />
		</div>
	)
}
