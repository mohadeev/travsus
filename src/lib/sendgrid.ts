import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

interface EmailData {
	to: string
	from: string
	subject: string
	text: string
}

export async function sendEmail(data: EmailData) {
	try {
		await sgMail.send(data)
	} catch (error) {
		console.error('SendGrid error:', error)
		throw new Error('Failed to send email')
	}
}
