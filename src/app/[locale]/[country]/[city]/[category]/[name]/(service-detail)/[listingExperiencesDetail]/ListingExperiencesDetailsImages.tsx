'use client'
// Photo grid (one large + four small) and a full-screen gallery with every photo.
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Grid2x2, X } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { useTourService } from '../TourServiceContext'

export default function ListingExperiencesDetailsImages() {
	const t = useTranslations('ListingExperiencesDetailsImages')
	const { images, name }: any = useTourService()
	const photos: string[] = (images ?? []).map((image: any) => image?.url).filter(Boolean)
	const [open, setOpen] = useState<number | null>(null)

	// Gallery: Esc closes it, and the page behind doesn't scroll
	useEffect(() => {
		if (open === null) return
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
		document.addEventListener('keydown', onKey)
		document.body.style.overflow = 'hidden'
		document.getElementById(`photo-${open}`)?.scrollIntoView({ block: 'start' })
		return () => {
			document.removeEventListener('keydown', onKey)
			document.body.style.overflow = ''
		}
	}, [open])

	if (!photos.length) return <div className="mt-6 aspect-[2/1] animate-pulse rounded-3xl bg-neutral-100" />

	const tile = (index: number, className: string, sizes: string) =>
		photos[index] ? (
			<button
				key={index}
				type="button"
				onClick={() => setOpen(index)}
				className={`group relative overflow-hidden bg-neutral-100 ${className}`}
				aria-label={`${name} – ${index + 1}/${photos.length}`}
			>
				<Image
					src={photos[index]}
					alt={`${name} – ${index + 1}`}
					fill
					sizes={sizes}
					priority={index === 0}
					className="object-cover transition duration-500 group-hover:scale-[1.03]"
				/>
				<span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
			</button>
		) : null

	return (
		<>
			<div className="relative mt-6">
				{/* Phones: one photo */}
				<div className="sm:hidden">{tile(0, 'block aspect-[4/3] w-full rounded-2xl', '100vw')}</div>

				{/* Larger screens: one large photo and up to four small ones */}
				<div className="hidden h-[460px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl sm:grid">
					{tile(0, 'col-span-2 row-span-2', '(max-width: 1280px) 50vw, 640px')}
					{[1, 2, 3, 4].map((i) => tile(i, photos.length > 2 ? '' : 'row-span-2', '(max-width: 1280px) 25vw, 320px'))}
				</div>

				{photos.length > 1 && (
					<button
						type="button"
						onClick={() => setOpen(0)}
						className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg ring-1 ring-black/5 transition hover:bg-neutral-100"
					>
						<Grid2x2 className="h-4 w-4" />
						{t('show_all_photos', { count: photos.length })}
					</button>
				)}
			</div>

			{open !== null && (
				<div role="dialog" aria-modal="true" aria-label={name} className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-neutral-950">
					<div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white/90 px-5 py-3 backdrop-blur dark:border-neutral-900 dark:bg-neutral-950/90">
						<p className="truncate pr-4 text-sm font-semibold">{name}</p>
						<button
							type="button"
							onClick={() => setOpen(null)}
							aria-label="Close"
							className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
						>
							<X className="h-5 w-5" />
						</button>
					</div>
					<div className="mx-auto max-w-4xl space-y-3 px-5 py-6">
						{photos.map((photo, index) => (
							<div key={photo} id={`photo-${index}`} className="relative aspect-[3/2] scroll-mt-20 overflow-hidden rounded-2xl bg-neutral-100">
								<Image src={photo} alt={`${name} – ${index + 1}`} fill sizes="(max-width: 896px) 100vw, 896px" className="object-cover" />
							</div>
						))}
					</div>
				</div>
			)}
		</>
	)
}
