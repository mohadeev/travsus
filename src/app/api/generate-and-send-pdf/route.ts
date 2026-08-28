export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { jsPDF } from 'jspdf'
import { JSDOM } from 'jsdom'
import sendEmail from '@/utils/email/sendMail'

// Set up SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export async function POST() {
	try {
		// HTML content as a string
		const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333366; }
            ul { color: #666666; }
          </style>
        </head>
        <body>
          <h1>Hello from Next.js!</h1>
          <p>This is a sample PDF generated from an HTML string.</p>
          <ul>
            <li>Item 1: This is the first item</li>
            <li>Item 2: This is the second item</li>
            <li>Item 3: This is the third item</li>
          </ul>
        </body>
      </html>
    `

		// Create a new jsPDF instance
		const doc = new jsPDF()

		// Use jsdom to parse the HTML
		const dom = new JSDOM(htmlContent)
		const document = dom.window.document

		// Extract text content
		const text = document.body.textContent || ''

		// Add content to PDF
		doc.setFontSize(16)
		doc.setFontSize(12)
		doc.text(text, 20, 30)

		// Get the PDF as base64
		const pdfBase64 = doc.output('datauristring').split(',')[1]

		await sendEmail({
			to: 'skendoulmohamed@gmail.com',
			subject: 'PDF Test',
			message: 'Please find the attached PDF generated from HTML string.',
			type: 'forgetPassword',
			emailData: {
				email: 'skendoulmohamed@gmail.com',
				restLink: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/q?token=${''}`,
				attachments: [
					{
						content: pdfBase64,
						filename: 'generated.pdf',
						type: 'application/pdf',
						disposition: 'attachment',
					},
				],
			},
		})

		return NextResponse.json({ message: 'PDF generated and sent successfully' })
	} catch (error) {
		console.error('Error:', error)
		return NextResponse.json(
			{ error: 'Failed to generate and send PDF' },
			{ status: 500 },
		)
	}
}
