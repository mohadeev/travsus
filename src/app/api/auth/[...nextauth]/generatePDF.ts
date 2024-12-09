import htmlPdf from 'html-pdf-node'
import fs from 'fs/promises'
import path from 'path'

interface PDFOptions {
	format: string
	margin: {
		top: number
		right: number
		bottom: number
		left: number
	}
	printBackground: boolean
}

async function generateAndExportPDF(exportPath: string): Promise<string> {
	try {
		// Read the HTML file
		const htmlContent: string = await fs.readFile(
			'updated_receipt.html',
			'utf-8',
		)

		// Options for PDF generation
		const options: PDFOptions = {
			format: 'A4',
			margin: { top: 20, right: 20, bottom: 20, left: 20 },
			printBackground: true,
		}

		// Generate PDF
		const pdfBuffer: Buffer = await htmlPdf.generatePdf(
			{ content: htmlContent },
			options,
		)

		// Create a filename with a timestamp
		const filename = `travsus_receipt_${Date.now()}.pdf`

		// Create the full export path
		const fullExportPath = path.join(exportPath, filename)

		// Ensure the export directory exists
		await fs.mkdir(exportPath, { recursive: true })

		// Write the PDF to the specified export location
		await fs.writeFile(fullExportPath, pdfBuffer)

		console.log('PDF generated and exported successfully!')
		return fullExportPath
	} catch (error) {
		console.error('Error generating or exporting PDF:', error)
		throw error
	}
}

// Example usage
const exportLocation = '/path/to/export/directory'

generateAndExportPDF(exportLocation)
	.then((pdfPath) => {
		console.log('PDF generation and export process completed.')
		console.log('PDF saved at:', pdfPath)
	})
	.catch((error) => {
		console.error('Unhandled error in PDF generation and export:', error)
	})
