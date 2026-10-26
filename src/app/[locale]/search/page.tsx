// /search: tour results with filters. Built on the server from the URL, so it
// loads fast, every filter is a link, and search engines can read it.
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpDown, Check, ChevronDown, Search, SearchX, SlidersHorizontal } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getHomeData } from '@/lib/homeData'
import { PRICE_STEPS, filtersHref, readFilters, searchTours, type SearchFilters } from '@/lib/searchTours'
import { formatCurrency } from '@/utils/formatCurrency'
import TourCard from '../(home)/TourCard'
import TourRow from '../(home)/TourRow'

// Results depend on the URL (?query=…&maxPrice=…), so the page is built per
// request, never at build time for every language.
export const dynamic = 'force-dynamic'

type PageProps = {
	params: { locale: string }
	searchParams: Record<string, string | string[] | undefined>
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
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

export default async function SearchPage({ params, searchParams }: PageProps) {
	setRequestLocale(params.locale)
	const t = await getTranslations('Search')
	const tHome = await getTranslations('Home')
	const filters = readFilters(searchParams)
	const [tours, { destinations }] = await Promise.all([
		searchTours(params.locale, filters),
		getHomeData(params.locale),
	])

	const groups: FilterGroup[] = [
		{
			title: t('duration'),
			options: [
				{ label: t('any'), href: filtersHref(filters, { duration: 'any' }), active: filters.duration === 'any' },
				{ label: t('one_day'), href: filtersHref(filters, { duration: '1' }), active: filters.duration === '1' },
				{ label: t('two_three'), href: filtersHref(filters, { duration: '2-3' }), active: filters.duration === '2-3' },
				{ label: t('four_plus'), href: filtersHref(filters, { duration: '4+' }), active: filters.duration === '4+' },
			],
		},
		{
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
			title: t('rating'),
			options: [
				{ label: t('any_rating'), href: filtersHref(filters, { rating: null }), active: !filters.rating },
				{ label: t('rating_min', { rating: '4.5' }), href: filtersHref(filters, { rating: 4.5 }), active: filters.rating === 4.5 },
				{ label: t('rating_min', { rating: '4' }), href: filtersHref(filters, { rating: 4 }), active: filters.rating === 4 },
			],
		},
	]
	const hasFilters = filtersHref(filters, { query: '', sort: null }) !== '/search?query='

	return (
		<main className="mx-auto max-w-7xl px-5 pb-24 pt-8 text-neutral-950 dark:text-white">
			{/* Search box: a new search starts with no filters */}
			<form action={`/${params.locale}/search`} method="get" role="search" className="flex max-w-2xl items-center gap-2 rounded-full border border-neutral-200 bg-white p-1.5 pl-5 focus-within:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-950">
				<Search className="h-5 w-5 shrink-0 text-neutral-500" />
				<label className="flex-1">
					<span className="sr-only">{tHome('search_label')}</span>
					<input
						type="search"
						name="query"
						defaultValue={filters.query}
						placeholder={tHome('search_placeholder')}
						className="w-full border-0 bg-transparent p-0 py-2 text-base placeholder:text-neutral-500 focus:outline-none focus:ring-0"
					/>
				</label>
				<button type="submit" className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950">
					{tHome('search_cta')}
				</button>
			</form>

			<div className="mt-8 flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
						{filters.query ? t('title_query', { query: filters.query }) : t('title_all')}
					</h1>
					<p className="mt-1 text-neutral-500">{t('count', { count: tours.length })}</p>
				</div>
				<SortMenu filters={filters} t={t} />
			</div>

			{/* Phones: filters as swipeable chips */}
			<div className="-mx-0 mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
				<span className="flex shrink-0 items-center gap-1.5 rounded-full bg-neutral-950 px-3.5 py-2 text-sm font-semibold text-white dark:bg-white dark:text-neutral-950">
					<SlidersHorizontal className="h-4 w-4" />
					{t('filters')}
				</span>
				{groups.flatMap((group) =>
					group.options.slice(1).map((option) => (
						<Link
							key={option.href}
							href={(option.active ? group.options[0].href : option.href) as any}
							className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
								option.active
									? 'border-neutral-950 bg-neutral-100 dark:border-white dark:bg-neutral-800'
									: 'border-neutral-200 hover:border-neutral-950 dark:border-neutral-800'
							}`}
						>
							{option.label}
						</Link>
					)),
				)}
			</div>

			<div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
				{/* Desktop: filter sidebar */}
				<aside className="hidden lg:block">
					<div className="sticky top-32 space-y-8">
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
							<Link href={filtersHref(filters, { duration: 'any', maxPrice: null, rating: null }) as any} className="inline-block text-sm font-semibold underline underline-offset-4">
								{t('clear')}
							</Link>
						)}
					</div>
				</aside>

				{/* Results */}
				<section aria-live="polite">
					{tours.length ? (
						<>
							{/* Phones: one row per tour, photo on the left */}
							<ul className="divide-y divide-neutral-200 sm:hidden dark:divide-neutral-800">
								{tours.map((tour) => (
									<li key={tour.id}>
										<TourRow tour={tour} />
									</li>
								))}
							</ul>
							<ul className="hidden gap-x-5 gap-y-10 sm:grid sm:grid-cols-2 xl:grid-cols-3">
								{tours.map((tour) => (
									<li key={tour.id}>
										<TourCard tour={tour} />
									</li>
								))}
							</ul>
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
								<Link href={filtersHref(filters, { duration: 'any', maxPrice: null, rating: null }) as any} className="mt-6 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-neutral-950">
									{t('clear')}
								</Link>
							)}
						</div>
					)}
				</section>
			</div>
		</main>
	)
}

type FilterGroup = {
	title: string
	options: { label: string; href: string; active: boolean }[]
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
