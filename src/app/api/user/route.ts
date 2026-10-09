export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { db, T, must, touch } from '@/lib/db'
import { safeUser } from '@/lib/users'

// Update the signed-in user's profile
export async function POST(req: Request) {
	try {
		const session: any = await getSession()
		const emailSession = session?.user?.email
		if (!emailSession) {
			return NextResponse.json(
				{ message: 'Not authenticated' },
				{ status: 401 },
			)
		}
		const {
			gender,
			username,
			dateOfBirth,
			address,
			phone,
			about,
			lastname,
			firstname,
		} = await req.json()

		const updatedUser = must(
			await db
				.from(T.users)
				.update(
					touch({
						username,
						phone,
						accountData: {
							lastname,
							firstname,
							gender,
							dateOfBirth,
							address,
							about,
						},
					}),
				)
				.eq('email', emailSession)
				.select('*')
				.single(),
		)

		return NextResponse.json(safeUser(updatedUser), { status: 200 })
	} catch (error) {
		console.error('Error updating user data:', error)
		return NextResponse.json(
			{ error: 'Error updating user data' },
			{ status: 500 },
		)
	}
}
