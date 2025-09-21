import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import extractLanguageFromRequest from '../../listing/get/getTourData/extractLanguageFromRequest'

const prisma = new PrismaClient()

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const lang = extractLanguageFromRequest(request)

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
				translations: true,
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
		const langPost = post.translations.find(({ language }) => lang === language)
		return NextResponse.json({ ...post, ...langPost })
	} catch (error) {
		console.error('Error fetching blog post:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch blog post' },
			{ status: 500 },
		)
	}
}
