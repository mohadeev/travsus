import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
	try {
		const json = await request.json()
		const { title, content, excerpt, tags } = json

		// Check for duplicate title
		const existingPost = await prisma.post.findFirst({
			where: {
				title: {
					equals: title,
					mode: 'insensitive', // Case-insensitive comparison
				},
			},
		})

		if (existingPost) {
			return NextResponse.json(
				{ error: 'A post with this title already exists' },
				{ status: 409 },
			)
		}

		// Create new post
		const newPost = await prisma.post.create({
			data: {
				title,
				content,
				excerpt,
				tags,
				author: {
					connect: { id: '673a1768ec99ae645fc474a9' }, // Default author ID
				},
			},
		})

		return NextResponse.json({ success: true, post: newPost }, { status: 201 })
	} catch (error) {
		console.error('Error creating post:', error)
		return NextResponse.json(
			{ error: 'An error occurred while creating the post' },
			{ status: 500 },
		)
	}
}
