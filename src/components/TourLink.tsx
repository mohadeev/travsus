'use client'
// A link to a tour page that, on click, hands what the card knows to the store,
// so <TourPreviewShell /> can draw the tour page instantly while it loads.
import type { ComponentProps } from 'react'
import Link from 'next/link'
import { useAppDispatch } from '@/store/hooks'
import { openTourPreview, setTourPreview, type TourPreview } from '@/store/slices/tourPage'

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string; preview: TourPreview }

export default function TourLink({ href, preview, onClick, ...rest }: Props) {
	const dispatch = useAppDispatch()
	return (
		<Link
			href={href as any}
			onClick={(event) => {
				onClick?.(event)
				// New tab / window: just remember the preview; same tab: show the shell now
				const newTab = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
				dispatch(newTab || event.defaultPrevented ? setTourPreview(preview) : openTourPreview(preview))
			}}
			{...rest}
		/>
	)
}
