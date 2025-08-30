import currentServerUser from '@/app/api/user/currentServerUser'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/authOptions'
import prisma from '@/prisma'

const getUserData = async (data?: any) => {
	const { include } = data || {}
	// include: {
	// 	customer: true,
	// 	tour: true,
	// 	provider: true,
	// },

	const currentUser: any = await getServerSession(authOptions)
	if (currentUser) {
		const user = await prisma.user.findUnique({
			where: {
				email: currentUser?.user?.email, // Assuming `currentUser` has the user ID
			},
		})
		return user
	} else {
		return null
	}
}

export default getUserData
export { getUserData }
