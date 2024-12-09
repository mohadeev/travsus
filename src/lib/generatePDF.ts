import htmlPdf from 'html-pdf-node'
import fs from 'fs/promises'
import path from 'path'
import { compileTemplate } from '@/utils/email/compileTemplate'
import { pdfType } from './pdfTypes'
import { color } from 'framer-motion'

interface PDFData {
	templateName: string
	data: Record<string, string | number>
}

export async function generatePDF(pdfData: PDFData): Promise<Buffer> {
	try {
		const newPdfType = pdfType({ type: pdfData.templateName })
		let htmlContent: any = await compileTemplate(
			newPdfType?.template,
			pdfData.data,
		)
		// let htmlContent = await fs.readFile(templatePath, 'utf-8')

		// Replace placeholders in the HTML with actual data
		// for (const [key, value] of Object.entries(pdfData.data)) {
		// 	const regex = new RegExp(`{{${key}}}`, 'g')
		// 	htmlContent = htmlContent.replace(regex, String(value))
		// }

		// Options for PDF generation
		const options = {
			format: 'A4',
			margin: { top: 40, right: 40, bottom: 40, left: 40 },
			color: '#ffffff',
			printBackground: true,
		}

		// Generate PDF
		const pdfBuffer: any = await htmlPdf.generatePdf(
			{ content: htmlContent },
			options,
		)

		return pdfBuffer
	} catch (error) {
		console.error('Error generating PDF:', error)
		console.error('Failed to generate PDF')
	}
}
