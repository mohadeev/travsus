'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import { ArrowRightIcon, Squares2X2Icon } from '@heroicons/react/24/outline'
import CommentListing from '@/components/CommentListing'
import FiveStartIconForRate from '@/components/FiveStartIconForRate'
import Avatar from '@/shared/Avatar'
import Badge from '@/shared/Badge'
import TransportBreakdown from './TransportBreakdown'
import ButtonCircle from '@/shared/ButtonCircle'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'
import Input from '@/shared/Input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import LikeSaveBtns from '@/components/LikeSaveBtns'
import StartRating from '@/components/StartRating'
import { includes_demo } from './constant'
import Image from 'next/image'
import StayDatesRangeInput from './StayDatesRangeInput'
import GuestsInput from './GuestsInput'
import SectionDateRange from '../SectionDateRange'
import { Route } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import handleCreateBooking from '@/utils/api-utils/handleCreateBooking'
import { SkeletonLoader } from './SkeletonLoader'
import {
	resetBooking,
	setPricePerSeat,
	setSeats,
	setSelectedDate,
} from '@/app/GlobalRedux/Features/bookingSlice/bookingSlice'
import RenderSidebar from './RenderSidebar'
import TourItinerary from './TourItinerary'
import ListingExperiencesDetailsImages from './ListingExperiencesDetailsImages'
import TourListingHeader from './listing-components/TourListingHeader'
import ExperiencesDescriptionSkeleton from './ExperiencesDescriptionSkeleton'
import SectionGridFilterCard from '@/app/(experience-listings)/SectionGridFilterCard'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// import MapComponent from './MapComponent'
import dynamic from 'next/dynamic'
import TourFAQ from './FAQProps'
import ReviewSystem from './ReviewSystem'
import Included from './Included'
import { ChevronDown, ChevronRight, Heart } from 'lucide-react'
import Link from 'next/link'
import TourItineraryWithMap from './tour-itinerary-with-map'
import TourHeader from './TourHeader'
import ReadMore from '@/app/destinations/[code]/[city]/ReadeMore'

const MapComponent = dynamic(() => import('./tour-map'), {
	ssr: false,
})

export interface ListingExperiencesDetailPageProps {}

interface Address {
	streetAddress?: string
	buildingNumber?: string
	city?: string
	state?: string
	postalCode?: string
	country?: string
}

const ListingExperiencesDetailPage: FC<
	ListingExperiencesDetailPageProps
> = ({}) => {
	const thisPathname = usePathname()
	const dispatch = useDispatch()
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()

	const { booking } = useSelector((state: any) => state.bookingSlice)

	const initialPrice = 100
	useEffect(() => {
		// Update the price when the component mounts or when initialPrice changes
		dispatch(setPricePerSeat(initialPrice))
	}, [dispatch, initialPrice])
	const handleDateChange = (date: string) => {
		dispatch(setSelectedDate(date))
	}

	const handleSeatsChange = (seats: any) => {
		// console.log('seats: ', seats)
		// dispatch(setSeats(seats))
	}

	const handleResetBooking = () => {
		dispatch(resetBooking())
	}

	const {
		name: title,
		region,
		start,
		id,
		images,
		overview,
		reviews,
		days,
		liked,
		startAddress,
		endAddress,
		faq,
		inclusions,
	}: any = useSelector((state: any) => state.creatingServiceSlice.service)

	const city = startAddress?.city

	const renderSection2 = () => {
		return (
			<>
				{overview ? (
					<div className="space-y-0 p-0">
						<div className="max-w-3xl">
							<h4 className="my-4 text-2xl font-semibold">Overview</h4>
							<div className="mb-0.5 rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-black md:text-base">
								<ReadMore description={overview} />
							</div>

							{/* <p className="mb-0.5 rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-black md:text-base">
								{overview}
								<button className="flex items-center text-sm font-medium text-black md:text-base">
									Read more{' '}
									<ChevronDown className="ml-1 h-4 w-4 md:h-5 md:w-5" />
								</button>
							</p> */}
						</div>
					</div>
				) : (
					<ExperiencesDescriptionSkeleton className="listingSection__wrap_no_border" />
				)}
			</>
		)
	}

	const renderSection5 = () => {
		return (
			<div className="listingSection__wrap">
				{/* HEADING */}
				<h2 className="text-2xl font-semibold">Host Information</h2>
				<div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

				{/* host */}
				<div className="flex items-center space-x-4">
					<Avatar
						hasChecked
						hasCheckedClass="w-4 h-4 -top-0.5 right-0.5"
						sizeClass="h-14 w-14"
						radius="rounded-full"
					/>
					<div>
						<a className="block text-xl font-medium" href="##">
							Kevin Francis
						</a>
						<div className="mt-1.5 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
							<StartRating />
							<span className="mx-2">·</span>
							<span> 12 places</span>
						</div>
					</div>
				</div>

				{/* desc */}
				<span className="text-neutral-6000 block dark:text-neutral-300">
					Providing lake views, The Symphony 9 Tam Coc in Ninh Binh provides
					accommodation, an outdoor swimming pool, a bar, a shared lounge, a
					garden and barbecue facilities...
				</span>

				{/* info */}
				<div className="block space-y-2.5 text-neutral-500 dark:text-neutral-400">
					<div className="flex items-center space-x-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<span>Joined in March 2016</span>
					</div>
					<div className="flex items-center space-x-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
							/>
						</svg>
						<span>Response rate - 100%</span>
					</div>
					<div className="flex items-center space-x-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>

						<span>Fast response - within a few hours</span>
					</div>
				</div>

				{/* == */}
				<div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
				<div>
					<ButtonSecondary href="/author">See host profile</ButtonSecondary>
				</div>
			</div>
		)
	}

	const renderSection6 = () => {
		return (
			<div className="listingSection__wrap">
				{/* HEADING */}
				<h2 className="text-2xl font-semibold">
					Reviews ({reviews?.length} reviews)
				</h2>
				<div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

				{/* Content */}
				<div className="space-y-5">
					<FiveStartIconForRate iconClass="w-6 h-6" className="space-x-0.5" />
					<div className="relative">
						<Input
							fontClass=""
							sizeClass="h-16 px-4 py-3"
							rounded="rounded-3xl"
							placeholder="Share your thoughts ..."
						/>
						<ButtonCircle
							className="absolute right-2 top-1/2 -translate-y-1/2 transform"
							size=" w-12 h-12 "
						>
							<ArrowRightIcon className="h-5 w-5" />
						</ButtonCircle>
					</div>
				</div>

				{/* comment */}
				<div className="divide-y divide-neutral-100 dark:divide-neutral-800">
					{reviews?.map((review: any, i: number) => (
						<CommentListing key={i} {...review} className="py-8" />
					))}

					<div className="pt-8">
						<ButtonSecondary>View more 20 reviews</ButtonSecondary>
					</div>
				</div>
			</div>
		)
	}

	const renderSection8 = () => {
		return (
			<div className="listingSection__wrap">
				{/* HEADING */}
				<h2 className="text-2xl font-semibold">Things to know</h2>
				<div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

				{/* CONTENT */}
				<div>
					<h4 className="text-lg font-semibold">Cancellation policy</h4>
					<span className="mt-3 block text-neutral-500 dark:text-neutral-400">
						Each service provided by TRAVSUS on the present Website (activities,
						day trips, guided tours and transfers) has its own specific
						cancellation policy. The User can check each specific cancellation
						policy in the description part of each activity (in the Website) or
						on the confirmation email that TRAVSUS will send the User once the
						reservation has been made. Hence, the specific cancellation
						conditions will be applicable to each service, which establish the
						cancellation time and possible penalisation. TRAVSUS will manage
						cancellations and will confirm the cancellation policies of each
						activity, excursion, guided tour and/or transfer. If the PROVIDER
						does not have availability on the reserved date, TRAVSUS will offer
						the customer an alternate date or schedule, which must be accepted
						or declined by the customer. If no reply about the alternative
						option is received within 72 hours, the booking will be cancelled
						and refunded immediately. In either case, TRAVSUS will send the
						relevant documentation. IN ACCORDANCE WITH THE ABOVE, AND BY
						ACCEPTING THESE GENERAL TERMS OF USE, THE USERS DECLARE TO HAVE
						EXPRESSLY READ AND ACCEPTED THE PRESENT CANCELLATION POLICY AND
						HEREBY AGREE TO THE CANCELLATION POLICIES OF EACH ACTIVITY, DAY
						TRIP, GUIDED TOUR AND / OR TRANSFER THAT ARE RESERVED ON THE PRESENT
						WEBSITE.
					</span>
				</div>
				<div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

				{/* CONTENT */}
				<div>
					<h4 className="text-lg font-semibold">Guest requirements</h4>
					<span className="mt-3 block text-neutral-500 dark:text-neutral-400">
						Up to 100 guests ages 4 and up can attend. Parents may also bring
						children under 2 years of age.
					</span>
				</div>
				<div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

				{/* CONTENT */}
				<div>
					<h4 className="text-lg font-semibold">What to bring</h4>
					<div className="prose sm:prose">
						{travelChecklist.map((category, index) => (
							<div key={index}>
								<h5 className="text-lg font-semibold">{category.category}</h5>
								<ul>
									{category.items.map((item, idx) => (
										<li key={idx}>{item}</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}

	return (
		<>
			<TourHeader />
			<ListingExperiencesDetailsImages />
			<div className={`nc-ListingExperiencesDetailPage`}>
				{/* MAIn */}
				<main className="relative z-10 mt-11 flex flex-col lg:flex-row">
					{/* CONTENT */}
					<div className="w-full space-y-8 lg:w-3/5 lg:space-y-10 lg:pr-10 xl:w-2/3">
						{renderSection2()}
						{/* <TourListingHeader /> */}
						<Included />
						{/* {days && <TourItinerary itinerary={days} days={days} />} */}
					</div>

					{/* SIDEBAR */}
					<div className="mt-14 hidden flex-grow lg:mt-0 lg:block">
						<div className="top-28">
							<RenderSidebar />
						</div>
					</div>
				</main>
				{days && (
					<div>
						<h4 className="my-4 text-2xl font-semibold">Itinerary</h4>

						{days && (
							<TourItineraryWithMap
								days={days}
								// startAddress={startAddress}
								// endAddress={endAddress}
								// addresses={addresses}
							/>
						)}
					</div>
				)}

				{/* {itinerary()} */}
				{/* {renderSection3()} */}

				{/* <SectionDateRange /> */}

				{/* {renderSection5()} */}
				{/* {renderSection6()} */}
				<TourFAQ faqs={faq} />

				{/* {renderSection8()} */}
				<ReviewSystem serviceId={id} serviceName={title} />
				{/* <SectionGridFilterCard
					layout="row"
					className={'mb-10 mt-10 pb-24 lg:pb-28'}
				/> */}
			</div>
		</>
	)
}

export default ListingExperiencesDetailPage

const travelChecklist = [
	{
		category: 'Clothing',
		items: [
			'Lightweight, breathable clothes: Cotton or linen for hot days.',
			'Modest clothing: Long skirts, dresses, and loose pants are recommended for women.',
			'Layers: A light jacket or sweater for cooler evenings and mountain areas.',
			'Comfortable shoes: For walking, hiking, and exploring cities like Marrakech and Fez.',
			'Swimwear: For beaches, pools, or traditional hammams (spas).',
		],
	},
	{
		category: 'Accessories',
		items: [
			'Sunscreen and sunglasses: The sun can be intense, especially in desert areas.',
			'Wide-brimmed hat or scarf: For sun protection and to cover up when needed.',
			'Reusable water bottle: Stay hydrated while being eco-friendly.',
			'Daypack: For carrying essentials during day trips.',
		],
	},
	{
		category: 'Travel Essentials',
		items: [
			'Passport and visa (if required): Ensure they are valid for your travel dates.',
			'Travel insurance: For emergencies or unexpected situations.',
			"Cash in Moroccan Dirham (MAD): Many places, especially smaller shops, don't accept cards.",
			'Plug adapter: Morocco uses type C and E plugs, with a voltage of 220V.',
		],
	},
	{
		category: 'Health and Safety',
		items: [
			'Basic first-aid kit: Include band-aids, pain relievers, and any prescription medications.',
			'Insect repellent: Useful, especially if visiting during warmer months.',
			'Hand sanitizer and wet wipes: For cleanliness on the go.',
		],
	},
	{
		category: 'Technology',
		items: [
			'Phone and charger: Consider purchasing a local SIM card for affordable internet access.',
			'Power bank: To keep devices charged during long excursions.',
			"Camera: To capture Morocco's stunning landscapes and architecture.",
		],
	},
	{
		category: 'Special Activities',
		items: [
			'Hiking gear: If trekking in the Atlas Mountains or other hiking areas.',
			'Warm clothing: If visiting the Sahara Desert at night, as temperatures can drop significantly.',
			'Snorkeling or diving gear: If planning water adventures along the coast.',
		],
	},
	{
		category: 'Cultural Considerations',
		items: [
			'Small gifts: If invited to someone’s home, it’s polite to bring a token of appreciation.',
			'Phrasebook or translation app: Learning a few phrases in Tamazight or French can be helpful.',
		],
	},
	{
		category: 'Optional Items',
		items: [
			'Notebook or journal: To document your experiences.',
			'Books or e-reader: For downtime during travel.',
		],
	},
]
