import currentServerUser from '@/app/api/user/currentServerUser'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/authOptions'
import prisma from '@/prisma'

const getUserData = async () => {
	const currentUser: any = await currentServerUser()
	const user = await prisma.user.findUnique({
		where: {
			email: currentUser?.user?.email, // Assuming `currentUser` has the user ID
		},
	})
	console.log('currentUser?.user?.email: ', user)

	return user
}

export default getUserData
