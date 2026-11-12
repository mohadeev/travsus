// Itinerary: the map (Start / Finish labels and a numbered circle where each
// day ends), highlights, then tabs that jump to a day and zoom the map to it.
// The route (one line per day) and every day are shown one under the other,
// all visible: search engines weigh visible text, and readers can scroll the
// whole trip. Each day shows its approximate distance and time on the road.
import { useMemo, useState } from 'react'
import { Car, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { useTranslations as useIntlTranslations } from 'next-intl'
import TourMap from './TourMap'
import { buildRoute } from './route'
import LinkedText from '@/components/text/LinkedText'

interface Day {
	name: string
	description: string
	cityName?: string
	stops?: {
		name: string
		description?: string
		duration?: string
		image?: string
		imageAlt?: string
		/** Who took the photo (free licences ask us to say so) */
		imageCredit?: { author?: string; license?: string; source?: string }
	}[]
}

export default function TourItineraryWithMap({ days }: { days: Day[]; title?: string }) {
	const t = useTranslations('ervicedetailListingexperiencesdetailTouritineraryWithMap')
	const tRoute = useIntlTranslations('TourRoute')
	const tPage = useIntlTranslations('TourPage')
	const route = useMemo(() => buildRoute(days), [days])
	// -1 = the overview (whole trip)
	const [selected, setSelected] = useState(-1)

	/** "Day 3: Merzouga" without repeating "Day 3" when the name already has it */
	const dayTitle = (day: Day, index: number) =>
		/^(day|día|jour|tag|giorno|dia)\s*\d/i.test(day.name || '') ? day.name : `${t('Day_Heading')} ${index + 1}: ${day.name}`
	/** The places of a day as "Fes - Azrou - Midelt" (the day's name if no places) */
	const dayRoute = (day: Day, index: number) => {
		const names = (route.dayPlaces[index] ?? []).map((p) => p.name)
		return names.length > 1 ? names.join(' - ') : day.name || names[0] || ''
	}

	/** Approximate road distance (km) and driving time (h) of a day, from its places on the map */
	const dayDrive = (index: number) => {
		const places = route.dayPlaces[index] ?? []
		let km = 0
		for (let i = 1; i < places.length; i++) km += distanceKm(places[i - 1], places[i])
		km = Math.round((km * ROAD_FACTOR) / 10) * 10 // roads wind: about 30% longer than a straight line
		if (km < 30) return null
		return { km, hours: Math.max(1, Math.round((km / AVERAGE_KMH) * 2) / 2) }
	}

	// Highlights: the named stops of the trip (first ones, no repeats), else the places it goes through
	const highlights = Array.from(
		new Set([...days.flatMap((day) => (day.stops ?? []).map((stop) => stop.name?.trim()).filter(Boolean) as string[]), ...route.path.map((p) => p.name)]),
	).slice(0, 8)

	/** Opens a day: highlights it on the map and scrolls to its text */
	const openDay = (index: number) => {
		setSelected(index)
		const el = document.getElementById(index < 0 ? 'itinerary' : `itinerary-day-${index + 1}`)
		if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' })
	}

	const tabs = [{ index: -1, label: tPage('tab_overview') }, ...days.map((_, index) => ({ index, label: tRoute('day', { n: index + 1 }) }))]

	return (
		<div>
			{route.path.length > 0 && (
				<div className="relative z-1 overflow-hidden rounded-lg">
					<TourMap days={days} selectedDayIndex={selected} onDaySelect={setSelected} height={260} />
				</div>
			)}

			<div role="tablist" aria-label={tPage('tab_itinerary')} className="mt-2 flex gap-2 overflow-x-auto border-b border-neutral-200 [scrollbar-width:none] dark:border-neutral-800 [&::-webkit-scrollbar]:hidden">
				{tabs.map((tab) => (
					<button
						key={tab.index}
						type="button"
						role="tab"
						aria-selected={selected === tab.index}
						onClick={() => (tab.index < 0 ? setSelected(-1) : openDay(tab.index))}
						className={`-mb-px shrink-0 border-b-[3px] px-4 py-3 text-base font-bold leading-6 transition ${
							selected === tab.index ? 'border-brand-500 text-ink dark:text-white' : 'border-transparent text-ink-soft hover:text-ink dark:text-neutral-400 dark:hover:text-white'
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Highlights of the trip */}
			{highlights.length > 2 && (
				<div className="mt-5 rounded-3xl bg-neutral-100 p-5 dark:bg-neutral-900">
					<h3 className="flex items-center gap-2 text-base font-bold leading-6">
						<Sparkles className="h-5 w-5" strokeWidth={1.8} aria-hidden />
						{tRoute('highlights')}
					</h3>
					<ul className="mt-3 flex flex-wrap gap-2">
						{highlights.map((name) => (
							<li key={name} className="rounded-full bg-white px-3 py-1.5 text-sm font-medium dark:bg-neutral-800">
								{name}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Day by day at a glance: route, where you sleep, time on the road (tap a row to open the day) */}
			<div className="mt-5 overflow-x-auto">
				<table className="w-full min-w-[480px] border-collapse text-left text-sm">
					<thead>
						<tr className="border-b border-neutral-200 text-ink-soft dark:border-neutral-800 dark:text-neutral-400">
							<th className="py-2 pr-3 font-semibold">{tRoute('table_day')}</th>
							<th className="py-2 pr-3 font-semibold">{tRoute('table_route')}</th>
							<th className="py-2 pr-3 font-semibold">{tRoute('table_overnight')}</th>
							<th className="py-2 font-semibold">{tRoute('table_road')}</th>
						</tr>
					</thead>
					<tbody>
						{days.map((day, index) => {
							const drive = dayDrive(index)
							const places = route.dayPlaces[index] ?? []
							const overnight = index < days.length - 1 ? places[places.length - 1]?.name ?? '' : '—'
							return (
								<tr key={index} onClick={() => openDay(index)} className="cursor-pointer border-b border-neutral-100 align-top hover:bg-neutral-50 dark:border-neutral-900 dark:hover:bg-neutral-900">
									<td className="py-2.5 pr-3 font-bold tabular-nums">{index + 1}</td>
									{/* The day number is in the first column: drop a "Day 1:" at the start of the name */}
									<td className="py-2.5 pr-3">{dayRoute(day, index).replace(/^\D{0,10}?\d+\s*[:：.\-–]\s*/, '')}</td>
									<td className="py-2.5 pr-3">{overnight}</td>
									<td className="whitespace-nowrap py-2.5 tabular-nums text-ink-soft dark:text-neutral-400">{drive ? `${drive.km.toLocaleString()} km · ${drive.hours} h` : '—'}</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>

			{days.map((day, index) => {
				const drive = dayDrive(index)
				return (
				<section
					key={`day-${index}`}
					id={`itinerary-day-${index + 1}`}
					className={`mt-6 scroll-mt-20 border-t border-neutral-200 pt-6 dark:border-neutral-800`}
				>
					<h3 className="text-lg font-bold leading-6">{dayTitle(day, index)}</h3>
					{drive && (
						<p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft dark:text-neutral-400">
							<Car className="h-4 w-4" strokeWidth={1.8} aria-hidden />
							{tRoute('day_drive', { km: drive.km.toLocaleString(), hours: drive.hours })}
						</p>
					)}
				<div className="mt-3 space-y-4">
					{day.description && (
						<p className="whitespace-pre-line text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
							<LinkedText text={day.description} />
						</p>
					)}
					{day.stops?.map((stop, stopIndex) => (
						<div key={`stop-${index}-${stopIndex}`} className="flex gap-3">
							<MapPin className="mt-0.5 h-4 w-4 shrink-0" />
							<div className="min-w-0">
								<h4 className="font-semibold">{stop.name}</h4>
								{stop.duration && (
									<p className="text-sm text-neutral-500">
										{t('Duration_Label')} {stop.duration}
									</p>
								)}
								{stop.image && (
									<figure className="mt-2 max-w-md">
										<div className="relative aspect-[16/9] overflow-hidden rounded-xl">
											<Image src={stop.image} alt={stop.imageAlt || stop.name} fill sizes="448px" className="object-cover" />
										</div>
										{stop.imageCredit?.license && (
											<figcaption className="mt-1 text-xs text-neutral-500">
												Photo:{' '}
												{stop.imageCredit.source ? (
													<a href={stop.imageCredit.source} target="_blank" rel="noopener nofollow" className="underline">
														{stop.imageCredit.author || 'Wikimedia Commons'}
													</a>
												) : (
													stop.imageCredit.author || 'Wikimedia Commons'
												)}
												, {stop.imageCredit.license}
											</figcaption>
										)}
									</figure>
								)}
								{stop.description && (
									<p className="mt-1 text-[15px] text-neutral-700 dark:text-neutral-300">
										<LinkedText text={stop.description} />
									</p>
								)}
							</div>
						</div>
					))}
				</div>
				</section>
				)
			})}
		</div>
	)
}

const ROAD_FACTOR = 1.3
const AVERAGE_KMH = 70

/** Straight-line distance between two places, in km (haversine) */
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
	const rad = Math.PI / 180
	const dLat = (b.lat - a.lat) * rad
	const dLng = (b.lng - a.lng) * rad
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2
	return 2 * 6371 * Math.asin(Math.sqrt(h))
}
