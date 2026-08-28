export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { generatePDF } from '@/lib/generatePDF'
import sendEmail from '@/utils/email/sendMail'

export async function GET(request: NextRequest) {
	try {
		// Dummy data for a receipt
		const dummyData = {
			receiptNumber: 'REC-2024-001',
			orderDate: '2024-11-09',
			orderNumber: 'TV-1176279-9389155',
			customerName: 'John Doe',
			tourName: 'European Adventure Tour',
			tourDuration: 7,
			priceExclVAT: 406.44,
			vatRate: 21,
			vatAmount: 85.35,
			priceInclVAT: 491.79,
		}

		// Generate PDF
		const pdfBuffer = await generatePDF({
			templateName: 'receipt_template',
			data: dummyData,
		})

		// Send email
		await sendEmail({
			to: 'skendoulmohamed@gmail.com',
			subject: 'Your Travsus Receipt',
			message: 'Please find attached your receipt from Travsus.',
			type: 'receipt',
			emailData: {
				customerName: dummyData.customerName,
				receiptNumber: dummyData.receiptNumber,
				attachment: {
					content: pdfBuffer.toString('base64'),
					filename: 'travsus_receipt.pdf',
					type: 'application/pdf',
					disposition: 'attachment',
				},
			},
		})

		return NextResponse.json(
			{ message: 'Receipt generated and sent successfully' },
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
