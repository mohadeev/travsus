export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData()
		const screenshot = formData.get('screenshot') as File
		const visitorId = formData.get('visitorId') as string
		const country = formData.get('country') as string
		const browser = formData.get('browser') as string
		const os = formData.get('os') as string

		if (!screenshot || !visitorId) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 },
			)
		}

		// Upload the screenshot to Vercel Blob
		const filename = `${visitorId}/${uuidv4()}.png`
		const blob = await put(filename, screenshot, {
			access: 'public',
		})

		// In a real app, you would store this information in a database
		// along with the visitor information

		return NextResponse.json({
			success: true,
			imageUrl: blob.url,
			timestamp: new Date().toISOString(),
		})
	} catch (error) {
		console.error('Error processing screenshot:', error)
		return NextResponse.json(
			{ error: 'Failed to process screenshot' },
			{ status: 500 },
		)
	}
}
