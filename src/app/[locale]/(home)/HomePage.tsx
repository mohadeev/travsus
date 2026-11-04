import { BadgeCheck, CalendarCheck, Headphones, ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { HomeDestination, HomeReview, HomeTour } from '@/lib/homeData'
import BookNowBanner from './BookNowBanner'
import HomeFaq from './HomeFaq'
import HomeMotion from './HomeMotion'
import HomeHero from './HomeHero'
import HomeReviews from './HomeReviews'
import HowItWorks from './HowItWorks'
import RealTrips from './RealTrips'
import RecentlyViewed from './RecentlyViewed'
import ImpactBanner from './ImpactBanner'
import ReferralBanner from './ReferralBanner'
import TopDestinations from './TopDestinations'
import TopTours from './TopTours'
import TrustSection from './TrustSection'
import styles from './home.module.css'

type Props = {
	tours: HomeTour[]
	destinations: HomeDestination[]
	reviews: HomeReview[]
	rating: { average: number | null; count: number }
}

/**
 * Home page layout, in the order a visitor makes up their mind: what we offer
 * and why to trust it (hero, proof row), what to book (tours, how it works,
 * destinations), what others say (reviews, real trips), what protects them
 * (trust, FAQ), then one last nudge. Each section is its own component in
 * this folder: reorder, add or remove sections below.
 */
export default function HomePage({ tours, destinations, reviews, rating }: Props) {
	const tLanding = useTranslations('Landing')
	const tTrust = useTranslations('Trust')
	// Tour cards for the browser (the search words are not needed there)
	const cards = tours.map(({ searchText, ...card }) => card)

	// Facts right under the search: real rating (when there is one), then what protects the booking
	const proof = [
		rating.average && rating.count > 0
			? ([BadgeCheck, tLanding('proof_rating', { rating: rating.average.toFixed(1), count: rating.count })] as const)
			: null,
		[ShieldCheck, tTrust('cancel_title')] as const,
		[CalendarCheck, tLanding('proof_deposit')] as const,
		[Headphones, tTrust('help_title')] as const,
	].filter((item) => item !== null)

	return (
		<>
			<HomeMotion />
			<main className="pb-12 text-neutral-950 sm:pb-24 dark:text-white">
				<HomeHero />

				{/* Phones: two columns, icon above text. Larger screens: one row. */}
				<ul className={`${styles.stagger} mx-auto grid max-w-7xl grid-cols-2 gap-x-2 gap-y-4 px-5 py-6 text-center text-xs font-medium leading-snug text-neutral-700 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-3 sm:py-8 sm:text-sm dark:text-neutral-300`}>
					{proof.map(([Icon, label]) => (
						<li key={label} className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
							<Icon className={`${styles.bob} h-5 w-5 shrink-0 text-neutral-950 dark:text-white`} />
							{label}
						</li>
					))}
				</ul>

				<div className="mx-auto max-w-7xl space-y-14 px-5 pt-4 sm:space-y-28 sm:pt-8">
					{/* Tours this visitor opened (from their browser); hidden for new visitors */}
					<RecentlyViewed tours={cards} />

					<TopTours tours={tours.slice(0, 16)} />

					<HowItWorks />

					<TopDestinations destinations={destinations} />

					<HomeReviews reviews={reviews} />

					{/* Photos of our best tours: real trips, not stock photos */}
					<div className={styles.reveal}>
						<RealTrips rating={rating} photos={tours.slice(0, 3).map((tour) => ({ src: tour.image, alt: tour.name }))} />
					</div>

					<TrustSection />

					<div className={styles.reveal}>
						<ImpactBanner />
					</div>

					<HomeFaq />

					<div className={styles.reveal}>
						<BookNowBanner />
					</div>

					<div className={styles.reveal}>
						<ReferralBanner />
					</div>
				</div>
			</main>
		</>
	)
}
