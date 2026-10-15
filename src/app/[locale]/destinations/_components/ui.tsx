// Pieces shared by the destination pages.
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowUpRight, MapPin, Navigation, Star } from 'lucide-react'
import type { City, Place } from '@/lib/destinations'

/** A larger version of the photo for full-width use */
export const bigImage = (url: string) =>
	url.includes('images.pexels.com') ? url.replace(/\?.*$/, '?auto=compress&cs=tinysrgb&w=2000') : url

export function Section({ title, text, action, children, id }: { title: string; text?: string; action?: ReactNode; children: ReactNode; id?: string }) {
	return (
		<section id={id} className="mt-16 scroll-mt-24 sm:mt-24">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div className="min-w-0">
					<span aria-hidden className="mb-3 block h-1 w-10 rounded-full bg-brand-500" />
					<h2 className="text-2xl font-bold tracking-tight sm:text-4xl">{title}</h2>
					{text && <p className="mt-2 max-w-2xl text-neutral-500">{text}</p>}
				</div>
				{action}
			</div>
			<div className="mt-8">{children}</div>
		</section>
	)
}

export function CityCard({ city, label }: { city: City; label?: string }) {
	return (
		<Link href={city.href as any} className="group block">
			<div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-neutral-100 dark:bg-neutral-900">
				{city.image && (
					<Image src={city.image} alt={city.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
				<div className="absolute inset-x-0 bottom-0 p-5 text-white">
					{label && <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70">{label}</p>}
					<p className="mt-1 flex items-center justify-between gap-2 text-xl font-bold tracking-tight">
						<span className="truncate">{city.name}</span>
						<ArrowUpRight className="h-5 w-5 shrink-0 opacity-0 transition group-hover:opacity-100" />
					</p>
				</div>
			</div>
		</Link>
	)
}

export function PlaceCard({ place, directions, website, cityLabel }: { place: Place & { city?: string | null }; directions: string; website: string; cityLabel?: string }) {
	const maps = place.point ? `https://www.google.com/maps/dir/?api=1&destination=${place.point.lat},${place.point.lng}` : null
	return (
		<article className="flex h-full flex-col overflow-hidden rounded-[28px] bg-white ring-1 ring-neutral-200 transition hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:bg-neutral-950 dark:ring-neutral-800">
			<div className="relative aspect-[16/10] bg-neutral-100 dark:bg-neutral-900">
				{place.image && <Image src={place.image} alt={place.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />}
				{place.category && (
					<span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-900 backdrop-blur">{place.category}</span>
				)}
			</div>
			<div className="flex flex-1 flex-col p-5">
				<div className="flex items-start justify-between gap-3">
					<h3 className="text-lg font-bold leading-snug tracking-tight">{place.name}</h3>
					{place.rating ? (
						<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-neutral-950 px-2.5 py-1 text-xs font-bold text-white dark:bg-white dark:text-neutral-950">
							<Star className="h-3 w-3 fill-current" />
							{place.rating.toFixed(1)}
						</span>
					) : null}
				</div>
				{(cityLabel || place.address) && (
					<p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
						<MapPin className="h-3.5 w-3.5 shrink-0" />
						<span className="truncate">{cityLabel || place.address}</span>
					</p>
				)}
				{place.description && <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">{place.description}</p>}
				<div className="mt-auto flex flex-wrap gap-2 pt-5">
					{maps && (
						<a href={maps} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-neutral-100 px-4 text-sm font-semibold transition hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800">
							<Navigation className="h-4 w-4" />
							{directions}
						</a>
					)}
					{place.website && (
						<a href={place.website} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold ring-1 ring-neutral-200 transition hover:ring-neutral-400 dark:ring-neutral-800">
							{website}
							<ArrowUpRight className="h-4 w-4" />
						</a>
					)}
				</div>
			</div>
		</article>
	)
}

/** OpenStreetMap, free and without a key */
export function MapEmbed({ point, zoom = 0.08, title, openLabel }: { point: { lat: number; lng: number }; zoom?: number; title: string; openLabel: string }) {
	const bbox = [point.lng - zoom * 1.6, point.lat - zoom, point.lng + zoom * 1.6, point.lat + zoom].map((n) => n.toFixed(4)).join(',')
	return (
		<div className="relative overflow-hidden rounded-[28px] ring-1 ring-neutral-200 dark:ring-neutral-800">
			<iframe
				title={title}
				src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${point.lat},${point.lng}`}
				className="h-[360px] w-full sm:h-[460px]"
				loading="lazy"
			/>
			<a
				href={`https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`}
				target="_blank"
				rel="noopener noreferrer"
				className="absolute bottom-4 right-4 inline-flex h-10 items-center gap-1.5 rounded-full bg-neutral-950 px-4 text-sm font-semibold text-white shadow-lg"
			>
				{openLabel}
				<ArrowUpRight className="h-4 w-4" />
			</a>
		</div>
	)
}
