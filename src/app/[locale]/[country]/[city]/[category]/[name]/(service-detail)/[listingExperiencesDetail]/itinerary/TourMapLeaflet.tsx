'use client'
// The tour map (browser only), laid out like TripAdvisor's: orange route with
// direction arrows, "Start" / "Finish" labels, a numbered circle where each
// day ends and small dots for places you only pass. Choosing a day highlights
// it and zooms to it.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Hand, Lock } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslations } from 'next-intl'
import { buildRoute, type Place, type RouteStop } from './route'

const ORANGE = '#F2612A'
const DARK_ORANGE = '#B83912'
const INK = '#002B11'

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
	// Phones: the map stays still so the page scrolls over it; a button lets
	// you move it, and it locks again once it leaves the screen
	const [touch, setTouch] = useState(false)
	const [unlocked, setUnlocked] = useState(false)

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
		else map.fitBounds(L.latLngBounds(places.map((p) => [p.lat, p.lng])), { padding: [44, 44], animate: true })
	}

	// Create the map once
	useEffect(() => {
		if (!containerRef.current || mapRef.current) return
		const map = L.map(containerRef.current, {
			scrollWheelZoom: false, // the page keeps scrolling normally
			zoomSnap: 0.25, // the route fills the map
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
		if (window.matchMedia('(pointer: coarse)').matches) setTouch(true)
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
					fillColor: dim ? '#c8c8c8' : INK,
					fillOpacity: 1,
				})
					.bindTooltip(escapeHtml(stop.name), { direction: 'top', offset: [0, -6] })
					.addTo(layer)
				continue
			}

			// As on TripAdvisor: "Start" / "Finish" labels, a numbered circle for the
			// days that end here, a small dot otherwise
			const pills = [stop.isStart && t('start'), stop.isEnd && !stop.isStart && t('finish')].filter(Boolean) as string[]
			const pill = pills.length
				? `<div style="position:absolute;left:0;bottom:${stop.days.length ? 20 : 10}px;transform:translateX(-50%);white-space:nowrap;background:#fff;color:${DARK_ORANGE};border:2px solid ${ORANGE};border-radius:9999px;padding:3px 12px;font-weight:800;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.18);font-family:inherit">${escapeHtml(pills.join(' · '))}</div>`
				: ''
			const center = stop.days.length
				? `<div style="position:absolute;left:0;top:0;transform:translate(-50%,-50%);min-width:34px;height:34px;padding:0 8px;border-radius:9999px;background:${isDayEnd ? ORANGE : INK};color:#fff;display:grid;place-items:center;font-weight:800;font-size:15px;border:2px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.3);font-family:inherit">${escapeHtml(dayList(stop.days))}</div>`
				: `<div style="position:absolute;left:0;top:0;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:9999px;background:${INK};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>`
			const html = `<div style="opacity:${dim ? 0.5 : 1}">${pill}${center}</div>`

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

	// Locked: no dragging or pinching, so a finger on the map scrolls the page
	useEffect(() => {
		const map = mapRef.current
		if (!map || !touch) return
		const handlers = [map.dragging, map.touchZoom, map.doubleClickZoom, (map as any).tap].filter(Boolean)
		handlers.forEach((handler: any) => (unlocked ? handler.enable() : handler.disable()))
	}, [touch, unlocked])

	// Lock again when the map scrolls out of view
	useEffect(() => {
		const el = containerRef.current
		if (!el || !unlocked) return
		const observer = new IntersectionObserver(([entry]) => !entry.isIntersecting && setUnlocked(false))
		observer.observe(el)
		return () => observer.disconnect()
	}, [unlocked])

	if (!route.path.length) return null

	return (
		<div className="relative isolate">
			<style>{`.tour-map-tiles { filter: saturate(0.55) brightness(1.04) contrast(0.95); }`}</style>
			{/* Static className: React must never rewrite it, Leaflet adds its own classes */}
			<div ref={containerRef} style={{ height }} className="w-full bg-neutral-100" />
			{touch && (
				<button
					type="button"
					onClick={() => setUnlocked(!unlocked)}
					className={`absolute left-3 top-3 z-[500] inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold shadow-md ring-1 ring-black/5 ${
						unlocked ? 'bg-ink text-white' : 'bg-white text-ink'
					}`}
				>
					{unlocked ? <Lock className="h-4 w-4" /> : <Hand className="h-4 w-4" />}
					{unlocked ? t('map_lock') : t('map_unlock')}
				</button>
			)}

		</div>
	)
}
