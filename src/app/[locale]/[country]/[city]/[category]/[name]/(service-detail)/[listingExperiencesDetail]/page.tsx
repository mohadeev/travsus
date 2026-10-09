'use client'

import { type FC, useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectMobileReserveOpen } from '@/store/slices/ui'
import RenderSidebar from './RenderSideBar/RenderSidebar'
import ListingExperiencesDetailsImages from './ListingExperiencesDetailsImages'
import ExperiencesDescriptionSkeleton from './ExperiencesDescriptionSkeleton'
import TourFAQ from './FAQProps'
import ReviewSystem from './ReviewSystem/ReviewSystem'
import Included from './Included'
import TourHeader from './TourHeader'
import ReadMore from '@/app/(client-components)/ReadeMore'
import { useTranslations } from '@/lib/i18n'
import ItemsCardList from '@/components/ItemsCardList'
import MobileFooterSticky from '../(components)/MobileFooterSticky'
import BookingGuarantees from './BookingGuarantees'
import TourPreBookingInfo from './TourPreBookingInfo'
import ContactReservations from './ContactReservations'
import TourItineraryWithMap from './itinerary/TourItineraryWithMap'
import { TourServiceProvider, useTourService } from '../TourServiceContext'

// const MapComponent = dynamic(() => import('./itinerary/TourMap'), {
// 	ssr: false,
// })

export type ListingExperiencesDetailPageProps = { serviceData: any }

// The tour arrives from the server as a prop and is shared through context,
// so the full content is in the server HTML (search engines, AI crawlers).
const ListingExperiencesDetailPage: FC<ListingExperiencesDetailPageProps> = ({
	serviceData,
}) => (
	<TourServiceProvider value={serviceData}>
		<TourDetail serviceData={serviceData} />
	</TourServiceProvider>
)

const TourDetail: FC<ListingExperiencesDetailPageProps> = ({ serviceData }) => {
	const t = useTranslations('servicedetail_listingexperiencesdetail_page')
	const service: any = useTourService()
	const { id, overview, days, faq }: any = service || {}
	const title = service?.name

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [service?.id])
	const renderSection2 = () => {
		return (
			<>
				{overview ? (
					<div className="space-y-0 p-0">
						<div className="max-w-3xl">
							<h2 className="my-4 text-2xl font-semibold">
								{t('Overview_Title')}
							</h2>
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

	const mobileReserveOpen = useAppSelector(selectMobileReserveOpen)
	return (
		<>
			{!mobileReserveOpen && (
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
								<h2 className="my-4 text-2xl font-semibold">
									{t('Itinerary_Title')}
								</h2>

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
