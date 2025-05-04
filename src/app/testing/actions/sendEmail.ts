'use server'

import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function sendEmail(formData: FormData) {
	const name = formData.get('name') as string
	const email = formData.get('email') as string
	const message = formData.get('message') as string

	const msg = {
		to: 'skendoulmohamed@gmail.com',
		from: 'form@travsus.com',
		subject: 'New Contact Form Submission',
		text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
	}

	try {
		await sgMail.send(msg)
		return { success: true }
	} catch (error) {
		console.error('SendGrid error:', error)
		return { success: false, error: 'Failed to send email' }
	}
}
