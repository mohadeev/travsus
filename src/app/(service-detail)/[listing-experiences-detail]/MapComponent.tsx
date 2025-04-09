'use client'

import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ButtonPrimary from '@/shared/ButtonPrimary'

const MapComponent = ({ startAddress }: any) => {
	if (!startAddress) {
		return null
	}
	const mapRef = useRef(null)

	useEffect(() => {
		if (!mapRef.current) return

		// Create a custom icon using SVG to avoid image loading issues
		const customIcon = L.divIcon({
			className: 'custom-marker',
			html: `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>`,
			iconSize: [32, 32],
			iconAnchor: [16, 32],
			popupAnchor: [0, -32],
		})

		// Initialize map view using coordinates from startAddress
		const map = L.map(mapRef.current).setView(
			[startAddress?.geoCoordinates?.lat, startAddress?.geoCoordinates?.log],
			13,
		)

		// Add OpenStreetMap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
		}).addTo(map)

		// Add marker with custom icon
		L.marker(
			[startAddress?.geoCoordinates?.lat, startAddress?.geoCoordinates?.log],
			{ icon: customIcon },
		).addTo(map)

		// Add custom marker styles
		const style = document.createElement('style')
		style.textContent = `
      .custom-marker {
        color: #ef4444;
      }
      .custom-marker svg {
        filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.2));
      }
    `
		document.head.appendChild(style)

		return () => {
			document.head.removeChild(style)
			map.remove()
		}
	}, [startAddress])

	// Open Google Maps in a new tab with the location coordinates
	const openGoogleMaps = () => {
		const lat = startAddress?.geoCoordinates?.lat
		const lng = startAddress?.geoCoordinates?.log
		if (lat && lng) {
			const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
			window.open(googleMapsUrl, '_blank')
		}
	}

	return (
		<div className="listingSection__wrap_no_border_color">
			{/* HEADING */}
			<div>
				<h2 className="text-2xl font-semibold">Location</h2>
				<span className="mt-2 block text-neutral-500 dark:text-neutral-400">
					{startAddress?.country} - {startAddress?.city}
				</span>
			</div>
			<div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

			{/* MAP */}
			{startAddress?.geoCoordinates?.lat && (
				<div className="aspect-h-5 aspect-w-5 z-0 rounded-xl ring-1 ring-black/10 sm:aspect-h-3">
					<div className="z-0 overflow-hidden rounded-xl">
						<div ref={mapRef} style={{ height: '400px', width: '100%' }} />
					</div>
				</div>
			)}

			{/* Button to open Google Maps */}
			<div className="mt-4 w-full text-center">
				{/* <button
					onClick={openGoogleMaps}
					className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				>
				</button>*/}
				<ButtonPrimary onClick={openGoogleMaps} className="w-full">
					{' '}
					Open in Google Maps
				</ButtonPrimary>
			</div>
		</div>
	)
}

export default MapComponent
