import { BadgeCheck, Headphones, ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { HomeDestination, HomeReview, HomeTour } from '@/lib/homeData'
import { PHOTOS } from '@/lib/photos'
import BookNowBanner from './BookNowBanner'
import HomeHero from './HomeHero'
import HomeReviews from './HomeReviews'
import HomeStructuredData from './HomeStructuredData'
import PhotoBanner from './PhotoBanner'
import RealTrips from './RealTrips'
import ReferralBanner from './ReferralBanner'
import TopDestinations from './TopDestinations'
import TopTours from './TopTours'
import styles from './home.module.css'

// [icon, translation key]: the promises under the hero
const PROMISES = [
	[BadgeCheck, 'app_locale_ClientHomePage_Best_Price_Guarantee'],
	[ShieldCheck, 'app_locale_ClientHomePage_No_Hidden_Fees'],
	[Headphones, 'app_locale_ClientHomePage_5_Star_Service_Quality'],
] as const

type Props = {
	tours: HomeTour[]
	destinations: HomeDestination[]
	reviews: HomeReview[]
	rating: { average: number | null; count: number }
}

/**
 * Home page layout. Each section is its own component in this folder:
 * reorder, add or remove sections below.
 */
export default function HomePage({ tours, destinations, reviews, rating }: Props) {
	const t = useTranslations('app_locale_ClientHomePage')
	const tHome = useTranslations('Home')

	return (
		<>
			<HomeStructuredData />

			<main className="pb-24 text-neutral-950 dark:text-white">
				<HomeHero destinations={destinations} />

				<ul className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-10 gap-y-3 px-5 py-8 text-sm font-medium text-neutral-600 dark:text-neutral-400">
					{PROMISES.map(([Icon, key]) => (
						<li key={key} className="flex items-center gap-2">
							<Icon className="h-5 w-5 text-neutral-950 dark:text-white" />
							{t(key)}
						</li>
					))}
				</ul>

				<div className="mx-auto max-w-7xl space-y-20 px-5 pt-8 sm:space-y-28">
					<TopTours tours={tours.slice(0, 8)} />

					<div className={styles.reveal}>
						<BookNowBanner />
					</div>

					<TopDestinations destinations={destinations} />

					<div className={styles.reveal}>
						<RealTrips rating={rating} />
					</div>

					<div className={styles.reveal}>
						<PhotoBanner
							photo={PHOTOS.sahara}
							align="right"
							title={tHome('sahara_title')}
							text={tHome('sahara_text')}
							ctaLabel={tHome('explore')}
							ctaHref="/search?query=desert"
						/>
					</div>

					<HomeReviews reviews={reviews} />

					<div className={styles.reveal}>
						<ReferralBanner />
					</div>
				</div>
			</main>
		</>
	)
}
