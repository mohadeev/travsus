export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const serviceId = request.nextUrl.searchParams.get('serviceId')
	const name = request.nextUrl.searchParams.get('name')

	if (!serviceId || !name) {
		return NextResponse.json(
			{ valid: false, error: 'Missing serviceId or name' },
			{ status: 400 },
		)
	}

	// Here you would typically check the tour validity in your database or external service
	// For this example, we'll just check if the serviceId starts with '6' and the name is not empty
	// You might want to add additional checks for the 'random string' case
	const isTourValid = serviceId.startsWith('6') && name.length > 0

	return NextResponse.json({ valid: isTourValid })
}
