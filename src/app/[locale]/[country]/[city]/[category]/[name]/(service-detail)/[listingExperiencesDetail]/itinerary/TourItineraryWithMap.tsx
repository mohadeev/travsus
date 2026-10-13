'use client'
// Itinerary: a plain "Your route" line, the map, and the day-by-day list.
// Picking a day anywhere (route line, map, list) shows it on the map.
import { Fragment, useMemo, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, ChevronDown, Flag, MapPin } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { useTranslations as useIntlTranslations } from 'next-intl'
import TourMap from './TourMap'
import { buildRoute } from './route'

interface Day {
	name: string
	description: string
	cityName?: string
	stops?: { name: string; description?: string; duration?: string; image?: string }[]
}

export default function TourItineraryWithMap({ days }: { days: Day[]; title?: string }) {
	const t = useTranslations('ervicedetailListingexperiencesdetailTouritineraryWithMap')
	const tRoute = useIntlTranslations('TourRoute')
	const route = useMemo(() => buildRoute(days), [days])
	// -1 = the whole trip
	const [selected, setSelected] = useState(-1)

	// Start, then where each day ends
	const start = route.path[0]
	const dayEnds = route.dayPlaces.map((places) => places[places.length - 1])

	const chip = (active: boolean) =>
		`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-sm font-semibold transition ${
			active
				? 'border-brand-500 bg-brand-500 text-white'
				: 'border-neutral-200 bg-white hover:border-brand-300 dark:border-neutral-800 dark:bg-neutral-950'
		}`

	return (
		<div className="overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800">
			{/* Your route, in words anyone can follow */}
			{start && (
				<div className="border-b border-neutral-200 p-4 sm:p-5 dark:border-neutral-800">
					<p className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">{tRoute('your_route')}</p>
					<ol className="flex flex-wrap items-center gap-2">
						<li>
							<button type="button" onClick={() => setSelected(-1)} className={chip(selected === -1)}>
								<Flag className="h-4 w-4" />
								<span>
									{tRoute('start')}: {start.name}
								</span>
							</button>
						</li>
						{dayEnds.map((place, index) => (
							<Fragment key={index}>
								<li aria-hidden className="text-neutral-400">
									<ArrowRight className="h-4 w-4" />
								</li>
								<li>
									<button type="button" onClick={() => setSelected(index)} className={chip(selected === index)}>
										<span className="font-bold">{tRoute('day', { n: index + 1 })}</span>
										{place && <span className={selected === index ? 'text-white/90' : 'text-neutral-600 dark:text-neutral-400'}>{place.name}</span>}
									</button>
								</li>
							</Fragment>
						))}
					</ol>
					<p className="mt-3 text-xs text-neutral-500">{tRoute('tap_hint')}</p>
				</div>
			)}

			<div className="relative z-1">
				<TourMap days={days} selectedDayIndex={selected} onDaySelect={setSelected} height={420} />
			</div>

			{/* Day-by-day text: visible, collapsible, and fully in the HTML.
			    Opening a day also shows it on the map. */}
			<ol className="divide-y divide-neutral-200 border-t border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
				{days.map((day, index) => {
					const label = /^(day|día|jour|tag|giorno|dia)\s*\d/i.test(day.name || '')
						? day.name
						: `${t('Day_Heading')} ${index + 1}: ${day.name}`
					return (
						<li key={`day-${index}`}>
							<details
								className="group px-5 py-4 sm:px-6"
								open={selected === index}
								onToggle={(e) => {
									const open = (e.currentTarget as HTMLDetailsElement).open
									if (open && selected !== index) setSelected(index)
								}}
							>
								<summary className="flex cursor-pointer list-none items-center gap-4 [&::-webkit-details-marker]:hidden">
									<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-500 text-sm font-bold text-white">
										{index + 1}
									</span>
									<h3 className="flex-1 font-semibold">{label}</h3>
									<ChevronDown className="h-5 w-5 shrink-0 text-neutral-500 transition-transform group-open:rotate-180" />
								</summary>
								<div className="ml-12 mt-3 space-y-4">
									{day.description && (
										<p className="whitespace-pre-line text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
											{day.description}
										</p>
									)}
									{day.stops?.map((stop, stopIndex) => (
										<div key={`stop-${index}-${stopIndex}`} className="flex gap-3">
											<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
											<div className="min-w-0">
												<h4 className="font-semibold">{stop.name}</h4>
												{stop.duration && (
													<p className="text-sm text-neutral-500">
														{t('Duration_Label')} {stop.duration}
													</p>
												)}
												{stop.image && (
													<div className="relative mt-2 aspect-[16/9] max-w-md overflow-hidden rounded-xl">
														<Image src={stop.image} alt={stop.name} fill sizes="448px" className="object-cover" />
													</div>
												)}
												{stop.description && (
													<p className="mt-1 text-[15px] text-neutral-700 dark:text-neutral-300">{stop.description}</p>
												)}
											</div>
										</div>
									))}
								</div>
							</details>
						</li>
					)
				})}
			</ol>
		</div>
	)
}
