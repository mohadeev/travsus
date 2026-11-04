export const dynamic = "force-dynamic";
import fs from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	// The widget map is a source file. Writing it only works in local `next dev`;
	// Workers and Vercel have a read-only deployment filesystem.
	if (process.env.NODE_ENV !== 'development') {
		return NextResponse.json(
			{ message: 'Widget ids are part of the repo. Edit src/constants/tawkWidgets.json locally and deploy.' },
			{ status: 403 },
		)
	}
	try {
		const data = await req.json()
		const filePath = path.join(process.cwd(), 'src/constants/tawkWidgets.json')
		fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')

		return NextResponse.json({ message: 'Saved successfully' }, { status: 200 })
	} catch (error) {
		console.error(error)
		return NextResponse.json({ message: 'Error saving JSON' }, { status: 500 })
	}
}
