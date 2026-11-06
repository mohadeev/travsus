// Home hero, TripAdvisor layout: a big centered "Where to?" in the visitor's
// language, TripAdvisor's six tabs (only "Things to Do" is available) and one
// large pill search bar. Server-rendered, no motion.
import Link from 'next/link'
import { BedDouble, Building2, House, Plane, Search, Ticket, UtensilsCrossed, type LucideIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import TabsRow from './TabsRow'

export default function HomeHero() {
	const t = useTranslations('Home')
	const tNav = useTranslations('Nav')
	const tSeo = useTranslations('HomeSeo')
	const locale = useLocale()

	// TripAdvisor's tabs. TRAVSUS offers things to do only: that tab comes first
	// and is the active one (black, underlined, opens all tours); the others
	// are shown greyed out and can't be clicked.
	const tabs: [LucideIcon, string, boolean][] = [
		[Ticket, t('tab_things'), true],
		[House, t('tab_all'), false],
		[BedDouble, t('tab_hotels'), false],
		[UtensilsCrossed, t('tab_restaurants'), false],
		[Plane, t('tab_flights'), false],
		[Building2, t('tab_rentals'), false],
	]

	return (
		<section className="mx-auto max-w-7xl px-4 pb-6 pt-7 text-center sm:px-5 sm:pb-10 sm:pt-12">
			{/* The page's main heading says what we offer (search engines, screen readers) */}
			<h1 className="sr-only">{tSeo('h1')}</h1>
			<p aria-hidden className="headline text-[44px] !leading-[0.98] !tracking-[-0.045em] sm:text-[72px]">
				{t('where_to_next')}
			</p>

			<TabsRow label={t('interests_title')}>
				<ul className="mx-auto flex w-max gap-2">
					{tabs.map(([Icon, label, available]) => (
						<li key={label}>
							{available ? (
								<Link
									href={'/search?query=' as any}
									aria-current="page"
									className="flex items-center gap-2 whitespace-nowrap border-b-2 border-black px-2.5 pb-2.5 pt-1.5 text-base font-bold text-black dark:border-white dark:text-white"
								>
									<Icon className="h-6 w-6 shrink-0" strokeWidth={1.8} aria-hidden />
									{label}
								</Link>
							) : (
								<span
									aria-disabled="true"
									className="flex cursor-not-allowed select-none items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-2.5 pb-2.5 pt-1.5 text-base font-bold text-neutral-300 dark:text-neutral-600"
								>
									<Icon className="h-6 w-6 shrink-0" strokeWidth={1.8} aria-hidden />
									{label}
								</span>
							)}
						</li>
					))}
				</ul>
			</TabsRow>

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
