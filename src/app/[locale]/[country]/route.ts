import type { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ country: string }> },
) {
	const { country } = await params
	const cookieStore = await cookies()

	cookieStore.set('ref_source', country, {
		httpOnly: false,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30, // 30 days
		path: '/',
	})

	redirect('/')
}
