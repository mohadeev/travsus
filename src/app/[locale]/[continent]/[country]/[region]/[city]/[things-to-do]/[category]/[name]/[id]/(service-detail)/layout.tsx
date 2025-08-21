import React, { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { updateLineItemsLogic } from '@/app/api/updateLineItems/updateLineItemsLogic'

const DetailtLayout = async ({
	children,
	params,
}: {
	children: ReactNode
	params: any
}) => {
	console.log('params', params)
	const headersList = await headers()
	const fullUrl = headersList.get('referer') || ''
	const url = new URL(fullUrl || 'http://localhost')
	const serviceId = params?.id

	// Initialize translations
	const t = (a: string) => {
		return ''
	}

	try {
		// Fetch tour details using normal fetch
		const serviceDataResponse = await fetch(
			`${process.env.NEXTAUTH_URL}/api/listing/get/getTourData?id=${serviceId}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)

		if (!serviceDataResponse.ok) {
			throw new Error(`HTTP error! status: ${serviceDataResponse.status}`)
		}

		const serviceData = await serviceDataResponse.json()

		// Fetch dynamic pricing using updateLineItemsLogic directly
		const prices = await updateLineItemsLogic({
			tour: serviceData,
			body: {},
		})

		// Calculate price dynamically
		const guests = prices?.guests
		const lineItems = prices?.lineItems
		const totalGuests = guests?.guestAdults + guests?.guestChildren || 1

		const filteredLineItems = lineItems?.filter(
			(item: any) => item.includeInTotal,
		)
		const totalAmount = filteredLineItems?.reduce(
			(total: any, item: any) => total + item.totalPrice,
			0,
		)
		const priceStart = totalAmount / totalGuests || 100

		// Extract image URLs from tourData.images array
		const imageUrls = serviceData?.images?.map((img: any) => img.url) || []

		// Extract reviews
		const reviews = serviceData?.reviews?.length
			? serviceData.reviews.map((review: any) => ({
					'@type': 'Review',
					reviewRating: {
						'@type': 'Rating',
						ratingValue: review.ratingValue || 5,
						bestRating: 5,
					},
					author: {
						'@type': 'Person',
						name: review.author || t('layout_Anonymous_User'),
					},
					reviewBody: review.reviewBody || t('layout_Default_Review_Text'),
				}))
			: []

		// Generate Structured Data for Google
		const tourSchema = serviceData
			? {
					'@context': 'https://schema.org',
					'@type': 'TouristTrip',
					name: serviceData.name,
					description: serviceData.overview,
					image: imageUrls,
					aggregateRating: serviceData.reviewCount
						? {
								'@type': 'AggregateRating',
								ratingValue: serviceData.rating || 4.5,
								reviewCount: serviceData.reviewCount,
							}
						: undefined,
					address: {
						'@type': 'PostalAddress',
						addressLocality:
							serviceData.startAddress?.city || t('layout_Unknown_City'),
						addressCountry:
							serviceData.startAddress?.country || t('layout_Unknown_Country'),
					},
					geo: serviceData.geo
						? {
								'@type': 'GeoCoordinates',
								latitude: serviceData.geo?.lat || 0,
								longitude: serviceData.geo?.lng || 0,
							}
						: undefined,
					duration: serviceData.duration
						? `PT${serviceData.duration}H`
						: 'PT4H',
					offers: {
						'@type': 'Offer',
						price: priceStart.toFixed(2),
						priceCurrency: serviceData.currency || 'USD',
						validFrom: new Date().toISOString(),
						availability: 'https://schema.org/InStock',
						provider: {
							'@type': 'Organization',
							name: 'TRAVSUS',
							url: 'https://travsus.com',
						},
					},
					performer: {
						'@type': 'Person',
						name: t('layout_Experienced_Guide'),
					},
					openingHours: 'Mo-Su 08:00-18:00',
					review: reviews,
				}
			: null
		const layoutParams = {
			theme: 'dark',
			siteName: 'My Next.js App',
			year: new Date().getFullYear(),
		}

		// Clone children and pass layoutParams as props

		return (
			<div className="ListingDetailPage">
				<div className="ListingDetailPage__content">
					<ListingExperiencesDetailPage serviceData={serviceData} />
				</div>

				{tourSchema && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: JSON.stringify(tourSchema) }}
					/>
				)}
			</div>
		)
	} catch (error: any) {
		console.log('error', error)
		return (
			<div className="ListingDetailPage">
				{('err', JSON.stringify(error))}
				<div className="ListingDetailPage__content">{children}</div>
			</div>
		)

		// const { code } = error?.response?.data?.code || {}
		// const status = error?.status || {}
		// if (code === 'P2023') {
		// 	notFound()
		// } else if (status >= 400) {
		// 	notFound()
		// }
		// // Re-throw unexpected errors
		// throw error
	}
}

export default DetailtLayout

import { cloneElement, isValidElement } from 'react'
import ListingExperiencesDetailPage from './[listing-experiences-detail]/page'

type ServiceData = {
	name: number
	id: number
}

export function ServiceWrapper({
	children,
	serviceData,
}: {
	children: ReactNode
	serviceData: ServiceData
}) {
	const childrenWithProps = isValidElement(children)
		? cloneElement(children, { serviceData })
		: children

	return <>{childrenWithProps}</>
}
