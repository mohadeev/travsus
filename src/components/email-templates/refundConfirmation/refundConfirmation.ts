import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'

interface RefundData {
	name: string
	refundId: string
	refundDate: string
	amount: string
	paymentMethod: string
	description: string
	refundDetailsLink: string
}

export const refundConfirmation = (data: RefundData): string => {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Refund Confirmation</title>
  </head>
  <body style="background-color: #fff; color: #000; margin: 0; padding: 0; font-family: Helvetica, Arial, sans-serif;">

    <!-- Header Section -->
    ${emailTemplatesHeader()}

    <!-- Main Content Section -->
    <div style="max-width: 500px; margin: 20px auto; padding: 10px;">
      <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
        Hello ${data.name},
        <br /><br />
        We're writing to confirm that your refund request has been processed successfully by Travsus.
        <br /><br />
        <b>Refund Details:</b>
        <br />
        <br />
        <b>Amount Refunded:</b> ${data.amount}
        <br />
        <b>Original Payment Method:</b> ${data.paymentMethod}
        <br />
        <b>Description:</b> ${data.description}
        <br /><br />
        You can view your refund details by clicking the button below:
        <br /><br />
        <a href="${data.refundDetailsLink}" style="font-size: 16px; color: #fff; cursor: pointer; background-color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 20px;">View Refund Details</a>
        <br /><br />
        Please note that it may take 5-10 business days for the refunded amount to appear in your account, depending on your bank's processing times.
        <br /><br />
        If you have any questions about this refund or if you believe there's an error, please don't hesitate to contact our customer support team immediately.
        <br /><br />
        We appreciate your understanding and thank you for your patience throughout this process.
        <br /><br />
        Best regards,
        <br />
        The Travsus Finance Team
        <br />
        <a href=${process.env.NEXT_PUBLIC_SITE_URL} style="color: #000;">https://www.travsus.com</a>
      </p>
    </div>

    <!-- Footer Section -->
    ${emailTemplatesFooter()}
  </body>
</html>`
}

// Example usage with default data
const defaultData: RefundData = {
	name: 'John Doe',
	refundId: 'TRV-REF-54321',
	refundDate: '2023-07-05',
	amount: '$250.00',
	paymentMethod: 'Visa ending in 5678',
	description:
		'Partial refund for cancelled Paris trip (Booking Ref: TRVS12345)',
	refundDetailsLink: 'https://www.travsus.com/refunds/TRV-REF-54321',
}

// To use the template with default data:
// const emailContent = refundConfirmation(defaultData);
