import { generatePDF } from '@/lib/generatePDF'
import sendEmail from '@/utils/email/sendMail'

export const bookingConfirmationEmail = async (bookingData: any) => {
	const confirmationMail = async () => {
		try {
			const invoicePdfBuffer = await generatePDF({
				templateName: 'invoice_template',
				data: bookingData,
			})

			// Generate Receipt PDF
			const receiptPdfBuffer = await generatePDF({
				templateName: 'receipt_template',
				data: bookingData,
			})

			// Send email
			await sendEmail({
				to: bookingData.customerEmail,
				subject: 'Your Travsus Booking Confirmation',
				message: '', // The template will be used instead of this message
				type: 'bookingConfirmation',
				emailData: {
					...bookingData,
					attachments: [
						{
							content: invoicePdfBuffer.toString('base64'),
							filename: 'travsus_invoice.pdf',
							type: 'application/pdf',
							disposition: 'attachment',
						},
						{
							content: receiptPdfBuffer.toString('base64'),
							filename: 'travsus_receipt.pdf',
							type: 'application/pdf',
							disposition: 'attachment',
						},
					],
				},
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
