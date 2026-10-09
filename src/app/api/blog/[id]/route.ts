export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from 'next/server'
import extractLanguageFromRequest from '../../listing/get/getTourData/extractLanguageFromRequest'
import { db, T, must } from '@/lib/db'
import { POST_WITH_AUTHOR } from '@/app/actions/blogSelect'

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const lang = extractLanguageFromRequest(request)

		if (!params.id) {
			return NextResponse.json(
				{ error: 'Post ID is required' },
				{ status: 400 },
			)
		}

		const post: any = must(
			await db.from(T.posts).select(POST_WITH_AUTHOR).eq('id', params.id).maybeSingle(),
		)

		if (!post) {
			return NextResponse.json({ error: 'Post not found' }, { status: 404 })
		}
		const langPost = (post.translations ?? []).find(
			({ language }: any) => lang === language,
		)
		return NextResponse.json({ ...post, ...langPost })
	} catch (error) {
		console.error('Error fetching blog post:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch blog post' },
			{ status: 500 },
		)
	}
}
