'use client'

import { type FC, Suspense, useEffect } from 'react'
import Avatar from '@/shared/Avatar'
import ButtonSecondary from '@/shared/ButtonSecondary'
import { usePathname } from 'next/navigation'
import StartRating from '@/components/StartRating'
import { useDispatch, useSelector } from 'react-redux'

import {
	setPricePerSeat,
	setSelectedDate,
} from '@/app/[locale]/GlobalRedux/Features/bookingSlice/bookingSlice'
import RenderSidebar from './RenderSideBar/RenderSidebar'
import ListingExperiencesDetailsImages from './ListingExperiencesDetailsImages'
import ExperiencesDescriptionSkeleton from './ExperiencesDescriptionSkeleton'
import dynamic from 'next/dynamic'
import TourFAQ from './FAQProps'
import ReviewSystem from './ReviewSystem/ReviewSystem'
import Included from './Included'
import TourItineraryWithMap from './itinerary/tour-itinerary-with-map'
import TourHeader from './TourHeader'
import ReadMore from '@/app/(client-components)/ReadeMore'
import { useTranslations } from '@/lib/i18n'
import ItemsCardList from '@/components/ItemsCardList'
import MobileFooterSticky from '../(components)/MobileFooterSticky'
import { updateServiceState } from '@/app/[locale]/GlobalRedux/Features/creatingServiceSlice/creatingServiceSlice'
import BookingGuarantees from './BookingGuarantees'
import TourPreBookingInfo from './TourPreBookingInfo'
import ContactReservations from './ContactReservations'

const MapComponent = dynamic(() => import('./itinerary/tour-map'), {
	ssr: false,
})

export type ListingExperiencesDetailPageProps = { serviceData: any }

interface Address {
	streetAddress?: string
	buildingNumber?: string
	city?: string
	state?: string
	postalCode?: string
	country?: string
}

const ListingExperiencesDetailPage: FC<ListingExperiencesDetailPageProps> = ({
	serviceData,
}) => {
	const t = useTranslations('servicedetail_listingexperiencesdetail_page')
	useEffect(() => {
		;(async () => {
			try {
				// Update global state
				dispatch(updateServiceState({ path: 'service', value: serviceData }))
			} catch (error: any) {}
		})()
		return () => {
			dispatch(updateServiceState({ path: 'service', value: null }))
		}
	}, [serviceData?.id])
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

	const { id, overview, days, startAddress, faq }: any =
		useSelector((state: any) => state.creatingServiceSlice.service) || {}
	const service: any = useSelector(
		(state: any) => state.creatingServiceSlice.service,
	)
	const title = service?.name

	const city = startAddress?.city
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [service?.id])
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

	const { mobileFooterStickyToggle } = useSelector(
		(state: any) => state.overlaySlice,
	)
	return (
		<>
			{mobileFooterStickyToggle === false && (
				<>
					<div className={'container'}>
						<TourHeader />
					</div>
					<ListingExperiencesDetailsImages />
					<div className={`nc-ListingExperiencesDetailPage container`}>
						<main className="mt-11 flex flex-col lg:flex-row">
							<div className="w-full space-y-8 lg:w-3/5 lg:space-y-10 lg:pr-10 xl:w-2/3">
								{renderSection2()}
								<Included />
								<BookingGuarantees />
								<TourFAQ faqs={faq} />
							</div>

							{/* SIDEBAR */}
							<div className="mt-14 hidden flex-grow lg:mt-0 lg:block">
								<div className="top-28">
									<RenderSidebar />
									<ContactReservations />
								</div>
							</div>
						</main>
						<TourPreBookingInfo />
						{days && (
							<div>
								<h4 className="my-4 text-2xl font-semibold">
									{t('Itinerary_Title')}
								</h4>

								{days && <TourItineraryWithMap days={days} />}
							</div>
						)}

						{id && <ReviewSystem serviceId={id} serviceName={title} />}
						{id && (
							<ItemsCardList
								locationType="relatedTours"
								heading={t('Similar_Experiences')}
								currentPage={1}
								id={id}
								layout="row"
							/>
						)}
					</div>
				</>
			)}
			<MobileFooterSticky />
		</>
	)
}

export default ListingExperiencesDetailPage
