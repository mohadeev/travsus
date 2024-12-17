import { generatePDF } from '@/lib/generatePDF'
import sendEmail from '@/utils/email/sendMail'
import axios from 'axios'
import emailTypes from './email/emailTypes'
import { compileTemplate } from './email/compileTemplate'

export const bookingConfirmationEmail = async (bookingData: any) => {
	const confirmationMail = async () => {
		try {
			const invoicePdfHtml = await generatePDF({
				templateName: 'invoice_template',
				data: bookingData,
			})
			let emailContent, emailSubject, emailSender
			const emailTyp = emailTypes({ type: 'bookingConfirmation' })
			if (emailTyp && emailTyp.template) {
				emailContent = await compileTemplate(emailTyp.template, bookingData)
				emailSubject = emailTyp.subject
				emailSender = emailTyp.sender
			}
			// Generate Receipt PDF
			const receiptPdfHtml = await generatePDF({
				templateName: 'receipt_template',
				data: bookingData,
			})
			const externalServerOrigin = process.env.NEXT_PUBLIC_EXTERNAL_SERVER

			const response = await axios.post(
				`${externalServerOrigin}/api/email/sendMail`,
				{
					htmlContent: emailContent,
					emailData: {
						to: bookingData.customer.email,
						sender: 'no-reply@travsus.com',
						subject: 'Your Travsus Booking Confirmation',
						attachments: [
							{
								content: invoicePdfHtml,
								filename: 'travsus_invoice.pdf',
								type: 'application/pdf',
								disposition: 'attachment',
							},
							{
								content: receiptPdfHtml,
								filename: 'travsus_receipt.pdf',
								type: 'application/pdf',
								disposition: 'attachment',
							},
						],
						...bookingData,
					},
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)
			return response

			// Send email
			await sendEmail({
				to: bookingData.customerEmail,
				subject: 'Your Travsus Booking Confirmation',
				message: '', // The template will be used instead of this message
				type: 'bookingConfirmation',
			})

			return {
				success: true,
				message:
					'Booking confirmation sent successfully with invoice and receipt',
			}
		} catch (error) {
			console.error('Error in bookingConfirmationEmail:', error)
			return {
				success: false,
				error: 'Failed to generate PDFs or send booking confirmation',
			}
		}
	}
	await confirmationMail()
}
