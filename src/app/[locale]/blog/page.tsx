// Blog: the latest article large, then the others in a grid, 12 per page.
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { listBlogPosts } from '@/lib/blog'
import PostCard from './PostCard'

const PER_PAGE = 12

type PageProps = { params: { locale: string }; searchParams: { page?: string } }

const pageOf = (value?: string) => Math.max(1, Math.floor(Number(value)) || 1)

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
	const t = await getTranslations({ locale: params.locale, namespace: 'Blog' })
	const page = pageOf(searchParams.page)
	const path = `/blog${page > 1 ? `?page=${page}` : ''}`
	return {
		title: `${t('meta_title')}${page > 1 ? ` – ${t('page', { page })}` : ''} | TRAVSUS`,
		description: t('meta_description'),
		alternates: {
			canonical: `/${params.locale}${path}`,
			languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
		},
	}
}

export default async function BlogPage({ params, searchParams }: PageProps) {
	const { locale } = params
	setRequestLocale(locale)
	const t = await getTranslations('Blog')
	const posts = await listBlogPosts(locale)

	const page = pageOf(searchParams.page)
	const pages = Math.max(1, Math.ceil(posts.length / PER_PAGE))
	if (page > pages) notFound()
	const shown = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE)
	// Page 1 opens with the latest article, large
	const featured = page === 1 ? shown[0] : null
	const rest = page === 1 ? shown.slice(1) : shown
	const pageHref = (n: number) => `/${locale}/blog${n > 1 ? `?page=${n}` : ''}`

	return (
		<main className="pb-16 text-neutral-950 sm:pb-24 dark:text-white [&_h1]:[text-wrap:balance] [&_h2]:[text-wrap:balance]">
			<section className="mx-auto max-w-7xl px-5 pt-12 text-center sm:pt-20">
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">{t('eyebrow')}</p>
				<h1 className="mx-auto mt-4 max-w-4xl text-[40px] font-bold leading-[1.04] tracking-tight sm:text-7xl">{t('hero_title')}</h1>
				<p className="mx-auto mt-5 max-w-2xl text-lg text-neutral-500 sm:text-2xl">{t('hero_text')}</p>
			</section>

			<div className="mx-auto mt-12 max-w-7xl px-5 sm:mt-20">
				{featured && <PostCard post={featured} featured />}

				{rest.length > 0 && (
					<ul className={`grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 ${featured ? 'mt-16 border-t border-neutral-200 pt-16 sm:mt-24 sm:pt-20 dark:border-neutral-800' : ''}`}>
						{rest.map((post) => (
							<li key={post.id}>
								<PostCard post={post} />
							</li>
						))}
					</ul>
				)}

				{pages > 1 && (
					<nav aria-label={t('pagination')} className="mt-16 flex items-center justify-center gap-3 sm:mt-24">
						{page > 1 && (
							<Link href={pageHref(page - 1) as any} rel="prev" className="inline-flex h-12 items-center gap-2 rounded-full border border-neutral-300 px-5 text-sm font-semibold transition hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white">
								<ArrowLeft className="h-4 w-4" />
								{t('newer')}
							</Link>
						)}
						<span className="px-2 text-sm text-neutral-500">{t('page_of', { page, pages })}</span>
						{page < pages && (
							<Link href={pageHref(page + 1) as any} rel="next" className="inline-flex h-12 items-center gap-2 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950">
								{t('older')}
								<ArrowRight className="h-4 w-4" />
							</Link>
						)}
					</nav>
				)}
			</div>
		</main>
	)
}
