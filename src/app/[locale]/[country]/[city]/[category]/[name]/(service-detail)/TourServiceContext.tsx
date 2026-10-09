'use client'
// Gives tour components the tour data. It comes from the server (so the HTML
// contains the real content for search engines and AI crawlers); while a
// clicked card is opening, its preview from the store is used instead.
import { createContext, useContext } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectTourPreview } from '@/store/slices/tourPage'

const TourServiceContext = createContext<any>(null)

export const TourServiceProvider = TourServiceContext.Provider

export function useTourService(): any {
	const fromServer = useContext(TourServiceContext)
	const preview = useAppSelector(selectTourPreview)
	return fromServer ?? preview
}
