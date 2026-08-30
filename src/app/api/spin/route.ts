export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateWinnerCode() {
	return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export async function POST() {
	try {
		const prizeNumber = Math.floor(Math.random() * 18) // 18 segments on the wheel

		const spin = await prisma.spin.create({
			data: {
				prizeNumber,
				timestamp: new Date(),
			},
		})

		let winnerCode = null

		// If the prize is not 0€ (assuming 0€ is at index 15), create a winner entry
		if (prizeNumber !== 15) {
			const winner = await prisma.winner.create({
				data: {
					spinId: spin.id,
					code: generateWinnerCode(),
				},
			})
			winnerCode = winner.code
		}

		return NextResponse.json({ prizeNumber, spinId: spin.id, winnerCode })
	} catch (error) {
		console.error('Error creating spin:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
