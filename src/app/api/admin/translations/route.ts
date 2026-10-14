// Translations panel data. Owner only (anyone else gets a 404).
//   GET                                  → all texts of the 10 languages
//   PUT    { group, key, values }        → set texts ({ "fr-FR": "…" }; "" removes)
//   DELETE { group, key }                → remove a key everywhere
//   POST   { import: { "en-US": {…} } }  → bulk import (addLangs.js format)
import { NextResponse, type NextRequest } from 'next/server'
import { isOwner } from '@/lib/admin/owner'
import { LOCALES, canWrite, deleteKey, importTexts, readAll, setTexts, validName } from '@/lib/admin/translations'

export const dynamic = 'force-dynamic'

const notFound = () => new NextResponse(null, { status: 404 })
const readOnly = () =>
	NextResponse.json({ error: 'The live site is read-only. Run the site locally (npm run dev) to edit texts, then push.' }, { status: 403 })

export async function GET() {
	if (!(await isOwner())) return notFound()
	return NextResponse.json({ locales: LOCALES, writable: canWrite(), messages: await readAll() }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function PUT(req: NextRequest) {
	if (!(await isOwner())) return notFound()
	if (!canWrite()) return readOnly()
	const { group, key, values } = await req.json().catch(() => ({}))
	if (!validName(group) || !validName(key) || !values || typeof values !== 'object') {
		return NextResponse.json({ error: 'Group and key may only use letters, numbers, _ . -' }, { status: 400 })
	}
	await setTexts(group, key, values)
	return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
	if (!(await isOwner())) return notFound()
	if (!canWrite()) return readOnly()
	const { group, key } = await req.json().catch(() => ({}))
	if (!validName(group) || !validName(key)) return NextResponse.json({ error: 'Bad group or key' }, { status: 400 })
	await deleteKey(group, key)
	return NextResponse.json({ ok: true })
}

export async function POST(req: NextRequest) {
	if (!(await isOwner())) return notFound()
	if (!canWrite()) return readOnly()
	const body = await req.json().catch(() => null)
	try {
		return NextResponse.json({ ok: true, counts: await importTexts(body?.import) })
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 400 })
	}
}
