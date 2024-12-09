import { generateInvoice } from '@/components/pdf-templates/generateInvoice'
import { generateReceipt } from '@/components/pdf-templates/generateReceipt'

const pdfTypes = [
	{ type: 'invoice_template', template: generateInvoice },
	{ type: 'receipt_template', template: generateReceipt },
]
export const pdfType = ({ type }: any) => {
	return pdfTypes.find((list) => list.type === type)
}
