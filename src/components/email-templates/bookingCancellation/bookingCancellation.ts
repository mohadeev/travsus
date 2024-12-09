import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'

export const bookingCancellation = (data: any) => {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Cancellation Confirmation</title>
  </head>
  <body style="background-color: #fff; color: #000; margin: 0; padding: 0; font-family: Helvetica, Arial, sans-serif;">

    <!-- Header Section -->
    ${emailTemplatesHeader()}

    <!-- Main Content Section -->
    <div style="max-width: 500px; margin: 20px auto; padding: 10px;">
      <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
        Hello {{name}},
        <br /><br />
        We're writing to confirm that your booking with Travsus has been cancelled as requested. Here are the details of the cancelled reservation:
        <br /><br />
        <b>Booking Reference:</b> {{bookingReference}}
        <br />
        <b>Destination:</b> {{destination}}
        <br />
        <b>Original Check-in Date:</b> {{checkInDate}}
        <br />
        <b>Original Check-out Date:</b> {{checkOutDate}}
        <br />
        <b>Cancellation Date:</b> {{cancellationDate}}
        <br /><br />
        <b>Refund Information:</b>
        <br />
        {{refundInfo}}
        <br /><br />
        If you're eligible for a refund, please allow 5-10 business days for the amount to be credited back to your original payment method.
        <br /><br />
        You can view the details of your cancellation by clicking the button below:
        <br /><br />
        <a href="{{cancellationDetailsLink}}" style="font-size: 16px; color: #fff; cursor: pointer; background-color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 20px;">View Cancellation Details</a>
        <br /><br />
        If you did not request this cancellation or if you have any questions, please contact our customer support team immediately.
        <br /><br />
        We hope to have the opportunity to serve you in the future.
        <br /><br />
        Best regards,
        <br />
        The Travsus Customer Service Team
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
const defaultData = {
	name: 'Alex Johnson',
	bookingReference: 'TRVS67890',
	destination: 'Tokyo, Japan',
	checkInDate: '2023-09-10',
	checkOutDate: '2023-09-17',
	cancellationDate: '2023-06-30',
	refundInfo:
		'A full refund of $1,500.00 will be processed to your original payment method.',
	cancellationDetailsLink: 'https://www.travsus.com/cancellations/TRVS67890',
}

// To use the template with default data:
// const emailContent = bookingCancellation(defaultData);
