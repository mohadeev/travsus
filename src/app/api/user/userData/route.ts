import prisma from '@/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import { parse } from 'cookie'
import currentServerUser from '../currentServerUser'
//coment
export async function GET(request: NextRequest) {
	const cookies = request.headers.get('cookie')
	const parsedCookies = cookies ? parse(cookies) : {}
	const geoCookie = parsedCookies.customGeo

	// Parse geolocation data from the cookie
	const customGeo = geoCookie ? JSON.parse(geoCookie) : {}

	try {
		const currentUser = await currentServerUser()
		// console.log('currentUser: ', currentUser)
		const session: any = await getServerSession(authOptions)
		if (!session || !session?.user?.email) {
			return NextResponse.json(
				{ message: 'Not authenticated' },
				{ status: 401 },
			)
		}
		const user: any = await prisma.user.findUnique({
			where: { email: session.user.email },
		})
		if (!user) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 })
		}
		user.currentGeo = customGeo
		return NextResponse.json({ user: user, message: 'user_found' })
	} catch (error) {
		console.error('Error fetching user data:', error)
		return NextResponse.error()
	}
}
