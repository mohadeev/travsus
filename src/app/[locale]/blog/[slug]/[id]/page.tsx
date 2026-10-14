// One article: title, author, photo, the text, tags, related articles and
// a link to the tours. The address always uses the title in the page's
// language; other addresses (old titles, copies of the article) redirect.
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { cache } from 'react'
import { ArrowLeft, ArrowRight, PenLine } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { blogPath, getBlogPost } from '@/lib/blog'
import { PHOTOS } from '@/lib/photos'
import { getSessionUser } from '@/lib/session'
import PostCard from '../../PostCard'
import ShareButtons from './ShareButtons'

export const dynamic = 'force-dynamic'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.travsus.com').replace(/\/$/, '')

type PageProps = { params: { locale: string; slug: string; id: string } }

// Metadata and page share one database read
const load = cache((id: string, locale: string) => getBlogPost(id, locale))

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const found = await load(params.id, params.locale)
	if (!found || 'redirectTo' in found) return {}
	const { post, languages } = found
	// Not translated into this language: the English page is the original
	const canonical = languages[params.locale] ?? languages[routing.defaultLocale]
	const description = post.excerpt.slice(0, 160)
	const image = post.image || PHOTOS.sahara
	return {
		title: `${post.title} | TRAVSUS`,
		description,
		alternates: { canonical, languages: { ...languages, 'x-default': languages[routing.defaultLocale] } },
		openGraph: {
			type: 'article',
			title: post.title,
			description,
			url: canonical,
			publishedTime: post.createdAt,
			authors: [post.author.name],
			tags: post.tags,
			images: [{ url: image, alt: post.title }],
		},
		twitter: { card: 'summary_large_image', title: post.title, description, images: [image] },
	}
}

export default async function BlogPostPage({ params }: PageProps) {
	const { locale } = params
	setRequestLocale(locale)
	const [found, viewer] = await Promise.all([load(params.id, locale), getSessionUser().catch(() => null)])
	if (!found) notFound()
	if ('redirectTo' in found) permanentRedirect(found.redirectTo)

	const { post, related } = found
	const path = blogPath(locale, post.title, post.id)
	if (decodeURIComponent(params.slug) !== path.split('/')[3]) permanentRedirect(path)

	const t = await getTranslations('Blog')
	const date = new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(post.createdAt))
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		image: [post.image || PHOTOS.sahara],
		datePublished: post.createdAt,
		inLanguage: post.translated ? locale : routing.defaultLocale,
		mainEntityOfPage: `${SITE_URL}${path}`,
		keywords: post.tags.join(', '),
		author: { '@type': 'Person', name: post.author.name },
		publisher: { '@type': 'Organization', name: 'TRAVSUS', url: SITE_URL },
	}

	return (
		<main className="pb-16 text-neutral-950 sm:pb-24 dark:text-white [&_h1]:[text-wrap:balance] [&_h2]:[text-wrap:balance]">
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

			<article>
				<header className="mx-auto max-w-3xl px-5 pt-8 sm:pt-14">
					<div className="flex items-center justify-between gap-4">
						<Link href={`/${locale}/blog` as any} className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 transition hover:text-neutral-950 dark:hover:text-white">
							<ArrowLeft className="h-4 w-4" />
							{t('back')}
						</Link>
						{viewer?.id && viewer.id === post.authorId && (
							<Link href={`/${locale}/editor?id=${post.id}` as any} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:border-neutral-950 dark:border-neutral-700">
								<PenLine className="h-4 w-4" />
								{t('edit')}
							</Link>
						)}
					</div>

					{post.tags[0] && <p className="mt-10 text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">{post.tags[0]}</p>}
					<h1 className="mt-3 text-[34px] font-bold leading-[1.1] tracking-tight sm:text-6xl">{post.title}</h1>
					{post.excerpt && <p className="mt-5 text-lg leading-relaxed text-neutral-500 sm:text-2xl">{post.excerpt}</p>}

					<div className="mt-8 flex flex-col gap-5 border-y border-neutral-200 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
						<div className="flex items-center gap-3">
							{post.author.image ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img src={post.author.image} alt="" className="h-11 w-11 rounded-full object-cover" />
							) : (
								<span className="grid h-11 w-11 place-items-center rounded-full bg-neutral-950 font-semibold text-white dark:bg-white dark:text-neutral-950">
									{post.author.name.charAt(0).toUpperCase()}
								</span>
							)}
							<div className="text-sm">
								<p className="font-semibold">{post.author.name}</p>
								<p className="text-neutral-500">
									<time dateTime={post.createdAt}>{date}</time> · {t('read_time', { minutes: post.readMinutes })}
								</p>
							</div>
						</div>
						<ShareButtons title={post.title} />
					</div>
					{!post.translated && <p className="mt-5 rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">{t('not_translated')}</p>}
				</header>

				<div className="relative mx-auto mt-10 aspect-[16/9] max-w-5xl overflow-hidden bg-neutral-100 sm:mt-14 sm:rounded-[36px] dark:bg-neutral-900">
					<Image src={post.image || PHOTOS.sahara} alt={post.title} fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
				</div>

				<div
					lang={post.translated ? locale : routing.defaultLocale}
					className="prose prose-lg prose-neutral mx-auto mt-10 max-w-3xl px-5 sm:mt-14 dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-3xl prose-h3:text-2xl prose-a:font-semibold prose-a:text-neutral-950 prose-a:underline-offset-4 prose-img:rounded-3xl prose-li:my-1 dark:prose-a:text-white"
					dangerouslySetInnerHTML={{ __html: post.content }}
				/>

				{post.tags.length > 0 && (
					<ul className="mx-auto mt-12 flex max-w-3xl flex-wrap gap-2 px-5" aria-label={t('tags')}>
						{post.tags.map((tag) => (
							<li key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
								{tag}
							</li>
						))}
					</ul>
				)}
			</article>

			{/* From reading to booking */}
			<section className="mx-auto mt-20 max-w-7xl px-5 sm:mt-28">
				<div className="relative isolate overflow-hidden rounded-[28px] bg-neutral-950 px-6 py-14 text-center text-white sm:rounded-[40px] sm:py-20">
					<Image src={PHOTOS.sahara} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-40" />
					<h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">{t('tours_title')}</h2>
					<p className="mx-auto mt-3 max-w-xl text-white/75 sm:text-lg">{t('tours_text')}</p>
					<Link href={`/${locale}/search?query=` as any} className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200">
						{t('tours_cta')}
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			</section>

			{related.length > 0 && (
				<section className="mx-auto mt-20 max-w-7xl px-5 sm:mt-28">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('related_title')}</h2>
					<ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
						{related.map((r) => (
							<li key={r.id}>
								<PostCard post={r} />
							</li>
						))}
					</ul>
				</section>
			)}
		</main>
	)
}
