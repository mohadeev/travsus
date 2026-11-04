'use client'

import { type FC, type ReactNode, useEffect, useRef, useState } from 'react'
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
import { BadgeEuro, CalendarCheck, Clock3, Flag, MapPin, Users, Wallet } from 'lucide-react'
import { useTranslations as useIntlTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import ShelfCard from '@/app/[locale]/(home)/ShelfCard'
import HomeRow from '@/app/[locale]/(home)/HomeRow'
import MobileFooterSticky from '../(components)/MobileFooterSticky'
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
	const tPerks = useTranslations('PremiumTourBenefits')
	const tInfo = useTranslations('BookingInfo')
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

					<div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
						{/* Main content, TripAdvisor layout: sections one under the other, divided by thin lines */}
						<div className="min-w-0 divide-y divide-neutral-200 dark:divide-neutral-800 [&>*:first-child]:pt-0 [&>*]:py-8">
							<section>
								<h2 className="headline text-[24px] !leading-tight">{t('Overview_Title')}</h2>
								{overview ? (
									<div className="mt-3 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
										<ReadMore description={overview} />
									</div>
								) : (
									<ExperiencesDescriptionSkeleton className="listingSection__wrap_no_border" />
								)}

								{/* Key facts, as on TripAdvisor: an icon and a line each */}
								<ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
									{facts.map(({ icon: Icon, label, value }) => (
										<Fact key={label} icon={Icon} title={`${label}: ${value}`} />
									))}
									<Fact icon={Users} title={tInfo('private_title')} text={tInfo('private_text')} />
									<Fact icon={CalendarCheck} title={tPerks('free_cancellation')} text={tPerks('free_cancellation_description')} />
									<Fact icon={Wallet} title={tPerks('reserve_now_pay_later')} text={tPerks('reserve_now_pay_later_description')} />
									<Fact icon={BadgeEuro} title={tPerks('lowest_price_guaranteed')} text={tPerks('lowest_price_guaranteed_description')} />
								</ul>
							</section>

							<Included />

							{days && (
								<section>
									<h2 className="headline mb-5 text-[24px] !leading-tight">{t('Itinerary_Title')}</h2>
									<TourItineraryWithMap days={days} />
								</section>
							)}

							<TourPreBookingInfo />
							<TourFAQ faqs={faq} />
							{service?.id && <ReviewSystem serviceId={service.id} serviceName={service.name} />}
						</div>

						{/* Booking card: stays in view while scrolling */}
						<aside className="hidden lg:flex lg:flex-col">
							{/* The booking card follows the visitor down the page; the contact
							    box sits at the end of the column */}
							<div className="flex-1">
								<StickyBookingCard>
									<RenderSidebar />
								</StickyBookingCard>
							</div>
							<div className="mt-6">
								<ContactReservations />
							</div>
						</aside>
					</div>

					{similar.length > 0 && (
						<section className="mt-16 border-t border-neutral-200 pt-10 dark:border-neutral-800">
							<h2 className="headline mb-4 text-[24px] !leading-tight">{t('Similar_Experiences')}</h2>
							<HomeRow label={t('Similar_Experiences')}>
								{similar.map((tour) => (
									<li key={tour.id} className="min-w-0 snap-start">
										<ShelfCard tour={tour} />
									</li>
								))}
							</HomeRow>
						</section>
					)}
				</div>
			)}
			<MobileFooterSticky />
		</>
	)
}

export default ListingExperiencesDetailPage

/** Space kept between the sticky site header and the booking card (px). */
const CARD_TOP = 96

/**
 * Keeps the booking card in view while scrolling (CSS sticky). On short
 * screens, where the whole card doesn't fit under the header, it sticks a bit
 * higher so its bottom, with the Reserve button, always stays on screen.
 */
function StickyBookingCard({ children }: { children: ReactNode }) {
	const ref = useRef<HTMLDivElement>(null)
	const [top, setTop] = useState(CARD_TOP)

	useEffect(() => {
		const card = ref.current
		if (!card) return
		const place = () => setTop(Math.min(CARD_TOP, window.innerHeight - card.offsetHeight - 16))
		place()
		const observer = new ResizeObserver(place)
		observer.observe(card)
		window.addEventListener('resize', place)
		return () => {
			observer.disconnect()
			window.removeEventListener('resize', place)
		}
	}, [])

	return (
		<div ref={ref} className="sticky z-10 transition-[top] duration-200" style={{ top }}>
			{children}
		</div>
	)
}

/** One key fact: an icon, a bold line and an optional short explanation. */
function Fact({ icon: Icon, title, text }: { icon: typeof Clock3; title: string; text?: string }) {
	return (
		<li className="flex gap-3">
			<Icon className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.9} aria-hidden />
			<p className="min-w-0 text-[15px] leading-snug">
				<span className="font-bold">{title}</span>
				{text && <span className="mt-0.5 block text-neutral-600 dark:text-neutral-400">{text}</span>}
			</p>
		</li>
	)
}

