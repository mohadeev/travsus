// Home page tour card, TripAdvisor layout: square photo with the save heart,
// bold two-line title, stars with the rating and number of reviews (only when
// the tour has reviews), length and starting city, and "from €276 per person"
// (whole euros, rounded up so it's never below what they'll pay).
import Image from 'next/image'
import TourLink from '@/components/TourLink'
import { useLocale, useTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import SaveButton from './SaveButton'

type Card = Omit<HomeTour, 'searchText'>

export default function ShelfCard({ tour }: { tour: Card }) {
	const t = useTranslations('Home')
	const locale = useLocale()
	const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
	const oneDecimal = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
	const whole = new Intl.NumberFormat(locale)
	const [beforePrice, afterPrice = ''] = t.raw('from_price').split('{price}')
	const details = [tour.days > 0 ? t('days_count', { count: tour.days }) : null, tour.city].filter(Boolean).join(' · ')

	return (
		<TourLink
			href={tour.href}
			preview={{ id: tour.id, name: tour.name, image: tour.image, days: tour.days, city: tour.city, price: tour.pricePerPerson, rating: tour.rating, reviewsCount: tour.reviewsCount }}
			className="group block min-w-0 text-black dark:text-white"
		>
			<div className="relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800" style={{ aspectRatio: '1 / 1' }}>
				<Image
					src={tour.image}
					alt={tour.name}
					fill
					sizes="(max-width: 680px) 72vw, (max-width: 1024px) 38vw, 300px"
					className="object-cover transition duration-500 group-hover:scale-105"
				/>
				<div className="absolute right-3 top-3">
					<SaveButton tourId={tour.id} label={t('save')} />
				</div>
			</div>

			<h3 title={tour.name} className="mt-2.5 line-clamp-2 text-base font-bold leading-[1.3] group-hover:underline">
				{tour.name}
			</h3>

			{tour.reviewsCount > 0 && tour.rating ? (
				<p className="mt-1.5 flex items-center gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
					<span className="flex gap-0.5" aria-hidden>
						{[0, 1, 2, 3, 4].map((i) => (
							<svg key={i} viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${i < Math.round(tour.rating!) ? 'fill-black dark:fill-white' : 'fill-neutral-300 dark:fill-neutral-600'}`}>
								<path d="M12 2.6l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8z" />
							</svg>
						))}
					</span>
					<span className="tabular-nums">
						{oneDecimal.format(tour.rating)} ({whole.format(tour.reviewsCount)})
					</span>
				</p>
			) : null}

			{details && <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{details}</p>}

			{tour.pricePerPerson && (
				<p className="mt-1.5 text-sm tabular-nums">
					{beforePrice}
					<b className="text-base font-extrabold">{money.format(Math.ceil(tour.pricePerPerson))}</b>
					{afterPrice} {t('per_person')}
				</p>
			)}
		</TourLink>
	)
}
