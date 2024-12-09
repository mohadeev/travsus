import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'

export const bookingModificationConfirmation = (data: any) => {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Modification Confirmation</title>
  </head>
  <body style="background-color: #fff; color: #000; margin: 0; padding: 0; font-family: Helvetica, Arial, sans-serif;">

    <!-- Header Section -->
    ${emailTemplatesHeader()}

    <!-- Main Content Section -->
    <div style="max-width: 500px; margin: 20px auto; padding: 10px;">
      <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
        Hello {{name}},
        <br /><br />
        We're writing to confirm that your booking has been successfully modified. Here are the updated details:
        <br /><br />
        <b>Booking Reference:</b> {{bookingReference}}
        <br />
        <b>Destination:</b> {{destination}}
        <br />
        <b>New Check-in Date:</b> {{newCheckInDate}}
        <br />
        <b>New Check-out Date:</b> {{newCheckOutDate}}
        <br />
        <b>Number of Guests:</b> {{numberOfGuests}}
        <br /><br />
        <b>Changes Made:</b>
        <ul style="padding-left: 20px;">
          {{#each changes}}
            <li>{{this}}</li>
          {{/each}}
        </ul>
        <br />
        <b>Price Adjustment:</b> {{priceAdjustment}}
        <br /><br />
        You can view your updated booking details by clicking the button below:
        <br /><br />
        <a href="{{bookingDetailsLink}}" style="font-size: 16px; color: #fff; cursor: pointer; background-color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 20px;">View Updated Booking</a>
        <br /><br />
        If you have any questions about these changes or need further assistance, please don't hesitate to contact our customer support team.
        <br /><br />
        We look forward to making your trip memorable!
        <br /><br />
        Best regards,
        <br />
        The Travsus Team
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
	name: 'Michael Brown',
	bookingReference: 'TRVS78901',
	destination: 'Rome, Italy',
	newCheckInDate: '2023-08-15',
	newCheckOutDate: '2023-08-22',
	numberOfGuests: 3,
	changes: [
		'Check-in date changed from 2023-08-10 to 2023-08-15',
		'Number of guests increased from 2 to 3',
	],
	priceAdjustment: '+$150.00',
	bookingDetailsLink: 'https://www.travsus.com/bookings/TRVS78901',
}

// To use the template with default data:
// const emailContent = bookingModificationConfirmation(defaultData);
