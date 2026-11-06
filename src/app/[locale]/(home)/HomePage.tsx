// Home page, TripAdvisor layout: "Where to?" with category tabs over one big
// search; a green promo card; rows of TRAVSUS tours (square photos, 4 in view);
// tall destination tiles; a yellow card; one more row of tours. The header and
// footer come from the site layout.
import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { HomeDestination, HomeReview, HomeTour } from '@/lib/homeData'
import { PHOTOS } from '@/lib/photos'
import HomeHero from './HomeHero'
import HomeRow from './HomeRow'
import PromoCard from './PromoCard'
import ShelfCard from './ShelfCard'

type Props = {
	tours: HomeTour[]
	destinations: HomeDestination[]
	reviews: HomeReview[]
	rating: { average: number | null; count: number }
}

const DESERT = /\b(desert|sahara|merzouga|erg chebbi|zagora|dunes?)\b/

export default function HomePage({ tours, destinations }: Props) {
	const t = useTranslations('Home')
	const tLanding = useTranslations('Landing')
	const tTrust = useTranslations('Trust')

	// Rows of tours, most popular first. Each row opens with tours the rows above
	// don't already show on screen (their first 4), so no two rows look the same.
	const seen = new Set<string>()
	const row = (match: (tour: HomeTour) => boolean) => {
		const all = tours.filter(match)
		const picked = [...all.filter((tour) => !seen.has(tour.id)), ...all.filter((tour) => seen.has(tour.id))].slice(0, 12)
		picked.slice(0, 4).forEach((tour) => seen.add(tour.id))
		return picked.map(({ searchText, ...card }) => card) // search words aren't needed in the browser
	}
	const top = row(() => true)
	const desert = row((tour) => DESERT.test(tour.searchText))
	const dayTrips = row((tour) => tour.days === 1)

	const shelf = (title: string, subtitle: string, cards: ReturnType<typeof row>) =>
		cards.length > 0 && (
			<section className="py-5 sm:py-7">
				{/* As on TripAdvisor: 20/24px extra bold, 16/24px subtitle 4px below, 16px to the cards */}
				<div className="mb-4">
					<h2 className="headline text-xl !leading-6">{title}</h2>
					<p className="mt-1 text-base leading-6 text-ink-soft dark:text-neutral-300">{subtitle}</p>
				</div>
				<HomeRow label={title}>
					{cards.map((tour) => (
						<li key={tour.id} className="min-w-0 snap-start">
							<ShelfCard tour={tour} />
						</li>
					))}
				</HomeRow>
			</section>
		)

	return (
		<main className="pb-12 text-ink dark:text-white">
			<HomeHero />

			<div className="mx-auto max-w-7xl px-6">
				<div className="py-5 sm:py-7">
					<PromoCard
						tone="dark"
						photo={PHOTOS.hiking}
						title={tLanding('cta_title')}
						text={tLanding('cta_text')}
						cta={tLanding('cta_button')}
						href="/search?query="
					/>
				</div>

				{shelf(t('top_tours'), t('top_tours_sub'), top)}
				{shelf(t('shelf_desert'), t('shelf_desert_sub'), desert)}

				{destinations.length > 0 && (
					<section className="py-5 sm:py-7">
						<h2 className="headline mb-4 text-[22px] !leading-[1.2] sm:text-[28px]">{t('destinations_title')}</h2>
						<HomeRow label={t('destinations_title')} wide>
							{destinations.slice(0, 12).map((d) => (
								<li key={d.city} className="min-w-0 snap-start">
									<Link href={`/search?query=${encodeURIComponent(d.city)}` as any} className="group relative block overflow-hidden rounded-xl bg-neutral-100" style={{ aspectRatio: '4 / 5' }}>
										<Image src={d.image} alt={d.city} fill sizes="(max-width: 680px) 62vw, (max-width: 1024px) 38vw, 300px" className="object-cover transition duration-500 group-hover:scale-105" />
										<span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
										<span className="absolute bottom-3.5 left-4 text-2xl font-extrabold tracking-[-0.01em] text-white">{d.city}</span>
									</Link>
								</li>
							))}
						</HomeRow>
					</section>
				)}

				<div className="py-5 sm:py-7">
					<PromoCard
						tone="yellow"
						photo={PHOTOS.sunsetHug}
						eyebrow={
							<>
								<ShieldCheck className="h-[22px] w-[22px]" strokeWidth={2} aria-hidden />
								TRAVSUS
							</>
						}
						title={tTrust('title')}
						text={tTrust('sub')}
						cta={tLanding('cta_button')}
						href="/search?query="
					/>
				</div>

				{shelf(t('shelf_day'), t('shelf_day_sub'), dayTrips)}
			</div>
		</main>
	)
}
