import { welcomeTemplate } from '@/components/email-templates/WellcomeTemplate'
// utils/sendEmail.ts
import handlebars from 'handlebars'
// import * as welcomeTemplate from './template.html'

import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import emailTypes from './emailTypes'
import { ServerClient } from 'postmark'

const sendEmail = async ({ to, subject, message, type, emailData }) => {
	const ACTIVE_PROD_EMAILS = process.env.ACTIVE_PROD_EMAILS
	const client = new ServerClient('d4835374-38d7-4278-bf9b-714d93328258')
	const emailTyp = emailTypes({ type })
	try {
		try {
			const response = await client.sendEmail({
				From: emailTyp.sender, // Sender email address
				To: to, // Recipient email address
				Subject: emailTyp.subject, // Subject line
				HtmlBody: compileWelcomeTemplate(emailTyp.template, emailData), // HTML body
				// TextBody: 'Hello from Postmark!', // Plain text body
				// MessageStream: 'outbound', // Message stream type
			})

			console.log(`Email sent successfully! Message ID: ${response.MessageID}`)
		} catch (error) {
			console.error('Error sending email:', error)
		}
		//------------------------------------------------------------------------
	} catch (error) {
		console.error('Error sending email:', error)
		throw new Error('Failed to send email')
	}
}

export default sendEmail
export function compileWelcomeTemplate(template, data) {
	const compileTemplate = handlebars.compile(template(data))
	const htmlBody = compileTemplate(data)
	return htmlBody
}
