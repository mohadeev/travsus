'use client'
// Turns on the scroll animations of the home page (see home.module.css):
// marks what is already on screen as shown, then reveals the rest as it
// scrolls into view. Renders nothing.
import { useEffect } from 'react'
import styles from './home.module.css'

export default function HomeMotion() {
	useEffect(() => {
		const root = document.documentElement
		const targets = Array.from(document.querySelectorAll<HTMLElement>(`.${styles.reveal}, .${styles.stagger}`))
		if (!('IntersectionObserver' in window) || !targets.length) return

		// Already visible: show at once, so nothing on screen blinks
		const inView = (el: HTMLElement) => el.getBoundingClientRect().top < window.innerHeight * 0.92
		targets.forEach((el) => inView(el) && el.classList.add(styles.in))
		root.classList.add(styles.ready)

		const observer = new IntersectionObserver(
			(entries) =>
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return
					entry.target.classList.add(styles.in)
					observer.unobserve(entry.target)
				}),
			{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
		)
		targets.filter((el) => !el.classList.contains(styles.in)).forEach((el) => observer.observe(el))

		return () => {
			observer.disconnect()
			root.classList.remove(styles.ready)
		}
	}, [])

	return null
}
