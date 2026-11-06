// Forum moderation for the admin (owner only): DELETE a post (with all its
// comments) or a single comment (its replies stay, moved to the top level).
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, must } from '@/lib/db'
import { isOwner } from '@/lib/admin/owner'

export const dynamic = 'force-dynamic'

export async function DELETE(req: NextRequest) {
	if (!(await isOwner())) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const body = await req.json().catch(() => ({}))
	const id = typeof body.id === 'string' ? body.id : ''
	const type = body.type === 'comment' ? 'comment' : body.type === 'post' ? 'post' : ''
	if (!id || !type) return NextResponse.json({ error: 'Missing id or type' }, { status: 400 })

	try {
		if (type === 'comment') {
			must(await db.from(T.forumComments).update({ parentId: null }).eq('parentId', id))
			must(await db.from(T.forumComments).delete().eq('id', id))
		} else {
			// Comments first (replies detached), then the post
			must(await db.from(T.forumComments).update({ parentId: null }).eq('postId', id))
			must(await db.from(T.forumComments).delete().eq('postId', id))
			must(await db.from(T.forumPosts).delete().eq('id', id))
		}
		return NextResponse.json({ ok: true })
	} catch (error) {
		console.error('Admin forum delete failed:', error)
		return NextResponse.json({ error: 'Could not delete. Please try again.' }, { status: 500 })
	}
}
