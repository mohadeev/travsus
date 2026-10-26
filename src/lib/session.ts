// Who is signed in (Clerk), and their row in our `users` table.
// Clerk handles sign-in; our data (bookings, tours, reviews) is linked by email.
import { currentUser as clerkUser } from '@clerk/nextjs/server'
import { db, T, must, newId, mongoCollection } from '@/lib/db'
import { sendTemplate } from '@/lib/email/send'

export type Session = {
	user: { email: string; name: string | null; image: string | null }
}

/** The signed-in person, or null. Same shape the app used with NextAuth. */
export async function getSession(): Promise<Session | null> {
	const user = await clerkUser()
	const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
	if (!user || !email) return null
	return {
		user: { email, name: user.fullName, image: user.imageUrl ?? null },
	}
}

/** First requests of the same person at the same time (one server instance) share one lookup */
const pending = new Map<string, Promise<any>>()

/**
 * The signed-in user's row in `users` (all columns), or null when signed out.
 * First sign-in with Clerk: an existing account with the same email is reused,
 * otherwise a new one is created and a welcome email is sent, exactly once:
 * the account is created with one atomic "insert if missing" on the email
 * (unique index, scripts/db/indexes.mjs), and only the request that really
 * created it sends the email.
 */
export async function getSessionUser(): Promise<any | null> {
	const user = await clerkUser()
	const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
	if (!user || !email) return null

	const existing = must(await db.from(T.users).select('*').eq('email', email).maybeSingle())
	if (existing) return existing

	if (!pending.has(email)) {
		pending.set(
			email,
			createUser(email, user.firstName ?? '', user.lastName ?? '').finally(() => pending.delete(email)),
		)
	}
	return pending.get(email)
}

async function createUser(email: string, firstname: string, lastname: string) {
	const users = await mongoCollection(T.users)
	const now = new Date()
	const fields = {
		email,
		accountData: { firstname, lastname },
		password: '', // passwords live in Clerk
		emailVerified: true,
	}
	let created = false
	try {
		const result = await users.updateOne(
			{ email },
			{ $setOnInsert: { _id: newId(), ...fields, createdAt: now, updatedAt: now } } as Record<string, any>,
			{ upsert: true },
		)
		created = result.upsertedCount === 1
	} catch (error: any) {
		// Another request created it a moment before (unique email): use theirs
		if (error?.code !== 11000) throw error
	}
	// Not awaited: signing in never waits for the email
	if (created) void sendTemplate('welcome', { to: email, data: { name: firstname || undefined } })
	return must(await db.from(T.users).select('*').eq('email', email).maybeSingle())
}
