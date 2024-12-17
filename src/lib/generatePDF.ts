import { compileTemplate } from '@/utils/email/compileTemplate'
import { pdfType } from './pdfTypes'
import axios from 'axios'

interface PDFData {
	templateName: string
	data: Record<string, string | number>
}


export async function generatePDF(pdfData: PDFData): Promise<string> {
	try {
		const newPdfType = pdfType({ type: pdfData.templateName })
		let htmlContent: string = await compileTemplate(
			newPdfType?.template,
			pdfData.data,
		)
		const externalServerOrigin = process.env.NEXT_PUBLIC_EXTERNAL_SERVER

		const response = await axios.post(
			`${externalServerOrigin}/api/pdf/generatepdf`,
			{
				htmlContent,
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)

		return htmlContent
	} catch (error) {
		console.error('Error generating PDF:', error)
		throw new Error('Failed to generate PDF')
	}
}
