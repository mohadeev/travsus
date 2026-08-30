export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const { url } = await request.json()

		if (!url) {
			return NextResponse.json({ error: 'URL is required' }, { status: 400 })
		}

		// Fetch the HTML content
		const response = await fetch(url, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
			},
		})

		if (!response.ok) {
			return NextResponse.json(
				{ error: 'Failed to fetch URL' },
				{ status: response.status },
			)
		}

		const html = await response.text()

		return NextResponse.json({
			html,
			status: response.status,
			contentType: response.headers.get('content-type'),
		})
	} catch (error) {
		console.error('Error fetching HTML:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
