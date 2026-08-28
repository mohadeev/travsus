export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'

// This function handles the GET request for city and country data
export async function GET(request: NextRequest) {
	const subcategoryName = 'city'
	const places = await prisma.place.findMany({})

	return NextResponse.json({ places: places })
}
