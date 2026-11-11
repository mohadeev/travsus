'use client'
// Shown the instant a tour is opened, while the real page loads. It is laid
// out exactly like the tour page (TourHeader, the photo, the section tabs), so
// nothing jumps when the page arrives: what the clicked card already knew
// (name, rating, photo) is shown in place, the rest as quiet grey shapes.
// Opened directly (no card clicked): the same layout with shapes only.
import Image from 'next/image'
import { ChevronLeft, Heart, Share } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useAppSelector } from '@/store/hooks'
import { selectTourPreview, type TourPreview } from '@/store/slices/tourPage'
import RatingBubbles from '@/app/[locale]/(home)/RatingBubbles'

const Shape = ({ className = '' }: { className?: string }) => <span className={`block rounded-full bg-neutral-100 dark:bg-neutral-800 ${className}`} />
const icon = 'grid h-10 w-10 place-items-center text-ink dark:text-white'

export default function TourPreviewShell() {
	const tPage = useTranslations('TourPage')
	const tHeader = useTranslations('Jan03_TourHeader_x9k2')
	const stored = useAppSelector(selectTourPreview) as TourPreview | null
	// Only previews made by a card click (the shape below), never an old full tour object
	const tour = stored && typeof stored === 'object' && 'image' in stored ? stored : null

	return (
		<div className="mx-auto max-w-7xl px-6 pb-24 text-ink dark:text-white" aria-busy="true">
			{/* Same as TourHeader: back arrow (phones) / breadcrumb, Save and Share */}
			<div className="pt-3">
				<div className="flex items-center justify-between gap-3">
					<span className={`-ml-2 sm:hidden ${icon}`}>
						<ChevronLeft className="h-6 w-6" strokeWidth={1.8} />
					</span>
					<Shape className="hidden h-4 w-64 sm:block" />
					<div className="-mr-2 flex items-center">
						<span className={icon}>
							<Heart className="h-[22px] w-[22px]" strokeWidth={1.8} />
						</span>
						<span className={icon}>
							<Share className="h-[22px] w-[22px]" strokeWidth={1.8} />
						</span>
					</div>
				</div>

				{tour?.name ? (
					<h1 className="headline mt-4 text-2xl ![text-wrap:wrap] !leading-7 sm:text-[32px] sm:!leading-[38px] lg:text-[36px] lg:!leading-[42px]">{tour.name}</h1>
				) : (
					<div className="mt-4 space-y-2">
						<Shape className="h-6 w-11/12 sm:h-8" />
						<Shape className="h-6 w-2/3 sm:h-8" />
					</div>
				)}

				{tour?.rating && tour.reviewsCount ? (
					<p className="mt-2 flex items-center gap-1.5 text-base leading-6 tabular-nums">
						<span>{tour.rating.toFixed(1)}</span>
						<RatingBubbles rating={tour.rating} size={16} tone="green" />
						<span className="underline underline-offset-4">
							({tour.reviewsCount.toLocaleString()} {tHeader('Reviews')})
						</span>
					</p>
				) : (
					<Shape className="mt-3 h-4 w-40" />
				)}
			</div>

			{/* Same as the gallery: one photo across the width on phones, a large one on bigger screens */}
			<div className="relative -mx-6 mt-5 bg-neutral-100 sm:hidden dark:bg-neutral-900" style={{ aspectRatio: '16 / 9' }}>
				{tour?.image && <Image src={tour.image} alt={tour.name ?? ''} fill priority sizes="100vw" className="object-cover" />}
			</div>
			<div className="mt-5 hidden h-[446px] grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] grid-rows-2 gap-1.5 overflow-hidden rounded-xl sm:grid">
				<div className="relative row-span-2 bg-neutral-100 dark:bg-neutral-900">
					{tour?.image && <Image src={tour.image} alt={tour.name ?? ''} fill priority sizes="(max-width: 1280px) 50vw, 620px" className="object-cover" />}
				</div>
				<div className="bg-neutral-100 dark:bg-neutral-900" />
				<div className="bg-neutral-100 dark:bg-neutral-900" />
				<div className="col-span-2 bg-neutral-100 dark:bg-neutral-900" />
			</div>

			{/* Same as the section tabs */}
			<div className="-mx-6 mt-4 flex gap-7 overflow-hidden whitespace-nowrap px-6 text-base font-bold leading-6">
				{(['tab_overview', 'tab_details', 'tab_itinerary', 'tab_reviews'] as const).map((key, i) => (
					<span key={key} className={`border-b-[3px] py-3 ${i === 0 ? 'border-brand-500' : 'border-transparent'}`}>
						{tPage(key)}
					</span>
				))}
			</div>

			{/* About: the heading and a few quiet lines of text */}
			<div className="mt-6 max-w-3xl">
				<h2 className="headline text-[24px] !leading-tight">{tPage('about')}</h2>
				<div className="mt-4 space-y-3">
					<Shape className="h-4 w-full" />
					<Shape className="h-4 w-11/12" />
					<Shape className="h-4 w-4/5" />
				</div>
			</div>
		</div>
	)
}
