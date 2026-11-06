'use client'
// Section tabs under the photos, as on TripAdvisor: Overview, Details,
// Itinerary, Reviews. They stay under the site header while scrolling, jump
// to their section, and underline the section in view.
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const TABS = [
	{ id: 'overview', key: 'tab_overview' },
	{ id: 'details', key: 'tab_details' },
	{ id: 'itinerary', key: 'tab_itinerary' },
	{ id: 'experience_reviews', key: 'tab_reviews' },
] as const

export default function TourTabs() {
	const t = useTranslations('TourPage')
	const [tabs, setTabs] = useState<typeof TABS[number][]>([...TABS])
	const [active, setActive] = useState<string>('overview')

	useEffect(() => {
		// Only the sections this tour has
		const present = TABS.filter((tab) => document.getElementById(tab.id))
		setTabs(present)
		const onScroll = () => {
			let current = present[0]?.id
			for (const tab of present) {
				const el = document.getElementById(tab.id)
				if (el && el.getBoundingClientRect().top <= 140) current = tab.id
			}
			if (current) setActive(current)
		}
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	return (
		<nav
			aria-label={t('sections_label')}
			className="sticky top-[60px] z-30 -mx-6 mt-4 bg-white px-6 sm:top-[72px] dark:bg-neutral-950"
		>
			<ul className="flex gap-7 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				{tabs.map((tab) => (
					<li key={tab.id}>
						<a
							href={`#${tab.id}`}
							onClick={(e) => {
								e.preventDefault()
								const el = document.getElementById(tab.id)
								if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 130, behavior: 'smooth' })
							}}
							aria-current={active === tab.id ? 'true' : undefined}
							className={`block border-b-[3px] py-3 text-base font-bold leading-6 transition ${
								active === tab.id ? 'border-brand-500 text-ink dark:text-white' : 'border-transparent text-ink hover:border-neutral-300 dark:text-white'
							}`}
						>
							{t(tab.key)}
						</a>
					</li>
				))}
			</ul>
		</nav>
	)
}
