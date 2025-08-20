'use client'

import { useEffect, useState, ReactNode, Suspense } from 'react'
import {
	usePathname,
	useSearchParams,
	useRouter,
	notFound,
} from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useTranslations } from '@/lib/i18n'
// import { toggleOverlay } from '../GlobalRedux/Features/overlaySlice/overlaySlice'
// import { updateServiceState } from '../GlobalRedux/Features/creatingServiceSlice/creatingServiceSlice'
import getFetchDataFromApi from '@/utils/getFetchDataFromApi'
import { updateLineItemsLogic } from '@/app/api/updateLineItems/updateLineItemsLogic'
import ListingImageGallery from '@/components/listing-image-gallery/ListingImageGallery'
import MobileFooterSticky from './(components)/MobileFooterSticky'
import { imageGallery as listingExperienceImageGallery } from './[listing-experiences-detail]/constant'
import { toggleOverlay } from '@/app/[locale]/GlobalRedux/Features/overlaySlice/overlaySlice'
import { updateServiceState } from '@/app/GlobalRedux/Features/creatingServiceSlice/creatingServiceSlice'

const DetailtLayout = ({ children }: { children: ReactNode }) => {
	const t = useTranslations('layout')
	const dispatch = useDispatch()
	const thisPathname = usePathname()
	const searchParams = useSearchParams()
	const serviceId = searchParams.get('serviceId')
	const router = useRouter()

	// State to store tour data & price
	const [tourData, setTourData] = useState<any>(null)
	const [priceData, setPriceData] = useState<any>(null)

	if (!serviceId) {
		notFound()
	}

	useEffect(() => {
		;(async () => {
			try {
				dispatch(toggleOverlay({ isVisible: false }))

				// Fetch tour details
				const serviceData = await getFetchDataFromApi(
					'/api/listing/get/getTourData?',
					{ id: serviceId },
				)
				console.log('serviceData: ', serviceData)
				setTourData(serviceData)

				// Fetch dynamic pricing
				const prices = await updateLineItemsLogic({
					tour: serviceData,
					body: {},
				})
				setPriceData(prices)

				// Update global state
				dispatch(updateServiceState({ path: 'service', value: serviceData }))
			} catch (error: any) {
				const { code } = error?.response?.data?.code || {}
				const status = error?.status || {}

				if (code === 'P2023') {
					dispatch(
						toggleOverlay({
							type: 'oops',
							data: { name: 'err' },
							isVisible: true,
						}),
					)
				} else if (status >= 400) {
					router.push('/not-found')
				}
			}
		})()
	}, [serviceId, dispatch])

	// Calculate price dynamically
	const guests = priceData?.guests
	const lineItems = priceData?.lineItems
	const totalGuests = guests?.guestAdults + guests?.guestChildren || 1

	const filteredLineItems = lineItems?.filter(
		(item: any) => item.includeInTotal,
	)
	const totalAmount = filteredLineItems?.reduce(
		(total: any, item: any) => total + item.totalPrice,
		0,
	)
	const priceStart = totalAmount / totalGuests || 100 // Default price if not available

	// ✅ Extract image URLs from tourData.images array
	const imageUrls = tourData?.images?.map((img: any) => img.url) || []

	// ✅ Extract reviews (ensure it's always present to avoid SEO errors)
	const reviews = tourData?.reviews?.length
		? tourData.reviews.map((review: any) => ({
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
		: [] // ✅ Fix: If no reviews, set as empty array instead of undefined

	// ✅ Generate Structured Data for Google (Fixed errors)
	const tourSchema = tourData
		? {
				'@context': 'https://schema.org',
				'@type': 'TouristTrip', // ✅ Changed from 'TouristAttraction' to 'TouristTrip'
				name: tourData.name,
				description: tourData.overview,
				image: imageUrls, // ✅ Ensuring image URLs are always included
				aggregateRating: tourData.reviewCount
					? {
							'@type': 'AggregateRating',
							ratingValue: tourData.rating || 4.5,
							reviewCount: tourData.reviewCount,
						}
					: undefined, // ✅ Prevents error when reviewCount is missing
				address: {
					'@type': 'PostalAddress',
					addressLocality:
						tourData.startAddress?.city || t('layout_Unknown_City'),
					addressCountry:
						tourData.startAddress?.country || t('layout_Unknown_Country'),
				},
				geo: tourData.geo
					? {
							'@type': 'GeoCoordinates',
							latitude: tourData.geo?.lat || 0,
							longitude: tourData.geo?.lng || 0,
						}
					: undefined, // ✅ Prevents error if geo is missing
				duration: tourData.duration ? `PT${tourData.duration}H` : 'PT4H', // Duration in ISO format
				offers: {
					'@type': 'Offer',
					price: priceStart.toFixed(2), // Dynamic price
					priceCurrency: tourData.currency || 'USD',
					validFrom: new Date().toISOString(), // When the offer is valid
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
				openingHours: 'Mo-Su 08:00-18:00', // Default hours
				review: reviews, // ✅ Ensuring the review field is always present
			}
		: null

	return (
		<div className="ListingDetailPage">
			<Suspense>
				<ListingImageGallery images={listingExperienceImageGallery} />
			</Suspense>

			<div className="ListingDetailPage__content">{children}</div>

			{/* ✅ SEO Structured Data for Tour (Ensured valid JSON-LD) */}
			{tourSchema && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(tourSchema) }}
				/>
			)}

			{/* ✅ STICKY FOOTER MOBILE */}
			<MobileFooterSticky />
		</div>
	)
}

export default DetailtLayout
