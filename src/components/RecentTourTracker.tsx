'use client'
// Remembers that this tour was opened, for "Recently viewed" on the home page.
import { useEffect } from 'react'
import { addRecentTour } from '@/lib/recentTours'

export default function RecentTourTracker({ tourId }: { tourId: string }) {
	useEffect(() => {
		if (tourId) addRecentTour(tourId)
	}, [tourId])
	return null
}
