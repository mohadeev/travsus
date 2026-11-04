'use client'
// Turns on the scroll animations of the home page (see home.module.css):
// marks what is already on screen as shown, then reveals the rest just before
// it scrolls into view (about 300 ms). Content is only hidden once this has
// run, never with reduced motion. Renders nothing.
import { useEffect } from 'react'
import styles from './home.module.css'

export default function HomeMotion() {
	useEffect(() => {
		const root = document.documentElement
		const targets = Array.from(document.querySelectorAll<HTMLElement>(`.${styles.reveal}, .${styles.stagger}`))
		// No animation without IntersectionObserver or with reduced motion: everything stays visible
		if (!('IntersectionObserver' in window) || !targets.length) return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

		const show = (el: Element) => el.classList.add(styles.in)
		// Near or above the bottom of the screen (or already scrolled past): show it
		const due = (el: HTMLElement) => el.getBoundingClientRect().top < window.innerHeight * 1.15
		targets.forEach((el) => due(el) && show(el))
		root.classList.add(styles.ready)

		// Starts a bit before a section reaches the screen, so it is already
		// coming in when it appears
		const observer = new IntersectionObserver(
			(entries) =>
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return
					show(entry.target)
					observer.unobserve(entry.target)
				}),
			{ rootMargin: '0px 0px 15% 0px', threshold: 0 },
		)
		let waiting = targets.filter((el) => !el.classList.contains(styles.in))
		waiting.forEach((el) => observer.observe(el))

		// Fast scrolls and jumps can skip past a section between two observer
		// checks: reveal everything at or above the screen on each scroll frame
		let frame = 0
		const onScroll = () => {
			if (frame) return
			frame = requestAnimationFrame(() => {
				frame = 0
				waiting = waiting.filter((el) => {
					if (!due(el)) return true
					show(el)
					observer.unobserve(el)
					return false
				})
				if (!waiting.length) window.removeEventListener('scroll', onScroll)
			})
		}
		window.addEventListener('scroll', onScroll, { passive: true })

		return () => {
			observer.disconnect()
			window.removeEventListener('scroll', onScroll)
			cancelAnimationFrame(frame)
			root.classList.remove(styles.ready)
		}
	}, [])

	return null
}
