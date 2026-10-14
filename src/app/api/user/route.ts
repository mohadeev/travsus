export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { db, T, must, touch } from '@/lib/db'
import { safeUser } from '@/lib/users'

// Profile fields a user may change, and their maximum length. The email is
// not here: it comes from the sign-in (Clerk) and links the account.
const ACCOUNT_FIELDS = { firstname: 80, lastname: 80, gender: 30, dateOfBirth: 10, address: 300, about: 1000 } as const
const USER_FIELDS = { username: 40, phone: 30 } as const

const clean = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : undefined)

// Update the signed-in user's profile. Only the fields sent are changed;
// everything else is kept.
export async function POST(req: Request) {
	try {
		const user = await getSessionUser()
		if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

		const body = await req.json().catch(() => ({}))
		const accountData: Record<string, any> = { ...(user.accountData ?? {}) }
		const changes: Record<string, any> = {}

		for (const [key, max] of Object.entries(ACCOUNT_FIELDS)) {
			const value = clean(body[key], max)
			if (value !== undefined) accountData[key] = value
		}
		for (const [key, max] of Object.entries(USER_FIELDS)) {
			const value = clean(body[key], max)
			if (value !== undefined) changes[key] = value
		}
		if (accountData.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(accountData.dateOfBirth)) {
			return NextResponse.json({ message: 'Invalid date of birth' }, { status: 400 })
		}

		const updated = must(
			await db
				.from(T.users)
				.update(touch({ ...changes, accountData }))
				.eq('id', user.id)
				.select(`*, referralLinks:${T.referralLinks}(*)`)
				.single(),
		)

		return NextResponse.json(safeUser(updated), { status: 200 })
	} catch (error) {
		console.error('Error updating user data:', error)
		return NextResponse.json({ message: 'Error updating user data' }, { status: 500 })
	}
}
