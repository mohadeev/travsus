import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
	[key: string]: {
		count: number
		resetTime: number
	}
}

const store: RateLimitStore = {}

export function rateLimit(limit: number = 4, windowMs: number = 60000) {
	return (req: NextRequest, res: NextResponse, next: () => void) => {
		const ip = req.ip || 'unknown'
		const key = `${ip}`
		const now = Date.now()

		if (!store[key]) {
			store[key] = {
				count: 1,
				resetTime: now + windowMs,
			}
		} else if (now > store[key].resetTime) {
			store[key] = {
				count: 1,
				resetTime: now + windowMs,
			}
		} else {
			store[key].count++
		}

		if (store[key].count > limit) {
			return NextResponse.json(
				{ error: '🚫 Too many requests, please try again later.' },
				{ status: 429 },
			)
		}

		next()
	}
}
