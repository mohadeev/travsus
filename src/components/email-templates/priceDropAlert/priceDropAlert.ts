import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'

export const priceDropAlert = (data: any) => {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Price Drop Alert - Act Now!</title>
  </head>
  <body style="background-color: #fff; color: #000; margin: 0; padding: 0; font-family: Arial, sans-serif;">

    <!-- Header Section -->
    ${emailTemplatesHeader}

    <!-- Main Content Section -->
    <div style="max-width: 500px; margin: 20px auto; padding: 10px;">
      <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
        Hello {{name}},
        <br /><br />
        Great news! The price for a trip you've been eyeing has just dropped. Don't miss this opportunity to save on your dream vacation!
        <br /><br />
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
          <b style="font-size: 18px;">Price Drop Details:</b>
          <br /><br />
          <b>Destination:</b> {{destination}}
          <br />
          <b>Original Price:</b> <span style="text-decoration: line-through;">{{originalPrice}}</span>
          <br />
          <b>New Price:</b> <span style="color: #008000; font-weight: bold;">{{newPrice}}</span>
          <br />
          <b>You Save:</b> <span style="color: #008000; font-weight: bold;">{{savingsAmount}} ({{savingsPercentage}}%)</span>
          <br />
          <b>Travel Dates:</b> {{travelDates}}
        </div>
        <br />
        <b>Why Book Now?</b>
        <ul style="padding-left: 20px;">
          <li>Limited time offer - prices may increase again soon</li>
          <li>Best price guarantee</li>
          <li>Flexible booking options available</li>
          <li>24/7 customer support</li>
        </ul>
        <br />
        Don't let this deal slip away! Click the button below to book your trip at this amazing price:
        <br /><br />
        <a href="{{bookingLink}}" style="font-size: 16px; color: #fff; cursor: pointer; background-color: #008000; padding: 10px 20px; text-decoration: none; border-radius: 20px;">Book Now and Save</a>
        <br /><br />
        If you have any questions or need assistance with your booking, our friendly customer support team is always here to help.
        <br /><br />
        Happy travels and happy savings!
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
	name: 'Emily Parker',
	destination: 'Cancun, Mexico',
	originalPrice: '$1,500.00',
	newPrice: '$1,200.00',
	savingsAmount: '$300.00',
	savingsPercentage: 20,
	travelDates: 'August 15 - August 22, 2023',
	bookingLink: 'https://www.travsus.com/book-now/EP78901',
}

// To use the template with default data:
// const emailContent = priceDropAlert(defaultData);
