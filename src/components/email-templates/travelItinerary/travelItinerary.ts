import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'

export const travelItinerary = (data: any) => {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Travel Itinerary</title>
  </head>
  <body style="background-color: #fff; color: #000; margin: 0; padding: 0; font-family: Helvetica, Arial, sans-serif;">

    <!-- Header Section -->
    ${emailTemplatesHeader()}

    <!-- Main Content Section -->
    <div style="max-width: 500px; margin: 20px auto; padding: 10px;">
      <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
        Hello {{name}},
        <br /><br />
        Your trip is just around the corner! Here's a detailed itinerary to help you prepare for your upcoming adventure.
        <br /><br />
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
          <b style="font-size: 18px;">Trip Overview:</b>
          <br /><br />
          <b>Destination:</b> {{destination}}
          <br />
          <b>Travel Dates:</b> {{startDate}} - {{endDate}}
          <br />
          <b>Booking Reference:</b> {{bookingReference}}
        </div>
        <br />
        <b>Detailed Itinerary:</b>
        <br /><br />
        {{#each itineraryItems}}
          <div style="margin-bottom: 15px;">
            <b>{{date}}</b>
            <br />
            {{description}}
            <br />
            {{#if location}}
              Location: {{location}}
              <br />
            {{/if}}
            {{#if time}}
              Time: {{time}}
              <br />
            {{/if}}
          </div>
        {{/each}}
        <br />
        <b>Important Contact Information:</b>
        <ul style="padding-left: 20px;">
          <li>Emergency Contact: {{emergencyContact}}</li>
          <li>Local Embassy: {{localEmbassy}}</li>
          <li>Travsus 24/7 Support: {{supportNumber}}</li>
        </ul>
        <br />
        <b>Travel Tips:</b>
        <ul style="padding-left: 20px;">
          <li>Check the weather forecast and pack accordingly</li>
          <li>Ensure your passport is valid for at least six months beyond your return date</li>
          <li>Familiarize yourself with local customs and etiquette</li>
          <li>Keep a copy of this itinerary and important documents with you</li>
        </ul>
        <br />
        For any changes or questions about your itinerary, please click the button below:
        <br /><br />
        <a href="{{manageBookingLink}}" style="font-size: 16px; color: #fff; cursor: pointer; background-color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 20px;">Manage My Booking</a>
        <br /><br />
        We hope you have a fantastic trip!
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
	name: 'Emma Thompson',
	destination: 'Tokyo, Japan',
	startDate: 'July 15, 2023',
	endDate: 'July 22, 2023',
	bookingReference: 'TRVS98765',
	itineraryItems: [
		{
			date: 'July 15, 2023',
			description: 'Arrival at Narita International Airport',
			location: 'Narita International Airport',
			time: '14:30',
		},
		{
			date: 'July 16, 2023',
			description: "Guided tour of Tokyo's historic sites",
			location: 'Meeting point: Hotel Lobby',
			time: '09:00',
		},
		{
			date: 'July 17, 2023',
			description: 'Free day to explore Tokyo',
		},
		// Add more itinerary items as needed
	],
	emergencyContact: '+1 (555) 123-4567',
	localEmbassy: '+81 3-3224-5000',
	supportNumber: '+1 (800) 987-6543',
	manageBookingLink: 'https://www.travsus.com/manage-booking/TRVS98765',
}

// To use the template with default data:
// const emailContent = travelItinerary(defaultData);
