import sendEmail from '@/utils/email/sendMail'
const bookingConfirmationEmailHook = (data: any) => {
	const email = 'skendoulmohamed@gmail.com'
	const fullname = 'Skendoul Mohamed'
	sendEmail({
		to: email,
		subject: 'sñldv',
		message: '´ñsd',
		type: 'bookingConfirmation',
		emailData: {
			name: fullname,
			email,
			restLink: `${process.env.NEXT_PUBLIC_SITE_URL}/sign-in`,
		},
	}) 
	
}

export default bookingConfirmationEmailHook
