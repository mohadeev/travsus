import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function POST() {
	try {
		// Generate a random number (0-17 for 18 segments)
		const prizeNumber = Math.floor(Math.random() * 18)

		// Save the spin result to the database
		const spin = await prisma.spin.create({
			data: {
				prizeNumber,
				timestamp: new Date(),
			},
		})

		let winnerCode = null
		// If it's a winning spin (not 0€), generate and save a unique code
		if (prizeNumber !== 15) {
			// 15 is the index for 0€ in our segments array
			winnerCode = Math.random().toString(36).substring(2, 10).toUpperCase()
			await prisma.winner.create({
				data: {
					spinId: spin.id,
					code: winnerCode,
				},
			})

			// Save the winner code in a cookie
			cookies().set('winnerCode', winnerCode, { maxAge: 7200 }) // 2 hours expiry
		}

		return NextResponse.json({ prizeNumber, spinId: spin.id, winnerCode })
	} catch (error) {
		console.error('Error in wheel game API:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}
