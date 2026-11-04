// Tour card, GetYourGuide / Airbnb style: a white card with a soft shadow that
// lifts on hover; a 4:3 photo (most of the card) with the save heart and the
// number of days; the starting city; a title always two lines tall, so every
// card in a row lines up; rating with the number of reviews (nothing when
// there are none yet); free cancellation; and the price pinned to the bottom,
// a whole number in the visitor's own format ("from €276 per person"),
// rounded up so it's never below what they'll pay.
import Image from 'next/image'
import { Check } from 'lucide-react'
import TourLink from '@/components/TourLink'
import { useLocale, useTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import RatingBubbles from './RatingBubbles'
import SaveButton from './SaveButton'

export default function TourCard({ tour }: { tour: HomeTour }) {
	const t = useTranslations('Home')
	const tTrust = useTranslations('Trust')
	const locale = useLocale()
	const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
	// "from {price}" around a bigger price
	const [beforePrice, afterPrice = ''] = t.raw('from_price').split('{price}')
	const oneDecimal = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
	const whole = new Intl.NumberFormat(locale)

	return (
		<TourLink
			href={tour.href}
			preview={{ id: tour.id, name: tour.name, image: tour.image, days: tour.days, city: tour.city, price: tour.pricePerPerson, rating: tour.rating, reviewsCount: tour.reviewsCount }}
			className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_14px_rgba(0,0,0,0.05)] ring-1 ring-neutral-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.25)] dark:bg-neutral-900 dark:ring-neutral-800"
		>
			<div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
				<Image
					src={tour.image}
					alt={tour.name}
					fill
					sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 25vw"
					className="object-cover transition duration-700 group-hover:scale-[1.05]"
				/>
				{/* Keeps the white badges readable on bright desert photos */}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
				<div className="absolute right-2.5 top-2.5">
					<SaveButton tourId={tour.id} label={t('save')} />
				</div>
				{tour.days > 0 && (
					<span className="absolute bottom-2.5 left-2.5 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-black shadow-sm">
						{t('days_count', { count: tour.days })}
					</span>
				)}
			</div>

			<div className="flex flex-1 flex-col p-3.5 sm:p-4">
				{tour.city && <p className="truncate text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{tour.city}</p>}
				<h3
					title={tour.name}
					className="mt-1 line-clamp-2 min-h-[2.6em] text-[15px] font-bold leading-[1.3] text-black group-hover:underline sm:text-base dark:text-white"
				>
					{tour.name}
				</h3>

				{tour.reviewsCount > 0 && tour.rating ? (
					<div className="mt-1.5 flex items-center gap-1.5 text-sm text-black dark:text-white">
						<span className="font-semibold">{oneDecimal.format(tour.rating)}</span>
						<RatingBubbles rating={tour.rating} size={13} tone="green" />
						<span className="text-neutral-500">({whole.format(tour.reviewsCount)})</span>
					</div>
				) : null}

				<p className="mt-1.5 flex items-center gap-1 text-[13px] font-medium text-emerald-700 dark:text-emerald-400">
					<Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
					{tTrust('cancel_title')}
				</p>

				{tour.pricePerPerson && (
					<p className="mt-auto pt-3 text-sm text-neutral-600 dark:text-neutral-400">
						{beforePrice}
						<span className="text-lg font-bold text-black dark:text-white">{money.format(Math.ceil(tour.pricePerPerson))}</span>
						{afterPrice} {t('per_person')}
					</p>
				)}
			</div>
		</TourLink>
	)
}
