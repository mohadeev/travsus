// Home hero, TripAdvisor layout: a big centered "Where to?" in the visitor's
// language, category tabs with icons (each opens that search; the first is
// the plain search) and one large pill search bar. Server-rendered, no motion.
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
		<section className="mx-auto max-w-7xl px-4 pb-6 pt-7 text-center sm:px-5 sm:pb-10 sm:pt-12">
			{/* The page's main heading says what we offer (search engines, screen readers) */}
			<h1 className="sr-only">{tSeo('h1')}</h1>
			<p aria-hidden className="headline text-[40px] !font-black !leading-[1.1] !tracking-[-0.02em] sm:text-[56px]">
				{t('where_to')}
			</p>

			<nav aria-label={t('interests_title')} className="-mx-4 mt-6 overflow-x-auto px-4 [scrollbar-width:none] sm:mt-8 [&::-webkit-scrollbar]:hidden">
				<ul className="mx-auto flex w-max gap-2">
					{tabs.map(([Icon, label, href], i) => (
						<li key={href}>
							<Link
								href={href as any}
								className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-2.5 pb-2.5 pt-1.5 text-base font-bold text-black transition dark:text-white ${
									i === 0 ? 'border-black dark:border-white' : 'border-transparent hover:border-neutral-300'
								}`}
							>
								<Icon className="h-6 w-6 shrink-0" strokeWidth={1.8} aria-hidden />
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
				className="mx-auto mt-5 flex max-w-[780px] items-center gap-2 rounded-full border border-neutral-200 bg-white py-1.5 pl-4 pr-1.5 text-black shadow-[0_4px_16px_rgba(0,0,0,0.14)] sm:mt-[22px] sm:py-2 sm:pl-[22px] sm:pr-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
			>
				<Search className="h-6 w-6 shrink-0" strokeWidth={2.2} aria-hidden />
				<label className="min-w-0 flex-1 text-left">
					<span className="sr-only">{t('search_label')}</span>
					<input
						type="search"
						name="query"
						placeholder={t('search_placeholder')}
						className="w-full border-0 bg-transparent p-0 px-0.5 py-2.5 text-base placeholder:text-neutral-500 focus:outline-none focus:ring-0 sm:px-1 sm:py-3 sm:text-lg"
					/>
				</label>
				<button
					type="submit"
					className="shrink-0 rounded-full bg-black px-4 py-3 text-base font-bold leading-none text-white transition hover:bg-neutral-800 sm:px-[26px] sm:py-[15px] dark:bg-white dark:text-black"
				>
					{t('search_cta')}
				</button>
			</form>
		</section>
	)
}
