// Forum data for the server pages: the discussion list, one discussion with
// its comments, and post counts per category.
import 'server-only'
import { db, T, must, fetchAll } from '@/lib/db'

const AUTHOR = `author:${T.users}!authorId(id, username, profileImage, accountData)`

export type ForumAuthor = { id: string; name: string; image: string | null }
export type ForumComment = {
	id: string
	content: string
	parentId: string | null
	createdAt: string
	likedByIds: string[]
	author: ForumAuthor
}
export type ForumPostSummary = {
	id: string
	title: string
	excerpt: string
	tags: string[]
	category: string
	createdAt: string
	author: ForumAuthor
	comments: number
}
export type ForumPost = ForumPostSummary & { content: string; commentList: ForumComment[] }

/** Display name and photo of a users row. */
export const toAuthor = (user: any): ForumAuthor => ({
	id: user?.id ?? '',
	name: user?.accountData?.firstname || user?.username || '',
	image: user?.profileImage?.url || null,
})

/** Search words, safe inside a PostgREST or() filter. */
const searchTerm = (query: string) => query.replace(/[,()%*\\]/g, ' ').trim().slice(0, 80)

export async function listForumPosts({ query = '', category = '' } = {}): Promise<ForumPostSummary[]> {
	let request = db
		.from(T.forumPosts)
		.select(`id, title, excerpt, tags, category, createdAt, ${AUTHOR}, comments:${T.forumComments}(count)`)
		.order('createdAt', { ascending: false })
		.limit(60)
	if (category) request = request.eq('category', category)
	const term = searchTerm(query)
	if (term) request = request.or(`title.ilike.%${term}%,content.ilike.%${term}%`)

	const rows = (must(await request) ?? []) as any[]
	return rows.map((row) => ({
		id: row.id,
		title: row.title,
		excerpt: row.excerpt ?? '',
		tags: (row.tags ?? []).filter(Boolean),
		category: row.category,
		createdAt: row.createdAt,
		author: toAuthor(row.author),
		comments: row.comments?.[0]?.count ?? 0,
	}))
}

export async function getForumPost(id: string): Promise<ForumPost | null> {
	const row: any = must(
		await db
			.from(T.forumPosts)
			.select(`*, ${AUTHOR}, comments:${T.forumComments}(id, content, parentId, createdAt, likedByIds, ${AUTHOR})`)
			.eq('id', id)
			.order('createdAt', { referencedTable: 'comments', ascending: true })
			.maybeSingle(),
	)
	if (!row) return null
	const commentList: ForumComment[] = (row.comments ?? []).map((c: any) => ({
		id: c.id,
		content: c.content,
		parentId: c.parentId,
		createdAt: c.createdAt,
		likedByIds: c.likedByIds ?? [],
		author: toAuthor(c.author),
	}))
	return {
		id: row.id,
		title: row.title,
		content: row.content ?? '',
		excerpt: row.excerpt ?? '',
		tags: (row.tags ?? []).filter(Boolean),
		category: row.category,
		createdAt: row.createdAt,
		author: toAuthor(row.author),
		comments: commentList.length,
		commentList,
	}
}

/** { [category key]: number of posts } */
export async function forumCategoryCounts(): Promise<Record<string, number>> {
	const rows = await fetchAll<{ category: string }>(() => db.from(T.forumPosts).select('category').order('id'))
	const counts: Record<string, number> = {}
	for (const { category } of rows) counts[category] = (counts[category] ?? 0) + 1
	return counts
}
