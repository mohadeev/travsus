import getUserData from '@/app/api/user/getUserData'
import prisma from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

// Remove this line as it's not necessary and might cause circular dependency issues
// import userData from '@/app/api/user/getUserData'
// export const getUserData = userData

export async function getUserById(id: string) {
	return prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			email: true,
			// Uncomment these if you need them
			// name: true,
			// Add any other fields you want to retrieve
		},
	})
}

export async function getUserByEmail(email: string) {
	return prisma.user.findUnique({
		where: { email },
		select: {
			id: true,
			email: true,
			// Uncomment these if you need them
			// name: true,
			// Add any other fields you want to retrieve
		},
	})
}

export { getUserData, authOptions }
// import { authOptions } from '@/lib/auth'
