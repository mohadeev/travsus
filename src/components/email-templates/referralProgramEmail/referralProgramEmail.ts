import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'

export const referralProgramEmail = (data: any) => {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Refer a Friend and Earn Rewards!</title>
  </head>
  <body style="background-color: #fff; color: #000; margin: 0; padding: 0; font-family: Helvetica, Arial, sans-serif;">

    <!-- Header Section -->
    ${emailTemplatesHeader()}

    <!-- Main Content Section -->
    <div style="max-width: 500px; margin: 20px auto; padding: 10px;">
      <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
        Hello {{name}},
        <br /><br />
        We hope you're enjoying your Travsus experience! We have an exciting opportunity for you to earn rewards while helping your friends and family discover amazing travel experiences.
        <br /><br />
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
          <b style="font-size: 18px;">Refer a Friend and Earn:</b>
          <br /><br />
          <ul style="padding-left: 20px;">
            <li>You get: <span style="color: #008000; font-weight: bold;">{{referrerReward}}</span> in travel credits</li>
            <li>Your friend gets: <span style="color: #008000; font-weight: bold;">{{referredReward}}</span> off their first booking</li>
          </ul>
        </div>
        <br />
        <b>How It Works:</b>
        <ol style="padding-left: 20px;">
          <li>Share your unique referral link with friends and family</li>
          <li>They sign up and make their first booking</li>
          <li>You both receive your rewards once their trip is completed</li>
        </ol>
        <br />
        Your unique referral link:
        <br />
        <a href="{{referralLink}}" style="color: #0000FF;">{{referralLink}}</a>
        <br /><br />
        Ready to start earning? Click the button below to access your referral dashboard:
        <br /><br />
        <a href="{{referralDashboardLink}}" style="font-size: 16px; color: #fff; cursor: pointer; background-color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 20px;">Access Referral Dashboard</a>
        <br /><br />
        <b>Why Your Friends Will Love Travsus:</b>
        <ul style="padding-left: 20px;">
          <li>Exclusive deals on flights, hotels, and vacation packages</li>
          <li>24/7 customer support</li>
          <li>Flexible booking options</li>
          <li>Rewards program for frequent travelers</li>
        </ul>
        <br />
        If you have any questions about our referral program, please don't hesitate to contact our customer support team.
        <br /><br />
        Happy referring and happy travels!
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
	name: 'David Wilson',
	referrerReward: '$50',
	referredReward: '10%',
	referralLink: 'https://www.travsus.com/refer/DW78901',
	referralDashboardLink: 'https://www.travsus.com/referral-dashboard',
}

// To use the template with default data:
// const emailContent = referralProgramEmail(defaultData);
