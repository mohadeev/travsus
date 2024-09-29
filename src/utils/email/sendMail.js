import { welcomeTemplate } from '@/components/email-templates/WellcomeTemplate'
// utils/sendEmail.ts
import * as handlebars from 'handlebars'
// import * as welcomeTemplate from './template.html'

import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

// Define the sendEmail function as a const and export it as default
// interface EmailOptions {
// 	to: string
// 	subject: string
// 	message: string
// 	Template: any // Accepting a React component as a template
// }

const sendEmail = async ({ to, subject, message, Template }) => {
	try {
		const transporter = nodemailer.createTransport({
			host: 'smtp.zoho.eu', // Use 'smtp.zoho.eu' for the EU region or 'smtp.zoho.com' for the US
			port: 465, // Use 465 for SSL
			secure: true, // Use SSL
			auth: {
				user: 'ceo@travsus.com', // Your Zoho email address from env variables
				pass: 'F1!dG3n7*zR@Pq5#', // Your Zoho App-Specific Password from env variables
			},
		})

		// Set up the email data (recipient, subject, and content)
		const mailOptions = {
			from: `"Mina from Travsus" <ceo@travsus.com>`, // Display company name
			to: 'skendoulmohamed@gmail.com', // Recipient's email address
			subject: 'nothing  ', // Subject of the email
			text: 'message', // Message body
			html: compileWelcomeTemplate('-----------', '-----'),
		}

		// Send the email
		const info = await transporter.sendMail(mailOptions)
		console.log('Message sent: %s', info.messageId)
	} catch (error) {
		console.error('Error sending email:', error)
		throw new Error('Failed to send email')
	}
}

import jsxToString from 'jsx-to-string'
import RestPasswordEmailTemplate from '@/components/email-templates/RestPasswordEmailTemplate'
// console.log('jsxToString: ', jsxToString)

// Export sendEmail as the default export
// console.log(jsxToString(WellcomeTemplate({})))
// function convertJSXToHTMLStyle(jsxCode) {
// 	// Function to convert camelCase to kebab-case
// 	function camelToKebab(str) {
// 		return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
// 	}

// 	// Step 1: Find all style={{...}} blocks and convert them
// 	jsxCode = jsxCode.replace(/style=\{\{(.*?)\}\}/gs, (match, cssContent) => {
// 		// Step 2: Convert camelCase to kebab-case inside style
// 		const kebabCaseCss = cssContent
// 			.split(',')
// 			.map((rule) => {
// 				let [key, value] = rule.split(':').map((part) => part.trim())
// 				key = camelToKebab(key.replace(/"/g, '')) // Remove quotes around keys
// 				value = value.replace(/"/g, '') // Remove quotes around values
// 				return `${key}: ${value}`
// 			})
// 			.join('; ')

// 		// Return the final converted inline style
// 		return `style="${kebabCaseCss};"`
// 	})

// 	return jsxCode
// }

// const htmlCode = convertJSXToHTMLStyle(jsxToString(WellcomeTemplate({})))

// console.log('Set up a custom domain: ', htmlCode)

export default sendEmail
// const filePath = path.join(process.cwd(), './src/utils/email/template.html')
// const jsxCode = fs.readFileSync(filePath, 'utf-8')
export function compileWelcomeTemplate(name, url) {
	const template = handlebars.compile(welcomeTemplate)
	const htmlBody = template({
		name: 'skd',
		url: 'url',
	})
	return htmlBody
}

// console.log(compileWelcomeTemplate('-----------', '-----'))
