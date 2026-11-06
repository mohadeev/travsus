// Phone list row (search results), in the same style as TourCard: a white card
// with a soft shadow; a photo on the left with the save heart and the number
// of days; on the right the city, a two-line title, the rating (nothing when
// there are no reviews yet), free cancellation, and the price pinned to the
// bottom as a whole number in the visitor's format ("from €276 per person"),
// rounded up so it's never below what they'll pay.
import Image from 'next/image'
import { Check } from 'lucide-react'
import TourLink from '@/components/TourLink'
import { useLocale, useTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import RatingBubbles from './RatingBubbles'
import SaveButton from './SaveButton'

export default function TourRow({ tour }: { tour: HomeTour }) {
	const t = useTranslations('Home')
	const tTrust = useTranslations('Trust')
	const locale = useLocale()
	const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
	const oneDecimal = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
	const whole = new Intl.NumberFormat(locale)
	// "from {price}" around a bigger price, in any word order
	const [beforePrice, afterPrice = ''] = t.raw('from_price').split('{price}')

	return (
		<TourLink
			href={tour.href}
			preview={{ id: tour.id, name: tour.name, image: tour.image, days: tour.days, city: tour.city, price: tour.pricePerPerson, rating: tour.rating, reviewsCount: tour.reviewsCount }}
			className="group flex overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_14px_rgba(0,0,0,0.05)] ring-1 ring-neutral-200/80 transition active:scale-[0.99] dark:bg-neutral-900 dark:ring-neutral-800"
		>
			<div className="relative w-[38%] shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
				<Image src={tour.image} alt={tour.name} fill sizes="40vw" className="object-cover" />
				{/* Keeps the white badge readable on bright desert photos */}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
				<div className="absolute right-2 top-2">
					<SaveButton tourId={tour.id} label={t('save')} />
				</div>
				{tour.days > 0 && (
					<span className="absolute bottom-2 left-2 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-black shadow-sm">
						{t('days_count', { count: tour.days })}
					</span>
				)}
			</div>

			<div className="flex min-h-[148px] min-w-0 flex-1 flex-col p-3">
				{tour.city && <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{tour.city}</p>}
				<h3 className="mt-0.5 line-clamp-3 text-[15px] font-bold leading-[1.3] text-black dark:text-white">{tour.name}</h3>

				{tour.reviewsCount > 0 && tour.rating ? (
					<div className="mt-1 flex items-center gap-1 text-[13px] text-black dark:text-white">
						<span className="font-semibold">{oneDecimal.format(tour.rating)}</span>
						<RatingBubbles rating={tour.rating} size={11} tone="green" />
						<span className="text-neutral-500">({whole.format(tour.reviewsCount)})</span>
					</div>
				) : null}

				<p className="mt-1 flex items-center gap-1 text-[12px] font-medium text-emerald-700 dark:text-emerald-400">
					<Check className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden />
					{tTrust('cancel_title')}
				</p>

				{tour.pricePerPerson && (
					<p className="mt-auto pt-2 text-[13px] leading-tight text-neutral-600 dark:text-neutral-400">
						{beforePrice}
						<span className="text-[17px] font-bold text-black dark:text-white">{money.format(Math.ceil(tour.pricePerPerson))}</span>
						{afterPrice} {t('per_person')}
					</p>
				)}
			</div>
		</TourLink>
	)
}
