// TripAdvisor-style tour card: square photo with the save heart, city chip,
// bold black title, rating bubbles with the number of reviews (nothing when
// there are none yet), price.
import Image from 'next/image'
import TourLink from '@/components/TourLink'
import { useLocale, useTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import { formatCurrency } from '@/utils/formatCurrency'
import RatingBubbles from './RatingBubbles'
import SaveButton from './SaveButton'

export default function TourCard({ tour }: { tour: HomeTour }) {
	const t = useTranslations('Home')
	const locale = useLocale()
	const oneDecimal = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
	const whole = new Intl.NumberFormat(locale)

	return (
		<TourLink
			href={tour.href}
			preview={{ id: tour.id, name: tour.name, image: tour.image, days: tour.days, city: tour.city, price: tour.pricePerPerson, rating: tour.rating, reviewsCount: tour.reviewsCount }}
			className="group block"
		>
			<div className="relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800" style={{ aspectRatio: "1 / 1" }}>
				<Image
					src={tour.image}
					alt={tour.name}
					fill
					sizes="(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 25vw"
					className="object-cover transition duration-500 group-hover:scale-[1.04]"
				/>
				<div className="absolute right-2 top-2 sm:right-3 sm:top-3">
					<SaveButton tourId={tour.id} label={t('save')} />
				</div>
				{tour.days > 0 && (
					<span className="absolute bottom-2 left-2 rounded-md bg-white/95 px-1.5 py-0.5 text-[11px] font-bold text-black shadow-sm sm:bottom-3 sm:left-3 sm:px-2 sm:py-1 sm:text-xs">
						{t('days_count', { count: tour.days })}
					</span>
				)}
			</div>

			<div className="mt-2 sm:mt-3">
				{tour.city && (
					<span className="inline-block max-w-full truncate rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-black sm:px-2.5 sm:py-1 sm:text-xs dark:bg-neutral-800 dark:text-white">
						{tour.city}
					</span>
				)}

				<h3 className="mt-1.5 line-clamp-3 text-[15px] font-bold leading-[1.25] text-black group-hover:underline sm:text-[17px] dark:text-white">
					{tour.name}
				</h3>

				{tour.reviewsCount > 0 && tour.rating ? (
					<div className="mt-1 flex items-center gap-1 text-[13px] text-black sm:text-sm dark:text-white">
						<span className="font-semibold">{oneDecimal.format(tour.rating)}</span>
						<RatingBubbles rating={tour.rating} size={12} tone="green" />
						<span>({whole.format(tour.reviewsCount)})</span>
					</div>
				) : null}

				{tour.pricePerPerson && (
					<p className="mt-1 text-[13px] font-bold text-black sm:text-sm dark:text-white">
						{t('from_price', { price: formatCurrency(tour.pricePerPerson) })} {t('per_person')}
					</p>
				)}
			</div>
		</TourLink>
	)
}
