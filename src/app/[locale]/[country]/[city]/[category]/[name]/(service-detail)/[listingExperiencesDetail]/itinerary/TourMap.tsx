'use client'
// Loads the map only in the browser (Leaflet needs `window`).
import { forwardRef } from 'react'
import dynamic from 'next/dynamic'
import type { TourMapLeafletProps } from './TourMapLeaflet'

const MapLoading = () => <div className="h-[420px] w-full animate-pulse bg-neutral-100" />

const TourMapLeaflet = dynamic(() => import('./TourMapLeaflet'), {
	ssr: false,
	loading: MapLoading,
})

type TourMapProps = TourMapLeafletProps & { monochrome?: boolean }

// The selected day comes in as a prop, so no imperative API is needed;
// the ref is accepted for compatibility with older callers.
const TourMap = forwardRef<{ zoomToDay: (dayIndex: number) => void }, TourMapProps>(
	({ monochrome: _monochrome, ...props }, _ref) => <TourMapLeaflet {...props} />,
)

TourMap.displayName = 'TourMap'

export default TourMap
