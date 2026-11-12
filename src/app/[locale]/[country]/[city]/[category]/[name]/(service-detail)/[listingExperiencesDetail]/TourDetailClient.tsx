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
import TourTabs from './TourTabs'
import MobileBookingBox from './MobileBookingBox'
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
import TourPlanning from './TourPlanning'
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
				<div className="mx-auto max-w-7xl px-6 pb-24 text-ink dark:text-white">
					<AffiliateShareBar title={service?.name} />
					<TourHeader />
					<ListingExperiencesDetailsImages />
					<TourTabs />

					<div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
						{/* Main content, TripAdvisor layout: sections one under the other, divided by thin lines */}
						<div className="min-w-0 divide-y divide-neutral-200 dark:divide-neutral-800 [&>*:first-child]:pt-0 [&>*]:py-8">
							<section id="overview">
								<h2 className="headline text-[24px] !leading-tight">{tPage('about')}</h2>
								{overview ? (
									<div className="mt-4">
										<ReadMore description={overview} inline />
									</div>
								) : (
									<ExperiencesDescriptionSkeleton className="listingSection__wrap_no_border" />
								)}
								<MobileBookingBox />

								{/* At a glance: length and where it starts / ends, as three small tiles */}
								{facts.length > 0 && (
									<ul className={`mt-8 grid gap-2 ${facts.length === 3 ? 'grid-cols-3' : facts.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
										{facts.map(({ icon: Icon, label, value }) => (
											<li key={label} className="min-w-0 rounded-3xl bg-neutral-100 px-4 py-4 dark:bg-neutral-900">
												<span className="grid h-8 w-8 place-items-center rounded-full bg-white text-ink dark:bg-neutral-800 dark:text-white">
													<Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
												</span>
												<p className="mt-2 text-xs leading-4 text-ink-soft dark:text-neutral-400">{label}</p>
												<p className="truncate text-sm font-bold leading-5">{value}</p>
											</li>
										))}
									</ul>
								)}

								{/* Why book with us: four short promises, icon in a soft circle */}
								<ul className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
									<Fact icon={Users} title={tInfo('private_title')} text={tInfo('private_text')} />
									<Fact icon={CalendarCheck} title={tPerks('free_cancellation')} text={tPerks('free_cancellation_description')} />
									<Fact icon={Wallet} title={tPerks('reserve_now_pay_later')} text={tPerks('reserve_now_pay_later_description')} />
									<Fact icon={BadgeEuro} title={tPerks('lowest_price_guaranteed')} text={tPerks('lowest_price_guaranteed_description')} />
								</ul>
							</section>

							<Included />

							{days && (
								<section id="itinerary">
									<h2 className="headline mb-5 text-[24px] !leading-tight">{tPage('itinerary_heading', { days: days.length })}</h2>
									<TourItineraryWithMap days={days} />
								</section>
							)}

							<TourPlanning />
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
const CARD_TOP = 72

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
		<li className="flex gap-3.5">
			<span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-100 text-ink dark:bg-neutral-900 dark:text-white">
				<Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
			</span>
			<p className="min-w-0 pt-0.5">
				<span className="block text-base font-bold leading-6">{title}</span>
				{text && <span className="mt-0.5 block text-sm leading-5 text-ink-soft dark:text-neutral-400">{text}</span>}
			</p>
		</li>
	)
}

