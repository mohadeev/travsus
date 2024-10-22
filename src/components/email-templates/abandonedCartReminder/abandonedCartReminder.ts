import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'

export const abandonedCartReminder = (data: any) => {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Complete Your Booking</title>
  </head>
  <body style="background-color: #fff; color: #000; margin: 0; padding: 0; font-family: Arial, sans-serif;">

    <!-- Header Section -->
    ${emailTemplatesHeader}

    <!-- Main Content Section -->
    <div style="max-width: 500px; margin: 20px auto; padding: 10px;">
      <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
        Hello {{name}},
        <br /><br />
        We noticed you were planning a trip to {{destination}} but didn't complete your booking. Don't miss out on this amazing opportunity!
        <br /><br />
        <b>Your Saved Booking Details:</b>
        <br />
        <b>Destination:</b> {{destination}}
        <br />
        <b>Check-in Date:</b> {{checkInDate}}
        <br />
        <b>Check-out Date:</b> {{checkOutDate}}
        <br />
        <b>Number of Guests:</b> {{numberOfGuests}}
        <br />
        <b>Total Price:</b> {{totalPrice}}
        <br /><br />
        <b>Why Complete Your Booking Now?</b>
        <ul style="padding-left: 20px;">
          <li>Limited availability - secure your preferred dates</li>
          <li>Current price guaranteed for the next 24 hours</li>
          <li>Free cancellation up to 48 hours before check-in</li>
          <li>24/7 customer support during your trip</li>
        </ul>
        <br />
        Ready to finalize your dream vacation? Click the button below to complete your booking:
        <br /><br />
        <a href="{{completeBookingLink}}" style="font-size: 16px; color: #fff; cursor: pointer; background-color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 20px;">Complete My Booking</a>
        <br /><br />
        If you have any questions or need assistance, our friendly customer support team is always here to help.
        <br /><br />
        We hope to help you make your travel dreams a reality soon!
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
	name: 'Alex Thompson',
	destination: 'Bali, Indonesia',
	checkInDate: '2023-09-15',
	checkOutDate: '2023-09-22',
	numberOfGuests: 2,
	totalPrice: '$1,200.00',
	completeBookingLink: 'https://www.travsus.com/complete-booking/AT78901',
}

// To use the template with default data:
// const emailContent = abandonedCartReminder(defaultData);
