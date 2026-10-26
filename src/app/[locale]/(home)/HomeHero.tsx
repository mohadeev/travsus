'use client'
// TripAdvisor-style hero with a daydream: a big emoji and a short travel line
// change every few seconds, the search bar suggests the matching place, and a
// travel quote fades in below. "Where to?" types itself out once in languages
// from all over the world and ends in the visitor's own language. Without
// motion, the first line and quote stay.
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import styles from './home.module.css'

// [emoji, place the search bar suggests]: one per hero_line_N
const LINES = [
	['🐪', 'Merzouga'],
	['🕌', 'Fes'],
	['🌅', 'Erg Chebbi'],
	['🍵', 'Nomad'],
	['🌊', 'Essaouira'],
	['🏔️', 'Atlas'],
] as const
// "Where to?" around the world, Darija and Tamazight included
const WHERE_TO = [
	'¿A dónde?', 'Où aller ?', 'فين غادي؟', 'ⵎⴰⵏⵉ?', 'Wohin?', 'Dove?', 'إلى أين؟', 'Para onde?', 'Куда?', 'どこへ？',
	'去哪儿？', '어디로?', 'Nereye?', 'कहाँ?', 'Wapi?', 'Πού;', 'לאן?', 'Ke mana?', 'Đi đâu?', 'ไปไหน?',
	'Dokąd?', 'Waarheen?', 'Hvorhen?', 'Mihin?', 'Hová?', 'Saan?', 'Where to?',
]
const QUOTES = 4
const EVERY = 3200 // ms per line; the quote changes every second line

export default function HomeHero() {
	const t = useTranslations('Home')
	const tSeo = useTranslations('HomeSeo')
	const locale = useLocale()
	const [step, setStep] = useState(0)
	const [typed, setTyped] = useState(t('where_to'))

	// Typewriter, once: delete, type a language, hold, next one... and stop on the
	// visitor's own language
	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
		const own = t('where_to')
		const words = [own, ...WHERE_TO.filter((w) => w !== own), own]
		// Split by visible letters, so Hindi, Thai or Tifinagh never show half a letter
		const letters = (w: string) =>
			typeof Intl.Segmenter === 'function' ? Array.from(new Intl.Segmenter().segment(w), (x) => x.segment) : Array.from(w)
		let word = 0
		let shown = letters(words[0]).length
		let deleting = false
		let timer: ReturnType<typeof setTimeout>
		const tick = () => {
			const chars = letters(words[word])
			if (!deleting && shown < chars.length) shown++
			else if (!deleting) deleting = true
			else if (shown > 0) shown--
			else {
				deleting = false
				word++
			}
			setTyped(letters(words[word]).slice(0, shown).join(''))
			const done = !deleting && shown === letters(words[word]).length
			if (done && word === words.length - 1) return
			timer = setTimeout(tick, done ? 700 : deleting ? 30 : 60)
		}
		timer = setTimeout(tick, 1600)
		return () => clearTimeout(timer)
	}, [t])

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
		const timer = setInterval(() => setStep((s) => s + 1), EVERY)
		return () => clearInterval(timer)
	}, [])

	const line = step % LINES.length
	const quote = Math.floor(step / 2) % QUOTES
	const [emoji, place] = LINES[line]

	return (
		<section className={`${styles.heroIn} mx-auto max-w-4xl px-5 pb-4 pt-8 text-center sm:pb-10 sm:pt-16`}>
			{/* The page's main heading says what we offer (for search engines and screen readers) */}
			<h1 className="sr-only">{tSeo('h1')}</h1>

			<p className="flex h-6 items-center justify-center text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 sm:text-base">
				<span className="sr-only">{t('where_to')}</span>
				<span aria-hidden dir="auto">
					{typed}
				</span>
				<span aria-hidden className={`${styles.caret} ml-1 inline-block h-[1.1em] w-[2px] bg-neutral-950 dark:bg-white`} />
			</p>

			{/* The daydream: same height for every line, so nothing below jumps */}
			<div aria-hidden className="mt-4 flex min-h-[150px] flex-col items-center justify-center sm:min-h-[190px]">
				<span key={`e${line}`} className={`${styles.emoji} block text-5xl sm:text-6xl`}>
					{emoji}
				</span>
				<p
					key={`l${line}`}
					className={`${styles.lineIn} mt-3 text-[34px] font-black leading-[1.05] tracking-tight text-neutral-950 sm:text-6xl dark:text-white`}
				>
					{t(`hero_line_${line + 1}`)}
				</p>
			</div>

			{/* Plain form: works before JavaScript loads */}
			<form
				action={`/${locale}/search`}
				method="get"
				role="search"
				className="mx-auto mt-6 flex max-w-3xl items-center gap-2 rounded-full border border-neutral-300 bg-white p-1.5 pl-4 text-neutral-950 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.3)] transition focus-within:border-neutral-950 sm:mt-8 sm:p-2 sm:pl-6 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
			>
				<Search className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
				<label className="min-w-0 flex-1">
					<span className="sr-only">{t('search_label')}</span>
					<input
						type="search"
						name="query"
						placeholder={t('hero_try', { place })}
						className="w-full border-0 bg-transparent p-0 py-2.5 text-base placeholder:text-neutral-500 focus:outline-none focus:ring-0 sm:py-3 sm:text-lg"
					/>
				</label>
				<button
					type="submit"
					className="shrink-0 rounded-full bg-neutral-950 px-5 py-3 text-[15px] font-bold text-white transition hover:bg-neutral-800 active:scale-95 sm:px-8 sm:py-3.5 sm:text-base dark:bg-white dark:text-neutral-950"
				>
					{t('search_cta')}
				</button>
			</form>

			{/* A travel quote */}
			<figure key={`q${quote}`} className={`${styles.quoteIn} mx-auto mt-6 min-h-[64px] max-w-xl sm:mt-8`}>
				<blockquote className="font-serif text-base italic leading-snug text-neutral-700 sm:text-lg dark:text-neutral-300">“{t(`quote_${quote + 1}`)}”</blockquote>
				<figcaption className="mt-1.5 text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">{t(`quote_by_${quote + 1}`)}</figcaption>
			</figure>
		</section>
	)
}
