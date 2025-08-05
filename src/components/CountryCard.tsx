'use client'

import type { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Route } from '@/routers/types'
import { useTranslations } from '@/lib/i18n'

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
	const t = useTranslations('components_CountryCard')

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
				className="relative block w-full overflow-hidden rounded-xl"
			>
				{/* Image with aspect ratio */}
				<div
					className={`aspect-h-3 aspect-w-3 ${size === 'small' ? 'w-[220px] sm:w-[250px] md:w-[280px]' : 'w-full'}`}
				>
					<img
						src={image}
						alt={name}
						className="rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				</div>

				{/* Gradient overlay for better text visibility */}
				<div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent via-transparent to-black/70"></div>

				{/* Country name - now inside the image and bigger */}
				<div className="absolute bottom-4 left-4 z-10">
					<h2 className="text-3xl font-bold text-white"> {name}</h2>
				</div>
			</Link>
		</div>
	)
}

export default CountryCard
