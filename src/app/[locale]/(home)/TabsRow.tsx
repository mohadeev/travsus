'use client'
// The hero's tab row: on narrow screens it scrolls sideways, so it opens
// scrolled to the active tab ("Things to Do") instead of the first one.
import { useEffect, useRef, type ReactNode } from 'react'

export default function TabsRow({ label, children }: { label: string; children: ReactNode }) {
	const ref = useRef<HTMLElement>(null)
	useEffect(() => {
		const row = ref.current
		const active = row?.querySelector<HTMLElement>('[aria-current="page"]')
		if (row && active && row.scrollWidth > row.clientWidth) {
			row.scrollLeft = active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2
		}
	}, [])
	return (
		<nav ref={ref} aria-label={label} className="-mx-4 mt-6 overflow-x-auto px-4 [scrollbar-width:none] sm:mt-8 [&::-webkit-scrollbar]:hidden">
			{children}
		</nav>
	)
}
