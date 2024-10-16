import NextAuth from 'next-auth'
import { authOptions } from './authOptions'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }



import prisma from '@/prisma'; // Adjust this path according to your project structure

