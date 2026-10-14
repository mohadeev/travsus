// Who may open the analytics panel: only the owner's sign-in email.
import 'server-only'
import { currentUser } from '@clerk/nextjs/server'

const OWNER_EMAIL = 'skendoulmohamed@gmail.com'

/** True when the signed-in Clerk user is the owner (verified email). */
export async function isAnalyticsOwner() {
	const user = await currentUser().catch(() => null)
	return !!user?.emailAddresses.some(
		(e) => e.emailAddress.toLowerCase() === OWNER_EMAIL && e.verification?.status === 'verified',
	)
}
