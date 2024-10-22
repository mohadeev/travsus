import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'

export const reminderNotification = (data: any) => {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Upcoming Booking Reminder</title>
  </head>
  <body style="background-color: #fff; color: #000; margin: 0; padding: 0; font-family: Arial, sans-serif;">

    <!-- Header Section -->
    ${emailTemplatesHeader}

    <!-- Main Content Section -->
    <div style="max-width: 500px; margin: 20px auto; padding: 10px;">
      <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
        Hello {{name}},
        <br /><br />
        This is a friendly reminder about your upcoming booking with Travsus. Your trip is just {{timeUntilBooking}} away!
        <br /><br />
        <b>Booking Details:</b>
        <br />
        <b>Booking Reference:</b> {{bookingReference}}
        <br />
        <b>Destination:</b> {{destination}}
        <br />
        <b>Check-in Date:</b> {{checkInDate}}
        <br />
        <b>Check-out Date:</b> {{checkOutDate}}
        <br />
        <b>Number of Guests:</b> {{numberOfGuests}}
        <br /><br />
        <b>Important Reminders:</b>
        <ul style="padding-left: 20px;">
          <li>Don't forget to check-in online if available</li>
          <li>Ensure your travel documents are up-to-date</li>
          <li>Check the weather forecast for your destination</li>
          <li>Review any specific rules or requirements for your accommodation</li>
        </ul>
        <br />
        You can view or modify your booking details by clicking the button below:
        <br /><br />
        <a href="{{bookingDetailsLink}}" style="font-size: 16px; color: #fff; cursor: pointer; background-color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 20px;">View Booking Details</a>
        <br /><br />
        If you have any questions or need to make changes to your reservation, please don't hesitate to contact our customer support team.
        <br /><br />
        We hope you have a wonderful trip!
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
	name: 'Emma Wilson',
	timeUntilBooking: '2 days',
	bookingReference: 'TRVS54321',
	destination: 'Barcelona, Spain',
	checkInDate: '2023-07-15',
	checkOutDate: '2023-07-22',
	numberOfGuests: 2,
	bookingDetailsLink: 'https://www.travsus.com/bookings/TRVS54321',
}

// To use the template with default data:
// const emailContent = reminderNotification(defaultData);
