// Who may open the admin panels (analytics, translations): only the owner's
// verified sign-in email.
import 'server-only'
import { currentUser } from '@clerk/nextjs/server'

const OWNER_EMAIL = 'skendoulmohamed@gmail.com'

/** True when the signed-in Clerk user is the owner (verified email). */
export async function isOwner() {
	const user = await currentUser().catch(() => null)
	return !!user?.emailAddresses.some(
		(e) => e.emailAddress.toLowerCase() === OWNER_EMAIL && e.verification?.status === 'verified',
	)
}
