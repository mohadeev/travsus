'use client'

import type { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Route } from '@/routers/types'

// Default fallback image if no image URL is provided
const DEFAULT_FALLBACK_IMAGE =
	'https://images.pexels.com/photos/31187683/pexels-photo-31187683/free-photo-of-serene-hillside-landscape-with-soft-mist.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'

// Simplified data structure for countries
export interface CountryDataType {
	id: string
	name: string // Country/Region name
	image?: string // Image URL from the API
	year?: string | number // Badge year (e.g., "2025")
	url?: string // Optional custom URL
	code?: string // Country code (e.g., "FR")
	code3?: string // Country 3-letter code (e.g., "FRA")
	continent?: string // Continent name
	isAds?: boolean // Not used anymore
	featured?: boolean // Not used anymore
}

export interface CountryCardProps {
	className?: string
	data: CountryDataType
	size?: 'default' | 'small'
}

const CountryCard: FC<CountryCardProps> = ({
	size = 'default',
	className = '',
	data,
}) => {
	const { id, name, image, year, url } = data

	// Create URL-friendly version of country name
	function convertString(input: string) {
		return input?.toLowerCase()?.replace(/\s+/g, '-')
	}

	const countrySlug = convertString(name)
	const href = url || (`/destinations/${countrySlug}` as Route)

	return (
		<div className={`nc-CountryCard group relative ${className}`}>
			<Link
				href={href}
				className="relative block w-full overflow-hidden rounded-md"
			>
				{/* Image with aspect ratio */}
				<div
					className={`aspect-h-3 aspect-w-3 ${size === 'small' ? 'w-[220px] sm:w-[250px] md:w-[280px]' : 'w-full'}`}
				>
					<Image
						src={image || DEFAULT_FALLBACK_IMAGE}
						alt={name}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes={
							size === 'small'
								? '(max-width: 640px) 220px, (max-width: 768px) 250px, 280px'
								: '(max-width: 640px) 300px, (max-width: 1024px) 50vw, 33vw'
						}
					/>
				</div>

				{/* Year badge */}
				{/* {year && (
					<div className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-black">
						{year}
					</div>
				)} */}

				{/* Gradient overlay for better text visibility */}
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div>

				{/* Country name - now inside the image and bigger */}
				<div className="absolute bottom-4 left-4 z-10">
					<h2 className="text-3xl font-bold text-white">{name}</h2>
				</div>
			</Link>
		</div>
	)
}

export default CountryCard
