import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { generatePDF } from '@/lib/generatePDF'

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function GET(request: NextRequest) {
	try {
		// Dummy data for an invoice
		const dummyData = {
			invoiceNumber: 'INV-2024-001',
			orderDate: '2024-11-09',
			orderNumber: 'TV-1176279-9389155',
			customerName: 'John Doe',
			customerAddress: '123 Travel Street, Apt 4B',
			customerCity: 'San Sebastian',
			customerRegion: 'Gipuzkoa',
			customerPostalCode: '20012',
			customerCountry: 'Spain',
			tourName: 'European Adventure Tour',
			tourDuration: 7,
			priceExclVAT: 406.44,
			vatRate: 21,
			vatAmount: 85.35,
			priceInclVAT: 491.79,
		}

		// Generate PDF
		const pdfBuffer = await generatePDF({
			templateName: 'invoice_template',
			data: dummyData,
		})

		// Create email
		const msg = {
			to: 'skendoulmohamed@gmail.com', // Recipient's email address
			from: 'test-invoices@travsus.com', // Test sender email address
			subject: '[TEST] Your Travsus Invoice (Dummy)',
			text: 'THIS IS A TEST EMAIL. Please ignore. \n\nPlease find attached your dummy invoice from Travsus.',
			html: `
        <strong style="color: red;">THIS IS A TEST EMAIL. Please ignore.</strong><br><br>
        <strong>Please find attached your dummy invoice from Travsus.</strong><br><br>
        <a href="https://www.travsus.com/unsubscribe">Unsubscribe from test emails</a>
      `,
			attachments: [
				{
					content: pdfBuffer.toString('base64'),
					filename: 'travsus_dummy_invoice.pdf',
					type: 'application/pdf',
					disposition: 'attachment',
				},
			],
		}

		// Send email
		await sgMail.send(msg)

		return NextResponse.json(
			{ message: 'Dummy invoice generated and sent successfully' },
			{ status: 200 },
		)
	} catch (error) {
		console.error('Error generating PDF or sending email:', error)
		return NextResponse.json(
			{ error: 'Failed to generate PDF or send email' },
			{ status: 500 },
		)
	}
}
