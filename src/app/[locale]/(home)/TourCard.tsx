// Tour card: photo with glass labels (days, save heart, city on a soft
// shade), bold black title, rating chip with the number of reviews (nothing
// when there are none yet), and a large price.
import Image from 'next/image'
import { MapPin, Star } from 'lucide-react'
import TourLink from '@/components/TourLink'
import { useLocale, useTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import { formatCurrency } from '@/utils/formatCurrency'
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
			<div
				className="relative isolate overflow-hidden rounded-2xl bg-neutral-100 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_36px_-14px_rgba(0,0,0,0.45)] sm:rounded-3xl dark:bg-neutral-800"
				style={{ aspectRatio: '1 / 1' }}
			>
				<Image
					src={tour.image}
					alt={tour.name}
					fill
					sizes="(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 25vw"
					className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
				/>
				{/* Shade so the city stays readable on any photo */}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

				{tour.days > 0 && (
					<span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold text-black shadow-sm backdrop-blur sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs">
						{t('days_count', { count: tour.days })}
					</span>
				)}
				<div className="absolute right-2 top-2 sm:right-3 sm:top-3">
					<SaveButton tourId={tour.id} label={t('save')} />
				</div>
				{tour.city && (
					<span className="absolute bottom-2 left-2 right-2 flex items-center gap-1 text-[12px] font-semibold text-white drop-shadow sm:bottom-3 sm:left-3 sm:text-sm">
						<MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
						<span className="truncate">{tour.city}</span>
					</span>
				)}
			</div>

			<div className="mt-2.5 px-0.5 sm:mt-3">
				<h3 className="line-clamp-2 text-[15px] font-extrabold leading-snug tracking-tight text-black decoration-2 underline-offset-2 group-hover:underline sm:text-[17px] dark:text-white">
					{tour.name}
				</h3>

				{tour.reviewsCount > 0 && tour.rating ? (
					<div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-black sm:text-[13px] dark:text-white">
						<span className="inline-flex items-center gap-1 rounded-full bg-black px-2 py-0.5 font-bold text-white dark:bg-white dark:text-black">
							<Star className="h-3 w-3 fill-current" strokeWidth={0} />
							{oneDecimal.format(tour.rating)}
						</span>
						<span className="font-medium">({whole.format(tour.reviewsCount)})</span>
					</div>
				) : null}

				{tour.pricePerPerson && (
					<p className="mt-1.5 text-[12px] font-medium text-black sm:text-[13px] dark:text-white">
						<span className="text-[16px] font-extrabold tracking-tight sm:text-lg">
							{t('from_price', { price: formatCurrency(tour.pricePerPerson) })}
						</span>{' '}
						{t('per_person')}
					</p>
				)}
			</div>
		</TourLink>
	)
}
