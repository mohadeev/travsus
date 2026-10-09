import getUserData from '@/app/api/user/getUserData'
import { db, T, must } from '@/lib/db'

export async function getUserById(id: string) {
	return must(await db.from(T.users).select('id, email').eq('id', id).maybeSingle())
}

export async function getUserByEmail(email: string) {
	return must(
		await db.from(T.users).select('id, email').eq('email', email).maybeSingle(),
	)
}

export { getUserData }
