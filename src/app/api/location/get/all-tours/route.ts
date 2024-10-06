import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1') // Default to page 1
        const limit = parseInt(searchParams.get('limit') || '8') // Default limit

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
            skip: (page - 1) * limit, // Skip tours for pagination
            take: limit, // Limit results
        })

        const modifiedToursData = allToursData.map((tour) => ({
            ...tour,
            liked: savedList?.includes(tour.id),
        }))

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
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
