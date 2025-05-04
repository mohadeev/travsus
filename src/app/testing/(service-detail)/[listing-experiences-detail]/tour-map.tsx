'use client'

import { forwardRef } from 'react'
import dynamic from 'next/dynamic'
import { MapIcon, Navigation } from 'lucide-react'

// Define your interfaces
interface Day {
	name: string
	description?: string
	cityId?: string
	cityName?: string
	geoCoordinates?: {
		lat: number
		log: number
	}
}

interface TourMapProps {
	days: Day[]
	selectedDayIndex?: number | null
	onDaySelect?: (dayIndex: number) => void
	height?: number
	monochrome?: boolean
}

// Create a loading component
const MapLoading = ({ height = 500 }: { height?: number }) => (
	<div className="overflow-hidden rounded-lg shadow-sm">
		<div className="flex justify-end gap-2 border-b bg-white p-2">
			<button
				disabled
				className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-medium text-black shadow-sm"
			>
				<MapIcon size={14} />
				<span>View All</span>
			</button>
			<button
				disabled
				className="flex items-center gap-1 rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white shadow-sm"
			>
				<Navigation size={14} />
				<span>Directions</span>
			</button>
		</div>
		<div className="relative">
			<div
				className="flex items-center justify-center bg-gray-100"
				style={{ height: `${height}px`, width: '100%' }}
			>
				<div className="text-center">
					<MapIcon className="mx-auto h-12 w-12 text-gray-400" />
					<p className="mt-2 text-sm text-gray-500">Loading map...</p>
				</div>
			</div>
		</div>
		<div className="flex flex-wrap gap-3 bg-gray-50 p-3 text-sm">
			<div className="flex items-center gap-1">
				<div className="h-4 w-4 rounded-full bg-black"></div>
				<span>Tour Days</span>
			</div>
			<div className="flex items-center gap-1">
				<div className="h-4 w-4 rounded-full bg-black"></div>
				<span>Selected Day</span>
			</div>
			<div className="flex items-center gap-1">
				<div className="h-1 w-8 bg-black"></div>
				<span>Route</span>
			</div>
		</div>
	</div>
)

// Create a separate component for the actual map implementation
// This will be dynamically imported with ssr: false
const InnerTourMap = forwardRef<
	{ zoomToDay: (dayIndex: number) => void },
	TourMapProps
>(
	(
		{ days, selectedDayIndex, onDaySelect, height = 500, monochrome = false },
		ref,
	) => {
		// Keep all your original TourMap code here, unchanged
		// This component will only be loaded on the client side

		// Import required modules
		const { useEffect, useRef, useImperativeHandle } = require('react')
		const L = require('leaflet')
		require('leaflet/dist/leaflet.css')

		const mapRef = useRef<HTMLDivElement>(null)
		const leafletMapRef = useRef<L.Map | null>(null)
		const routeLayerRef = useRef<L.Polyline | null>(null)
		const markersLayerRef = useRef<L.LayerGroup | null>(null)
		const markersRef = useRef<L.Marker[]>([])

		// Expose the zoomToDay method to parent components
		useImperativeHandle(ref, () => ({
			zoomToDay: (dayIndex: number) => {
				if (dayIndex >= 0 && dayIndex < days.length) {
					const day = days[dayIndex]
					if (day.geoCoordinates?.lat && day.geoCoordinates?.log) {
						leafletMapRef.current?.setView(
							[day.geoCoordinates.lat, day.geoCoordinates.log],
							13,
						)

						// Highlight the marker
						if (markersRef.current[dayIndex]) {
							markersRef.current[dayIndex].openPopup()
						}
					}
				}
			},
		}))

		// Initialize map
		useEffect(() => {
			if (!mapRef.current) return

			// Initialize map if it doesn't exist
			if (!leafletMapRef.current) {
				// Set initial view based on first day with coordinates
				let initialCoords: [number, number] = [0, 0]
				const initialZoom = 5
				let hasInitialCoords = false

				// Try to find the first day with coordinates
				for (const day of days) {
					if (day.geoCoordinates?.lat && day.geoCoordinates?.log) {
						initialCoords = [day.geoCoordinates.lat, day.geoCoordinates.log]
						hasInitialCoords = true
						break
					}
				}

				// If we still don't have coordinates, use a default
				if (!hasInitialCoords) {
					// Default to a central location (e.g., center of Morocco if that's your focus)
					initialCoords = [31.7917, -7.0926] // Center of Morocco
				}

				leafletMapRef.current = L.map(mapRef.current).setView(
					initialCoords,
					initialZoom,
				)

				// Add OpenStreetMap tiles
				if (monochrome) {
					// Use OpenStreetMap with monochrome style
					L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
						maxZoom: 19,
						attribution:
							'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
					}).addTo(leafletMapRef.current)
				} else {
					// Use standard OpenStreetMap
					L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
						maxZoom: 19,
						attribution:
							'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
					}).addTo(leafletMapRef.current)
				}

				// Create layer for markers and routes
				markersLayerRef.current = L.layerGroup().addTo(leafletMapRef.current)
			}

			// Update map with current days
			updateMap()

			// Clean up function
			return () => {
				if (leafletMapRef.current) {
					leafletMapRef.current.remove()
					leafletMapRef.current = null
				}
			}
		}, [days, monochrome])

		// Update map when selectedDayIndex changes
		useEffect(() => {
			if (
				selectedDayIndex !== null &&
				selectedDayIndex >= 0 &&
				selectedDayIndex < days.length
			) {
				const day = days[selectedDayIndex]
				if (
					day.geoCoordinates?.lat &&
					day.geoCoordinates?.log &&
					leafletMapRef.current
				) {
					leafletMapRef.current.setView(
						[day.geoCoordinates.lat, day.geoCoordinates.log],
						13,
					)

					// Open the popup for the selected day
					if (markersRef.current[selectedDayIndex]) {
						markersRef.current[selectedDayIndex].openPopup()
					}
				}
			}

			// When the map is shown or hidden, we need to invalidate its size
			if (leafletMapRef.current) {
				setTimeout(() => {
					leafletMapRef.current?.invalidateSize()
				}, 100)
			}
		}, [selectedDayIndex, days])

		// Function to update the map with current days and coordinates
		const updateMap = () => {
			if (!leafletMapRef.current || !markersLayerRef.current) return

			// Clear existing markers and routes
			markersLayerRef.current.clearLayers()
			markersRef.current = []

			if (routeLayerRef.current && leafletMapRef.current) {
				leafletMapRef.current.removeLayer(routeLayerRef.current)
				routeLayerRef.current = null
			}

			// Create route points and bounds
			const routePoints: L.LatLngExpression[] = []
			const bounds = L.latLngBounds([])
			let hasValidCoordinates = false

			// Add markers for each day with coordinates
			days.forEach((day, index) => {
				if (!day.geoCoordinates?.lat || !day.geoCoordinates?.log) return

				const coords: [number, number] = [
					day.geoCoordinates.lat,
					day.geoCoordinates.log,
				]
				routePoints.push(coords)
				bounds.extend(coords)
				hasValidCoordinates = true

				// Create marker for each day
				const isSelected = selectedDayIndex === index

				const dayIcon = L.divIcon({
					className: 'day-marker',
					html: `<div class="flex flex-col items-center">
                  <div class="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                    ${index + 1}
                  </div>
                  <div class="text-xs font-semibold bg-white px-1 py-0.5 rounded shadow mt-1">
                    ${day.cityName || `Day ${index + 1}`}
                  </div>
                </div>`,
					iconSize: [40, 40],
					iconAnchor: [20, 20],
				})

				const marker = L.marker(coords, { icon: dayIcon })
					.bindPopup(
						`
            <div>
              <h3 class="font-bold">${day.name || `Day ${index + 1}`}</h3>
              <p class="text-sm">${day.cityName || 'Unknown location'}</p>
              ${day.description ? `<p class="text-xs mt-1">${day.description.substring(0, 100)}...</p>` : ''}
            </div>
          `,
					)
					.on('click', () => {
						if (onDaySelect) {
							onDaySelect(index)
						}
					})
					.addTo(markersLayerRef.current!)

				// Store marker reference
				markersRef.current[index] = marker

				// Open popup if this is the selected day
				if (isSelected) {
					marker.openPopup()
				}
			})

			// Create route line connecting all points
			if (routePoints.length > 1) {
				routeLayerRef.current = L.polyline(routePoints, {
					color: '#000000', // Black color for monochrome design
					weight: 3,
					opacity: 0.7,
					dashArray: '5, 10',
				}).addTo(leafletMapRef.current)
			}

			// Fit map to show all points
			if (hasValidCoordinates && leafletMapRef.current) {
				leafletMapRef.current.fitBounds(bounds, { padding: [50, 50] })
			}
		}

		// Add custom CSS for markers
		useEffect(() => {
			const style = document.createElement('style')
			style.textContent = `
        .day-marker {
          z-index: 1000;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        .leaflet-popup-content {
          margin: 10px;
        }
      `
			document.head.appendChild(style)

			return () => {
				document.head.removeChild(style)
			}
		}, [])

		// Open Google Maps with directions between all points
		const openGoogleMapsDirections = () => {
			// Collect all valid coordinates
			const points: [number, number][] = []

			// Add coordinates for each day
			days.forEach((day) => {
				if (day.geoCoordinates?.lat && day.geoCoordinates?.log) {
					points.push([day.geoCoordinates.lat, day.geoCoordinates.log])
				}
			})

			if (points.length < 2) {
				alert('Need at least two locations to show directions')
				return
			}

			// Create Google Maps directions URL
			let url = 'https://www.google.com/maps/dir/'

			points.forEach((point) => {
				url += `${point[0]},${point[1]}/`
			})

			window.open(url, '_blank')
		}

		// Function to fit all points in view
		const fitAllPoints = () => {
			if (!leafletMapRef.current) return

			const bounds = L.latLngBounds([])
			let hasValidCoordinates = false

			days.forEach((day) => {
				if (day.geoCoordinates?.lat && day.geoCoordinates?.log) {
					bounds.extend([day.geoCoordinates.lat, day.geoCoordinates.log])
					hasValidCoordinates = true
				}
			})

			if (hasValidCoordinates) {
				leafletMapRef.current.fitBounds(bounds, { padding: [50, 50] })
			}
		}

		return (
			<div className="overflow-hidden rounded-lg shadow-sm">
				{/* Map control buttons - Moved ABOVE the map */}
				<div className="flex justify-end gap-2 border-b bg-white p-2">
					<button
						onClick={fitAllPoints}
						className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-medium text-black shadow-sm transition-colors hover:bg-gray-200"
					>
						<MapIcon size={14} />
						<span>View All</span>
					</button>
					<button
						onClick={openGoogleMapsDirections}
						className="flex items-center gap-1 rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-gray-800"
					>
						<Navigation size={14} />
						<span>Directions</span>
					</button>
				</div>

				{/* MAP */}
				<div className="relative">
					<div ref={mapRef} style={{ height: `${height}px`, width: '100%' }} />
				</div>

				{/* LEGEND */}
				<div className="flex flex-wrap gap-3 bg-gray-50 p-3 text-sm">
					<div className="flex items-center gap-1">
						<div className="h-4 w-4 rounded-full bg-black"></div>
						<span>Tour Days</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="h-4 w-4 rounded-full bg-black"></div>
						<span>Selected Day</span>
					</div>
					<div className="flex items-center gap-1">
						<div className="h-1 w-8 bg-black"></div>
						<span>Route</span>
					</div>
				</div>
			</div>
		)
	},
)

InnerTourMap.displayName = 'InnerTourMap'

// Dynamically import the inner component with ssr: false
const DynamicTourMap = dynamic(() => Promise.resolve(InnerTourMap), {
	ssr: false,
	loading: MapLoading,
})

// Export the dynamic component as the default export
const TourMap = forwardRef<
	{ zoomToDay: (dayIndex: number) => void },
	TourMapProps
>((props, ref) => {
	return <DynamicTourMap {...props} ref={ref} />
})

TourMap.displayName = 'TourMap'

export default TourMap
