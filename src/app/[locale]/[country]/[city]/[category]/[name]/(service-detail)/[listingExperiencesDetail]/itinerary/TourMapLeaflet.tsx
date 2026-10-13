'use client'
// The tour map (browser only). Orange route with direction arrows, a big label
// for every place you sleep ("Start · Day 3 · Marrakech") and small dots for
// places you only pass. Choosing a day highlights it and zooms to it.
import { useEffect, useMemo, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslations } from 'next-intl'
import { Maximize2, Navigation } from 'lucide-react'
import { buildRoute, type Place, type RouteStop } from './route'

const ORANGE = '#F2612A'
const DARK_ORANGE = '#B83912'

export type TourMapLeafletProps = {
	days: any[]
	selectedDayIndex?: number | null
	onDaySelect?: (dayIndex: number) => void
	height?: number
}

/** "1", "1 & 3", "1–7" */
function dayList(days: number[]) {
	if (days.length <= 2) return days.join(' & ')
	const consecutive = days.every((day, i) => i === 0 || day === days[i - 1] + 1)
	return consecutive ? `${days[0]}–${days[days.length - 1]}` : days.join(', ')
}

const escapeHtml = (text: string) =>
	text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

type Point = [number, number] // [lat, lng]

/**
 * A leg drawn as a gentle curve bending to the right of travel, so the way
 * out and the way back (same two places) show as two separate arcs.
 */
function curve(from: Place, to: Place, steps = 24): Point[] {
	const dx = to.lng - from.lng
	const dy = to.lat - from.lat
	const bend = 0.18
	const control: Point = [(from.lat + to.lat) / 2 - dx * bend, (from.lng + to.lng) / 2 + dy * bend]
	const points: Point[] = []
	for (let i = 0; i <= steps; i++) {
		const t = i / steps
		const u = 1 - t
		points.push([
			u * u * from.lat + 2 * u * t * control[0] + t * t * to.lat,
			u * u * from.lng + 2 * u * t * control[1] + t * t * to.lng,
		])
	}
	return points
}

/** Screen angle (degrees) of the line from a to b. */
const angle = (a: Point, b: Point) => (Math.atan2(-(b[0] - a[0]), b[1] - a[1]) * 180) / Math.PI

export default function TourMapLeaflet({ days, selectedDayIndex, onDaySelect, height = 420 }: TourMapLeafletProps) {
	const t = useTranslations('TourRoute')
	const route = useMemo(() => buildRoute(days), [days])
	const containerRef = useRef<HTMLDivElement>(null)
	const mapRef = useRef<L.Map | null>(null)
	const layerRef = useRef<L.LayerGroup | null>(null)
	const selected = selectedDayIndex ?? -1

	const label = (stop: RouteStop) => {
		const parts: string[] = []
		if (stop.isStart) parts.push(t('start'))
		if (stop.days.length) {
			parts.push(stop.days.length === 1 ? t('day', { n: stop.days[0] }) : t('days', { list: dayList(stop.days) }))
		}
		return parts.join(' · ')
	}

	const fitTo = (places: Place[]) => {
		const map = mapRef.current
		if (!map || !places.length) return
		if (places.length === 1) map.setView([places[0].lat, places[0].lng], 10, { animate: true })
		else map.fitBounds(L.latLngBounds(places.map((p) => [p.lat, p.lng])), { padding: [80, 80], animate: true })
	}

	// Create the map once
	useEffect(() => {
		if (!containerRef.current || mapRef.current) return
		const map = L.map(containerRef.current, {
			scrollWheelZoom: false, // the page keeps scrolling normally
			zoomControl: false,
			attributionControl: true,
		})
		L.control.zoom({ position: 'bottomright' }).addTo(map)
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			className: 'tour-map-tiles',
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		}).addTo(map)
		layerRef.current = L.layerGroup().addTo(map)
		mapRef.current = map
		map.setView([31.79, -7.09], 5)
		return () => {
			map.remove()
			mapRef.current = null
		}
	}, [])

	// Draw route, arrows and places (again when the selected day changes)
	useEffect(() => {
		const map = mapRef.current
		const layer = layerRef.current
		if (!map || !layer) return
		layer.clearLayers()

		const dayKeys = new Set((route.dayPlaces[selected] ?? []).map((p) => p.key))
		const dayEnd = route.dayPlaces[selected]?.[route.dayPlaces[selected].length - 1]?.key
		const focused = selected >= 0

		// Legs of the chosen day (consecutive places within that day)
		const dayLegs = new Set<string>()
		const chosen = route.dayPlaces[selected] ?? []
		chosen.slice(1).forEach((to, i) => dayLegs.add(`${chosen[i].key}>${to.key}`))

		// Each leg: white edge + orange curve and an arrow in the middle
		route.path.slice(1).forEach((to, i) => {
			const from = route.path[i]
			const points = curve(from, to)
			const onDay = dayLegs.has(`${from.key}>${to.key}`)
			const color = onDay ? DARK_ORANGE : ORANGE
			const faded = focused && !onDay
			L.polyline(points, { color: '#ffffff', weight: onDay ? 12 : 9, opacity: faded ? 0.5 : 0.95, lineCap: 'round' }).addTo(layer)
			L.polyline(points, { color, weight: onDay ? 7 : 5, opacity: faded ? 0.3 : 1, lineCap: 'round' }).addTo(layer)

			const mid = Math.floor(points.length / 2)
			L.marker(points[mid], {
				interactive: false,
				icon: L.divIcon({
					className: '',
					iconSize: [22, 22],
					iconAnchor: [11, 11],
					html: `<div style="transform:rotate(${angle(points[mid - 1], points[mid + 1])}deg);width:22px;height:22px;border-radius:9999px;background:${color};opacity:${faded ? 0.45 : 1};display:grid;place-items:center;box-shadow:0 1px 4px rgba(0,0,0,.25);border:2px solid #fff"><svg width="10" height="10" viewBox="0 0 10 10"><path d="M2.5 1.5 L7.5 5 L2.5 8.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`,
				}),
			}).addTo(layer)
		})

		// Places
		for (const stop of route.stops) {
			const main = stop.isStart || stop.days.length > 0
			const isDayEnd = stop.key === dayEnd
			const dim = focused && !dayKeys.has(stop.key)

			if (!main) {
				// Passing through: small dot, name on hover/tap
				L.circleMarker([stop.lat, stop.lng], {
					radius: 6,
					color: '#ffffff',
					weight: 2,
					fillColor: dim ? '#c8c8c8' : ORANGE,
					fillOpacity: 1,
				})
					.bindTooltip(escapeHtml(stop.name), { direction: 'top', offset: [0, -6] })
					.addTo(layer)
				continue
			}

			const badge = escapeHtml(label(stop))
			const color = isDayEnd ? DARK_ORANGE : ORANGE
			const html = `
				<div style="position:absolute;left:0;bottom:12px;transform:translateX(-50%);white-space:nowrap;opacity:${dim ? 0.55 : 1};font-family:inherit">
					<div style="display:flex;align-items:center;gap:8px;background:#fff;border-radius:9999px;padding:4px 12px 4px 4px;box-shadow:0 4px 14px rgba(0,0,0,.18);border:2px solid ${isDayEnd ? DARK_ORANGE : '#fff'}">
						<span style="background:${color};color:#fff;border-radius:9999px;padding:4px 10px;font-weight:700;font-size:12px">${badge}</span>
						<span style="font-weight:700;font-size:14px;color:#111">${escapeHtml(stop.name)}</span>
					</div>
				</div>
				<div style="position:absolute;left:0;top:0;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>`

			L.marker([stop.lat, stop.lng], {
				zIndexOffset: isDayEnd ? 1000 : stop.isStart ? 500 : 0,
				icon: L.divIcon({ className: '', iconSize: [0, 0], iconAnchor: [0, 0], html }),
				keyboard: true,
				title: `${label(stop)} – ${stop.name}`,
			})
				.on('click', () => {
					if (stop.days.length && onDaySelect) onDaySelect(stop.days[0] - 1)
				})
				.addTo(layer)
		}

		// Zoom to the chosen day, or show the whole trip
		fitTo(focused && route.dayPlaces[selected]?.length ? route.dayPlaces[selected] : route.path)
	}, [route, selected]) // eslint-disable-line react-hooks/exhaustive-deps

	const openDirections = () => {
		if (route.path.length < 2) return
		const url = `https://www.google.com/maps/dir/${route.path.map((p) => `${p.lat},${p.lng}`).join('/')}`
		window.open(url, '_blank', 'noopener')
	}

	if (!route.path.length) return null

	return (
		<div className="relative isolate">
			<style>{`.tour-map-tiles { filter: saturate(0.55) brightness(1.04) contrast(0.95); }`}</style>
			<div ref={containerRef} style={{ height }} className="w-full bg-neutral-100" />

			{/* Map buttons */}
			<div className="absolute right-3 top-3 z-[500] flex gap-2">
				<button
					type="button"
					onClick={() => (onDaySelect ? onDaySelect(-1) : fitTo(route.path))}
					className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-semibold shadow-md ring-1 ring-black/5 hover:bg-neutral-50"
				>
					<Maximize2 className="h-4 w-4" />
					{t('see_all')}
				</button>
				{route.path.length > 1 && (
					<button
						type="button"
						onClick={openDirections}
						className="hidden items-center gap-1.5 rounded-full bg-neutral-950 px-3.5 py-2 text-sm font-semibold text-white shadow-md hover:bg-neutral-800 sm:inline-flex"
					>
						<Navigation className="h-4 w-4" />
						{t('directions')}
					</button>
				)}
			</div>

			{/* What the symbols mean, in plain words */}
			<ul className="absolute bottom-3 left-3 z-[500] flex flex-wrap gap-x-4 gap-y-1 rounded-2xl bg-white/95 px-3.5 py-2 text-xs font-medium shadow-md ring-1 ring-black/5">
				<li className="flex items-center gap-1.5">
					<span className="rounded-full px-1.5 text-[10px] font-bold text-white" style={{ background: ORANGE }}>
						1
					</span>
					{t('legend_night')}
				</li>
				<li className="flex items-center gap-1.5">
					<span className="h-2.5 w-2.5 rounded-full border-2 border-white shadow" style={{ background: ORANGE }} />
					{t('legend_pass')}
				</li>
			</ul>
		</div>
	)
}
