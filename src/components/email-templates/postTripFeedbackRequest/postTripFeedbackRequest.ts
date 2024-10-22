import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'

export const postTripFeedbackRequest = (data: any) => {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>How Was Your Trip? We'd Love to Hear From You!</title>
  </head>
  <body style="background-color: #fff; color: #000; margin: 0; padding: 0; font-family: Arial, sans-serif;">

    <!-- Header Section -->
    ${emailTemplatesHeader}

    <!-- Main Content Section -->
    <div style="max-width: 500px; margin: 20px auto; padding: 10px;">
      <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
        Hello {{name}},
        <br /><br />
        We hope you had a fantastic time on your recent trip to {{destination}}! We'd love to hear about your experience and how we can make future trips even better.
        <br /><br />
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
          <b style="font-size: 18px;">Your Trip Details:</b>
          <br /><br />
          <b>Destination:</b> {{destination}}
          <br />
          <b>Travel Dates:</b> {{startDate}} - {{endDate}}
          <br />
          <b>Booking Reference:</b> {{bookingReference}}
        </div>
        <br />
        <b>Share Your Feedback:</b>
        <br /><br />
        Your insights are invaluable in helping us improve our services and ensure exceptional experiences for all our travelers. It only takes a few minutes to complete our survey.
        <br /><br />
        <a href="{{feedbackLink}}" style="font-size: 16px; color: #fff; cursor: pointer; background-color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 20px;">Give Your Feedback</a>
        <br /><br />
        <b>As a thank you for your time, you'll receive:</b>
        <ul style="padding-left: 20px;">
          <li>{{rewardAmount}} in travel credits for your next booking</li>
          <li>Entry into our monthly draw for a chance to win {{prizeDescription}}</li>
        </ul>
        <br />
        <b>Quick Ratings:</b>
        <br />
        If you're short on time, you can also provide a quick rating by clicking on the stars below:
        <br /><br />
        <div>
          <a href="{{rating1Link}}" style="text-decoration: none; color: #FFD700; font-size: 24px;">★</a>
          <a href="{{rating2Link}}" style="text-decoration: none; color: #FFD700; font-size: 24px;">★</a>
          <a href="{{rating3Link}}" style="text-decoration: none; color: #FFD700; font-size: 24px;">★</a>
          <a href="{{rating4Link}}" style="text-decoration: none; color: #FFD700; font-size: 24px;">★</a>
          <a href="{{rating5Link}}" style="text-decoration: none; color: #FFD700; font-size: 24px;">★</a>
        </div>
        <br />
        Your feedback helps us maintain our high standards and continually improve our services. We appreciate your time and look forward to hearing about your experience.
        <br /><br />
        Thank you for choosing Travsus for your travel needs. We hope to serve you again on your next adventure!
        <br /><br />
        Best regards,
        <br />
        The Travsus Customer Experience Team
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
	name: 'Sarah Miller',
	destination: 'Paris, France',
	startDate: 'June 10, 2023',
	endDate: 'June 17, 2023',
	bookingReference: 'TRVS54321',
	feedbackLink: 'https://www.travsus.com/feedback/TRVS54321',
	rewardAmount: '$25',
	prizeDescription: 'a luxury weekend getaway',
	rating1Link: 'https://www.travsus.com/quickrating/TRVS54321/1',
	rating2Link: 'https://www.travsus.com/quickrating/TRVS54321/2',
	rating3Link: 'https://www.travsus.com/quickrating/TRVS54321/3',
	rating4Link: 'https://www.travsus.com/quickrating/TRVS54321/4',
	rating5Link: 'https://www.travsus.com/quickrating/TRVS54321/5',
}

// To use the template with default data:
// const emailContent = postTripFeedbackRequest(defaultData);
