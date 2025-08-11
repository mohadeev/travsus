'use client'

import { type FC, useEffect } from 'react'
import Avatar from '@/shared/Avatar'
import ButtonSecondary from '@/shared/ButtonSecondary'
import { usePathname } from 'next/navigation'
import StartRating from '@/components/StartRating'
import { useDispatch, useSelector } from 'react-redux'
import {
	setPricePerSeat,
	setSelectedDate,
} from '@/app/GlobalRedux/Features/bookingSlice/bookingSlice'
import RenderSidebar from './RenderSidebar'
import ListingExperiencesDetailsImages from './ListingExperiencesDetailsImages'
import ExperiencesDescriptionSkeleton from './ExperiencesDescriptionSkeleton'
import dynamic from 'next/dynamic'
import TourFAQ from './FAQProps'
import ReviewSystem from './ReviewSystem'
import Included from './Included'
import TourItineraryWithMap from './tour-itinerary-with-map'
import TourHeader from './TourHeader'
import ReadMore from '@/app/(client-components)/ReadeMore'
import { useTranslations } from '@/lib/i18n'
import ItemsCardList from '@/components/ItemsCardList'

const MapComponent = dynamic(() => import('./tour-map'), {
	ssr: false,
})

export type ListingExperiencesDetailPageProps = {}

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
	const t = useTranslations('servicedetail_listingexperiencesdetail_page')

	const thisPathname = usePathname()
	const dispatch = useDispatch()

	const { booking } = useSelector((state: any) => state.bookingSlice)

	const initialPrice = 100
	useEffect(() => {
		// Update the price when the component mounts or when initialPrice changes
		dispatch(setPricePerSeat(initialPrice))
	}, [dispatch, initialPrice])

	const handleDateChange = (date: string) => {
		dispatch(setSelectedDate(date))
	}

	const {
		name: title,
		id,
		overview,
		days,
		startAddress,
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
							<h4 className="my-4 text-2xl font-semibold">
								{t('Overview_Title')}
							</h4>
							<div className="mb-0.5 rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-black md:text-base">
								<ReadMore description={overview} />
							</div>
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
				<h2 className="text-2xl font-semibold">
					{t('Host_Information_Title')}
				</h2>
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
							{t('Host_Name')}
						</a>
						<div className="mt-1.5 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
							<StartRating />
							<span className="mx-2">·</span>
							<span> {t('Host_Places_Count')}</span>
						</div>
					</div>
				</div>

				{/* desc */}
				<span className="text-neutral-6000 block dark:text-neutral-300">
					{t('Host_Description')}
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
						<span>{t('Host_Joined_Date')}</span>
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
						<span>{t('Host_Response_Rate')}</span>
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

						<span>{t('Host_Response_Time')}</span>
					</div>
				</div>

				{/* == */}
				<div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
				<div>
					<ButtonSecondary href="/author">
						{t('See_Host_Profile_Button')}
					</ButtonSecondary>
				</div>
			</div>
		)
	}

	const renderSection8 = () => {
		return (
			<div className="listingSection__wrap">
				{/* HEADING */}
				<h2 className="text-2xl font-semibold">{t('Things_To_Know_Title')}</h2>
				<div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

				{/* CONTENT */}
				<div>
					<h4 className="text-lg font-semibold">
						{t('Cancellation_Policy_Title')}
					</h4>
					<span className="mt-3 block text-neutral-500 dark:text-neutral-400">
						{t('Cancellation_Policy_Text')}
					</span>
				</div>
				<div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

				{/* CONTENT */}
				<div>
					<h4 className="text-lg font-semibold">
						{t('Guest_Requirements_Title')}
					</h4>
					<span className="mt-3 block text-neutral-500 dark:text-neutral-400">
						{t('Guest_Requirements_Text')}
					</span>
				</div>
				<div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />
			</div>
		)
	}

	return (
		<>
			<TourHeader />
			<ListingExperiencesDetailsImages />
			<div className={`nc-ListingExperiencesDetailPage`}>
				<main className="relative z-10 mt-11 flex flex-col lg:flex-row">
					<div className="w-full space-y-8 lg:w-3/5 lg:space-y-10 lg:pr-10 xl:w-2/3">
						{renderSection2()}
						<Included />
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
						<h4 className="my-4 text-2xl font-semibold">
							{t('Itinerary_Title')}
						</h4>

						{days && <TourItineraryWithMap days={days} />}
					</div>
				)}

				<TourFAQ faqs={faq} />
				<ReviewSystem serviceId={id} serviceName={title} />
				<ItemsCardList
					locationType="tour"
					heading={t('app_locale_ClientHomePage_Popular_Tours')}
					subHeading={t('app_locale_ClientHomePage_Discover_Exciting_Tours')}
					currentPage={1}
					layout="row"
				/>
			</div>
		</>
	)
}

export default ListingExperiencesDetailPage
