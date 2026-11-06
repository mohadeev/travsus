// Forum moderation: every post and comment (including the ones hidden from
// readers), flagged when they look like a scam, an illegal offer or
// advertising, with a Delete button for each.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db, T } from '@/lib/db'
import { isOwner } from '@/lib/admin/owner'
import { flagReasons } from '@/lib/forumModeration'
import ForumPanel, { type AdminPost } from './ForumPanel'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Forum | TRAVSUS', robots: { index: false, follow: false } }

const AUTHOR = `author:${T.users}!authorId(id, username, email, accountData)`
const name = (u: any) => [u?.accountData?.firstname, u?.accountData?.lastname].filter(Boolean).join(' ') || u?.username || 'Unknown'

export default async function AdminForumPage() {
	if (!(await isOwner())) notFound()
	const { data, error } = await db
		.from(T.forumPosts)
		.select(`id, title, content, category, createdAt, ${AUTHOR}, comments:${T.forumComments}(id, content, createdAt, ${AUTHOR})`)
		.order('createdAt', { ascending: false })
		.limit(500)

	const posts: AdminPost[] = ((data ?? []) as any[]).map((row) => ({
		id: row.id,
		title: row.title ?? '',
		content: row.content ?? '',
		category: row.category ?? '',
		createdAt: row.createdAt,
		author: name(row.author),
		authorEmail: row.author?.email ?? '',
		flags: flagReasons(row),
		comments: (row.comments ?? []).map((c: any) => ({
			id: c.id,
			content: c.content ?? '',
			createdAt: c.createdAt,
			author: name(c.author),
			flags: flagReasons({ content: c.content }),
		})),
	}))

	return <ForumPanel initial={posts} loadError={error ? 'Could not load the forum.' : ''} />
}
