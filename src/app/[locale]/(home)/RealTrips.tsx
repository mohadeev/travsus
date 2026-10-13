// "Real trips. Real people." Grey card with a photo collage of travellers.
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PHOTOS } from '@/lib/photos'
import RatingBubbles from './RatingBubbles'

type Props = { rating: { average: number | null; count: number } }

export default function RealTrips({ rating }: Props) {
	const t = useTranslations('Home')

	return (
		<section className="grid items-center gap-10 overflow-hidden rounded-[28px] bg-neutral-100 p-7 sm:p-12 lg:grid-cols-2 dark:bg-neutral-900">
			<div>
				<h2 className="text-3xl font-bold tracking-tight sm:text-5xl">{t('travelers_title')}</h2>
				<p className="mt-4 max-w-md text-lg text-neutral-600 dark:text-neutral-400">
					{t('travelers_text')}
				</p>
				{rating.average && rating.count > 0 && (
					<p className="mt-6 flex items-center gap-2 text-sm font-medium">
						<RatingBubbles rating={rating.average} size={14} />
						{t('avg_rating', { rating: rating.average.toFixed(1), count: rating.count })}
					</p>
				)}
				<Link
					href={'/search?query=' as any}
					className="group mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950"
				>
					{t('explore_tours')}
					<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Link>
			</div>

			<div className="grid h-[380px] grid-cols-2 grid-rows-2 gap-3 sm:h-[460px]">
				{[PHOTOS.hiking, PHOTOS.sunsetHug, PHOTOS.laughing].map((photo, i) => (
					<div
						key={photo}
						className={`relative overflow-hidden rounded-2xl ${i === 0 ? 'row-span-2' : ''}`}
					>
						<Image src={photo} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
					</div>
				))}
			</div>
		</section>
	)
}
