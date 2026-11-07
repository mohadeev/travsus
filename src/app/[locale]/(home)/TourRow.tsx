// Phone list row (search results), with the same type and colours as the cards
// (measured on TripAdvisor's): no box or shadow; the photo on the left with 8px
// corners and the save heart; on the right, rows 4px apart: the starting city
// as a small grey label (12/16px), the title bold 16/20px (up to 3 lines), the
// rating 14/18px (value, green bubbles, number of reviews; nothing when there
// are no reviews yet), length and free cancellation 14/18px, and
// "from €276 per person" all bold 14/18px pinned to the bottom (whole euros,
// rounded up so it's never below what they'll pay).
import Image from 'next/image'
import TourLink from '@/components/TourLink'
import { useLocale, useTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import RatingBubbles from './RatingBubbles'
import SaveButton from './SaveButton'
import PopularBadge from './PopularBadge'

export default function TourRow({ tour }: { tour: HomeTour }) {
	const t = useTranslations('Home')
	const tTrust = useTranslations('Trust')
	const locale = useLocale()
	const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
	const oneDecimal = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
	const whole = new Intl.NumberFormat(locale)
	const details = [tour.days > 0 ? t('days_count', { count: tour.days }) : null, tTrust('cancel_title')].filter(Boolean).join(' · ')

	return (
		<TourLink
			href={tour.href}
			preview={{ id: tour.id, name: tour.name, image: tour.image, days: tour.days, city: tour.city, price: tour.pricePerPerson, rating: tour.rating, reviewsCount: tour.reviewsCount }}
			className="group flex gap-3 text-ink active:opacity-80 dark:text-white"
		>
			<div className="relative w-[38%] shrink-0 self-start overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800" style={{ aspectRatio: '1 / 1' }}>
				<Image src={tour.image} alt={tour.name} fill sizes="40vw" className="object-cover" />
				{tour.popular && <PopularBadge className="absolute bottom-2 left-2" />}
				<div className="absolute right-2 top-2">
					<SaveButton tourId={tour.id} label={t('save')} />
				</div>
			</div>

			<div className="flex min-w-0 flex-1 flex-col">
				<div className="grid content-start gap-1">
					{tour.city && (
						<span className="justify-self-start rounded bg-[#F7F7F7] px-2 py-1 text-xs leading-4 dark:bg-neutral-800">{tour.city}</span>
					)}
					<h3 className="line-clamp-3 text-base font-bold leading-5">{tour.name}</h3>

					{tour.reviewsCount > 0 && tour.rating ? (
						<p className="flex items-center gap-1 text-sm leading-[18px] text-ink-soft dark:text-neutral-300">
							<span className="tabular-nums">{oneDecimal.format(tour.rating)}</span>
							<RatingBubbles rating={tour.rating} size={12} tone="green" />
							<span className="tabular-nums">({whole.format(tour.reviewsCount)})</span>
						</p>
					) : null}

					<p className="text-sm leading-[18px] text-ink-soft dark:text-neutral-300">{details}</p>
				</div>

				{tour.pricePerPerson && (
					<p className="mt-auto pt-1 text-sm font-bold leading-[18px] tabular-nums">
						{t('from_price', { price: money.format(Math.ceil(tour.pricePerPerson)) })} {t('per_person')}
					</p>
				)}
			</div>
		</TourLink>
	)
}
