"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"

interface City {
  name: string
  order: number
}

interface Coordinates {
  lat: number
  lng: number
}

interface TripMapProps {
  selectedCities: City[]
  suggestedCities: string[]
  suggestedCoordinates: Record<string, Coordinates>
  onSuggestedCityClick: (city: string) => void
  country: string
}

const TripMap: React.FC<TripMapProps> = ({
  selectedCities,
  suggestedCities,
  suggestedCoordinates,
  onSuggestedCityClick,
  country,
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const routeLayerRef = useRef<L.Polyline | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const suggestedMarkersLayerRef = useRef<L.LayerGroup | null>(null)
  const previewLineRef = useRef<L.Polyline | null>(null)

  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [coordinatesCache, setCoordinatesCache] = useState<Record<string, Coordinates>>(suggestedCoordinates || {})

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map if it doesn't exist
    if (!leafletMapRef.current) {
      // Set initial view based on country
      let initialCoords: [number, number] = [0, 0]
      let initialZoom = 5

      switch (country.toLowerCase()) {
        case "morocco":
          initialCoords = [31.7917, -7.0926] // Center of Morocco
          initialZoom = 6
          break
        case "spain":
          initialCoords = [40.4637, -3.7492] // Center of Spain
          initialZoom = 6
          break
        case "france":
          initialCoords = [46.6034, 1.8883] // Center of France
          initialZoom = 6
          break
        case "italy":
          initialCoords = [41.8719, 12.5674] // Center of Italy
          initialZoom = 6
          break
        case "portugal":
          initialCoords = [39.3999, -8.2245] // Center of Portugal
          initialZoom = 7
          break
        default:
          // Default view of Europe
          initialCoords = [48.8566, 2.3522] // Paris
          initialZoom = 4
      }

      leafletMapRef.current = L.map(mapRef.current).setView(initialCoords, initialZoom)

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(leafletMapRef.current)

      // Create layers for markers and routes
      markersLayerRef.current = L.layerGroup().addTo(leafletMapRef.current)
      suggestedMarkersLayerRef.current = L.layerGroup().addTo(leafletMapRef.current)
    }

    // Clean up function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [country])

  // Update coordinates cache when suggestedCoordinates change
  useEffect(() => {
    if (suggestedCoordinates && Object.keys(suggestedCoordinates).length > 0) {
      setCoordinatesCache((prev) => ({
        ...prev,
        ...suggestedCoordinates,
      }))
    }
  }, [suggestedCoordinates])

  // Update map when selected cities, suggested cities, or coordinates change
  useEffect(() => {
    updateMap()
  }, [selectedCities, suggestedCities, coordinatesCache])

  // Function to update the map with current cities and coordinates
  const updateMap = () => {
    if (!leafletMapRef.current) return

    // Clear existing markers and routes
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers()
    }

    if (suggestedMarkersLayerRef.current) {
      suggestedMarkersLayerRef.current.clearLayers()
    }

    if (routeLayerRef.current && leafletMapRef.current) {
      leafletMapRef.current.removeLayer(routeLayerRef.current)
      routeLayerRef.current = null
    }

    // If we don't have any cities or coordinates, don't update the map
    if (selectedCities.length === 0 && suggestedCities.length === 0) return

    // Create selected city markers and route
    const routePoints: L.LatLngExpression[] = []
    const bounds = L.latLngBounds([])
    let hasValidCoordinates = false

    // Add selected cities to the map
    selectedCities.forEach((city, index) => {
      if (!coordinatesCache[city.name]) return

      const coords = coordinatesCache[city.name]
      routePoints.push([coords.lat, coords.lng])
      bounds.extend([coords.lat, coords.lng])
      hasValidCoordinates = true

      // Create marker for each selected city
      const selectedIcon = L.divIcon({
        className: "selected-city-marker",
        html: `<div class="flex flex-col items-center">
                <div class="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                  ${index + 1}
                </div>
                <div class="text-xs font-semibold bg-white px-1 py-0.5 rounded shadow mt-1">
                  ${city.name}
                </div>
              </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })

      const marker = L.marker([coords.lat, coords.lng], { icon: selectedIcon })
        .bindPopup(`
    <div class="custom-popup">
      <h3 class="font-bold">${city.name}</h3>
      <p class="text-sm">Stop #${index + 1}</p>
    </div>
  `)
        .addTo(markersLayerRef.current!)
    })

    // Create route line connecting selected cities
    if (routePoints.length > 1) {
      routeLayerRef.current = L.polyline(routePoints, {
        color: "black",
        weight: 3,
        opacity: 0.7,
        dashArray: "5, 10",
      }).addTo(leafletMapRef.current)
    }

    // Add markers for suggested cities
    suggestedCities.forEach((city) => {
      if (!coordinatesCache[city]) return

      const coords = coordinatesCache[city]
      bounds.extend([coords.lat, coords.lng])
      hasValidCoordinates = true

      const suggestedIcon = L.divIcon({
        className: "suggested-city-marker",
        html: `<div class="flex flex-col items-center">
                <div class="w-6 h-6 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center">
                  <div class="w-2 h-2 rounded-full bg-gray-400"></div>
                </div>
                <div class="text-xs font-medium bg-white px-1 py-0.5 rounded shadow mt-1 text-gray-600">
                  ${city}
                </div>
              </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      const marker = L.marker([coords.lat, coords.lng], { icon: suggestedIcon })
        .bindPopup(`
    <div class="custom-popup">
      <h3 class="font-bold">${city}</h3>
      <p class="text-sm">Suggested destination</p>
    </div>
  `)
        .addTo(suggestedMarkersLayerRef.current!)

      // Add click handler
      marker.on("click", () => {
        onSuggestedCityClick(city)
      })

      // Add hover handlers to show preview line
      marker.on("mouseover", () => {
        setHoveredCity(city)

        // Show preview line if there are selected cities
        if (selectedCities.length > 0 && leafletMapRef.current) {
          const lastSelectedCity = selectedCities[selectedCities.length - 1]

          if (coordinatesCache[lastSelectedCity.name] && coordinatesCache[city]) {
            const lastCityCoords = coordinatesCache[lastSelectedCity.name]
            const hoveredCityCoords = coordinatesCache[city]

            // Remove existing preview line
            if (previewLineRef.current && leafletMapRef.current) {
              leafletMapRef.current.removeLayer(previewLineRef.current)
            }

            // Create new preview line
            previewLineRef.current = L.polyline(
              [
                [lastCityCoords.lat, lastCityCoords.lng],
                [hoveredCityCoords.lat, hoveredCityCoords.lng],
              ],
              {
                color: "blue",
                weight: 2,
                opacity: 0.5,
                dashArray: "5, 5",
              },
            ).addTo(leafletMapRef.current)
          }
        }
      })

      marker.on("mouseout", () => {
        setHoveredCity(null)

        // Remove preview line
        if (previewLineRef.current && leafletMapRef.current) {
          leafletMapRef.current.removeLayer(previewLineRef.current)
          previewLineRef.current = null
        }
      })
    })

    // Fit map to show all cities
    if (hasValidCoordinates && leafletMapRef.current) {
      leafletMapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }

  // Add custom CSS for markers
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
    .selected-city-marker {
      z-index: 1000;
    }
    .suggested-city-marker {
      z-index: 900;
      cursor: pointer;
    }
    .custom-popup {
      padding: 4px 8px;
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .custom-popup h3 {
      margin: 0;
      color: #111;
      font-size: 14px;
    }
    .custom-popup p {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 12px;
    }
    .leaflet-popup-content-wrapper {
      border-radius: 8px;
      padding: 0;
    }
    .leaflet-popup-content {
      margin: 0;
      padding: 0;
    }
    .leaflet-popup-tip {
      background-color: white;
    }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Function to fit all cities in view
  const fitAllCities = () => {
    if (!leafletMapRef.current) return

    const allCities = [...selectedCities.map((c) => c.name), ...suggestedCities]
    if (allCities.length === 0) return

    const bounds = L.latLngBounds([])
    let hasValidCoordinates = false

    allCities.forEach((city) => {
      if (coordinatesCache[city]) {
        const coords = coordinatesCache[city]
        bounds.extend([coords.lat, coords.lng])
        hasValidCoordinates = true
      }
    })

    if (hasValidCoordinates) {
      leafletMapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Trip Route Map</h3>
          <p className="text-sm text-gray-500">
            {selectedCities.length > 0
              ? `Your route: ${selectedCities.map((c) => c.name).join(" → ")}`
              : "Select cities to see your route on the map"}
          </p>
        </div>
      </div>

      <div ref={mapRef} className="h-[400px] w-full relative"></div>

      <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {hoveredCity
            ? `Preview: ${selectedCities.length > 0 ? selectedCities[selectedCities.length - 1].name : ""} → ${hoveredCity}`
            : selectedCities.length > 0
              ? `${selectedCities.length} cities selected`
              : "No cities selected"}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fitAllCities}
          disabled={selectedCities.length === 0 && suggestedCities.length === 0}
        >
          Fit All Cities
        </Button>
      </div>

      <div className="p-3 bg-white border-t border-gray-200 flex flex-wrap gap-2">
        <div className="text-xs text-gray-500 w-full mb-1">Legend:</div>
        <div className="flex items-center gap-1 text-xs">
          <div className="w-4 h-4 rounded-full bg-black"></div>
          <span>Selected Cities</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-400"></div>
          <span>Suggested Cities</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <div className="w-8 h-1 bg-black"></div>
          <span>Route</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <div className="w-8 h-1 bg-blue-500"></div>
          <span>Preview</span>
        </div>
      </div>
    </div>
  )
}

export default TripMap

