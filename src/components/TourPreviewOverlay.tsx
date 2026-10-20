'use client'
// The tour page "clone": from the click on a tour card until the new route is
// on screen, the preview shell replaces the page under the header (no waiting
// on a frozen page). Then the route's own loading.tsx (same shell) or the real
// page takes over. The old page stays mounted, only hidden.
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { closeTourPreview, selectTourOpening } from '@/store/slices/tourPage'
import TourPreviewShell from './TourPreviewShell'

export default function TourPreviewOverlay({ children }: { children: React.ReactNode }) {
	const dispatch = useAppDispatch()
	const opening = useAppSelector(selectTourOpening)
	const pathname = usePathname()
	const openedOn = useRef<string | null>(null)

	useEffect(() => {
		if (!opening) return
		openedOn.current = pathname
		window.scrollTo(0, 0)
		const close = () => dispatch(closeTourPreview())
		// Never stuck: back button, or a navigation that never lands
		const timer = setTimeout(close, 15000)
		window.addEventListener('popstate', close)
		return () => {
			clearTimeout(timer)
			window.removeEventListener('popstate', close)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [opening])

	// The new route is on screen
	useEffect(() => {
		if (opening && openedOn.current !== null && pathname !== openedOn.current) dispatch(closeTourPreview())
	}, [pathname, opening, dispatch])

	return (
		<>
			<div hidden={opening}>{children}</div>
			{opening && <TourPreviewShell />}
		</>
	)
}
