import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'
export const dynamic = 'force-dynamic' // This ensures the route is always dynamic

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = request.nextUrl // Use nextUrl instead of new URL(request.url)
		const page = parseInt(searchParams.get('page') || '1')
		const limit = parseInt(searchParams.get('limit') || '8')

		const userData: any = await getUserData()
		const { savedList } = userData || {}

		const totalTours = await prisma.tour.count({
			where: {
				images: {
					isEmpty: false,
				},
			},
		})

		const allToursData = await prisma.tour.findMany({
			where: {
				images: {
					isEmpty: false,
				},
			},
			skip: (page - 1) * limit,
			take: limit,
		})

		const modifiedToursData = allToursData.map((tour) => ({
			...tour,
			liked: savedList?.includes(tour.id),
		}))
		// console.log('modifiedToursData:', modifiedToursData?.[0])

		return NextResponse.json({
			allToursData: modifiedToursData,
			totalTours,
			page,
			totalPages: Math.ceil(totalTours / limit),
		})
	} catch (error) {
		console.error('Error fetching tour:', error)
		return NextResponse.json(
			{ message: 'Error fetching tour data' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}

import nodemailer from 'nodemailer'
