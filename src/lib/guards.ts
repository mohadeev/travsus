// Permission helpers for API routes.
import { NextResponse } from 'next/server'
import getUserData from '@/app/api/user/getUserData'
import { OWNER_EMAIL } from '@/lib/admin/owner'

/**
 * The signed-in user (full row) or null. The site owner's account (matched by
 * its sign-in email) counts as an admin.
 */
export async function currentUser(): Promise<any | null> {
	const user = (await getUserData()) ?? null
	if (user && String(user.email ?? '').toLowerCase() === OWNER_EMAIL) user.isAdmin = true
	return user
}

/** Admins can edit everything; others only what they created. */
export function canEdit(user: any, ownerId?: string | null) {
	return !!user && (user.isAdmin === true || (!!ownerId && user.id === ownerId))
}

/**
 * For admin-only API routes. Returns a 401/403 response to send back,
 * or null when the signed-in user is an admin.
 */
export async function adminOnly() {
	const user = await currentUser()
	if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
	if (user.isAdmin !== true) return NextResponse.json({ error: 'Admins only' }, { status: 403 })
	return null
}
