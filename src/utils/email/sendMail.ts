import {
	TransactionalEmailsApi,
	TransactionalEmailsApiApiKeys,
	SendSmtpEmail,
} from '@getbrevo/brevo'
import emailTypes from './emailTypes'
import { compileTemplate } from './compileTemplate'

// Instantiate Brevo API
const transactionalEmailsApi = new TransactionalEmailsApi()
transactionalEmailsApi.setApiKey(
	TransactionalEmailsApiApiKeys.apiKey,
	process.env.BREVO_API_KEY as string,
)

const sendEmail = async ({ to, subject, message, type, emailData }: any) => {
	const emailTyp = emailTypes({ type })
	const isTestEnvironment =
		process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'

	try {
		let emailContent = message
		let emailSubject = subject
		let emailSender = 'notifications@travsus.com' // Default sender

		if (emailTyp && emailTyp.template) {
			emailContent = await compileTemplate(await emailTyp.template, emailData)
			emailSubject = emailTyp.subject
			emailSender = emailTyp.sender
		}

		if (isTestEnvironment) {
			emailSubject = `[TEST] ${emailSubject}`
			emailContent = `
        <strong style="color: red;">THIS IS A TEST EMAIL. Please ignore.</strong><br><br>
        ${emailContent}
        <br><br>
        <a href="https://www.travsus.com/unsubscribe">Unsubscribe from test emails</a>
      `
		}
		console.log('emailSender', emailSender)
<<<<<<< HEAD
		const msg = {
			to: to || 'skendoulmohamed@gmail.com',
			from: 'admin@travsus.com',
=======

		const msg: SendSmtpEmail = {
			sender: { email: emailSender, name: 'TRAVSUS' }, // Brevo requires object
			to: [{ email: to || 'skendoulmohamed@gmail.com' }],
>>>>>>> 4104937fc9d9edfcc5487e4af003be04d8e7a747
			subject: emailSubject,
			htmlContent: emailContent,
		}

		// Handle attachments if provided
		if (emailData?.attachments) {
			msg.attachment = emailData.attachments.map((att: any) => ({
				name: att.filename,
				content: att.content.toString('base64'),
			}))
		}

		const response = await transactionalEmailsApi.sendTransacEmail(msg)

		console.log(
			`Email sent to ${to} successfully! Message ID:`,
			response.body.messageId,
		)
		return response
<<<<<<< HEAD
	} catch (error) {
		console.error('Error sending email:', JSON.stringify(error))
=======
	} catch (error: any) {
		console.error(
			'Error sending email:',
			error.response?.body || error.message || error,
		)
>>>>>>> 4104937fc9d9edfcc5487e4af003be04d8e7a747
		console.error('Failed to send email')
	}
}

export default sendEmail
