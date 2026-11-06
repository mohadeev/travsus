// Home page tour card, measured on TripAdvisor's own cards (computed styles of
// their product cards at 1440px and 390px wide):
// - square photo, 8px corners, the save heart in the corner, 8px below it;
// - then rows 4px apart: the starting city as a small grey label (12/16px),
//   the title bold 18/22px (up to 3 lines), the rating 14/18px (value, five
//   12px bubbles, number of reviews; only when the tour has reviews), the
//   length 14/18px, and "from €276 per person" all bold 14/18px (whole euros,
//   rounded up so it's never below what they'll pay).
// Text in the site's ink colours (main and secondary).
import Image from 'next/image'
import TourLink from '@/components/TourLink'
import { useLocale, useTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import RatingBubbles from './RatingBubbles'
import SaveButton from './SaveButton'

type Card = Omit<HomeTour, 'searchText'>

export default function ShelfCard({ tour }: { tour: Card }) {
	const t = useTranslations('Home')
	const locale = useLocale()
	const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
	const oneDecimal = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
	const whole = new Intl.NumberFormat(locale)

	return (
		<TourLink
			href={tour.href}
			preview={{ id: tour.id, name: tour.name, image: tour.image, days: tour.days, city: tour.city, price: tour.pricePerPerson, rating: tour.rating, reviewsCount: tour.reviewsCount }}
			className="group block min-w-0 text-ink dark:text-white"
		>
			{/* Square (inline: the aspect-ratio plugin turns Tailwind's aspect-square off) */}
			<div className="relative overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800" style={{ aspectRatio: '1 / 1' }}>
				<Image
					src={tour.image}
					alt={tour.name}
					fill
					sizes="(max-width: 640px) 66vw, (max-width: 1024px) 33vw, 272px"
					className="object-cover transition duration-500 group-hover:scale-105"
				/>
				<div className="absolute right-2 top-2">
					<SaveButton tourId={tour.id} label={t('save')} />
				</div>
			</div>

			<div className="mt-2 grid gap-1">
				{tour.city && (
					<span className="justify-self-start rounded bg-[#F7F7F7] px-2 py-1 text-xs leading-4 dark:bg-neutral-800">{tour.city}</span>
				)}

				<h3 title={tour.name} className="line-clamp-3 text-lg font-bold leading-[22px] group-hover:underline">
					{tour.name}
				</h3>

				{tour.reviewsCount > 0 && tour.rating ? (
					<p className="flex items-center gap-1 text-sm leading-[18px] text-ink-soft dark:text-neutral-300">
						<span className="tabular-nums">{oneDecimal.format(tour.rating)}</span>
						<RatingBubbles rating={tour.rating} size={12} />
						<span className="tabular-nums">({whole.format(tour.reviewsCount)})</span>
					</p>
				) : null}

				{tour.days > 0 && <p className="text-sm leading-[18px] text-ink-soft dark:text-neutral-300">{t('days_count', { count: tour.days })}</p>}

				{tour.pricePerPerson && (
					<p className="text-sm font-bold leading-[18px] tabular-nums">
						{t('from_price', { price: money.format(Math.ceil(tour.pricePerPerson)) })} {t('per_person')}
					</p>
				)}
			</div>
		</TourLink>
	)
}
