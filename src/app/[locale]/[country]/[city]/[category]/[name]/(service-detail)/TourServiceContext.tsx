'use client'
// Gives tour components the tour data. It comes from the server, so the HTML
// contains the real content for search engines and AI crawlers. (While a page
// loads, <TourPreviewShell /> draws the clicked card's preview instead.)
import { createContext, useContext } from 'react'

const TourServiceContext = createContext<any>(null)

export const TourServiceProvider = TourServiceContext.Provider

export function useTourService(): any {
	return useContext(TourServiceContext)
}
