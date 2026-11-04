// /search: tour results with filters. Built on the server from the URL, so it
// loads fast, every filter is a link, and search engines can read it.
//
// Laid out the way a traveler decides: what we offer and why to trust it
// (title, search, proof row), quick ways in (popular places), the tours with
// their filters, a person to ask when the choice is hard (after the 6th tour),
// then how booking works and the questions people ask before they book.
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpDown, BadgeCheck, CalendarCheck, Check, ChevronDown, Headphones, MessageCircle, Phone, Search, SearchX, ShieldCheck, SlidersHorizontal, X } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getHomeData, type HomeDestination } from '@/lib/homeData'
import { PRICE_STEPS, filtersHref, readFilters, searchTours, type SearchFilters } from '@/lib/searchTours'
import { formatCurrency } from '@/utils/formatCurrency'
import { SUPPORT_PHONE, SUPPORT_PHONE_TEL } from '@/constants/contact'
import TourCard from '../(home)/TourCard'
import TourRow from '../(home)/TourRow'
import HowItWorks from '../(home)/HowItWorks'
import HomeFaq from '../(home)/HomeFaq'
import HomeMotion from '../(home)/HomeMotion'
import styles from '../(home)/home.module.css'

// Results depend on the URL (?query=…&maxPrice=…), so the page is built per
// request, never at build time for every language.
export const dynamic = 'force-dynamic'

type PageProps = {
	params: Promise<{ locale: string }>
	searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const t = await getTranslations({ locale: params.locale, namespace: 'Search' })
	const filters = readFilters(searchParams)
	const filtered = !!filters.query || filtersHref(filters, { query: '' }) !== '/search?query='
	return {
		title: `${filters.query ? t('title_query', { query: filters.query }) : t('meta_title')} | TRAVSUS`,
		description: t('meta_description'),
		alternates: { canonical: `/${params.locale}/search` },
		// The plain list is indexable; every filtered variant points to it
		robots: filtered ? { index: false, follow: true } : undefined,
	}
}

export default async function SearchPage(props: PageProps) {
	const searchParams = await props.searchParams;
	const params = await props.params;
	setRequestLocale(params.locale)
	const t = await getTranslations('Search')
	const tHome = await getTranslations('Home')
	const tLanding = await getTranslations('Landing')
	const tTrust = await getTranslations('Trust')
	const filters = readFilters(searchParams)
	const [tours, { destinations, rating }] = await Promise.all([
		searchTours(params.locale, filters),
		getHomeData(params.locale),
	])

	const groups: FilterGroup[] = [
		{
			key: 'duration',
			title: t('duration'),
			options: [
				{ label: t('any'), href: filtersHref(filters, { duration: 'any' }), active: filters.duration === 'any' },
				{ label: t('one_day'), href: filtersHref(filters, { duration: '1' }), active: filters.duration === '1' },
				{ label: t('two_three'), href: filtersHref(filters, { duration: '2-3' }), active: filters.duration === '2-3' },
				{ label: t('four_plus'), href: filtersHref(filters, { duration: '4+' }), active: filters.duration === '4+' },
			],
		},
		{
			key: 'maxPrice',
			title: t('price'),
			options: [
				{ label: t('any_price'), href: filtersHref(filters, { maxPrice: null }), active: !filters.maxPrice },
				...PRICE_STEPS.map((step) => ({
					label: t('price_under', { price: formatCurrency(step) }),
					href: filtersHref(filters, { maxPrice: step }),
					active: filters.maxPrice === step,
				})),
			],
		},
		{
			key: 'rating',
			title: t('rating'),
			options: [
				{ label: t('any_rating'), href: filtersHref(filters, { rating: null }), active: !filters.rating },
				{ label: t('rating_min', { rating: '4.5' }), href: filtersHref(filters, { rating: 4.5 }), active: filters.rating === 4.5 },
				{ label: t('rating_min', { rating: '4' }), href: filtersHref(filters, { rating: 4 }), active: filters.rating === 4 },
			],
		},
	]
	// 24 tours at a time: a shorter list is easier to choose from, and
	// "Show more" (?page=2, a plain link) adds the next 24 below
	const PAGE_SIZE = 24
	const pageParam = Number(Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page)
	const page = Number.isInteger(pageParam) && pageParam > 1 ? pageParam : 1
	const shown = tours.slice(0, PAGE_SIZE * page)
	const moreHref = `${filtersHref(filters, {})}&page=${page + 1}`

	const hasFilters = filtersHref(filters, { query: '', sort: null }) !== '/search?query='
	const clearHref = filtersHref(filters, { duration: 'any', maxPrice: null, rating: null })

	// What is narrowing the list right now, each with a link that removes it
	const activeFilters = [
		filters.query ? { label: `“${filters.query}”`, href: filtersHref(filters, { query: '' }) } : null,
		...groups.map((group) => {
			const option = group.options.find((o, i) => i > 0 && o.active)
			return option ? { label: option.label, href: group.options[0].href } : null
		}),
	].filter((f) => f !== null)

	// Facts under the search, the same as on the home page: the real rating
	// (when there is one), then what protects the booking
	const proof = [
		rating.average && rating.count > 0
			? ([BadgeCheck, tLanding('proof_rating', { rating: rating.average.toFixed(1), count: rating.count })] as const)
			: null,
		[ShieldCheck, tTrust('cancel_title')] as const,
		[CalendarCheck, tLanding('proof_deposit')] as const,
		[Headphones, tTrust('help_title')] as const,
	].filter((item) => item !== null)

	// "Not sure which tour?" goes after the 6th tour, where choosing gets hard
	const HELP_AFTER = 6
	const help = (
		<HelpCard
			title={t('help_title')}
			text={t('help_text')}
			whatsapp={t('help_whatsapp')}
			call={t('help_call')}
		/>
	)

	return (
		<>
			<HomeMotion />
			<main className="mx-auto max-w-7xl px-5 pb-16 pt-6 text-neutral-950 sm:pb-24 sm:pt-10 dark:text-white">
				{/* Compact on purpose: the tours start on the first screen. Desktop: title
				    on the left, search on the right. */}
				<header className={`${styles.heroIn} grid gap-4 lg:grid-cols-[1fr_minmax(0,460px)] lg:items-end lg:gap-12`}>
					<div>
						<h1 className="headline text-[28px] leading-[1.1] sm:text-[40px]">
							{filters.query ? t('title_query', { query: filters.query }) : t('title_all')}
						</h1>
						{!filters.query && <p className="mt-2 hidden max-w-2xl text-base text-neutral-600 sm:block dark:text-neutral-400">{tLanding('hero_sub')}</p>}
					</div>

					{/* Search box: a new search starts with no filters */}
					<form
						action={`/${params.locale}/search`}
						method="get"
						role="search"
						className="flex w-full items-center gap-2 rounded-full border border-neutral-200 bg-white p-1.5 pl-5 shadow-[0_6px_24px_rgba(0,0,0,0.07)] transition focus-within:border-neutral-950 focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-950"
					>
						<Search className="h-5 w-5 shrink-0 text-neutral-500" />
						<label className="min-w-0 flex-1">
							<span className="sr-only">{tHome('search_label')}</span>
							<input
								type="search"
								name="query"
								defaultValue={filters.query}
								placeholder={tHome('search_placeholder')}
								className="w-full border-0 bg-transparent p-0 py-2 text-base placeholder:text-neutral-500 focus:outline-none focus:ring-0"
							/>
						</label>
						<button type="submit" className="shrink-0 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950">
							{tHome('search_cta')}
						</button>
					</form>
				</header>

				{/* Phones: why to trust us, one thin line that scrolls sideways
				    (larger screens show it under the filters) */}
				<ul className="-mx-5 mt-3 flex gap-4 overflow-x-auto whitespace-nowrap px-5 text-xs font-medium text-neutral-600 [scrollbar-width:none] lg:hidden dark:text-neutral-400 [&::-webkit-scrollbar]:hidden">
					{proof.map(([Icon, label]) => (
						<li key={label} className="flex shrink-0 items-center gap-1">
							<Icon className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden />
							{label}
						</li>
					))}
				</ul>

				{/* Quick ways in: the places with the most tours */}
				{!filters.query && destinations.length > 1 && (
					<PopularPlaces title={t('popular_places')} destinations={destinations.slice(0, 8)} countLabel={(count) => tHome('tours_count', { count })} />
				)}

				{/* Count, what's filtering the list, sort */}
				<div className="mt-5 flex items-center justify-between gap-3 border-t border-neutral-200 pt-5 lg:mt-8 lg:pt-6 dark:border-neutral-800">
					<p className="text-base font-semibold sm:text-lg">{t('count', { count: tours.length })}</p>
					<SortMenu filters={filters} t={t} />
				</div>

				{activeFilters.length > 0 && (
					<ul className="mt-4 flex flex-wrap items-center gap-2">
						{activeFilters.map((filter) => (
							<li key={filter.href}>
								<Link
									href={filter.href as any}
									aria-label={t('remove_filter', { filter: filter.label })}
									className="flex items-center gap-1.5 rounded-full bg-neutral-100 py-1.5 pl-3.5 pr-2.5 text-sm font-medium transition hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
								>
									{filter.label}
									<X className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
								</Link>
							</li>
						))}
						{activeFilters.length > 1 && (
							<li>
								<Link href={'/search?query=' as any} className="px-2 text-sm font-semibold underline underline-offset-4">
									{t('clear')}
								</Link>
							</li>
						)}
					</ul>
				)}

				{/* Phones: filters as swipeable chips */}
				<div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
					<span className="flex shrink-0 items-center gap-1.5 rounded-full bg-neutral-950 px-3.5 py-2 text-sm font-semibold text-white dark:bg-white dark:text-neutral-950">
						<SlidersHorizontal className="h-4 w-4" />
						{t('filters')}
					</span>
					{groups.flatMap((group) =>
						group.options.slice(1).map((option) => (
							<Link
								key={option.href}
								href={(option.active ? group.options[0].href : option.href) as any}
								aria-current={option.active ? 'true' : undefined}
								className={`flex shrink-0 items-center gap-1 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
									option.active
										? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950'
										: 'border-neutral-200 hover:border-neutral-950 dark:border-neutral-800'
								}`}
							>
								{option.active && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />}
								{option.label}
							</Link>
						)),
					)}
				</div>

				<div className="mt-6 grid gap-10 lg:mt-8 lg:grid-cols-[220px_1fr]">
					{/* Desktop: filter sidebar */}
					<aside className="hidden lg:block">
						<div className="sticky top-28 space-y-8">
							{groups.map((group) => (
								<section key={group.title}>
									<h2 className="mb-3 text-sm font-semibold">{group.title}</h2>
									<ul className="space-y-1">
										{group.options.map((option) => (
											<li key={option.href}>
												<Link
													href={option.href as any}
													aria-current={option.active ? 'true' : undefined}
													className={`flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition hover:bg-neutral-100 dark:hover:bg-neutral-900 ${
														option.active ? 'font-semibold' : 'text-neutral-600 dark:text-neutral-400'
													}`}
												>
													<span
														className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border ${
															option.active
																? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950'
																: 'border-neutral-300 dark:border-neutral-700'
														}`}
													>
														{option.active && <Check className="h-3 w-3" strokeWidth={3} />}
													</span>
													{option.label}
												</Link>
											</li>
										))}
									</ul>
								</section>
							))}
							{hasFilters && (
								<Link href={clearHref as any} className="inline-block text-sm font-semibold underline underline-offset-4">
									{t('clear')}
								</Link>
							)}

							{/* Why to trust us, next to the tours */}
							<ul className="space-y-3 rounded-2xl bg-neutral-50 p-4 text-[13px] font-medium leading-snug text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
								{proof.map(([Icon, label]) => (
									<li key={label} className="flex items-center gap-2.5">
										<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white shadow-sm dark:bg-neutral-950">
											<Icon className="h-4 w-4 text-emerald-700 dark:text-emerald-400" aria-hidden />
										</span>
										{label}
									</li>
								))}
							</ul>
						</div>
					</aside>

					{/* Results */}
					<section aria-live="polite">
						{tours.length ? (
							<>
								{/* Phones: one row per tour, photo on the left */}
								<ul className="space-y-3 sm:hidden">
									{shown.flatMap((tour, i) => [
										<li key={tour.id}>
											<TourRow tour={tour} />
										</li>,
										i === HELP_AFTER - 1 && tours.length > HELP_AFTER ? <li key="help" className="py-3">{help}</li> : null,
									])}
								</ul>
								<ul className="hidden gap-x-5 gap-y-8 sm:grid sm:grid-cols-2 xl:grid-cols-3">
									{shown.flatMap((tour, i) => [
										<li key={tour.id}>
											<TourCard tour={tour} />
										</li>,
										i === HELP_AFTER - 1 && tours.length > HELP_AFTER ? (
											<li key="help" className="sm:col-span-2 xl:col-span-3">
												{help}
											</li>
										) : null,
									])}
								</ul>
								{shown.length < tours.length && (
									<div className="mt-10 flex flex-col items-center gap-3">
										<p className="text-sm text-neutral-500">{t('showing', { shown: shown.length, total: tours.length })}</p>
										<div aria-hidden className="h-1 w-48 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
											<div className="h-full rounded-full bg-neutral-950 dark:bg-white" style={{ width: `${(shown.length / tours.length) * 100}%` }} />
										</div>
										<Link href={moreHref as any} scroll={false} className="mt-2 rounded-full border border-neutral-950 px-6 py-3 text-sm font-semibold transition hover:bg-neutral-950 hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-neutral-950">
											{t('show_more')}
										</Link>
									</div>
								)}
								{/* Short lists: the help card closes the list instead */}
								{tours.length <= HELP_AFTER && <div className="mt-8">{help}</div>}
							</>
						) : (
							<div className="flex flex-col items-center rounded-3xl border border-dashed border-neutral-300 px-6 py-16 text-center dark:border-neutral-700">
								<SearchX className="h-10 w-10 text-neutral-400" strokeWidth={1.5} />
								<h2 className="mt-4 text-xl font-bold">{t('none_title')}</h2>
								<p className="mt-1 max-w-sm text-neutral-500">{t('none_text')}</p>
								<div className="mt-6 flex flex-wrap justify-center gap-2">
									{destinations.slice(0, 5).map((d) => (
										<Link key={d.city} href={`/search?query=${encodeURIComponent(d.city)}` as any} className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium hover:border-neutral-950 dark:border-neutral-800">
											{d.city}
										</Link>
									))}
								</div>
								{hasFilters && (
									<Link href={clearHref as any} className="mt-6 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-neutral-950">
										{t('clear')}
									</Link>
								)}
								<div className="mt-10 w-full text-left">{help}</div>
							</div>
						)}
					</section>
				</div>

				{/* Before booking: how it works and the usual questions */}
				<div className="mt-20 space-y-16 sm:mt-28 sm:space-y-28">
					<HowItWorks />
					<HomeFaq schema={false} />
				</div>
			</main>
		</>
	)
}

type FilterGroup = {
	key: string
	title: string
	options: { label: string; href: string; active: boolean }[]
}

/** Places with the most tours, as round photo chips that scroll sideways on phones. */
function PopularPlaces({ title, destinations, countLabel }: { title: string; destinations: HomeDestination[]; countLabel: (count: number) => string }) {
	return (
		<nav aria-label={title} className="mt-5 lg:mt-8">
			<h2 className="sr-only text-sm font-semibold text-neutral-500 lg:not-sr-only dark:text-neutral-400">{title}</h2>
			<ul className={`${styles.stagger} -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:mt-3 lg:flex-wrap lg:gap-2.5 lg:px-0 [&::-webkit-scrollbar]:hidden`}>
				{destinations.map((d) => (
					<li key={d.city} className="shrink-0">
						<Link
							href={`/search?query=${encodeURIComponent(d.city)}` as any}
							className="group flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-3.5 transition hover:-translate-y-0.5 hover:border-neutral-950 hover:shadow-md lg:gap-2.5 lg:py-1.5 lg:pl-1.5 lg:pr-4 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-white"
						>
							<span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-neutral-100 lg:h-9 lg:w-9 dark:bg-neutral-800">
								<Image src={d.image} alt="" fill sizes="36px" className="object-cover transition duration-500 group-hover:scale-110" />
							</span>
							<span className="leading-tight">
								<span className="block text-sm font-semibold">{d.city}</span>
								<span className="hidden text-xs text-neutral-500 lg:block">{countLabel(d.toursCount)}</span>
							</span>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	)
}

/** "Not sure which tour?": a real person on WhatsApp or the phone, 7 days a week. */
function HelpCard({ title, text, whatsapp, call }: { title: string; text: string; whatsapp: string; call: string }) {
	return (
		<aside className={`${styles.reveal} flex flex-col gap-5 rounded-3xl bg-neutral-950 p-6 text-white sm:p-8 md:flex-row md:items-center md:justify-between md:gap-10 dark:bg-neutral-900`}>
			<div className="flex gap-4">
				<span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/10">
					<Headphones className="h-6 w-6" aria-hidden />
				</span>
				<div>
					<h2 className="text-lg font-bold sm:text-xl">{title}</h2>
					<p className="mt-1 max-w-xl text-[15px] leading-relaxed text-white/75">{text}</p>
				</div>
			</div>
			<div className="flex shrink-0 flex-wrap gap-2.5">
				<a
					href={`https://wa.me/${SUPPORT_PHONE.replace(/\D/g, '')}`}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
				>
					<MessageCircle className="h-4 w-4" aria-hidden />
					{whatsapp}
				</a>
				<a href={SUPPORT_PHONE_TEL} className="flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold transition hover:border-white">
					<Phone className="h-4 w-4" aria-hidden />
					{call}
				</a>
			</div>
		</aside>
	)
}

/** Sort dropdown made of links (<details>): works without JavaScript. */
function SortMenu({ filters, t }: { filters: SearchFilters; t: (key: string) => string }) {
	const options: [SearchFilters['sort'], string][] = [
		['recommended', t('recommended')],
		['price_low', t('price_low')],
		['price_high', t('price_high')],
		['rating', t('best_rated')],
	]
	const current = options.find(([value]) => value === filters.sort)?.[1]

	return (
		<details className="group relative">
			<summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium hover:border-neutral-950 dark:border-neutral-800 [&::-webkit-details-marker]:hidden">
				<ArrowUpDown className="h-4 w-4" />
				<span className="text-neutral-500">{t('sort')}:</span> {current}
				<ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
			</summary>
			<ul className="absolute right-0 z-20 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-900">
				{options.map(([value, label]) => (
					<li key={value}>
						<Link
							href={filtersHref(filters, { sort: value }) as any}
							className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
						>
							{label}
							{value === filters.sort && <Check className="h-4 w-4" />}
						</Link>
					</li>
				))}
			</ul>
		</details>
	)
}
