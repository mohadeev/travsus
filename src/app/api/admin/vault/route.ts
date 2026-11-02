// The owner's password vault (owner only). The browser encrypts the passwords
// with the unlock code before sending them (AES-GCM, key from PBKDF2), so this
// route only ever stores and returns scrambled data: without the code, the
// database row is unreadable. GET returns the vault (or null before it is
// created), PUT replaces it; `version` stops an older tab from overwriting a
// newer save.
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, must } from '@/lib/db'
import { isOwner } from '@/lib/admin/owner'

export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'no-store, max-age=0' }
const B64 = /^[A-Za-z0-9+/]+={0,2}$/
const MAX_DATA = 2_000_000 // characters of encrypted data

type VaultRow = { id: string; kdf: string; iterations: number; salt: string; iv: string; data: string; version: number; updatedAt?: string }

const notFound = () => NextResponse.json({ error: 'Not found' }, { status: 404, headers: NO_STORE })

export async function GET() {
	if (!(await isOwner())) return notFound()
	const row = must(await db.from(T.vault).select('id, kdf, iterations, salt, iv, data, version, updatedAt').limit(1).maybeSingle()) as VaultRow | null
	return NextResponse.json({ vault: row }, { headers: NO_STORE })
}

export async function PUT(req: NextRequest) {
	if (!(await isOwner())) return notFound()
	const body = await req.json().catch(() => ({}))
	const iterations = Number(body.iterations)
	const valid =
		body.kdf === 'PBKDF2-SHA256' &&
		Number.isInteger(iterations) && iterations >= 300_000 && iterations <= 5_000_000 &&
		[body.salt, body.iv, body.data].every((x) => typeof x === 'string' && B64.test(x)) &&
		body.data.length <= MAX_DATA
	if (!valid) return NextResponse.json({ error: 'Not a valid vault' }, { status: 400, headers: NO_STORE })

	const fields = { kdf: body.kdf, iterations, salt: body.salt, iv: body.iv, data: body.data, updatedAt: new Date().toISOString() }
	const current = must(await db.from(T.vault).select('id, version').limit(1).maybeSingle()) as { id: string; version: number } | null
	if (!current) {
		const row = must(await db.from(T.vault).insert({ ...fields, version: 1 }).select('version').single()) as { version: number }
		return NextResponse.json({ version: row.version }, { status: 201, headers: NO_STORE })
	}
	// Saved from a tab that hadn't seen the latest save
	if (Number(body.version) !== current.version) return NextResponse.json({ error: 'CONFLICT' }, { status: 409, headers: NO_STORE })
	const row = must(await db.from(T.vault).update({ ...fields, version: current.version + 1 }).eq('id', current.id).eq('version', current.version).select('version').maybeSingle()) as { version: number } | null
	if (!row) return NextResponse.json({ error: 'CONFLICT' }, { status: 409, headers: NO_STORE })
	return NextResponse.json({ version: row.version }, { headers: NO_STORE })
}
