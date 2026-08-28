export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
	try {
		const { prizeNumber, winnerCode } = await request.json()

		const spin = await prisma.spin.create({
			data: {
				prizeNumber,
				timestamp: new Date(),
			},
		})

		if (winnerCode) {
			await prisma.winner.create({
				data: {
					spinId: spin.id,
					code: winnerCode,
				},
			})
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error saving spin result:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
