// TripAdvisor-style tour card: square photo with the save heart and the
// number of days, bold black title, rating bubbles with the number of reviews
// (nothing when there are none yet), bold price.
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
			<div className="relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800" style={{ aspectRatio: '1 / 1' }}>
				<Image
					src={tour.image}
					alt={tour.name}
					fill
					sizes="(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 25vw"
					className="object-cover transition duration-500 group-hover:scale-[1.04]"
				/>
				<div className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3">
					<SaveButton tourId={tour.id} label={t('save')} />
				</div>
				{tour.days > 0 && (
					<span className="absolute bottom-2.5 left-2.5 rounded-md bg-white px-2 py-0.5 text-xs font-bold text-black sm:bottom-3 sm:left-3">
						{t('days_count', { count: tour.days })}
					</span>
				)}
			</div>

			<h3 className="mt-3 line-clamp-3 text-[17px] font-bold leading-[1.3] text-black group-hover:underline dark:text-white">
				{tour.name}
			</h3>

			{tour.reviewsCount > 0 && tour.rating ? (
				<div className="mt-1 flex items-center gap-1.5 text-sm text-black dark:text-white">
					<span>{oneDecimal.format(tour.rating)}</span>
					<RatingBubbles rating={tour.rating} size={13} tone="green" />
					<span>({whole.format(tour.reviewsCount)})</span>
				</div>
			) : null}

			{tour.pricePerPerson && (
				<p className="mt-2 text-sm font-bold text-black dark:text-white">
					{t('from_price', { price: formatCurrency(tour.pricePerPerson) })} {t('per_person')}
				</p>
			)}
		</TourLink>
	)
}
