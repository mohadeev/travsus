// import { emailTemplatesFooter } from './EmailTemplatesFooter'
// import { emailTemplatesHeader } from './EmailTemplatesHeader'

import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'

export const verifyEmailAddress = (data: {
	verificationLinkToken: string
	verificationCodeToken: string
	verificationCode: string
}) => {
	const tokenVerificationUrl = `${process.env.NEXTAUTH_URL}/verify-email/token?token=${data.verificationLinkToken}`
	const codeVerificationUrl = `${process.env.NEXTAUTH_URL}/verify-email/code?token=${data.verificationCodeToken}`

	return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Your Email Address</title>
    </head>
    <body style="background-color: #fff; color: #000; margin: 0; padding: 0; font-family: Helvetica, Arial, sans-serif;">
  
      <!-- Header Section -->
      ${emailTemplatesHeader()}
  
      <!-- Main Content Section -->
      <div style="max-width: 500px; margin: 20px auto; padding: 10px;">
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 20px; color: #000;">Verify Your Email Address</h1>
        
        <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
          Hello,
          <br /><br />
          Thank you for signing up with Travsus. Please verify your email address using one of the following methods:
        </p>
  
        <h2 style="font-size: 18px; font-weight: 600; margin-top: 30px; color: #000;">Method 1: Click the Verification Link</h2>
        <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
          Click the button below to verify your email address:
          <br /><br />
          <a href="${tokenVerificationUrl}" style="font-size: 16px; color: #fff; cursor: pointer; background-color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 20px; display: inline-block;">Verify Email</a>
        </p>
  
        <h2 style="font-size: 18px; font-weight: 600; margin-top: 30px; color: #000;">Method 2: Enter the Verification Code</h2>
        <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
          Go to the link below and enter the following 6-digit code:
          <br /><br />
          <a href="${codeVerificationUrl}" style="color: #000; text-decoration: underline;">${codeVerificationUrl}</a>
          <br /><br />
          <span style="font-size: 24px; font-weight: 700; background-color: #f0f0f0; padding: 10px; border-radius: 5px; letter-spacing: 5px;">${data.verificationCode}</span>
        </p>
  
        <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000; margin-top: 30px;">
          If you didn't request this verification, please ignore this email or contact our support team if you have any concerns.
          <br /><br />
          Happy travels,
          <br /><br />
          The Travsus Support Team
          <br />
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #000;">https://www.travsus.com</a>
        </p>
      </div>
  
      <!-- Footer Section -->
      ${emailTemplatesFooter()}
    </body>
  </html>`
}
