import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'

export const accountInactivityReminder = (data: any) => {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>We Miss You! - Special Offer Inside</title>
  </head>
  <body style="background-color: #fff; color: #000; margin: 0; padding: 0; font-family: Arial, sans-serif;">

    <!-- Header Section -->
    ${emailTemplatesHeader}

    <!-- Main Content Section -->
    <div style="max-width: 500px; margin: 20px auto; padding: 10px;">
      <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
        Hello {{name}},
        <br /><br />
        We've noticed it's been a while since you last used your Travsus account. We miss you and hope you'll come back to explore the world with us!
        <br /><br />
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
          <b style="font-size: 18px;">Special Welcome Back Offer:</b>
          <br /><br />
          <span style="color: #008000; font-weight: bold; font-size: 20px;">{{specialOffer}}</span> off your next booking!
          <br />
          Use code: <b>{{promoCode}}</b> at checkout
          <br />
          <small>Valid for bookings made in the next 30 days</small>
        </div>
        <br />
        <b>What's New at Travsus:</b>
        <ul style="padding-left: 20px;">
          <li>{{newFeature1}}</li>
          <li>{{newFeature2}}</li>
          <li>{{newFeature3}}</li>
        </ul>
        <br />
        <b>Popular Destinations You Might Love:</b>
        <ul style="padding-left: 20px;">
          {{#each popularDestinations}}
            <li>{{this}}</li>
          {{/each}}
        </ul>
        <br />
        Ready to plan your next adventure? Click the button below to start exploring:
        <br /><br />
        <a href="{{exploreLink}}" style="font-size: 16px; color: #fff; cursor: pointer; background-color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 20px;">Explore Destinations</a>
        <br /><br />
        If you're having any issues with your account or need assistance, our customer support team is always here to help.
        <br /><br />
        We hope to see you back on Travsus soon!
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
	name: 'Alex Johnson',
	specialOffer: '15%',
	promoCode: 'WELCOMEBACK15',
	newFeature1: 'Personalized travel recommendations based on your preferences',
	newFeature2:
		'Flexible booking options with free cancellation on select properties',
	newFeature3:
		'Enhanced loyalty program with more ways to earn and redeem points',
	popularDestinations: [
		'Bali, Indonesia',
		'Santorini, Greece',
		'Machu Picchu, Peru',
		'Kyoto, Japan',
	],
	exploreLink: 'https://www.travsus.com/explore',
}

// To use the template with default data:
// const emailContent = accountInactivityReminder(defaultData);
