'use client'
// Shown the instant a tour is opened, while the real page loads: the tour page's
// layout filled with what the clicked card already knew (photo, name, days,
// city, rating, price) from Redux, and soft placeholders for the rest.
// Opened directly (no card clicked): the same layout with placeholders only.
import Image from 'next/image'
import { Clock3, MapPin, Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useAppSelector } from '@/store/hooks'
import { selectTourPreview, type TourPreview } from '@/store/slices/tourPage'
import { formatCurrency } from '@/utils/formatCurrency'

const Bar = ({ className = '' }: { className?: string }) => <span className={`block animate-pulse rounded-full bg-neutral-200/80 dark:bg-neutral-800 ${className}`} />

export default function TourPreviewShell() {
	const t = useTranslations('Home')
	const stored = useAppSelector(selectTourPreview) as TourPreview | null
	// Only previews made by a card click (the shape below), never an old full tour object
	const tour = stored && typeof stored === 'object' && 'image' in stored ? stored : null

	return (
		<div className="mx-auto max-w-7xl px-5 pb-24 text-neutral-950 dark:text-white" aria-busy="true">
			{/* Header: breadcrumb, title, rating */}
			<div className="pt-6">
				<Bar className="h-4 w-56" />
				{tour?.name ? (
					<h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{tour.name}</h1>
				) : (
					<div className="mt-4 space-y-3">
						<Bar className="h-9 w-4/5" />
						<Bar className="h-9 w-1/2" />
					</div>
				)}
				{tour?.rating ? (
					<p className="mt-3 inline-flex items-center gap-1.5 text-sm">
						<Star className="h-4 w-4 fill-current text-[#00AA6C]" />
						<span className="font-semibold">{tour.rating.toFixed(1)}</span>
						{tour.reviewsCount ? <span className="text-neutral-500">({tour.reviewsCount})</span> : null}
					</p>
				) : (
					<Bar className="mt-4 h-4 w-32" />
				)}
			</div>

			{/* Gallery: the card photo large, the other tiles as placeholders */}
			<div className="mt-6 sm:hidden">
				<div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
					{tour?.image && <Image src={tour.image} alt={tour.name ?? ''} fill priority sizes="100vw" className="object-cover" />}
				</div>
			</div>
			<div className="mt-6 hidden h-[460px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl sm:grid">
				<div className="relative col-span-2 row-span-2 bg-neutral-100 dark:bg-neutral-900">
					{tour?.image && <Image src={tour.image} alt={tour.name ?? ''} fill priority sizes="50vw" className="object-cover" />}
				</div>
				{[0, 1, 2, 3].map((i) => (
					<div key={i} className="animate-pulse bg-neutral-100 dark:bg-neutral-900" />
				))}
			</div>

			<div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
				{/* Overview: quick facts from the card, text placeholders */}
				<div className="min-w-0">
					<span aria-hidden className="mb-3 block h-1 w-10 rounded-full bg-brand-500" />
					<Bar className="h-7 w-40" />
					<div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
						{tour?.days ? (
							<Fact icon={<Clock3 className="h-5 w-5 text-brand-500" strokeWidth={1.8} />} value={t('days_count', { count: tour.days })} />
						) : (
							<div className="h-[66px] animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-900" />
						)}
						{tour?.city ? (
							<Fact icon={<MapPin className="h-5 w-5 text-brand-500" strokeWidth={1.8} />} value={tour.city} />
						) : (
							<div className="h-[66px] animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-900" />
						)}
					</div>
					<div className="mt-7 space-y-3">
						<Bar className="h-4 w-full" />
						<Bar className="h-4 w-11/12" />
						<Bar className="h-4 w-full" />
						<Bar className="h-4 w-3/4" />
					</div>
				</div>

				{/* Booking card: the price is already known */}
				<aside className="hidden lg:block">
					<div className="rounded-3xl border border-neutral-200 p-6 shadow-xl dark:border-neutral-800">
						{tour?.price ? (
							<p className="text-lg">
								<span className="text-3xl font-bold tracking-tight">{formatCurrency(tour.price)}</span>{' '}
								<span className="text-neutral-500">{t('per_person')}</span>
							</p>
						) : (
							<Bar className="h-9 w-40" />
						)}
						<div className="mt-6 space-y-4">
							<div className="h-14 animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-900" />
							<div className="h-28 animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-900" />
							<div className="h-24 animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-900" />
							<div className="h-14 animate-pulse rounded-full bg-brand-500/30" />
						</div>
					</div>
				</aside>
			</div>
		</div>
	)
}

function Fact({ icon, value }: { icon: React.ReactNode; value: string }) {
	return (
		<div className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
			{icon}
			<span className="truncate font-semibold">{value}</span>
		</div>
	)
}
