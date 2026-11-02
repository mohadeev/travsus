// The owner's password vault (owner only). The browser encrypts everything
// before sending it, so this route only stores and returns scrambled data:
//   - the vault, encrypted with a random vault key (AES-GCM)
//   - that vault key, wrapped twice: with the unlock code and with the
//     recovery key (each through PBKDF2)
// Without the code or the recovery key the row is unreadable. GET returns the
// vault (null before it is created), PUT replaces it; `version` stops an older
// tab from overwriting a newer save. A PUT may carry a new recovery key to
// email to the owner: it is sent once and never stored.
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, must } from '@/lib/db'
import { isOwner, OWNER_EMAIL } from '@/lib/admin/owner'
import { sendTemplate } from '@/lib/email/send'

export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'no-store, max-age=0' }
const B64 = /^[A-Za-z0-9+/]+={0,2}$/
const KEY = /^[A-Z2-9]{40}$/
const REASONS = ['created', 'changed', 'reset', 'new'] as const
const MAX_DATA = 2_000_000 // characters of encrypted data

type Wrapped = { kdf: 'PBKDF2-SHA256'; iterations: number; salt: string; iv: string; key: string }

const notFound = () => NextResponse.json({ error: 'Not found' }, { status: 404, headers: NO_STORE })
const b64 = (x: unknown, max = 200): x is string => typeof x === 'string' && x.length <= max && B64.test(x)
const wrapped = (w: any): w is Wrapped =>
	!!w && w.kdf === 'PBKDF2-SHA256' && Number.isInteger(w.iterations) && w.iterations >= 300_000 && w.iterations <= 5_000_000 && b64(w.salt) && b64(w.iv) && b64(w.key)

export async function GET() {
	if (!(await isOwner())) return notFound()
	const row = must(await db.from(T.vault).select('id, format, kdf, iterations, salt, iv, data, code, recovery, version, updatedAt').limit(1).maybeSingle())
	return NextResponse.json({ vault: row }, { headers: NO_STORE })
}

export async function PUT(req: NextRequest) {
	if (!(await isOwner())) return notFound()
	const body = await req.json().catch(() => ({}))
	const valid = body.format === 2 && b64(body.iv) && b64(body.data, MAX_DATA) && wrapped(body.code) && wrapped(body.recovery)
	if (!valid) return NextResponse.json({ error: 'Not a valid vault' }, { status: 400, headers: NO_STORE })
	const recoveryKey = typeof body.emailRecoveryKey === 'string' && KEY.test(body.emailRecoveryKey) ? body.emailRecoveryKey : null
	const reason = REASONS.includes(body.reason) ? body.reason : 'new'

	const pick = ({ kdf, iterations, salt, iv, key }: Wrapped) => ({ kdf, iterations, salt, iv, key })
	// Older single-key fields (kdf, iterations, salt) are cleared
	const fields = { format: 2, iv: body.iv, data: body.data, code: pick(body.code), recovery: pick(body.recovery), kdf: null, iterations: null, salt: null, updatedAt: new Date().toISOString() }
	const current = must(await db.from(T.vault).select('id, version').limit(1).maybeSingle()) as { id: string; version: number } | null
	let version: number
	if (!current) {
		version = (must(await db.from(T.vault).insert({ ...fields, version: 1 }).select('version').single()) as { version: number }).version
	} else {
		// Saved from a tab that hadn't seen the latest save
		if (Number(body.version) !== current.version) return NextResponse.json({ error: 'CONFLICT' }, { status: 409, headers: NO_STORE })
		const row = must(await db.from(T.vault).update({ ...fields, version: current.version + 1 }).eq('id', current.id).eq('version', current.version).select('version').maybeSingle()) as { version: number } | null
		if (!row) return NextResponse.json({ error: 'CONFLICT' }, { status: 409, headers: NO_STORE })
		version = row.version
	}

	// The new recovery key goes to the owner's inbox, after the save
	let emailed: boolean | undefined
	if (recoveryKey) emailed = (await sendTemplate('vault-recovery-key', { to: OWNER_EMAIL, data: { key: recoveryKey, reason } })).ok
	return NextResponse.json({ version, emailed }, { status: current ? 200 : 201, headers: NO_STORE })
}
