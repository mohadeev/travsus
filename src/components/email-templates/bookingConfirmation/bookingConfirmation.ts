import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'

export const bookingConfirmation = (data: any) => {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Confirmation</title>
  </head>
  <body style="background-color: #fff; color: #000; margin: 0; padding: 0; font-family: Arial, sans-serif;">

    <!-- Header Section -->
    ${emailTemplatesHeader}

    <!-- Main Content Section -->
    <div style="max-width: 500px; margin: 20px auto; padding: 10px;">
      <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
        Hello {{name}},
        <br /><br />
        Great news! Your booking with Travsus has been confirmed. Here are the details of your reservation:
        <br /><br />
        <b>Booking Reference:</b> {{bookingReference}}
        <br />
        <b>Destination:</b> {{destination}}
        <br />
        <b>Check-in Date:</b> {{checkInDate}}
        <br />
        <b>Check-out Date:</b> {{checkOutDate}}
        <br />
        <b>Number of Guests:</b> {{numberOfGuests}}
        <br />
        <b>Total Amount:</b> {{totalAmount}}
        <br /><br />
        You can view your booking details and make any changes by clicking the button below:
        <br /><br />
        <a href="{{bookingDetailsLink}}" style="font-size: 16px; color: #fff; cursor: pointer; background-color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 20px;">View Booking Details</a>
        <br /><br />
        If you have any questions or need further assistance, please don't hesitate to contact our customer support team.
        <br /><br />
        We hope you have a wonderful stay!
        <br /><br />
        Best regards,
        <br />
        The Travsus Team
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
	name: 'John Doe',
	bookingReference: 'TRVS12345',
	destination: 'Paris, France',
	checkInDate: '2023-07-15',
	checkOutDate: '2023-07-22',
	numberOfGuests: 2,
	totalAmount: '$1,200.00',
	bookingDetailsLink: 'https://www.travsus.com/bookings/TRVS12345',
}

// To use the template with default data:
// const emailContent = bookingConfirmation(defaultData);
