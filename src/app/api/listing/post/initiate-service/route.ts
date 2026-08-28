export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import getUserData from '@/app/api/user/getUserData'

const prisma = new PrismaClient()

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const userData: any = await getUserData({ include: { businesses: true } })
		const { businesses } = userData
		const selectedCompany: any = businesses?.[0] || null
		const { id: compnanyId } = selectedCompany || {}
		console.log('userData', compnanyId)
		const id = userData.id
		// if (id) {
		// 	return NextResponse.json({}, { status: 201 })
		// }
		const newTour = await prisma.tour.create({
			data: {
				creator: { connect: { id: id } },
				business: { connect: { id: compnanyId } },
				name: body.name,
				subtitle: body.subtitle,
				overview: body.overview,
				productCategory: body.productCategory,
				slug: body.slug,
				images: body.images,
				people: body.people,
				services: body.services,
				places: body.places,
				highlights: body.highlights,
				days: body.days,
				paths: body.paths,
				price: body.price,
				discount: body.discount,
				start: body.start,
				end: body.end,
				reviews: body.reviews,
				lang: body.lang,
				tourfor: body.tourfor,
				conclusion: body.conclusion,
				tags: body.tags,
				keyphrase: body.keyphrase,
				pricingTiers: body.pricingTiers,
				accommodations: body.accommodations,
			},
		})

		return NextResponse.json(newTour, { status: 201 })
	} catch (error) {
		console.error('Error creating tour:', error)
		return NextResponse.json({ error: 'Error creating tour' }, { status: 500 })
	}
}
