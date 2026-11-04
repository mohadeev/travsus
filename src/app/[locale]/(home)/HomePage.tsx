import { useTranslations } from 'next-intl'
import type { HomeDestination, HomeReview, HomeTour } from '@/lib/homeData'
import { PHOTOS } from '@/lib/photos'
import { SUPPORT_PHONE } from '@/constants/contact'
import HomeFaq from './HomeFaq'
import HomeHero from './HomeHero'
import HomeReviews from './HomeReviews'
import PhotoBanner from './PhotoBanner'
import RecentlyViewed from './RecentlyViewed'
import TopDestinations from './TopDestinations'
import TopTours from './TopTours'
import TrustSection from './TrustSection'

type Props = {
	tours: HomeTour[]
	destinations: HomeDestination[]
	reviews: HomeReview[]
	rating: { average: number | null; count: number }
}

const DESERT = /\b(desert|sahara|merzouga|erg chebbi|zagora|dunes?)\b/

/**
 * Home page laid out like TripAdvisor's: a plain white page, "Where to?" with
 * category tabs over one big search, one promo card, then rows of real
 * content (tours by kind, destinations, reviews), and the reassurance and
 * questions at the end. Each section is its own component in this folder.
 */
export default function HomePage({ tours, destinations, reviews }: Props) {
	const t = useTranslations('Home')
	const tLanding = useTranslations('Landing')
	// Tour cards for the browser (the search words are not needed there)
	const cards = tours.map(({ searchText, ...card }) => card)

	// Rows of tours by kind, most popular first. Each row starts with tours the
	// rows above don't already show on screen (their first 4), so no two rows
	// open with the same cards.
	const seen = new Set<string>()
	const row = (match: (tour: HomeTour) => boolean) => {
		const all = tours.filter(match)
		const fresh = all.filter((tour) => !seen.has(tour.id))
		const picked = [...fresh, ...all.filter((tour) => seen.has(tour.id))].slice(0, 12)
		picked.slice(0, 4).forEach((tour) => seen.add(tour.id))
		return picked
	}
	const top = row(() => true)
	const desert = row((tour) => DESERT.test(tour.searchText))
	const dayTrips = row((tour) => tour.days === 1)
	const multiDay = row((tour) => tour.days >= 4)

	return (
		<main className="pb-16 text-neutral-950 sm:pb-24 dark:text-white">
			<HomeHero />

			<div className="mx-auto max-w-7xl space-y-12 px-5 sm:space-y-16">
				{/* One promo card right under the search, as on TripAdvisor */}
				<PhotoBanner
					photo={PHOTOS.sahara}
					eyebrow={tLanding('cta_eyebrow')}
					title={tLanding('cta_title')}
					text={tLanding('cta_text')}
					ctaLabel={tLanding('cta_button')}
					ctaHref="/search?query="
					footnote={tLanding('cta_note', { phone: SUPPORT_PHONE })}
				/>

				{/* Tours this visitor opened (from their browser); hidden for new visitors */}
				<RecentlyViewed tours={cards} />

				<TopTours tours={top} />

				<TopTours tours={desert} title={t('shelf_desert')} subtitle={t('shelf_desert_sub')} href="/search?query=desert" />

				<TopDestinations destinations={destinations} />

				<TopTours tours={dayTrips} title={t('shelf_day')} subtitle={t('shelf_day_sub')} href="/search?query=&duration=1" />

				<TopTours tours={multiDay} title={t('shelf_multi')} subtitle={t('shelf_multi_sub')} href="/search?query=&duration=4%2B" />

				<HomeReviews reviews={reviews} />

				<TrustSection />

				<HomeFaq />
			</div>
		</main>
	)
}
