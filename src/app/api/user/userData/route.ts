import prisma from '@/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/authOptions'
//coment
export async function GET(request: NextRequest) {
	try {
		const session: any = await getServerSession(authOptions)
		if (!session || !session?.user?.email) {
			return NextResponse.json(
				{ message: 'Not authenticated' },
				{ status: 401 },
			)
		}
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
		})
		if (!user) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 })
		}
		return NextResponse.json({ user: user, message: 'user_found' })
	} catch (error) {
		console.error('Error fetching user data:', error)
		return NextResponse.error()
	}
}
