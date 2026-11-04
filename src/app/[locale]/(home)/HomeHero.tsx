// TripAdvisor-style hero, plain and fast: a big "Where to?" in the visitor's
// language, category tabs (each one a search), and one large search bar.
// No animation: it's on screen and readable at once, and fully server-rendered.
import Link from 'next/link'
import { CalendarDays, Clock3, House, Mountain, Search, Tent, Waves, type LucideIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

export default function HomeHero() {
	const t = useTranslations('Home')
	const tNav = useTranslations('Nav')
	const tSeo = useTranslations('HomeSeo')
	const locale = useLocale()

	const tabs: [LucideIcon, string, string][] = [
		[House, tNav('all_tours'), '/search?query='],
		[Tent, t('interest_desert'), '/search?query=desert'],
		[Clock3, t('interest_day_trips'), '/search?query=&duration=1'],
		[CalendarDays, t('interest_multi_day'), '/search?query=&duration=4%2B'],
		[Mountain, t('interest_mountains'), '/search?query=atlas'],
		[Waves, t('interest_coast'), '/search?query=coast'],
	]

	return (
		<section className="mx-auto max-w-4xl px-5 pb-8 pt-8 text-center sm:pb-12 sm:pt-14">
			{/* The page's main heading says what we offer (for search engines and screen readers) */}
			<h1 className="sr-only">{tSeo('h1')}</h1>
			<p aria-hidden className="headline text-[40px] !leading-none !tracking-[-0.04em] sm:text-[64px]">
				{t('where_to')}
			</p>

			{/* Categories, like TripAdvisor's tabs: the first is the plain search */}
			<nav aria-label={t('interests_title')} className="-mx-5 mt-7 overflow-x-auto px-5 [scrollbar-width:none] sm:mt-10 [&::-webkit-scrollbar]:hidden">
				<ul className="mx-auto flex w-max gap-1 sm:gap-2">
					{tabs.map(([Icon, label, href], i) => (
						<li key={href}>
							<Link
								href={href as any}
								className={`flex items-center gap-2 border-b-2 px-3 pb-3 pt-1 text-[15px] font-semibold transition sm:px-4 ${
									i === 0
										? 'border-neutral-950 text-neutral-950 dark:border-white dark:text-white'
										: 'border-transparent text-neutral-600 hover:border-neutral-300 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
								}`}
							>
								<Icon className="h-5 w-5 shrink-0" strokeWidth={1.9} aria-hidden />
								{label}
							</Link>
						</li>
					))}
				</ul>
			</nav>

			{/* Plain form: works before JavaScript loads */}
			<form
				action={`/${locale}/search`}
				method="get"
				role="search"
				className="mx-auto mt-5 flex max-w-3xl items-center gap-2 rounded-full border border-neutral-200 bg-white p-2 pl-5 text-neutral-950 shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition focus-within:shadow-[0_6px_28px_rgba(0,0,0,0.18)] sm:mt-6 sm:pl-7 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
			>
				<Search className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2.2} aria-hidden />
				<label className="min-w-0 flex-1 text-left">
					<span className="sr-only">{t('search_label')}</span>
					<input
						type="search"
						name="query"
						placeholder={t('search_placeholder')}
						className="w-full border-0 bg-transparent p-0 py-3 text-base font-medium placeholder:font-normal placeholder:text-neutral-500 focus:outline-none focus:ring-0 sm:py-4 sm:text-lg"
					/>
				</label>
				<button
					type="submit"
					className="shrink-0 rounded-full bg-neutral-950 px-6 py-3 text-[15px] font-bold text-white transition hover:bg-neutral-800 active:scale-95 sm:px-9 sm:py-4 sm:text-base dark:bg-white dark:text-neutral-950"
				>
					{t('search_cta')}
				</button>
			</form>
		</section>
	)
}
