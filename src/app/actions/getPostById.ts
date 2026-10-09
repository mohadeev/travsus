import { db, T, must } from '@/lib/db'

export async function getPostById(id: string) {
	try {
		return must(await db.from(T.posts).select('*').eq('id', id).maybeSingle())
	} catch (error) {
		console.error('Error fetching blog post:', error)
		throw error
	}
}
