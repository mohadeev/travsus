import QRCode from 'qrcode'
import { JSDOM } from 'jsdom'
import { createCanvas } from 'canvas'
import { formatCurrency } from '@/utils/formatCurrency'
import { filteredLineItems } from '@/utils/lineItemsUtils'

interface Booking {
	tour: {
		name: string
		duration: number
		accommodations: Array<{
			name: string
			pricingTiers: Array<{
				bedOptions: Array<{
					bedType: string
					basePrice: number
				}>
			}>
		}>
	}
	selectedDate: {
		startDate: number
		endDate: number
	}
	accommodation: {
		[key: string]: {
			[key: string]: {
				adult: number
				child: number
			}
		}
	}
	lineItems: Array<{
		description: string
		totalPrice: number
		totalGuests?: number
		unitPrice?: number
	}>
	duration: number
	invoiceNumber?: string
	orderNumber?: string
	bookingReference?: string
	receiptNumber?: string
	createdAt?: string
	customer?: {
		accountData?: {
			firstname?: string
			lastname?: string
		}
		email?: string
		address?: string
		city?: string
		region?: string
		postalCode?: string
		country?: string
	}
	provider?: {
		accountData?: {
			firstname?: string
			lastname?: string
		}
		email?: string
		address?: string
		city?: string
		region?: string
		postalCode?: string
		country?: string
	}
}

const formatDate = (dateString: number): string => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
}

const generateAccommodationRows = (booking: Booking): string => {
	let rows = ''
	const accommodations = booking.accommodation || {}
	for (const [type, rooms] of Object.entries(accommodations)) {
		for (const [roomType, guests] of Object.entries(rooms)) {
			const { adult, child } = guests
			const totalGuests = adult + child
			const adultPrice =
				booking.tour.accommodations
					.find((a) => a.name === type)
					?.pricingTiers[0]?.bedOptions.find(
						(b) => b.bedType.toLowerCase() === roomType.toLowerCase(),
					)?.basePrice || 0
			const childPrice = adultPrice * 1 // 0.7 Assuming child price is 70% of adult price
			const totalPrice = adult * adultPrice + child * childPrice

			rows += `
        <tr>
          <td>${type}</td>
          <td>${roomType}</td>
          <td>${adult}</td>
          <td>${child}</td>
          <td>${totalGuests}</td>
          <td>${formatCurrency(adultPrice)}</td>
          <td>${formatCurrency(childPrice)}</td>
          <td>${formatCurrency(totalPrice)}</td>
        </tr>
      `
		}
	}
	return rows
}

const generateQRCode = async (data: string): Promise<string> => {
	try {
		return await QRCode.toDataURL(data, { errorCorrectionLevel: 'H' })
	} catch (err) {
		console.error('Error generating QR code:', err)
		return ''
	}
}

const generateBarcode = (data: string): string => {
	const JsBarcode = require('jsbarcode')
	const { createCanvas } = require('canvas')
	const canvas = createCanvas(150, 75)
	JsBarcode(canvas, data, {
		format: 'CODE128',
		width: 1.5,
		height: 75,
		displayValue: false,
	})
	return canvas.toDataURL()
}

export const generateInvoice = async (booking: Booking): Promise<string> => {
	let qrCodeData = ''
	let barcodeData = ''

	try {
		qrCodeData = await generateQRCode(booking.invoiceNumber || 'N/A')
	} catch (error) {
		console.error('Error generating QR code:', error)
		qrCodeData = '' // Fallback to empty string if QR code generation fails
	}

	try {
		barcodeData = generateBarcode(booking.bookingReference || 'N/A')
	} catch (error) {
		console.error('Error generating barcode:', error)
		barcodeData = '' // Fallback to empty string if barcode generation fails
	}

	return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Travsus - Invoice</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
          
          :root {
            --color-white-00: #ffffff;
            --color-gray-50: #f9fafb;
            --color-gray-100: #f3f4f6;
            --color-gray-200: #e5e7eb;
            --color-gray-300: #d1d5db;
            --color-gray-400: #9ca3af;
            --color-gray-500: #6b7280;
            --color-gray-600: #4b5563;
            --color-gray-700: #374151;
            --color-gray-800: #1f2937;
            --color-gray-900: #111827;
          }
          
          body {
						font-family: Arial, sans-serif;
            background-color: var(--color-white-00);
            color: var(--color-gray-900);
            line-height: 1.5;
            margin: 0;
            padding: 0;
          }
          
          .container {
            max-width: 800px;
            margin: 40px auto;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
          }
          
          .header {
            background-color: var(--color-gray-800);
            color: white;
            padding: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          
          .logo {
            width: 100px;
          }
          
          .invoice-details {
            margin-top: 16px;
            font-size: 14px;
          }
          
          .invoice-number {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          
          .qr-code {
            margin-bottom: 8px;
          }
          
          .qr-code img {
            max-width: 100px;
            height: auto;
          }
          
          .content {
            padding: 24px;
          }
          
          h2 {
            font-size: 18px;
            font-weight: 600;
            color: var(--color-gray-900);
            margin-top: 0;
            margin-bottom: 16px;
          }
          
          .section {
            margin-bottom: 32px;
          }
          
          .summary {
            background-color: var(--color-gray-50);
            border-radius: 6px;
            padding: 16px;
          }
          
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          
          .detail-label {
            color: var(--color-gray-500);
            font-size: 14px;
          }
          
          .detail-value {
            font-weight: 500;
            text-align: right;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }
          
          th {
            background-color: var(--color-gray-50);
            font-weight: 500;
            text-align: left;
            padding: 12px;
            font-size: 14px;
            color: var(--color-gray-600);
          }
          
          td {
            padding: 12px;
            border-bottom: 1px solid var(--color-gray-200);
            font-size: 14px;
          }
          
          tr:last-child td {
            border-bottom: none;
          }
          
          .total {
            font-weight: 600;
            color: var(--color-gray-900);
          }
          
          .footer {
            background-color: var(--color-gray-50);
            padding: 24px;
            text-align: center;
            font-size: 14px;
            color: var(--color-gray-500);
          }
          
          .barcode-section {
            text-align: center;
            margin-bottom: 24px;
          }
          
          .barcode {
            max-width: 50%;
            height: auto;
          }
          
          @media print {
            body {
              background-color: white;
            }
            .container {
              box-shadow: none;
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <img
                src="https://www.travsus.com/_next/static/media/logo-light.22b411ff.png"
                alt="Travsus Logo"
                class="logo"
              />
              <div class="invoice-details">
                <div class="invoice-number">Invoice ${booking.invoiceNumber || 'N/A'}</div>
                <div>Date: ${booking.createdAt ? formatDate(new Date(booking.createdAt).getTime()) : 'N/A'}</div>
              </div>
            </div>
            <div class="qr-code">
              <img src="${qrCodeData}" alt="QR Code" />
            </div>
          </div>
          
          <div class="content">
            <div class="section">
              <h2>Tour Details</h2>
              <div class="summary">
                <div class="detail-row">
                  <span class="detail-label">Tour Name</span>
                  <span class="detail-value">${booking.tour.name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Duration</span>
                  <span class="detail-value">${booking.duration} days</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Start Date</span>
                  <span class="detail-value">${formatDate(booking.selectedDate.startDate)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">End Date</span>
                  <span class="detail-value">${formatDate(booking.selectedDate.endDate)}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <h2>Booking Information</h2>
              <div class="summary">
                <div class="detail-row">
                  <span class="detail-label">Order Number</span>
                  <span class="detail-value">${booking.orderNumber || 'N/A'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Booking Reference</span>
                  <span class="detail-value">${booking.bookingReference || 'N/A'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Receipt Number</span>
                  <span class="detail-value">${booking.receiptNumber || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <h2>Accommodation Details</h2>
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Room</th>
                    <th>Adults</th>
                    <th>Children</th>
                    <th>Total Guests</th>
                    <th>Unit Price (Adult)</th>
                    <th>Unit Price (Child)</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${generateAccommodationRows(booking)}
                </tbody>
              </table>
            </div>

            <div class="section">
              <h2>Services Provided</h2>
              <table>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${booking.lineItems
										.filter(
											({ includeInTotal }: any) => includeInTotal === true,
										)
										.map(
											(item) => `
                    <tr>
                      <td>${item.description}</td>
                      <td>${item.totalGuests || 'N/A'}</td>
                      <td>${item.unitPrice ? formatCurrency(item.unitPrice) : 'N/A'}</td>
                      <td>${formatCurrency(item.totalPrice)}</td>
                    </tr>
                  `,
										)
										.join('')}
                </tbody>
              </table>
            </div>

            <div class="section">
              <h2>Financial Summary</h2>
              <div class="summary">
                <div class="detail-row total">
                  <span>Total</span>
                  <span>${formatCurrency(filteredLineItems(booking.lineItems).reduce((total, item) => total + item.totalPrice, 0))}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <h2>Customer Details</h2>
              <div class="summary">
                <div class="detail-row">
                  <span class="detail-label">Name</span>
                  <span class="detail-value">${booking.customer?.accountData?.firstname || ''} ${booking.customer?.accountData?.lastname || ''}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email</span>
                  <span class="detail-value">${booking.customer?.email || 'N/A'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Address</span>
                  <span class="detail-value">${booking.customer?.address || 'N/A'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">City, Region, Postal Code</span>
                  <span class="detail-value">${booking.customer?.city || 'N/A'}, ${booking.customer?.region || 'N/A'}, ${booking.customer?.postalCode || 'N/A'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Country</span>
                  <span class="detail-value">${booking.customer?.country || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="barcode-section">
            <img src="${barcodeData}" alt="Barcode" class="barcode" />
          </div>
          <div class="footer">
            <p>
              ${process.env.NEXT_PUBLIC_LEGAL_NAME || 'Travsus'} | Provider: ${booking.provider?.accountData?.firstname || 'N/A'} | Email: ${booking.provider?.accountData?.firstname || 'N/A'}
            </p>
            <p>
              Thank you for choosing us. If you have any questions about this invoice, please contact us.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}
