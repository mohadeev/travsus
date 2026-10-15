// Who is signed in (Clerk), and their row in our `users` table.
// Clerk handles sign-in; our data (bookings, tours, reviews) is linked by email.
import { currentUser as clerkUser } from '@clerk/nextjs/server'
import { db, T, must, withMeta } from '@/lib/db'
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

/**
 * The signed-in user's row in `users` (all columns), or null when signed out.
 * First sign-in with Clerk: an existing account with the same email is reused,
 * otherwise a new one is created and a welcome email is sent.
 */
export async function getSessionUser(): Promise<any | null> {
	const user = await clerkUser()
	const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
	if (!user || !email) return null

	const existing = must(
		await db.from(T.users).select('*').eq('email', email).maybeSingle(),
	)
	if (existing) return existing

	const created = await db
		.from(T.users)
		.insert(
			withMeta({
				email,
				accountData: {
					firstname: user.firstName ?? '',
					lastname: user.lastName ?? '',
				},
				password: '', // passwords live in Clerk
				emailVerified: true,
			}),
		)
		.select('*')
		.single()

	// Two first requests at once: the other one created it (email is unique)
	if (created.error) {
		return must(await db.from(T.users).select('*').eq('email', email).maybeSingle())
	}

	// Not awaited: signing in never waits for the email
	void sendTemplate('welcome', { to: email, data: { name: user.firstName ?? undefined } })
	return created.data
}
