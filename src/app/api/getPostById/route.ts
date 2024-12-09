import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const id = searchParams.get('id')

	if (!id) {
		return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
	}

	try {
		const post = await prisma.post.findUnique({
			where: { id },
			include: {
				author: true,
			},
		})
		console.log('post:', post)
		if (!post) {
			return NextResponse.json({ error: 'Post not found' }, { status: 404 })
		}

		return NextResponse.json(post)
	} catch (error) {
		console.error('Error fetching post:', error)
		return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
	}
}
