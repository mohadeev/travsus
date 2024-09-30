import prisma from '@/prisma'
import updateListing from '@/app/api/api-utils/updateListing'
import currentServerUser from '@/app/api/user/currentServerUser'
import { NextResponse, NextRequest } from 'next/server'
import sendEmail from '@/utils/email/sendMail'

export async function POST(request) {
	console.log('here')
	sendEmail({
		to: 'skendoulmohamed@gmail.com',
		subject: 'first email',
		type: 'welcome',
		message: 'this is the first email data',
		emailData: { name: 'Moha' },
	})
	return NextResponse.json({ message: 'here is the emails' }, { status: 200 })
}
