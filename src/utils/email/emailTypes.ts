import { bookingCancellation } from '@/components/email-templates/bookingCancellation/bookingCancellation'
import { bookingConfirmation } from '@/components/email-templates/bookingConfirmation/bookingConfirmation'
import { forgetPassword } from '@/components/email-templates/forget-password/forgetPassword'
import { paymentConfirmation } from '@/components/email-templates/paymentConfirmation/paymentConfirmation'
import { reminderNotification } from '@/components/email-templates/reminderNotification/reminderNotification'
import { welcomeTemplate } from '@/components/email-templates/welcome/WellcomeTemplate'

const emailTypes = ({ type }: any) => {
	return emailList.find((list) => list.type === type)
}

const emailList = [
	{
		type: 'welcome',
		email: 'notifications@travsus.com',
		subject: 'Welcome to your exclusive travel community!',
		sender: `"Travsus" <notifications@travsus.com>`,
		template: welcomeTemplate,
	},
	{
		type: 'forgetPassword',
		email: 'notifications@travsus.com',
		subject: 'Your Travsus password',
		sender: `"Travsus" <notifications@travsus.com>`,
		template: forgetPassword,
	},
	{
		type: 'forgetPassword',
		email: 'notifications@travsus.com',
		subject: 'Your Travsus password',
		sender: `"Travsus" <notifications@travsus.com>`,
		template: bookingConfirmation,
	},
	{
		type: 'bookingCancellation',
		email: 'notifications@travsus.com',
		subject: 'Your Travsus booking cancellation',
		sender: `"Travsus" <notifications@travsus.com>`,
		template: bookingCancellation,
	},
	{
		type: 'bookingCancellation',
		email: 'notifications@travsus.com',
		subject: 'Your Travsus booking cancellation',
		sender: `"Travsus" <notifications@travsus.com>`,
		template: bookingCancellation,
	},
	{
		type: 'reminderNotification',
		email: 'notifications@travsus.com',
		subject: 'Your Travsus booking cancellation',
		sender: `"Travsus" <notifications@travsus.com>`,
		template: reminderNotification,
	},

	{
		type: 'paymentConfirmation',
		email: 'notifications@travsus.com',
		subject: 'Your Travsus booking cancellation',
		sender: `"Travsus" <notifications@travsus.com>`,
		template: paymentConfirmation,
	},
]

export default emailTypes
