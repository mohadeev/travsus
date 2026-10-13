// TripAdvisor-style hero: big photo of happy travellers, category tabs and
// one search box on top of it.
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
	const tHero = useTranslations('app_locale_test_page')
	const locale = useLocale()

	return (
		<section className="mx-auto max-w-7xl px-5 pt-5">
			<div className="relative isolate overflow-hidden rounded-3xl bg-neutral-900">
				<Image
					src={PHOTOS.hero}
					alt=""
					fill
					priority
					sizes="(max-width: 1280px) 100vw, 1240px"
					className={`${styles.heroImage} -z-10 object-cover`}
				/>
				<div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />

				<div className="mx-auto flex min-h-[520px] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center text-white sm:min-h-[580px]">
					<h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
						{tHero('app_locale_test_page_Travel_With_Ultimate_Flexibility')}
					</h1>
					<p className="mt-4 max-w-xl text-lg text-white/85 sm:text-xl">
						{tHero('app_locale_test_page_Book_Cancel_Refund_Anytime_Anywhere')}
					</p>

					{/* Tabs: quick searches, TripAdvisor-style */}
					<ul className={`${styles.noScrollbar} mt-10 flex max-w-full gap-1 overflow-x-auto rounded-full bg-black/30 p-1 backdrop-blur-md`}>
						{TABS.map(([label, query, Icon], i) => (
							<li key={label} className="shrink-0">
								<Link
									href={`/search?query=${encodeURIComponent(query)}` as any}
									className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
										i === 0 ? 'bg-white text-neutral-950' : 'text-white hover:bg-white/15'
									}`}
								>
									<Icon className="h-4 w-4" />
									{t(label)}
								</Link>
							</li>
						))}
					</ul>

					{/* Plain form: works before JavaScript loads */}
					<form
						action={`/${locale}/search`}
						method="get"
						role="search"
						className="mt-4 flex w-full max-w-2xl items-center gap-2 rounded-full bg-white p-2 pl-5 text-neutral-950 shadow-2xl"
					>
						<Search className="h-5 w-5 shrink-0" />
						<label className="flex-1">
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
							className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
						>
							{t('search_cta')}
						</button>
					</form>

					{destinations.length > 0 && (
						<p className="mt-5 flex flex-wrap justify-center gap-2 text-sm">
							{destinations.slice(0, 5).map((d) => (
								<Link
									key={d.city}
									href={`/search?query=${encodeURIComponent(d.city)}` as any}
									className="rounded-full border border-white/40 px-3 py-1 font-medium text-white backdrop-blur-sm transition hover:bg-white hover:text-neutral-950"
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
