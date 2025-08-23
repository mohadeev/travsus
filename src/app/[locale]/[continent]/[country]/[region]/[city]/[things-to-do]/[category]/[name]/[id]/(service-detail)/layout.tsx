import React, { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { updateLineItemsLogic } from '@/app/api/updateLineItems/updateLineItemsLogic'
import ListingExperiencesDetailPage from './[listing-experiences-detail]/page'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { slugify } from 'transliteration'

// ... (your existing interfaces remain the same)
interface Review {
	rating?: number
	userName?: string
	author?: string
	content?: string
	reviewBody?: string
	createdAt?: string
}

interface Day {
	hidden: boolean
	name: string
	description: string
	cityId: string
	cityName: string
	countryName: string
	stateName: string
	geoCoordinates: {
		lat: number
		log: number
	}
	originalCityName: string
	continent?: {
		name: string
	}
	country?: {
		name: string
	}
	province?: {
		name: string
	}
	city?: {
		name: string
	}
}

interface PricingTier {
	minSeats: number
	maxSeats: number
	pricing: {
		pricePerDay: number
		totalPrice: number
		currency: string
	}
	transportType: string
	transportImage: string
}

interface Accommodation {
	name: string
	description: string
	pricingTiers: Array<{
		name: string
		minSeats: number
		maxSeats: number
		bedOptions: Array<{
			bedType: string
			maxOccupancy: number
			basePrice: number
			currency: string
		}>
	}>
}

interface FAQ {
	question: string
	answer: string
}

interface Inclusions {
	luxury: {
		private: string[]
		shared: string[]
	}
	standard: {
		private: string[]
		shared: string[]
	}
}

interface ServiceData {
	id: string
	creatorId: string
	businessId: string
	name: string
	subtitle: string
	overview: string
	productCategory: string
	slug: string
	images: Array<{
		url: string
		public_id: string
		alt?: string
		featured?: boolean
	}>
	people: any[]
	services: any[]
	places: any[]
	highlights: any[]
	paths: any[]
	price: string
	discount: string
	start: any
	end: any
	lang: string
	tourfor: string
	updated: boolean
	conclusion: string
	tags: string[]
	keyphrase: any[]
	createdAt: string
	updatedAt: string
	startAddressId: string
	endAddressId: string
	durationType: string
	duration: any
	includesOvernight: boolean
	nameContentId: string
	subtitleContentId: any
	overviewContentId: string
	conclusionContentId: any
	startAddress: {
		geoCoordinates: {
			lat: number
			log: number
		}
		id: string
		streetAddress: string
		buildingNumber: string
		suiteNumber: any
		postOfficeBox: any
		city: string
		state: string
		postalCode: string
		country: string
		landmark: string
		subdivision: any
		timeZone: string
		isPrimary: boolean
		notes: string
		createdAt: string
		updatedAt: string
	}
	endAddress: {
		geoCoordinates: {
			lat: number
			log: number
		}
		id: string
		streetAddress: string
		buildingNumber: string
		suiteNumber: any
		postOfficeBox: any
		city: string
		state: string
		postalCode: string
		country: string
		landmark: string
		subdivision: any
		timeZone: string
		isPrimary: boolean
		notes: string
		createdAt: string
		updatedAt: string
	}
	nameContent: {
		id: string
		contentType: string
		entityId: string
		createdAt: string
		updatedAt: string
		translations: Array<{
			id: string
			contentId: string
			languageCode: string
			text: string
			createdAt: string
			updatedAt: string
		}>
	}
	subtitleContent: any
	overviewContent: {
		id: string
		contentType: string
		entityId: string
		createdAt: string
		updatedAt: string
		translations: Array<{
			id: string
			contentId: string
			languageCode: string
			text: string
			createdAt: string
			updatedAt: string
		}>
	}
	conclusionContent: any
	formattedReviews: Array<{
		id: string
		userId: string
		userName: string
		userImage: any
		rating: number
		title: string
		content: string
		travelDate: string
		travelType: string
		images: any[]
		createdAt: string
		updatedAt: string
		author: {
			name: string
			image: any
			location: string
			contributions: number
		}
	}>
	language: string
	continentInfo: {
		name: string
		code: string
		id: string
	}
	days: Day[]
	pricingTiers: PricingTier[]
	accommodations: Accommodation[]
	faq: FAQ[]
	inclusions: Inclusions
	reviewsCount?: number
	averageRating?: number
	region?: any
	start?: {
		name: string
	}
}

interface DetailLayoutProps {
	children: ReactNode
	params: { id: string; locale: string }
}

// Generate metadata function for Next.js SEO
export async function generateMetadata({
	params,
}: {
	params: { id: string; locale: string }
}): Promise<Metadata> {
	const serviceId = params?.id
	const t = await getTranslations({
		locale: params.locale,
		namespace: 'TourPageMetadata',
	})

	const locale = params.locale
	try {
		// Fetch tour details
		const serviceDataResponse = await fetch(
			`${process.env.NEXTAUTH_URL}/api/listing/get/getTourData?id=${serviceId}&locale=${locale}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				next: { revalidate: 3600 }, // Cache for 1 hour
			},
		)

		if (!serviceDataResponse.ok) {
			return {
				title: 'Tour Not Found | TRAVSUS',
				description: 'The requested tour could not be found.',
			}
		}

		const serviceData: ServiceData = await serviceDataResponse.json()

		// Calculate price range
		const minPrice = serviceData.pricingTiers?.length
			? Math.min(
					...serviceData.pricingTiers.map((tier) => tier.pricing.totalPrice),
				)
			: 0
		const currency = serviceData.pricingTiers?.[0]?.pricing.currency || 'EUR'

		// Get first image for social media
		const imageUrl =
			serviceData.images?.[0]?.url ||
			'https://travsus.com/default-tour-image.jpg'

		// Generate canonical URL
		const canonicalUrl = generateTourUrl(serviceData, t)
		const day = serviceData?.days?.[0]

		console.log('serviceData', serviceData.name)
		const countryName = day.country?.name || day.countryName || ''

		return {
			title: `${t('TourPage_title', { tourName: serviceData.name, country: countryName })}`,
			description: serviceData.overview.substring(0, 160),
			keywords:
				serviceData.tags?.join(', ') ||
				'Morocco tour, desert trip, Marrakech, Merzouga, SahaPra',
			openGraph: {
				title: serviceData.name,
				description: serviceData.overview.substring(0, 160),
				type: 'website',
				locale: params.locale,
				siteName: 'TRAVSUS',
				url: canonicalUrl,
				images: [
					{
						url: imageUrl,
						width: 1200,
						height: 630,
						alt: serviceData.name,
					},
				],
			},
			twitter: {
				card: 'summary_large_image',
				title: serviceData.name,
				description: serviceData.overview.substring(0, 160),
				images: [imageUrl],
			},
			robots: {
				index: true,
				follow: true,
				googleBot: {
					index: true,
					follow: true,
					'max-video-preview': -1,
					'max-image-preview': 'large',
					'max-snippet': -1,
				},
			},
			alternates: {
				canonical: canonicalUrl,
				languages: {
					'en-US': canonicalUrl,
					'es-ES': canonicalUrl.replace('/en/', '/es/'),
					'fr-FR': canonicalUrl.replace('/en/', '/fr/'),
				},
			},
			other: {
				price: `${minPrice} ${currency}`,
				'product:price:amount': minPrice.toString(),
				'product:price:currency': currency,
			},
		}
	} catch (error) {
		console.error('Error generating metadata:', error)
		return {
			title: 'Morocco Tours | TRAVSUS',
			description:
				'Discover amazing tours and experiences in Morocco with TRAVSUS.',
		}
	}
}
// Function to generate tour URL like in the client component
function generateTourUrl(serviceData: ServiceData, t: any): string {
	const day = serviceData.days?.[0]
	if (!day)
		return `https://travsus.com/tours/${serviceData.slug || serviceData.id}`

	const continentName =
		day.continent?.name || serviceData.continentInfo?.name || 'africa'
	const countryName = day.country?.name || day.countryName || 'morocco'
	const provinceName = day.province?.name || day.stateName || ''
	const cityName = day.city?.name || day.cityName || 'marrakech'
	const thingsToDoSlug =
		t('Jan03_TourHeader_x9k2_things_to_do_slug') || 'things-to-do'
	const toursSlug = t('Jan03_TourHeader_x9k2_tours') || 'tours'

	return `https://travsus.com/${slugify(continentName)}/${slugify(countryName)}/${slugify(provinceName)}/${slugify(cityName)}/${slugify(thingsToDoSlug)}/${slugify(toursSlug)}/${slugify(serviceData.name)}/${serviceData.id}/q=tour`
}

const DetailLayout = async ({ children, params }: DetailLayoutProps) => {
	const headersList = await headers()
	const fullUrl = headersList.get('referer') || ''
	const url = new URL(fullUrl || 'http://localhost')
	const serviceId = params?.id
	const { locale } = await params
	const t = await getTranslations({
		locale,
		namespace: 'TourPageMetadata',
	})

	try {
		// Fetch tour details
		const serviceDataResponse = await fetch(
			`${process.env.NEXTAUTH_URL}/api/listing/get/getTourData?id=${serviceId}&locale=${locale}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)

		if (!serviceDataResponse.ok) {
			if (serviceDataResponse.status === 404) {
				notFound()
			}
			throw new Error(`HTTP error! status: ${serviceDataResponse.status}`)
		}

		const serviceData: ServiceData = await serviceDataResponse.json()

		// Fetch dynamic pricing
		const prices = await updateLineItemsLogic({
			tour: serviceData,
			body: {},
		})

		// Calculate price dynamically
		const guests = prices?.guests
		const lineItems = prices?.lineItems
		const totalGuests =
			(guests?.guestAdults || 0) + (guests?.guestChildren || 0) || 1

		const filteredLineItems = lineItems?.filter(
			(item: any) => item.includeInTotal,
		)
		const totalAmount = filteredLineItems?.reduce(
			(total: number, item: any) => total + (item.totalPrice || 0),
			0,
		)
		const priceStart = totalAmount / totalGuests || 100

		// Extract image URLs
		const imageUrls = serviceData?.images?.map((img) => img.url) || []

		// Generate Structured Data for Google - FIXED VERSION
		const tourSchema = serviceData
			? {
					'@context': 'https://schema.org',
					'@type': 'TouristTrip',
					name: serviceData.name,
					description: serviceData.overview,
					image: imageUrls,
					// CORRECTED: AggregateRating is the proper way to include reviews for TouristTrip
					aggregateRating: serviceData.reviewsCount
						? {
								'@type': 'AggregateRating',
								ratingValue: serviceData.averageRating || 4.5,
								reviewCount: serviceData.reviewsCount,
								bestRating: '5',
								worstRating: '1',
							}
						: undefined,
					address: {
						'@type': 'PostalAddress',
						addressLocality:
							serviceData.startAddress?.city || t('layout_Unknown_City'),
						addressCountry:
							serviceData.startAddress?.country || t('layout_Unknown_Country'),
					},
					geo: serviceData.startAddress?.geoCoordinates
						? {
								'@type': 'GeoCoordinates',
								latitude: serviceData.startAddress.geoCoordinates.lat || 0,
								longitude: serviceData.startAddress.geoCoordinates.log || 0,
							}
						: undefined,
					duration: serviceData.duration
						? `PT${serviceData.duration}H`
						: 'PT72H', // 3 days default
					offers: {
						'@type': 'Offer',
						price: priceStart.toFixed(2),
						priceCurrency:
							serviceData.pricingTiers?.[0]?.pricing.currency || 'EUR',
						priceSpecification: {
							'@type': 'PriceSpecification',
							minPrice: Math.min(
								...serviceData.pricingTiers.map(
									(tier) => tier.pricing.totalPrice,
								),
							),
							maxPrice: Math.max(
								...serviceData.pricingTiers.map(
									(tier) => tier.pricing.totalPrice,
								),
							),
							priceCurrency:
								serviceData.pricingTiers?.[0]?.pricing.currency || 'EUR',
						},
						validFrom: new Date().toISOString(),
						availability: 'https://schema.org/InStock',
						url: generateTourUrl(serviceData, t),
						seller: {
							'@type': 'Organization',
							name: 'TRAVSUS',
							url: 'https://travsus.com',
						},
					},
					performer: {
						'@type': 'Person',
						name: t('layout_Experienced_Guide'),
					},
					itinerary: serviceData.days?.map((day, index) => ({
						'@type': 'TouristAttraction',
						name: day.name,
						description: day.description,
						position: index + 1,
					})),
					location: {
						'@type': 'Place',
						name: 'Morocco',
						address: {
							'@type': 'PostalAddress',
							addressCountry: 'MA',
						},
					},
					// REMOVED: The invalid 'review' property that was causing the error
				}
			: null

		// Generate FAQ structured data
		const faqSchema = serviceData.faq?.length
			? {
					'@context': 'https://schema.org',
					'@type': 'FAQPage',
					mainEntity: serviceData.faq.map((faq) => ({
						'@type': 'Question',
						name: faq.question,
						acceptedAnswer: {
							'@type': 'Answer',
							text: faq.answer,
						},
					})),
				}
			: null

		return (
			<div className="ListingDetailPage">
				<div className="ListingDetailPage__content">
					<ListingExperiencesDetailPage serviceData={serviceData} />
				</div>

				{/* Structured Data for SEO */}
				{tourSchema && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: JSON.stringify(tourSchema) }}
					/>
				)}

				{faqSchema && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
					/>
				)}
			</div>
		)
	} catch (error: any) {
		console.error('Error in DetailLayout:', error)

		// Handle specific error cases
		if (error?.response?.data?.code === 'P2023' || error?.status >= 400) {
			notFound()
		}

		return (
			<div className="ListingDetailPage">
				<div className="ListingDetailPage__content">
					<div className="error-message">
						<h2>Something went wrong</h2>
						<p>Please try again later.</p>
					</div>
				</div>
			</div>
		)
	}
}

export default DetailLayout
