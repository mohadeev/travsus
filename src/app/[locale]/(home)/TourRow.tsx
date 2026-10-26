// Phone list row (search results): square photo with the save heart on the
// left; city, title, days, rating and price on the right.
import Image from 'next/image'
import { Star } from 'lucide-react'
import TourLink from '@/components/TourLink'
import { useLocale, useTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import { formatCurrency } from '@/utils/formatCurrency'
import SaveButton from './SaveButton'

export default function TourRow({ tour }: { tour: HomeTour }) {
	const t = useTranslations('Home')
	const locale = useLocale()
	const oneDecimal = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
	const whole = new Intl.NumberFormat(locale)
	// "from {price}" split around the price, so it can be bold in any word order
	const [before, after = ''] = t('from_price', { price: '\u0000' }).split('\u0000')

	return (
		<TourLink
			href={tour.href}
			preview={{ id: tour.id, name: tour.name, image: tour.image, days: tour.days, city: tour.city, price: tour.pricePerPerson, rating: tour.rating, reviewsCount: tour.reviewsCount }}
			className="group flex gap-3 py-4"
		>
			<div className="relative w-[36%] shrink-0 self-start overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800" style={{ aspectRatio: '1 / 1' }}>
				<Image src={tour.image} alt={tour.name} fill sizes="40vw" className="object-cover" />
				<div className="absolute right-2 top-2">
					<SaveButton tourId={tour.id} label={t('save')} />
				</div>
			</div>

			<div className="flex min-w-0 flex-1 flex-col">
				{tour.city && <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-400">{tour.city}</p>}
				<h3 className="mt-0.5 line-clamp-3 text-[15px] font-bold leading-[1.3] text-black group-hover:underline dark:text-white">{tour.name}</h3>
				{tour.days > 0 && <p className="mt-1.5 text-[13px] text-neutral-600 dark:text-neutral-400">{t('days_count', { count: tour.days })}</p>}

				<div className="mt-auto flex items-baseline justify-between gap-2 pt-2">
					{tour.reviewsCount > 0 && tour.rating ? (
						<span className="flex items-center gap-1 text-[13px] text-black dark:text-white">
							<span className="font-semibold">{oneDecimal.format(tour.rating)}</span>
							<Star className="h-3 w-3 fill-current" strokeWidth={0} />
							<span className="text-neutral-600 dark:text-neutral-400">({whole.format(tour.reviewsCount)})</span>
						</span>
					) : (
						<span />
					)}
					{tour.pricePerPerson && (
						<p className="text-right text-[13px] text-neutral-600 dark:text-neutral-400">
							{before}
							<span className="text-[17px] font-bold text-black dark:text-white">{formatCurrency(tour.pricePerPerson)}</span>
							{after}
							<span className="block text-[11px]">{t('per_person')}</span>
						</p>
					)}
				</div>
			</div>
		</TourLink>
	)
}
