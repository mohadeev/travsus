import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const id = params.id

		if (!id) {
			return NextResponse.json(
				{ error: 'Post ID is required' },
				{ status: 400 },
			)
		}

		const post = await prisma.post.findUnique({
			where: { id },
			include: {
				author: {
					select: {
						id: true,
						name: true,
						email: true,
						username: true,
						accountData: true,
					},
				},
			},
		})

		if (!post) {
			return NextResponse.json({ error: 'Post not found' }, { status: 404 })
		}

		return NextResponse.json(post)
	} catch (error) {
		console.error('Error fetching blog post:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch blog post' },
			{ status: 500 },
		)
	}
}
