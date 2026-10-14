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
import AffiliateShareBar from '@/components/AffiliateShareBar'
import ReadMore from '@/app/(client-components)/ReadeMore'
import { useTranslations } from '@/lib/i18n'
import { Clock3, Flag, MapPin } from 'lucide-react'
import { useTranslations as useIntlTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import TourCard from '@/app/[locale]/(home)/TourCard'
import MobileFooterSticky from '../(components)/MobileFooterSticky'
import BookingGuarantees from './BookingGuarantees'
import TourPreBookingInfo from './TourPreBookingInfo'
import ContactReservations from './ContactReservations'
import TourItineraryWithMap from './itinerary/TourItineraryWithMap'
import { TourServiceProvider, useTourService } from '../TourServiceContext'

export type ListingExperiencesDetailPageProps = {
	serviceData: any
	/** Other tours to suggest at the bottom (from the server) */
	similar?: HomeTour[]
}

// The tour arrives from the server as a prop and is shared through context,
// so the full content is in the server HTML (search engines, AI crawlers).
const ListingExperiencesDetailPage: FC<ListingExperiencesDetailPageProps> = ({
	serviceData,
	similar = [],
}) => (
	<TourServiceProvider value={serviceData}>
		<TourDetail serviceData={serviceData} similar={similar} />
	</TourServiceProvider>
)

const TourDetail: FC<ListingExperiencesDetailPageProps> = ({ similar = [] }) => {
	const t = useTranslations('servicedetail_listingexperiencesdetail_page')
	const tPage = useIntlTranslations('TourPage')
	const tHome = useIntlTranslations('Home')
	const service: any = useTourService()
	const { overview, days, faq }: any = service || {}
	const mobileReserveOpen = useAppSelector(selectMobileReserveOpen)

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [service?.id])

	// Quick facts under the overview (only the ones this tour has)
	const facts = [
		days?.length && { icon: Clock3, label: tPage('duration'), value: tHome('days_count', { count: days.length }) },
		service?.startAddress?.city && { icon: MapPin, label: tPage('starts_in'), value: service.startAddress.city },
		service?.endAddress?.city && { icon: Flag, label: tPage('ends_in'), value: service.endAddress.city },
	].filter(Boolean) as { icon: typeof Clock3; label: string; value: string }[]

	return (
		<>
			{!mobileReserveOpen && (
				<div className="mx-auto max-w-7xl px-5 pb-24 text-neutral-950 dark:text-white">
					<AffiliateShareBar title={service?.name} />
					<TourHeader />
					<ListingExperiencesDetailsImages />

					<div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
						{/* Main content */}
						<div className="min-w-0 space-y-14">
							<section>
								<span aria-hidden className="mb-3 block h-1 w-10 rounded-full bg-brand-500" />
								<h2 className="text-2xl font-bold tracking-tight">{t('Overview_Title')}</h2>
								{facts.length > 0 && (
									<dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
										{facts.map(({ icon: Icon, label, value }) => (
											<div key={label} className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
												<Icon className="h-5 w-5 shrink-0 text-brand-500" strokeWidth={1.8} />
												<div className="min-w-0">
													<dt className="text-xs text-neutral-500">{label}</dt>
													<dd className="truncate font-semibold">{value}</dd>
												</div>
											</div>
										))}
									</dl>
								)}
								{overview ? (
									<div className="mt-6 text-[17px] leading-relaxed text-neutral-700 dark:text-neutral-300">
										<ReadMore description={overview} />
									</div>
								) : (
									<ExperiencesDescriptionSkeleton className="listingSection__wrap_no_border" />
								)}
							</section>

							<BookingGuarantees />
							<Included />

							{days && (
								<section>
									<span aria-hidden className="mb-3 block h-1 w-10 rounded-full bg-brand-500" />
									<h2 className="mb-6 text-2xl font-bold tracking-tight">{t('Itinerary_Title')}</h2>
									<TourItineraryWithMap days={days} />
								</section>
							)}

							<TourPreBookingInfo />
							<TourFAQ faqs={faq} />
							{service?.id && <ReviewSystem serviceId={service.id} serviceName={service.name} />}
						</div>

						{/* Booking card: stays in view while scrolling */}
						<aside className="hidden lg:block">
							<div className="sticky top-32">
								<RenderSidebar />
								<ContactReservations />
							</div>
						</aside>
					</div>

					{similar.length > 0 && (
						<section className="mt-24">
							<span aria-hidden className="mb-3 block h-1 w-10 rounded-full bg-brand-500" />
							<h2 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">{t('Similar_Experiences')}</h2>
							<ul className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
								{similar.map((tour) => (
									<li key={tour.id}>
										<TourCard tour={tour} />
									</li>
								))}
							</ul>
						</section>
					)}
				</div>
			)}
			<MobileFooterSticky />
		</>
	)
}

export default ListingExperiencesDetailPage
