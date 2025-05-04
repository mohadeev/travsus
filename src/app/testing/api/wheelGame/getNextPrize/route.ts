import { NextResponse } from 'next/server'

const generateWinnerCode = () =>
	Math.random().toString(36).substring(2, 10).toUpperCase()
const generatePrizeNumber = () => Math.floor(Math.random() * 18)

export async function GET() {
	const prizeNumber = generatePrizeNumber()
	const winnerCode = prizeNumber !== 15 ? generateWinnerCode() : null
	return NextResponse.json({ prizeNumber, winnerCode })
}
