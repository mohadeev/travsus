import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import jsPDF from 'jspdf'
import sendEmail from '@/utils/email/sendMail'

export async function POST() {
	try {
		sendEmail({
			to: 'skendoulmohamed@gmail.com',
			subject: 'Testing',
			message: 'Testing',
			type: 'forgetPassword',
			emailData: {
				// name: firstname,
				email: 'skendoulmohamed@gmail.com',
				restLink: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/q?token=${''}`,
			},
		})

		return NextResponse.json({ message: 'PDF generated and sent successfully' })
	} catch (error) {
		console.error('Error:', error)
		return NextResponse.json(
			{ error: 'Failed to generate and send PDF' },
			{ status: 500 },
		)
	}
}
