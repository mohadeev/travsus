import userData from '@/app/api/user/getUserData'
import prisma from '@/lib/prisma'
export const getUserData = userData

export async function getUserById(id: string) {
	return prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			// name: true,
			email: true,
			// Add any other fields you want to retrieve
		},
	})
}

export async function getUserByEmail(email: string) {
	return prisma.user.findUnique({
		where: { email },
		select: {
			id: true,
			// name: true,
			email: true,
			// Add any other fields you want to retrieve
		},
	})
}
