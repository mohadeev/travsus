'use client'
// Photo mosaic (one large photo, two small ones and a wide one) and a full-screen gallery with every photo.
// Photos from Wikimedia Commons carry a credit (author, license, source): it is
// shown under the grid and under each photo in the gallery, as their licenses ask.
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Grid2x2, X } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { useTourService } from '../TourServiceContext'

export default function ListingExperiencesDetailsImages() {
	const t = useTranslations('ListingExperiencesDetailsImages')
	const { images, name }: any = useTourService()
	type Credit = { author?: string; license?: string; source?: string }
	const list: { url: string; credit?: Credit }[] = (images ?? []).filter((image: any) => image?.url)
	const photos: string[] = list.map((image) => image.url)
	const credits = list.map((image) => image.credit).filter((c): c is Credit => !!c?.license)
	const creditText = (c: Credit) => [c.author, c.license].filter(Boolean).join(', ')
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
			<div className="relative mt-5">
				{/* Phones: one large photo, two small ones under it */}
				<div className="-mx-5 grid grid-cols-2 grid-rows-[220px_110px] gap-1.5 sm:hidden">
					{tile(0, photos.length > 2 ? 'col-span-2' : 'col-span-2 row-span-2', '100vw')}
					{[1, 2].map((i) => tile(i, '', '50vw'))}
				</div>

				{/* Larger screens: one large photo; two small ones and a wide one beside it */}
				<div className="hidden h-[446px] grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] grid-rows-2 gap-1.5 overflow-hidden rounded-xl sm:grid">
					{tile(0, photos.length > 1 ? 'row-span-2' : 'col-span-3 row-span-2', '(max-width: 1280px) 50vw, 620px')}
					{photos.length === 2 && tile(1, 'col-span-2 row-span-2', '(max-width: 1280px) 50vw, 620px')}
					{photos.length === 3 && [1, 2].map((i) => tile(i, 'col-span-2', '(max-width: 1280px) 50vw, 620px'))}
					{photos.length >= 4 && (
						<>
							{tile(1, '', '(max-width: 1280px) 25vw, 310px')}
							{tile(2, '', '(max-width: 1280px) 25vw, 310px')}
							{tile(3, 'col-span-2', '(max-width: 1280px) 50vw, 620px')}
						</>
					)}
				</div>

				{photos.length > 1 && (
					<button
						type="button"
						onClick={() => setOpen(0)}
						className="absolute bottom-3.5 right-3.5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[15px] font-bold text-black shadow-[0_1px_6px_rgba(0,0,0,0.25)] transition hover:bg-neutral-100"
					>
						<Grid2x2 className="h-4 w-4" />
						{t('show_all_photos', { count: photos.length })}
					</button>
				)}
			</div>
			{credits.length > 0 && (
				<p className="mt-2 text-[11px] leading-snug text-neutral-400">
					Photos:{' '}
					{credits.map((c, i) => (
						<span key={i}>
							{i > 0 && ' · '}
							<a href={c.source} target="_blank" rel="noopener noreferrer nofollow" className="hover:underline">
								{creditText(c)}
							</a>
						</span>
					))}
				</p>
			)}

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
						{list.map((image, index) => (
							<figure key={image.url} id={`photo-${index}`} className="scroll-mt-20">
								<div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-neutral-100">
									<Image src={image.url} alt={`${name} – ${index + 1}`} fill sizes="(max-width: 896px) 100vw, 896px" className="object-cover" />
								</div>
								{image.credit?.license && (
									<figcaption className="mt-1 text-xs text-neutral-400">
										<a href={image.credit.source} target="_blank" rel="noopener noreferrer nofollow" className="hover:underline">
											{creditText(image.credit)}
										</a>
									</figcaption>
								)}
							</figure>
						))}
					</div>
				</div>
			)}
		</>
	)
}
