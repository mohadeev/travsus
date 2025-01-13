import { ServerClient } from 'postmark'

const client = new ServerClient(process.env.POSTMARK_API_TOKEN!)

export async function sendVerificationEmail(
	email: string,
	verificationLinkToken: string,
	verificationCodeToken: string,
	verificationCode: string,
) {
	const tokenVerificationUrl = `${process.env.NEXTAUTH_URL}/verify-email/token?token=${verificationLinkToken}`
	const codeVerificationUrl = `${process.env.NEXTAUTH_URL}/verify-email/code?token=${verificationCodeToken}`

	try {
		const response = await client.sendEmail({
			From: '"Travsus" <notifications@travsus.com>',
			To: 'skendoulmohamed@gmail.com',
			Subject: 'Verify your email address',
			HtmlBody: `
        <h1>Verify your email address</h1>
        <p>You can verify your email address using either of the following methods:</p>
        <h2>Method 1: Click the verification link</h2>
        <p>Click the link below to verify your email address:</p>
        <a href="${tokenVerificationUrl}">${tokenVerificationUrl}</a>
        <h2>Method 2: Enter the verification code</h2>
        <p>Go to the link below and enter the following 6-digit code:</p>
        <a href="${codeVerificationUrl}">${codeVerificationUrl}</a>
        <h3>Your verification code: ${verificationCode}</h3>
      `,
			TextBody: `
        Verify your email address

        You can verify your email address using either of the following methods:

        Method 1: Click the verification link
        Click the link below to verify your email address:
        ${tokenVerificationUrl}

        Method 2: Enter the verification code
        Go to the link below and enter the following 6-digit code:
        ${codeVerificationUrl}

        Your verification code: ${verificationCode}
      `,
			MessageStream: 'outbound',
		})

		console.log('Email sent successfully:', response.To)
		return response
	} catch (error) {
		console.error('Error sending email:', error)
		throw error
	}
}

console.log('pass')
