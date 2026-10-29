// Sahara banner: the invitation and button on the left, the best-selling desert
// trips on the right as small cards, the dune photo behind. Wide and compact.
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import { PHOTOS } from '@/lib/photos'
import { formatCurrency } from '@/utils/formatCurrency'
import TourLink from '@/components/TourLink'

// Best sellers first (3-day Marrakech, 3-day Fes, 2 nights in Merzouga)
const FEATURED = ['680bc6a5aa6f43072c7700f6', '680bc6b6aa6f43072c7700f8', '685bd6cd0496dbd8c4f2ee92']

export default function SaharaBanner({ tours }: { tours: Omit<HomeTour, 'searchText'>[] }) {
	const t = useTranslations('Home')
	const byId = new Map(tours.map((tour) => [tour.id, tour]))
	const trips = FEATURED.map((id) => byId.get(id)).filter((tour): tour is Omit<HomeTour, 'searchText'> => !!tour)

	return (
		<section className="relative isolate overflow-hidden rounded-3xl bg-neutral-950 text-white sm:rounded-[28px]">
			<Image src={PHOTOS.sahara} alt="" fill sizes="(max-width: 1280px) 100vw, 1280px" className="-z-10 object-cover" />
			<div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/60 to-black/20 lg:bg-gradient-to-r lg:from-black/80 lg:via-black/45 lg:to-black/30" />

			<div className="grid items-center gap-8 px-6 pb-7 pt-40 sm:px-10 sm:py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:px-14 lg:py-14">
				<div>
					<h2 className="headline text-3xl [text-shadow:0_1px_16px_rgb(0_0_0/0.35)] sm:text-5xl">
						{t('sahara_title')}
					</h2>
					<p className="mt-3 max-w-md text-base text-white/85 sm:mt-4 sm:text-lg">{t('sahara_text')}</p>
					<Link
						href={'/search?query=desert' as any}
						className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-neutral-950 transition hover:bg-amber-200 sm:mt-8 sm:w-auto"
					>
						{t('explore')}
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Link>
				</div>

				{trips.length > 0 && (
					<ul className="space-y-2.5 sm:space-y-3">
						{trips.map((trip) => (
							<li key={trip.id}>
								<TourLink
									href={trip.href}
									preview={{ id: trip.id, name: trip.name, image: trip.image, days: trip.days, city: trip.city, price: trip.pricePerPerson, rating: trip.rating, reviewsCount: trip.reviewsCount }}
									className="group flex items-center gap-3 rounded-2xl bg-white/10 p-2.5 pr-4 ring-1 ring-white/15 backdrop-blur-md transition hover:bg-white/20 sm:gap-4 sm:p-3 sm:pr-5"
								>
									<span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl sm:h-[72px] sm:w-24">
										<Image src={trip.image} alt="" fill sizes="96px" className="object-cover transition duration-500 group-hover:scale-110" />
									</span>
									<span className="min-w-0 flex-1">
										<span className="line-clamp-2 text-sm font-semibold leading-snug sm:text-base">{trip.name}</span>
										<span className="mt-1 block text-xs text-white/70 sm:text-sm">
											{trip.days > 0 && t('days_count', { count: trip.days })}
											{trip.pricePerPerson && (
												<>
													{trip.days > 0 && ' · '}
													<span className="font-semibold text-amber-300">{t('from_price', { price: formatCurrency(trip.pricePerPerson) })}</span>{' '}
													{t('per_person')}
												</>
											)}
										</span>
									</span>
									<ChevronRight className="h-5 w-5 shrink-0 text-white/60 transition group-hover:translate-x-0.5 group-hover:text-white" />
								</TourLink>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	)
}
