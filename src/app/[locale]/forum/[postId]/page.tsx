// One discussion: the question, its tags and the comment thread.
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { ArrowLeft } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getForumPost } from '@/lib/forum'
import { getSessionUser } from '@/lib/session'
import Avatar from '../Avatar'
import CommentThread from '../CommentThread'
import { forumCategory } from '../categories'

export const dynamic = 'force-dynamic'

type PageProps = { params: { locale: string; postId: string } }

// Metadata and page share one database read
const load = cache((id: string) => getForumPost(id))

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const post = await load(params.postId)
	if (!post) return {}
	const description = post.content.replace(/\s+/g, ' ').slice(0, 155)
	return {
		title: `${post.title} | TRAVSUS Forum`,
		description,
		alternates: { canonical: `/${params.locale}/forum/${post.id}` },
		openGraph: { title: post.title, description, type: 'article' },
	}
}

export default async function ForumPostPage({ params }: PageProps) {
	const { locale } = params
	setRequestLocale(locale)
	const [post, viewer] = await Promise.all([load(params.postId), getSessionUser().catch(() => null)])
	if (!post) notFound()

	const t = await getTranslations('Forum')
	const tOld = await getTranslations('Jan03_Forum_x8k2')
	const category = forumCategory(post.category)
	const date = new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(post.createdAt))

	// Discussion rich results
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'DiscussionForumPosting',
		headline: post.title,
		text: post.content,
		datePublished: post.createdAt,
		author: { '@type': 'Person', name: post.author.name || 'TRAVSUS traveller' },
		interactionStatistic: { '@type': 'InteractionCounter', interactionType: 'https://schema.org/CommentAction', userInteractionCount: post.comments },
		comment: post.commentList.slice(0, 20).map((c) => ({
			'@type': 'Comment',
			text: c.content,
			datePublished: c.createdAt,
			author: { '@type': 'Person', name: c.author.name || 'TRAVSUS traveller' },
		})),
	}

	return (
		<main className="mx-auto max-w-3xl px-5 pb-16 pt-8 text-neutral-950 sm:pb-24 sm:pt-12 dark:text-white [&_h1]:[text-wrap:balance]">
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

			<Link
				href={`/${locale}/forum${category ? `?category=${category.key}` : ''}` as any}
				className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 transition hover:text-neutral-950 dark:hover:text-white"
			>
				<ArrowLeft className="h-4 w-4" />
				{category ? tOld(category.name) : t('back')}
			</Link>

			<article className="mt-6">
				<h1 className="text-[32px] font-bold leading-tight tracking-tight sm:text-5xl">{post.title}</h1>
				<div className="mt-6 flex items-center gap-3">
					<Avatar author={post.author} size={44} />
					<div className="text-sm">
						<p className="font-semibold">{post.author.name || t('anonymous')}</p>
						<p className="text-neutral-500">{date}</p>
					</div>
				</div>
				<div className="mt-8 whitespace-pre-line break-words text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
					{post.content}
				</div>
				{post.tags.length > 0 && (
					<ul className="mt-8 flex flex-wrap gap-2">
						{post.tags.map((tag) => (
							<li key={tag}>
								<Link
									href={`/${locale}/forum?q=${encodeURIComponent(tag)}` as any}
									className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-300"
								>
									#{tag}
								</Link>
							</li>
						))}
					</ul>
				)}
			</article>

			<CommentThread postId={post.id} initial={post.commentList} viewerId={viewer?.id ?? null} />
		</main>
	)
}
