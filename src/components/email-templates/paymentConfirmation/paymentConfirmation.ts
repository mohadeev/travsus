import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'

export const paymentConfirmation = (data: any) => {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Confirmation</title>
  </head>
  <body style="background-color: #fff; color: #000; margin: 0; padding: 0; font-family: Arial, sans-serif;">

    <!-- Header Section -->
    ${emailTemplatesHeader}

    <!-- Main Content Section -->
    <div style="max-width: 500px; margin: 20px auto; padding: 10px;">
      <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
        Hello {{name}},
        <br /><br />
        Thank you for your payment to Travsus. We're writing to confirm that your payment has been successfully processed.
        <br /><br />
        <b>Payment Details:</b>
        <br />
        <b>Transaction ID:</b> {{transactionId}}
        <br />
        <b>Date:</b> {{paymentDate}}
        <br />
        <b>Amount:</b> {{amount}}
        <br />
        <b>Payment Method:</b> {{paymentMethod}}
        <br />
        <b>Description:</b> {{description}}
        <br /><br />
        You can view your payment details and download the receipt by clicking the button below:
        <br /><br />
        <a href="{{receiptLink}}" style="font-size: 16px; color: #fff; cursor: pointer; background-color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 20px;">View Receipt</a>
        <br /><br />
        If you have any questions about this payment or if you believe there's an error, please don't hesitate to contact our customer support team immediately.
        <br /><br />
        Thank you for choosing Travsus for your travel needs.
        <br /><br />
        Best regards,
        <br />
        The Travsus Finance Team
        <br />
        <a href=${process.env.NEXT_PUBLIC_SITE_URL} style="color: #000;">https://www.travsus.com</a>
      </p>
    </div>

    <!-- Footer Section -->
    ${emailTemplatesFooter}
  </body>
</html>`
}

// Example usage with default data
const defaultData = {
	name: 'Jane Smith',
	transactionId: 'TRV-PAY-98765',
	paymentDate: '2023-06-30',
	amount: '$500.00',
	paymentMethod: 'Visa ending in 1234',
	description: 'Deposit for Paris trip (Booking Ref: TRVS12345)',
	receiptLink: 'https://www.travsus.com/payments/TRV-PAY-98765',
}

// To use the template with default data:
// const emailContent = paymentConfirmation(defaultData);
