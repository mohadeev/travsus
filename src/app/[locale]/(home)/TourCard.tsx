// TripAdvisor-style tour card: photo, save heart, title, rating bubbles, price.
import Image from 'next/image'
import TourLink from '@/components/TourLink'
import { MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import { formatCurrency } from '@/utils/formatCurrency'
import RatingBubbles from './RatingBubbles'
import SaveButton from './SaveButton'

export default function TourCard({ tour }: { tour: HomeTour }) {
	const t = useTranslations('Home')

	return (
		<TourLink
			href={tour.href}
			preview={{ id: tour.id, name: tour.name, image: tour.image, days: tour.days, city: tour.city, price: tour.pricePerPerson, rating: tour.rating, reviewsCount: tour.reviewsCount }}
			className="group block"
		>
			<div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
				<Image
					src={tour.image}
					alt={tour.name}
					fill
					sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
					className="object-cover transition duration-500 group-hover:scale-105"
				/>
				<div className="absolute right-3 top-3">
					<SaveButton tourId={tour.id} label={t('save')} />
				</div>
				{tour.days > 0 && (
					<span className="absolute bottom-3 left-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-neutral-900 shadow">
						{t('days_count', { count: tour.days })}
					</span>
				)}
			</div>

			<div className="mt-3 space-y-1.5">
				<h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-neutral-900 group-hover:underline dark:text-white">
					{tour.name}
				</h3>

				{tour.reviewsCount > 0 && tour.rating ? (
					<div className="flex items-center gap-1.5 text-sm">
						<span className="font-semibold">{tour.rating.toFixed(1)}</span>
						<RatingBubbles rating={tour.rating} />
						<span className="text-neutral-500">
							({t('reviews_count', { count: tour.reviewsCount })})
						</span>
					</div>
				) : (
					<span className="inline-block rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
						{t('new_tour')}
					</span>
				)}

				{tour.city && (
					<p className="flex items-center gap-1 text-sm text-neutral-500">
						<MapPin className="h-3.5 w-3.5" />
						{tour.city}
					</p>
				)}

				{tour.pricePerPerson && (
					<p className="pt-0.5 text-sm text-neutral-700 dark:text-neutral-300">
						<span className="font-bold text-neutral-900 dark:text-white">
							{t('from_price', { price: formatCurrency(tour.pricePerPerson) })}
						</span>{' '}
						<span className="text-neutral-500">{t('per_person')}</span>
					</p>
				)}
			</div>
		</TourLink>
	)
}
