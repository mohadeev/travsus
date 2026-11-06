'use client'
// A home page row that scrolls sideways: 4 items in view on large screens, round
// white arrows on the sides, level with the middle of the photos (hidden at
// each end, and on touch screens where people swipe).
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HomeRow({ label, wide = false, children }: { label: string; wide?: boolean; children: ReactNode }) {
	const track = useRef<HTMLUListElement>(null)
	const [state, setState] = useState({ start: true, end: false, middle: 0 })

	useEffect(() => {
		const el = track.current
		if (!el) return
		const sync = () => {
			const img = el.querySelector('img')
			setState({
				start: el.scrollLeft < 8,
				end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8,
				middle: img ? img.offsetHeight / 2 : 0,
			})
		}
		sync()
		el.addEventListener('scroll', sync, { passive: true })
		window.addEventListener('resize', sync)
		const images = Array.from(el.querySelectorAll('img'))
		images.forEach((img) => img.addEventListener('load', sync))
		return () => {
			el.removeEventListener('scroll', sync)
			window.removeEventListener('resize', sync)
			images.forEach((img) => img.removeEventListener('load', sync))
		}
	}, [])

	const go = (direction: 1 | -1) => track.current?.scrollBy({ left: direction * track.current.clientWidth, behavior: 'smooth' })
	const arrow =
		'absolute z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-[0_1px_6px_rgba(0,0,0,0.2)] transition disabled:pointer-events-none disabled:opacity-0 lg:grid'

	return (
		<div className="relative">
			<button type="button" aria-label={`${label} ←`} disabled={state.start} onClick={() => go(-1)} className={`${arrow} -left-5`} style={{ top: state.middle || '40%' }}>
				<ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
			</button>
			<ul
				ref={track}
				aria-label={label}
				// As on TripAdvisor: 1.5 cards in view on phones and 3 on tablets
				// with 8px gaps; 4 with 16px gaps from 1024px
				className={`grid snap-x snap-mandatory grid-flow-col gap-2 overflow-x-auto [scrollbar-width:none] sm:auto-cols-[calc((100%-16px)/3)] lg:auto-cols-[calc((100%-48px)/4)] lg:gap-4 [&::-webkit-scrollbar]:hidden ${
					wide ? 'auto-cols-[62%]' : 'auto-cols-[calc((100%-8px)/1.5)]'
				}`}
			>
				{children}
			</ul>
			<button type="button" aria-label={`${label} →`} disabled={state.end} onClick={() => go(1)} className={`${arrow} -right-5`} style={{ top: state.middle || '40%' }}>
				<ChevronRight className="h-5 w-5" strokeWidth={2.4} />
			</button>
		</div>
	)
}
