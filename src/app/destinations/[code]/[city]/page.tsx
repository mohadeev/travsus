'use client'

import { useEffect, useState } from 'react'
import { Camera, Heart, ChevronDown, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
// import CollectionsGrid from './Collection'
import CountryCardList from '@/components/LocationCardList'

// import SectionGridFilterCard from '../(experience-listings)/SectionGridFilterCard'
import FeatureNotificationForm from '@/app/feature-notification-form'
import SectionGridFilterCard from '@/app/(experience-listings)/SectionGridFilterCard'
import CollectionsGrid from '@/components/CollectionsGrid'
import ReadeMore from './ReadeMore'

export default function DestinationPage({
	params,
	searchParams,
}: {
	params: { city: string }
	searchParams: any
}) {
	// Extract the country code from the URL parameters
	const { city } = params
	console.log('searchParams: ', searchParams)

	// State for country data, loading state, and errors
	const [countryData, setCountryData] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const [showModal, setShowModal] = useState(false)

	useEffect(() => {
		// Reset states when country code changes
		setIsLoading(true)
		setError(null)

		const fetchCountryData = async () => {
			try {
				// Make sure the URL is correct
				const apiUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/cities/${searchParams.lcId}`
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
					throw new Error(`Failed to fetch data for country code: ${city}`)
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
	}, [city]) // Re-run when country code changes

	// Show loading state
	if (isLoading) {
		return (
			<div className="destination-layout">
				<main>
					<div className="p-8 text-center">
						<h1 className="mb-4 text-2xl font-bold">Loading...</h1>
						<p>Fetching information for {city.toUpperCase()}</p>
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
							Sorry, we couldn't find information for the country city: {city}
						</p>
						<p className="mt-4 text-sm text-gray-500">
							Please check that the country city is correct and try again.
						</p>
					</div>
				</main>
			</div>
		)
	}

	// Main content - previously in MoroccoTravelPage
	console.log('countryData: ', countryData)

	return (
		<>
			<div className="mx-auto max-w-6xl">
				{/* Navigation Bar with divider */}
				<div className="px-4 md:px-0">
					<nav className="relative flex items-center border-b border-black py-3">
						{/* Scrollable navigation for all screen sizes */}
						<div
							onClick={() => setShowModal(true)}
							className="hide-scrollbar flex items-center overflow-x-auto"
						>
							{[
								countryData?.name,
								'Hotels',
								'Things to Do',
								'Restaurants',
								'Flights',
								'Vacation Rentals',
								'Cruises',
								'Rental Cars',
								'Forums',
							].map((item, index) => (
								<Link
									key={item}
									href="#"
									className={`mr-4 flex flex-shrink-0 items-center whitespace-nowrap text-base font-semibold md:mr-6 ${
										index === 0
											? 'rounded-full bg-black px-3 py-1.5 text-white no-underline md:px-4 md:py-2'
											: 'text-black hover:underline'
									}`}
								>
									{item}
								</Link>
							))}
						</div>
					</nav>
				</div>

				{/* Breadcrumb Navigation - responsive */}
				<div className="mt-2 flex flex-col px-4 py-2 text-xs md:mt-4 md:flex-row md:items-center md:justify-between md:px-0">
					<div className="mb-1 flex items-center md:mb-0">
						<Link href="#" className="text-black hover:underline">
							Travsus
						</Link>
						<ChevronRight className="mx-1 h-2.5 w-2.5 text-black" />
						<Link
							href="#"
							className="flex items-center text-black hover:underline"
						>
							{countryData?.name}
							<ChevronDown className="ml-1 h-2.5 w-2.5" />
						</Link>
					</div>
					<div className="text-black">
						<span>
							Plan Your Trip to {countryData?.name}: Best {countryData?.name}{' '}
							Travel Guide
						</span>
					</div>
				</div>

				{/* Banner Image - full width on mobile */}
				<div className="px-0 pb-3 pt-3 md:pb-4 md:pt-4">
					<div className="relative h-[300px] w-full overflow-hidden md:h-[500px] md:rounded-[16px]">
						<img
							src={countryData?.image}
							alt={countryData?.name}
							className="h-full w-full object-cover"
							priority
						/>
						<div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-black bg-black px-3 py-1 md:bottom-4 md:right-4 md:px-4 md:py-1.5">
							<Camera className="h-3 w-3 text-white md:h-4 md:w-4" />
							<span className="text-xs text-white md:text-sm">1</span>
						</div>
						<div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 transform space-x-1.5 md:bottom-4 md:space-x-2">
							{Array.from({ length: 5 }).map((_, index) => (
								<button
									key={index}
									className={`h-1.5 w-1.5 rounded-full md:h-2 md:w-2 ${index === 0 ? 'bg-white' : 'bg-white/50'}`}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</div>
					</div>

					{/* Sponsored text moved outside the image */}
					<p className="mt-1 px-4 text-xs text-black md:mt-2 md:px-0 md:text-sm">
						{countryData?.name === 'Morocco'
							? 'Sponsored by' + countryData?.name
							: ''}
					</p>
				</div>

				{/* Content Section - Morocco on left, Save on right */}
				<div className="px-4 py-5 md:px-0 md:py-8">
					<div className="mb-4 flex flex-row items-center justify-between md:mb-6">
						{/* Morocco heading always on left */}
						<h1 className="text-3xl font-extrabold text-black md:text-5xl">
							{countryData?.name}
						</h1>

						{/* Save button always on right */}
						<button
							className="flex h-10 w-10 items-center justify-center rounded-full border border-black hover:bg-gray-50 md:h-12 md:w-12"
							aria-label="Save"
						>
							<Heart className="h-5 w-5 md:h-6 md:w-6" />
						</button>
					</div>

					<ReadeMore countryData={countryData} />
				</div>
				{/* <CollectionsGrid layout={'row'} /> */}
				<CollectionsGrid
					cityName={countryData?.name}
					layout="row"
					// countryCode="MAR"
					// placeType="restaurant"
					// heading="Restaurants in Marrakech"
					// subHeading="Taste the flavors of"
				/>
				{/* <CountryCardList
					locationType="city"
					// countryCode={code?.toUpperCase()}
					// locationType="country"
					layout="row"
					// countryCodes={['MAR', 'FRA', 'ESP']}
					// heading="Popular Countries"
				/> */}

				<SectionGridFilterCard layout={'row'} />

				{/* Custom CSS for hiding scrollbars */}
				<style jsx global>{`
					.hide-scrollbar::-webkit-scrollbar {
						display: none;
					}
					.hide-scrollbar {
						-ms-overflow-style: none;
						scrollbar-width: none;
					}
				`}</style>
			</div>
			<FeatureNotificationForm
				isOpen={showModal}
				onClose={() => setShowModal(false)}
			/>
		</>
	)
}
