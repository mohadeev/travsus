export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from 'next/server'
import { getTourData } from '@/lib/tourData'
import extractLanguageFromRequest from './extractLanguageFromRequest'

export async function GET(request: NextRequest) {
	try {
		const id = new URL(request.url).searchParams.get('id')

		if (!id || id === 'undefined') {
			return NextResponse.json(
				{ message: 'Tour ID is required and must be valid' },
				{ status: 400 },
			)
		}

		const tourData = await getTourData(id, extractLanguageFromRequest(request))
		if (!tourData) {
			return NextResponse.json({ message: 'Tour not found' }, { status: 404 })
		}

		return NextResponse.json(tourData)
	} catch (error) {
		console.error('Error fetching tour data:', error)
		return NextResponse.json(
			{
				message: 'Error fetching tour data',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	}
}
