import prisma from '@/prisma'
import updateListing from '@/app/api/api-utils/updateListing'
import currentServerUser from '@/app/api/user/currentServerUser'
import { NextResponse, NextRequest } from 'next/server'
// import WellcomeTemplate from '@/components/email-templates/WellcomeTemplate'
import sendEmail from '@/utils/email/sendMail'

export async function POST(request) {
	console.log('here')
    sendEmail({
		to: 'skendoulmohamed@gmail.com',
		subject: 'first email',
		message: 'this is the first email data',
		// Template: <WellcomeTemplate />,
	})
	return NextResponse.json({ message: 'here is the emails' }, { status: 200 })
}
