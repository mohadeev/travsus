export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { db, T, must } from '@/lib/db'
import { POST_WITH_AUTHOR } from '@/app/actions/blogSelect'

export async function GET(request: NextRequest) {
	const id = request.nextUrl.searchParams.get('id')

	if (!id) {
		return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
	}

	try {
		const post = must(
			await db.from(T.posts).select(POST_WITH_AUTHOR).eq('id', id).maybeSingle(),
		)
		if (!post) {
			return NextResponse.json({ error: 'Post not found' }, { status: 404 })
		}

		return NextResponse.json(post)
	} catch (error) {
		console.error('Error fetching post:', error)
		return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
	}
}
