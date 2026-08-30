export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function GET() {
	try {
		// Get the current user
		const userData = await getUserData()

		// Check if user is authenticated
		if (!userData || !userData.id) {
			return NextResponse.json(
				{
					total: 0,
					pending: 0,
					confirmed: 0,
					cancelled: 0,
				},
				{ status: 401 },
			)
		}

		// Get the business associated with this user
		const business = await prisma.business.findFirst({
			where: {
				creatorId: userData.id,
			},
		})

		// If no business found, return zeros
		if (!business) {
			return NextResponse.json({
				total: 0,
				pending: 0,
				confirmed: 0,
				cancelled: 0,
			})
		}

		// Get counts for each booking status
		const [total, pending, confirmed, cancelled] = await Promise.all([
			prisma.booking.count({
				where: {
					tour: {
						businessId: business.id,
					},
				},
			}),
			prisma.booking.count({
				where: {
					tour: {
						businessId: business.id,
					},
					bookingState: 'pending',
				},
			}),
			prisma.booking.count({
				where: {
					tour: {
						businessId: business.id,
					},
					bookingState: 'confirmed',
				},
			}),
			prisma.booking.count({
				where: {
					tour: {
						businessId: business.id,
					},
					bookingState: 'cancelled',
				},
			}),
		])

		return NextResponse.json({
			total,
			pending,
			confirmed,
			cancelled,
		})
	} catch (error) {
		console.error('Error fetching booking stats:', error)
		return NextResponse.json(
			{
				total: 0,
				pending: 0,
				confirmed: 0,
				cancelled: 0,
			},
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
