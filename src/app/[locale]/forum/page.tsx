// Travel forum: search, categories and the latest discussions. Rendered on
// the server so every discussion is a real, indexable link.
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, MessageCircle, Search } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { forumCategoryCounts, listForumPosts } from '@/lib/forum'
import Avatar from './Avatar'
import NewDiscussion from './NewDiscussion'
import { FORUM_CATEGORIES, forumCategory } from './categories'

export const dynamic = 'force-dynamic'

type PageProps = {
	params: { locale: string }
	searchParams: { q?: string; category?: string; postId?: string }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
	const t = await getTranslations({ locale: params.locale, namespace: 'Forum' })
	const filtered = !!(searchParams.q || searchParams.category)
	return {
		title: `${t('meta_title')} | TRAVSUS`,
		description: t('meta_description'),
		alternates: {
			canonical: `/${params.locale}/forum`,
			languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/forum`])),
		},
		// Search results and category views point to the main list
		robots: filtered ? { index: false, follow: true } : undefined,
	}
}

export default async function ForumPage({ params, searchParams }: PageProps) {
	const { locale } = params
	// Old links: /forum?postId=…
	if (searchParams.postId) redirect(`/${locale}/forum/${encodeURIComponent(searchParams.postId)}`)

	setRequestLocale(locale)
	const t = await getTranslations('Forum')
	const tOld = await getTranslations('Jan03_Forum_x8k2')
	const query = (searchParams.q ?? '').trim()
	const active = forumCategory(searchParams.category)?.key ?? ''
	const [posts, counts] = await Promise.all([
		listForumPosts({ query, category: active }),
		forumCategoryCounts(),
	])
	const total = Object.values(counts).reduce((a, b) => a + b, 0)
	const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
	// Forum address with a category and search words
	const href = (category: string, q = query) => {
		const p = new URLSearchParams()
		if (q) p.set('q', q)
		if (category) p.set('category', category)
		const s = p.toString()
		return `/${locale}/forum${s ? `?${s}` : ''}`
	}

	return (
		<main className="pb-16 text-neutral-950 sm:pb-24 dark:text-white [&_h1]:[text-wrap:balance] [&_h2]:[text-wrap:balance]">
			{/* Hero: one idea, search, one action */}
			<section className="mx-auto max-w-7xl px-5 pt-12 text-center sm:pt-20">
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">{t('eyebrow')}</p>
				<h1 className="mx-auto mt-4 max-w-4xl text-[40px] font-bold leading-[1.04] tracking-tight sm:text-7xl">
					{t('hero_title')}
				</h1>
				<p className="mx-auto mt-5 max-w-2xl text-lg text-neutral-500 sm:text-2xl">{t('hero_text')}</p>

				<div className="mx-auto mt-8 flex max-w-2xl flex-col gap-2.5 sm:mt-10 sm:flex-row">
					<form action={`/${locale}/forum`} method="get" role="search" className="relative flex-1">
						{active && <input type="hidden" name="category" value={active} />}
						<Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
						<label className="sr-only" htmlFor="forum-search">
							{tOld('Search_Discussions')}
						</label>
						<input
							id="forum-search"
							type="search"
							name="q"
							defaultValue={query}
							placeholder={tOld('Search_Discussions')}
							className="h-12 w-full rounded-full border-0 bg-neutral-100 pl-12 pr-5 text-base ring-1 ring-transparent transition placeholder:text-neutral-500 focus:bg-white focus:outline-none focus:ring-neutral-950 dark:bg-neutral-900 dark:focus:ring-white"
						/>
					</form>
					<NewDiscussion category={active} />
				</div>
			</section>

			{/* Categories: swipe on phones */}
			<nav aria-label={tOld('Categories_Title')} className="mx-auto mt-12 max-w-4xl px-5 sm:mt-16">
				<ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
					{[{ key: '', name: null, icon: MessageCircle }, ...FORUM_CATEGORIES].map(({ key, name, icon: Icon }) => {
						const selected = key === active
						const count = key ? counts[key] ?? 0 : total
						return (
							<li key={key || 'all'} className="shrink-0">
								<Link
									href={href(key) as any}
									aria-current={selected ? 'page' : undefined}
									className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
										selected
											? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
											: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
									}`}
								>
									<Icon className="h-4 w-4" />
									{name ? tOld(name) : t('all')}
									<span className={`tabular-nums ${selected ? 'opacity-60' : 'text-neutral-400'}`}>{count}</span>
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>

			{/* Discussions */}
			<section className="mx-auto mt-10 max-w-4xl px-5 sm:mt-14">
				<div className="flex items-baseline justify-between gap-4 border-b border-neutral-200 pb-4 dark:border-neutral-800">
					<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
						{active ? tOld(forumCategory(active)!.name) : tOld('Recent_Discussions_Title')}
					</h2>
					<p className="shrink-0 text-sm text-neutral-500">
						{t('results', { count: posts.length })}
						{query && ` ${t('results_for', { query })}`}
					</p>
				</div>

				{posts.length === 0 ? (
					<div className="mt-8 rounded-[28px] bg-neutral-100 px-6 py-14 text-center sm:py-20 dark:bg-neutral-900">
						<MessageCircle className="mx-auto h-10 w-10 text-neutral-400" strokeWidth={1.5} />
						<p className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">{t(query ? 'empty_search_title' : 'empty_title')}</p>
						<p className="mx-auto mt-2 max-w-md text-neutral-500">{t(query ? 'empty_search_text' : 'empty_text')}</p>
						<div className="mt-7 flex flex-wrap justify-center gap-3">
							{query ? (
								<Link
									href={href(active, '') as any}
									className="inline-flex h-12 items-center rounded-full border border-neutral-300 px-6 text-sm font-semibold transition hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white"
								>
									{t('clear_search')}
								</Link>
							) : (
								<NewDiscussion category={active} />
							)}
						</div>
					</div>
				) : (
					<ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
						{posts.map((post) => {
							const category = forumCategory(post.category)
							return (
								<li key={post.id}>
									<Link href={`/${locale}/forum/${post.id}` as any} className="group flex gap-4 py-6">
										<Avatar author={post.author} />
										<div className="min-w-0 flex-1">
											<h3 className="text-lg font-semibold leading-snug group-hover:underline">{post.title}</h3>
											{post.excerpt && <p className="mt-1 line-clamp-2 text-neutral-500">{post.excerpt}</p>}
											<p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-500">
												{category && (
													<span className="rounded-full bg-neutral-100 px-2.5 py-0.5 font-medium text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
														{tOld(category.name)}
													</span>
												)}
												<span>{post.author.name || t('anonymous')}</span>
												<span>{date.format(new Date(post.createdAt))}</span>
												<span className="inline-flex items-center gap-1">
													<MessageCircle className="h-4 w-4" />
													{post.comments}
												</span>
											</p>
										</div>
										<ArrowRight className="mt-1 hidden h-5 w-5 shrink-0 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-950 sm:block dark:group-hover:text-white" />
									</Link>
								</li>
							)
						})}
					</ul>
				)}
			</section>
		</main>
	)
}
