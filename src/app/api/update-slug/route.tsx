import { generateTourLink } from '@/useTourLink'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		// Extract search parameters from the URL
		const { searchParams } = new URL(request.url)
		const locale = searchParams.get('locale')
		const serviceId = searchParams.get('serviceId')

		const serviceDataResponse = await fetch(
			`${process.env.NEXTAUTH_URL}/api/listing/get/getTourData?id=${serviceId}&locale=${locale}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)
		const serviceData: any = await serviceDataResponse.json()
		const link = generateTourLink(serviceData, locale)
		console.log('link: ', serviceData.slugs)
		const currentLink = serviceData.slugs.find(
			({ language }: any) => language === locale,
		)
		return NextResponse.json(
			{
				success: true,
				data: {
					locale,
					serviceId,
					link: currentLink.slug,
				},
				message: 'Parameters retrieved successfully',
			},
			{ status: 200 },
		)
		// return NextResponse.redirect(new URL(url.origin + '/' + link), 301)

		// Return the parameters in the response
	} catch (error) {
		// Handle any errors
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to process request',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	}
}
