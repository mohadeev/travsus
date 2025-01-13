import { bookingCancellation } from '@/components/email-templates/bookingCancellation/bookingCancellation'
import { bookingConfirmation } from '@/components/email-templates/bookingConfirmation/bookingConfirmation'
import { forgetPassword } from '@/components/email-templates/forget-password/forgetPassword'
import { newsletterWelcomeTemplate } from '@/components/email-templates/newsletterWelcomeTemplate/newsletterWelcomeTemplate'
import { paymentConfirmation } from '@/components/email-templates/paymentConfirmation/paymentConfirmation'
import { refundConfirmation } from '@/components/email-templates/refundConfirmation/refundConfirmation'
import { reminderNotification } from '@/components/email-templates/reminderNotification/reminderNotification'
import { verifyEmailAddress } from '@/components/email-templates/verifyEmailAddress/verifyEmailAddress'
import { welcomeTemplate } from '@/components/email-templates/welcome/WellcomeTemplate'

const emailTypes = ({ type }: any) => {
	return emailList.find((list) => list.type === type)
}

const emailList = [
	{
		type: 'welcome',
		email: 'notifications@travsus.com',
		subject: 'Welcome to your exclusive travel community!',
		sender: `Travsus <notifications@travsus.com>`,
		template: welcomeTemplate,
	},
	{
		type: 'forgetPassword',
		email: 'no-reply@travsus.com',
		subject: 'Your Travsus password',
		sender: `Travsus <no-reply@travsus.com>`,
		template: forgetPassword,
	},
	{
		type: 'verifyEmailAddress',
		email: 'no-reply@travsus.com',
		subject: 'Your Email for Travsus',
		sender: `Travsus <no-reply@travsus.com>`,
		template: verifyEmailAddress,
	},

	{
		type: 'bookingConfirmation',
		email: 'no-reply@travsus.com',
		subject: 'Your Travsus booking confirmation',
		sender: `Travsus <no-reply@travsus.com>`,
		template: bookingConfirmation,
	},
	{
		type: 'bookingCancellation',
		email: 'no-reply@travsus.com',
		subject: 'Your Travsus booking cancellation',
		sender: `Travsus <no-reply@travsus.com>`,
		template: bookingCancellation,
	},
	{
		type: 'bookingCancellation',
		email: 'no-reply@travsus.com',
		subject: 'Your Travsus booking cancellation',
		sender: `Travsus <no-reply@travsus.com>`,
		template: bookingCancellation,
	},
	{
		type: 'reminderNotification',
		email: 'notifications@travsus.com',
		subject: 'Your Travsus booking cancellation',
		sender: `Travsus <notifications@travsus.com>`,
		template: reminderNotification,
	},

	{
		type: 'paymentConfirmation',
		email: 'payment@travsus.com',
		subject: 'Your Travsus payment confirmation',
		sender: `Travsus <payment@travsus.com>`,
		template: paymentConfirmation,
	},
	{
		type: 'newsletterWelcomeTemplate',
		email: 'notifications@travsus.com',
		subject: 'Welcome to Our Newsletter',
		sender: `Travsus <notifications@travsus.com>`,
		template: newsletterWelcomeTemplate,
	},

	{
		type: 'refundConfirmation',
		email: 'payment@travsus.com',
		subject: 'Your Travsus refund confirmation',
		sender: `Travsus <payment@travsus.com>`,
		template: refundConfirmation,
	},
]

export default emailTypes
