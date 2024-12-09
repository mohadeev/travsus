const sgMail = require('@sendgrid/mail')
const sendGrid = () => {
	// Set API Key
	sgMail.setApiKey(process.env.SENDGRID_API_KEY)

	// Create email
	const msg = {
		to: 'skendoulmohamed@gmail.com', // Recipient's email address
		from: 'notifications@travsus.com', // Sender's verified email
		subject: 'Welcome to Travsus!',
		text: 'This is a plain-text email.',
		html: '<strong>This is an HTML email.</strong>',
	}

	// Send email
	sgMail
		.send(msg)
		.then(() => {
			console.log('Email sent successfully!')
		})
		.catch((error: any) => {
			console.error('Error sending email:', error)
		})
}

const postMark = async (emailTyp: any) => {
	const response = await client.sendEmail({
		From: emailTyp.sender, // Sender email address
		To: to, // Recipient email address
		Subject: emailTyp.subject, // Subject line
		HtmlBody: compileWelcomeTemplate(emailTyp.template, emailData), // HTML body
		// TextBody: 'Hello from Postmark!', // Plain text body
		// MessageStream: 'outbound', // Message stream type
	})
}
