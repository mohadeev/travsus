"use client"

import { useState, useRef, useEffect } from "react"
import TourMap from "./tour-map"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { MapPin } from "lucide-react"

interface Day {
  name: string
  description: string
  cityId?: string
  cityName?: string
  geoCoordinates?: {
    lat: number
    log: number
  }
  stops?: {
    name: string
    description?: string
    duration?: string
    image?: string
  }[]
}

interface TourItineraryWithMapProps {
  days: Day[]
  title?: string
}

export default function TourItineraryWithMap({ days, title = "Desert Tour" }: TourItineraryWithMapProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0)
  const [selectedStopIndex, setSelectedStopIndex] = useState<number>(0)
  const [expandedDays, setExpandedDays] = useState<boolean[]>(Array(days.length).fill(false))
  const mapRef = useRef(null)
  const [dotDensity, setDotDensity] = useState(8) // 8px spacing between dots
  const timelineRefs = useRef<(HTMLDivElement | null)[]>([])
  const overviewTimelineRefs = useRef<(HTMLDivElement | null)[]>([])

  // Function to handle day selection
  const handleDaySelect = (dayIndex: number) => {
    setSelectedDayIndex(dayIndex)
    setSelectedStopIndex(0) // Reset stop index when changing days

    // If we have a reference to the map component, call its zoomToDay method
    if (mapRef.current && typeof mapRef.current.zoomToDay === "function") {
      mapRef.current.zoomToDay(dayIndex)
    }
  }

  // Toggle expansion for a specific day
  const toggleExpand = (dayIndex: number) => {
    const newExpandedDays = [...expandedDays]
    newExpandedDays[dayIndex] = !newExpandedDays[dayIndex]
    setExpandedDays(newExpandedDays)
  }

  // Ensure we have a valid day selected
  useEffect(() => {
    if (selectedDayIndex >= days.length) {
      setSelectedDayIndex(0)
    }
  }, [days, selectedDayIndex])

  // Get the currently selected day
  const selectedDay = days[selectedDayIndex] || days[0]

  // Get stops for the selected day, or create a default one if none exist
  const stops = selectedDay.stops || [
    {
      name: selectedDay.cityName || "Tour Stop",
      description: selectedDay.description || "No description available",
    },
  ]

  // Get the currently selected stop
  const selectedStop = stops[selectedStopIndex] || stops[0]

  // Create dots for timeline
  useEffect(() => {
    // Create dots for day detail timelines
    timelineRefs.current.forEach((ref, index) => {
      if (!ref) return

      // Clear existing dots
      while (ref.firstChild) {
        ref.removeChild(ref.firstChild)
      }

      const height = ref.clientHeight
      const dotSize = 4 // Exact dot size in pixels
      const spacing = dotDensity - dotSize // Actual spacing between dots
      const totalPerDot = dotSize + spacing

      // Calculate how many dots can fit in the container
      const dotsCount = Math.floor((height - spacing) / totalPerDot) + 1

      // Create dots
      for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement("div")
        dot.style.position = "absolute"
        dot.style.top = `${i * dotDensity}px`
        dot.style.left = "50%"
        dot.style.transform = "translateX(-50%)"
        dot.style.width = "4px"
        dot.style.height = "4px"
        dot.style.backgroundColor = "#000000"
        dot.style.borderRadius = "50%"
        ref.appendChild(dot)
      }
    })

    // Create dots for overview timelines
    overviewTimelineRefs.current.forEach((ref, index) => {
      if (!ref) return

      // Clear existing dots
      while (ref.firstChild) {
        ref.removeChild(ref.firstChild)
      }

      const height = ref.clientHeight
      const dotSize = 4 // Exact dot size in pixels
      const spacing = dotDensity - dotSize // Actual spacing between dots
      const totalPerDot = dotSize + spacing

      // Calculate how many dots can fit in the container
      const dotsCount = Math.floor((height - spacing) / totalPerDot) + 1

      // Create dots
      for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement("div")
        dot.style.position = "absolute"
        dot.style.top = `${i * dotDensity}px`
        dot.style.left = "50%"
        dot.style.transform = "translateX(-50%)"
        dot.style.width = "4px"
        dot.style.height = "4px"
        dot.style.backgroundColor = "#000000"
        dot.style.borderRadius = "50%"
        ref.appendChild(dot)
      }
    })
  }, [stops, dotDensity, selectedDayIndex])

  // Set timeline ref
  const setTimelineRef = (el: HTMLDivElement | null, index: number) => {
    if (timelineRefs.current.length <= index) {
      timelineRefs.current = [...timelineRefs.current, ...Array(index - timelineRefs.current.length + 1).fill(null)]
    }
    timelineRefs.current[index] = el
  }

  // Set overview timeline ref
  const setOverviewTimelineRef = (el: HTMLDivElement | null, index: number) => {
    if (overviewTimelineRefs.current.length <= index) {
      overviewTimelineRefs.current = [
        ...overviewTimelineRefs.current,
        ...Array(index - overviewTimelineRefs.current.length + 1).fill(null),
      ]
    }
    overviewTimelineRefs.current[index] = el
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Top navigation tabs */}
      <div className="border-b">
        <div className="flex overflow-x-auto">
          <button
            className={`px-6 py-4 font-medium text-black whitespace-nowrap ${
              selectedDayIndex === -1 ? "border-b-2 border-black font-bold" : ""
            }`}
            onClick={() => handleDaySelect(-1)}
          >
            Overview
          </button>

          {days.map((day, index) => (
            <button
              key={index}
              className={`px-6 py-4 font-medium text-black whitespace-nowrap ${
                selectedDayIndex === index ? "border-b-2 border-black font-bold" : ""
              }`}
              onClick={() => handleDaySelect(index)}
            >
              Day {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Day subtitle */}
      <div className="px-6 py-2 bg-gray-50 text-sm text-black border-b">
        {selectedDayIndex === -1 ? (
          <div className="flex gap-2">
            <span>Full Map</span>
            <span>•</span>
            <span>{days.length} days</span>
          </div>
        ) : (
          <div>{selectedDay.name}</div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex flex-col lg:flex-row">
        {/* Left side: Itinerary details */}
        <div className="w-full lg:w-2/5 p-6 border-r">
          {selectedDayIndex === -1 ? (
            // Overview content
            <div>
              <h2 className="text-xl font-bold mb-4">{title}</h2>
              <p className="text-black mb-6">
                {days.length} day journey through{" "}
                {days
                  .map((d) => d.cityName)
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <div className="space-y-6 relative">
                {days.map((day, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    {/* Dotted line connecting days */}
                    {index < days.length - 1 && (
                      <div
                        ref={(el) => setOverviewTimelineRef(el, index)}
                        className="absolute left-4 top-0 bottom-0 w-0.5 flex flex-col items-center"
                        style={{
                          transform: "translateX(-50%)",
                          top: `${index * 6 + 2.5}rem`,
                          height: "4rem",
                        }}
                      ></div>
                    )}

                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 z-10">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium">{day.name}</h3>
                      <p className="text-sm text-black mt-1">{day.cityName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Day detail content with stops
            <div>
              <h2 className="text-xl font-bold mb-4">{selectedDay.name}</h2>

              <div className="relative">
                {stops.map((stop, index) => (
                  <div key={index} className="mb-8">
                    {/* Timeline dotted line */}
                    <div
                      ref={(el) => setTimelineRef(el, index)}
                      className="absolute left-4 top-0 bottom-0 w-0.5 flex flex-col items-center"
                      style={{ transform: "translateX(-50%)" }}
                    ></div>

                    <div className="flex">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center z-10 relative">
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                      </div>

                      <div className="ml-4 flex-1">
                        <h3 className="font-medium">{stop.name}</h3>
                        {stop.duration && <p className="text-sm text-black mt-1">Stop: {stop.duration}</p>}

                        {stop.image && (
                          <div className="mt-3 mb-3 rounded-lg overflow-hidden">
                            <Image
                              src={stop.image || "/placeholder.svg"}
                              alt={stop.name}
                              width={400}
                              height={250}
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        )}

                        <p className="text-black mt-2">{stop.description}</p>

                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 bg-black text-white hover:bg-gray-800 border-black"
                          onClick={() => setSelectedStopIndex(index)}
                        >
                          More about {stop.name}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium mb-2">Meals included:</h3>
                <p className="text-black">Breakfast, Dinner</p>
              </div>
            </div>
          )}
        </div>

        {/* Right side: Map */}
        <div className="w-full lg:w-3/5">
          <TourMap
            days={days}
            ref={mapRef}
            selectedDayIndex={selectedDayIndex === -1 ? null : selectedDayIndex}
            onDaySelect={handleDaySelect}
            height={600}
            monochrome={true}
          />
        </div>
      </div>

      {/* SEO-friendly hidden content - visible to search engines but not to users */}
      <div className="sr-only">
        <h2>{title} - Complete Itinerary</h2>
        {days.map((day, index) => (
          <div key={`seo-day-${index}`}>
            <h3>
              Day {index + 1}: {day.name}
            </h3>
            <p>{day.description}</p>
            {day.stops &&
              day.stops.map((stop, stopIndex) => (
                <div key={`seo-stop-${index}-${stopIndex}`}>
                  <h4>{stop.name}</h4>
                  <p>{stop.description}</p>
                  {stop.duration && <p>Duration: {stop.duration}</p>}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
