// The booking confirmation & invoice PDF with example data (owner only), to
// check how it looks.
import { NextResponse } from 'next/server'
import { isOwner } from '@/lib/admin/owner'
import { TEMPLATES } from '@/lib/email/templates'
import { bookingPdf } from '@/lib/email/bookingPdf'

export const dynamic = 'force-dynamic'

export async function GET() {
	if (!(await isOwner())) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const pdf = await bookingPdf(TEMPLATES['booking-confirmed'].sample)
	return new NextResponse(new Uint8Array(pdf), {
		headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'inline; filename="TRAVSUS-sample-booking.pdf"', 'Cache-Control': 'no-store' },
	})
}
