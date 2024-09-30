import { welcomeTemplate } from '@/components/email-templates/WellcomeTemplate'
// utils/sendEmail.ts
import handlebars from 'handlebars'
// import * as welcomeTemplate from './template.html'

import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import emailTypes from './emailTypes'
import awsSesConfig from '@/app/api/config/awsSesConfig'

// Define the sendEmail function as a const and export it as default
// interface EmailOptions {
// 	to: string
// 	subject: string
// 	message: string
// 	Template: any // Accepting a React component as a template
// }

const sendEmail = async ({ to, subject, message, type, emailData }) => {
	const emailTyp = emailTypes({ type })
	// console.log(emailTyp)
	try {
		const transporter = nodemailer.createTransport({
			host: 'smtp.zoho.eu', // Use 'smtp.zoho.eu' for the EU region or 'smtp.zoho.com' for the US
			port: 465, // Use 465 for SSL
			secure: true, // Use SSL
			auth: {
				user: emailTyp.email, // Your Zoho email address from env variables
				pass: emailTyp.password, // Your Zoho App-Specific Password from env variables
			},
		})
		// const transporter = nodemailer.createTransport({
		// 	SES: new awsSesConfig.SES({ apiVersion: '2010-12-01' }),
		// })

		// Set up the email data (recipient, subject, and content)
		const mailOptions = {
			from: emailTyp.sender, // Display company name
			to: to, // Recipient's email address
			subject: emailTyp.subject, // Subject of the email
			html: compileWelcomeTemplate(emailTyp.template, emailData),
		}

		// Send the email
		const info = await transporter.sendMail(mailOptions)
		console.log('Message sent: %s', info.messageId)
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
