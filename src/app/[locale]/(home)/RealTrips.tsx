// "Real trips. Real people." Grey card with a photo collage of travellers.
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PHOTOS } from '@/lib/photos'
import RatingBubbles from './RatingBubbles'
import styles from './home.module.css'

type Props = { rating: { average: number | null; count: number } }

export default function RealTrips({ rating }: Props) {
	const t = useTranslations('Home')

	return (
		<section className="grid items-center gap-7 overflow-hidden rounded-3xl bg-neutral-100 p-6 sm:gap-10 sm:rounded-[28px] sm:p-12 lg:grid-cols-2 dark:bg-neutral-900">
			<div>
				<h2 className="text-[26px] font-bold leading-tight tracking-tight sm:text-5xl">{t('travelers_title')}</h2>
				<p className="mt-2 max-w-md text-base text-neutral-600 sm:mt-4 sm:text-lg dark:text-neutral-400">
					{t('travelers_text')}
				</p>
				{rating.average && rating.count > 0 && (
					<p className="mt-4 flex items-center gap-2 text-sm font-medium sm:mt-6">
						<RatingBubbles rating={rating.average} size={14} />
						{t('avg_rating', { rating: rating.average.toFixed(1), count: rating.count })}
					</p>
				)}
				<Link
					href={'/search?query=' as any}
					className="group mt-5 inline-flex sm:mt-8 items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-xl active:scale-95 dark:bg-white dark:text-neutral-950"
				>
					{t('explore_tours')}
					<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Link>
			</div>

			<div className="grid h-[260px] grid-cols-2 grid-rows-2 gap-2 sm:h-[460px] sm:gap-3">
				{[PHOTOS.hiking, PHOTOS.sunsetHug, PHOTOS.laughing].map((photo, i) => (
					<div
						key={photo}
						className={`${styles.float} group relative overflow-hidden rounded-2xl ${i === 0 ? 'row-span-2' : ''}`}
					>
						<Image src={photo} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-110" />
					</div>
				))}
			</div>
		</section>
	)
}
