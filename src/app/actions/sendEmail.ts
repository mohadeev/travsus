'use server'

import {
	TransactionalEmailsApi,
	TransactionalEmailsApiApiKeys,
	SendSmtpEmail,
} from '@getbrevo/brevo'

const transactionalEmailsApi = new TransactionalEmailsApi()
transactionalEmailsApi.setApiKey(
	TransactionalEmailsApiApiKeys.apiKey,
	process.env.BREVO_API_KEY as string,
)

export async function sendEmail(formData: FormData) {
	const name = formData.get('name') as string
	const email = formData.get('email') as string
	const message = formData.get('message') as string

	const emailContent = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong> ${message}</p>
  `

	const msg: SendSmtpEmail = {
		sender: { email: 'form@travsus.com', name: 'Travsus Form' }, // Verified sender in Brevo
		to: [{ email: 'skendoulmohamed@gmail.com', name: 'Skendou Mohamed' }],
		subject: 'New Contact Form Submission',
		htmlContent: emailContent,
		textContent: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
	}

	try {
		const response = await transactionalEmailsApi.sendTransacEmail(msg)
		console.log('Email sent successfully! Message ID:', response.body.messageId)
		return { success: true }
	} catch (error: any) {
		console.error(
			'Brevo error:',
			error.response?.body || error.message || error,
		)
		return { success: false, error: 'Failed to send email' }
	}
}
