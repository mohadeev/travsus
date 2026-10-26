'use client'
// A row that scrolls sideways, with ← → buttons on larger screens (a mouse
// can't easily scroll sideways). The buttons fade out at each end.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Shelf({
	as: Tag = 'ul',
	className,
	label,
	children,
}: {
	as?: 'ul' | 'div'
	className: string
	label: string
	children: ReactNode
}) {
	const row = useRef<HTMLUListElement & HTMLDivElement>(null)
	const [ends, setEnds] = useState({ start: true, end: false })

	useEffect(() => {
		const el = row.current
		if (!el) return
		const update = () =>
			setEnds({
				start: el.scrollLeft < 8,
				end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8,
			})
		update()
		el.addEventListener('scroll', update, { passive: true })
		window.addEventListener('resize', update)
		return () => {
			el.removeEventListener('scroll', update)
			window.removeEventListener('resize', update)
		}
	}, [])

	const go = (direction: 1 | -1) =>
		row.current?.scrollBy({
			left: direction * row.current.clientWidth,
			behavior: 'smooth',
		})
	const button =
		'absolute top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-neutral-950 shadow-lg ring-1 ring-black/10 transition hover:scale-105 disabled:pointer-events-none disabled:opacity-0 sm:grid dark:bg-neutral-900 dark:text-white dark:ring-white/10'

	return (
		<div className="relative">
			<Tag ref={row} className={className}>
				{children}
			</Tag>
			<button
				type="button"
				aria-label={`${label} ←`}
				disabled={ends.start}
				onClick={() => go(-1)}
				className={`${button} -left-5`}
			>
				<ChevronLeft className="h-5 w-5" />
			</button>
			<button
				type="button"
				aria-label={`${label} →`}
				disabled={ends.end}
				onClick={() => go(1)}
				className={`${button} -right-5`}
			>
				<ChevronRight className="h-5 w-5" />
			</button>
		</div>
	)
}
