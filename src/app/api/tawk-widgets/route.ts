import fs from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
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
