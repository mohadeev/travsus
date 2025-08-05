'use client'

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapIcon, Navigation } from 'lucide-react'

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

// Using forwardRef to expose methods to parent component
const TourMap = forwardRef<
	{ zoomToDay: (dayIndex: number) => void },
	TourMapProps
>(
	(
		{ days, selectedDayIndex, onDaySelect, height = 500, monochrome = false },
		ref,
	) => {
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

				// Add high-quality monochrome map tiles
				if (monochrome) {
					// Use Stadia Maps Alidade Smooth with higher quality
					L.tileLayer(
						'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
						{
							maxZoom: 20,
							attribution:
								'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
						},
					).addTo(leafletMapRef.current)
				} else {
					// Use Mapbox Streets with higher quality
					L.tileLayer(
						'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
						{
							attribution:
								'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
							subdomains: 'abcd',
							maxZoom: 20,
						},
					).addTo(leafletMapRef.current)
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

		// Add custom CSS for markers and z-index fixes
		useEffect(() => {
			const style = document.createElement('style')
			style.textContent = `
        /* Fix z-index issues with map */
        .leaflet-map-container {
          z-index: 0 !important;
          position: relative;
        }
        
        .leaflet-map-container .leaflet-pane {
          z-index: 1 !important;
        }
        
        .leaflet-map-container .leaflet-pane .leaflet-popup-pane {
          z-index: 7 !important;
        }
        
        .leaflet-map-container .leaflet-pane .leaflet-marker-pane {
          z-index: 6 !important;
        }
        
        .leaflet-map-container .leaflet-pane .leaflet-tooltip-pane {
          z-index: 5 !important;
        }
        
        .leaflet-map-container .leaflet-pane .leaflet-overlay-pane {
          z-index: 4 !important;
        }
        
        .leaflet-map-container .leaflet-pane .leaflet-shadow-pane {
          z-index: 3 !important;
        }
        
        .leaflet-map-container .leaflet-pane .leaflet-tile-pane {
          z-index: 2 !important;
        }
        
        .leaflet-map-container .leaflet-control-container {
          z-index: 8 !important;
        }
        
        .day-marker {
          z-index: 500 !important;
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
			<div
				className="overflow-hidden rounded-lg shadow-sm"
				style={{ position: 'relative', zIndex: 0 }}
			>
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
						<span>Directions sdvsdvsv</span>
					</button>
				</div>

				{/* MAP */}
				<div className="leaflet-map-container relative " style={{ zIndex: 1 }}>
					<div ref={mapRef} style={{ height: `${height}px`, width: '100%' zIndex: 1}} />
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

//comment

TourMap.displayName = 'TourMap'

export default TourMap
