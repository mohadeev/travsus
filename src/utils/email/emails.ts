import sgMail from '@sendgrid/mail'
import emailTypes from './emailTypes'
import handlebars from 'handlebars'
import { compileTemplate } from './compileTemplate'

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

const sendEmail = async ({ to, subject, message, type, emailData }: any) => {
	const emailTyp = emailTypes({ type })
	const isTestEnvironment =
		process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'

	try {
		let emailContent = message
		let emailSubject = subject
		let emailSender = 'notifications@travsus.com' // Default sender

		if (emailTyp && emailTyp.template) {
			emailContent = await compileTemplate(emailTyp.template, emailData)
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

		const msg = {
			to: to,
			from: emailSender,
			subject: emailSubject,
			html: emailContent,
			attachments: emailData.attachment ? [emailData.attachment] : undefined,
		}

		const response = await sgMail.send(msg)
		console.log(`Email sent successfully! Response:`, response[0].statusCode)

		return response
	} catch (error) {
		console.error('Error sending email:', error)
		console.error('Failed to send email')
	}
}

export default sendEmail

// function compileTemplate(template: any, data: any) {
// 	const compileTemplate = handlebars.compile(template(data))
// 	const htmlBody = compileTemplate(data)
// 	return htmlBody
// }
