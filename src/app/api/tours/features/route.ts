export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'

// The edite-tours page posts per-language highlights / FAQs / inclusions here,
// but the tours table has no per-language columns for them yet, so this has
// never saved anything. Returns an explicit error until storage is designed.
export async function POST() {
	return NextResponse.json(
		{
			success: false,
			message:
				'Saving per-language tour features is not implemented yet (no storage for it in the database).',
		},
		{ status: 501 },
	)
}
