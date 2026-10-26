// TripAdvisor-style hero. Phones: a clean white "Where to?" with one search
// bar and quick-search chips. Larger screens: big photo of happy travellers,
// category tabs and one search box on top of it.
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, Compass, Mountain, Search, Sun, Timer, type LucideIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { HomeDestination } from '@/lib/homeData'
import { PHOTOS } from '@/lib/photos'
import styles from './home.module.css'

// [label key, search words, icon]: the tabs above the search box
const TABS: [string, string, LucideIcon][] = [
	['tab_all', '', Compass],
	['interest_desert', 'desert', Sun],
	['interest_multi_day', 'days', CalendarDays],
	['interest_mountains', 'atlas', Mountain],
	['interest_day_trips', 'day trip', Timer],
]

export default function HomeHero({ destinations }: { destinations: HomeDestination[] }) {
	const t = useTranslations('Home')
	const tSeo = useTranslations('HomeSeo')
	const tHero = useTranslations('app_locale_test_page')
	const locale = useLocale()

	return (
		<section className="mx-auto max-w-7xl px-5 pt-3 sm:pt-5">
			{/* Phones */}
			<div className={`${styles.heroIn} pb-2 pt-7 text-center sm:hidden`}>
				<p className="text-[44px] font-black leading-none tracking-tight text-neutral-950 dark:text-white">{t('where_to')}</p>
				<h1 className="mx-auto mt-3 max-w-xs text-[13px] leading-snug text-neutral-500">{tSeo('h1')}</h1>

				<form
					action={`/${locale}/search`}
					method="get"
					role="search"
					className="mt-6 flex items-center gap-2 rounded-full border border-neutral-300 bg-white p-1.5 pl-4 text-neutral-950 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.3)] focus-within:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
				>
					<Search className="h-5 w-5 shrink-0" />
					<label className="min-w-0 flex-1">
						<span className="sr-only">{t('search_label')}</span>
						<input
							type="search"
							name="query"
							placeholder={t('search_placeholder')}
							className="w-full border-0 bg-transparent p-0 py-2.5 text-base placeholder:text-neutral-500 focus:outline-none focus:ring-0"
						/>
					</label>
					<button
						type="submit"
						className="shrink-0 rounded-full bg-neutral-950 px-5 py-3 text-[15px] font-bold text-white transition active:scale-95 dark:bg-white dark:text-neutral-950"
					>
						{t('search_cta')}
					</button>
				</form>

				{/* Quick searches: categories, then cities. Swipe sideways. */}
				<ul className={`${styles.noScrollbar} -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1`}>
					{TABS.slice(1).map(([label, query, Icon]) => (
						<li key={label} className="shrink-0">
							<Link
								href={`/search?query=${encodeURIComponent(query)}` as any}
								className="flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-950 transition active:scale-95 dark:border-neutral-700 dark:text-white"
							>
								<Icon className="h-4 w-4" />
								{t(label)}
							</Link>
						</li>
					))}
					{destinations.slice(0, 5).map((d) => (
						<li key={d.city} className="shrink-0">
							<Link
								href={`/search?query=${encodeURIComponent(d.city)}` as any}
								className="block rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-950 transition active:scale-95 dark:border-neutral-700 dark:text-white"
							>
								{d.city}
							</Link>
						</li>
					))}
				</ul>
			</div>

			{/* Larger screens */}
			<div className="relative isolate hidden overflow-hidden rounded-3xl bg-neutral-900 sm:block">
				<Image
					src={PHOTOS.hero}
					alt=""
					fill
					priority
					sizes="(max-width: 1280px) 100vw, 1240px"
					className={`${styles.heroImage} -z-10 object-cover`}
				/>
				<div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />

				<div className={`${styles.heroIn} mx-auto flex min-h-[440px] max-w-3xl flex-col items-center justify-center px-4 py-10 text-center text-white sm:min-h-[580px] sm:py-16`}>
					{/* The page's main heading says what we offer (for search engines and screen readers); the big line stays the slogan */}
					<h1 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 sm:mb-4 sm:text-sm">{tSeo('h1')}</h1>
					<p className="text-[32px] font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
						{tHero('app_locale_test_page_Travel_With_Ultimate_Flexibility')}
					</p>
					<p className="mt-3 max-w-xl text-base text-white/85 sm:mt-4 sm:text-xl">
						{tHero('app_locale_test_page_Book_Cancel_Refund_Anytime_Anywhere')}
					</p>

					{/* Plain form: works before JavaScript loads */}
					<form
						action={`/${locale}/search`}
						method="get"
						role="search"
						className={`${styles.search} mt-7 flex w-full max-w-2xl items-center gap-2 rounded-full bg-white p-1.5 pl-4 text-neutral-950 shadow-2xl sm:order-last sm:mt-4 sm:p-2 sm:pl-5`}
					>
						<Search className="h-5 w-5 shrink-0" />
						<label className="min-w-0 flex-1">
							<span className="sr-only">{t('search_label')}</span>
							<input
								type="search"
								name="query"
								placeholder={t('search_placeholder')}
								className="w-full border-0 bg-transparent p-0 py-2.5 text-base placeholder:text-neutral-500 focus:outline-none focus:ring-0"
							/>
						</label>
						<button
							type="submit"
							aria-label={t('search_cta')}
							className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-neutral-950 text-sm font-semibold text-white transition hover:scale-105 hover:bg-neutral-800 active:scale-95 sm:h-auto sm:w-auto sm:px-6 sm:py-3"
						>
							<Search className="h-5 w-5 sm:hidden" />
							<span className="hidden sm:inline">{t('search_cta')}</span>
						</button>
					</form>

					{/* Tabs: quick searches, TripAdvisor-style. Swipe on phones. */}
					<ul
						className={`${styles.noScrollbar} -mx-4 mt-4 flex max-w-[calc(100%_+_2rem)] gap-2 overflow-x-auto px-4 sm:mx-0 sm:mt-10 sm:max-w-full sm:gap-1 sm:rounded-full sm:bg-black/30 sm:p-1 sm:backdrop-blur-md`}
					>
						{TABS.map(([label, query, Icon], i) => (
							<li key={label} className="shrink-0">
								<Link
									href={`/search?query=${encodeURIComponent(query)}` as any}
									className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 active:scale-95 ${
										i === 0
											? 'bg-white text-neutral-950'
											: 'bg-black/30 text-white backdrop-blur-md hover:bg-white/15 sm:bg-transparent sm:backdrop-blur-none'
									}`}
								>
									<Icon className="h-4 w-4" />
									{t(label)}
								</Link>
							</li>
						))}
					</ul>

					{destinations.length > 0 && (
						<p className="order-last mt-5 hidden flex-wrap justify-center gap-2 text-sm sm:flex">
							{destinations.slice(0, 5).map((d) => (
								<Link
									key={d.city}
									href={`/search?query=${encodeURIComponent(d.city)}` as any}
									className="rounded-full border border-white/40 px-3 py-1 font-medium text-white backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-neutral-950"
								>
									{d.city}
								</Link>
							))}
						</p>
					)}
				</div>
			</div>
		</section>
	)
}
