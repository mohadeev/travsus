import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import jsPDF from 'jspdf'

// Set up SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function GET() {
	try {
		// Create a new PDF document
		const doc = new jsPDF()

		// Add content to the PDF
		doc.setFontSize(16)
		doc.text('Hello from Next.js!', 20, 20)
		doc.setFontSize(12)
		doc.text('This is a sample PDF generated using jsPDF.', 20, 30)

		// Generate PDF buffer
		const pdfBuffer = doc.output('arraybuffer')

		// Encode PDF to base64
		const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')

		// Prepare email
		const msg = {
			to: 'skendoulmohamed@gmail.com',
			from: 'example@travsus.com',
			subject: 'Your Generated PDF',
			text: 'Please find attached the generated PDF.',
			attachments: [
				{
					content: pdfBase64,
					filename: 'generated.pdf',
					type: 'application/pdf',
					disposition: 'attachment',
				},
			],
		}

		// Send email
		await sgMail.send(msg)

		return NextResponse.json({ message: 'PDF generated and sent successfully' })
	} catch (error) {
		console.error('Error:', error)
		return NextResponse.json(
			{ error: 'Failed to generate and send PDF' },
			{ status: 500 },
		)
	}
}
