import { useSession } from 'next-auth/react'
import { PrismaClient } from '@prisma/client'
import { NextResponse, NextRequest } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/authOptions'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

// Función PUT para actualizar datos de usuario
export async function POST(req: NextRequest) {
	try {
		const session: any = await getServerSession(authOptions)
		const emailSession = session?.user?.email
		console.log('emailSession', emailSession)
		if (!session || !session?.user?.email) {
			return NextResponse.json(
				{ message: 'Not authenticated' },
				{ status: 401 },
			)
		}
		const body = await req.json()
		const {
			email,
			gender,
			username,
			dateOfBirth,
			address,
			phone,
			about,
			lastname,
			firstname,
		} = body

		// Actualiza el usuario en la base de datos
		const updatedUser = await prisma.user.update({
			where: { email: emailSession },
			data: {
				username,
				phone,
				accountData: {
					lastname,
					firstname,
					gender,
					dateOfBirth,
					address,
					about,
				},
			},
		})

		return NextResponse.json(updatedUser, { status: 200 })
	} catch (error) {
		console.error('Error updating user data:', error)
		return NextResponse.json(
			{ error: 'Error updating user data' },
			{ status: 500 },
		)
	}
}

// Manejo de otros métodos HTTP no permitidos
export function handleRequestMethod(req: NextRequest) {
	const allowedMethods = ['PUT']
	if (!allowedMethods.includes(req.method)) {
		return NextResponse.json(
			{ error: `Method ${req.method} Not Allowed` },
			{ status: 405 },
		)
	}
}
