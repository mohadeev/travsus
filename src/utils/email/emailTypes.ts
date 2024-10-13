import { forgetPassword } from '@/components/email-templates/forget-password/forgetPassword'
import { welcomeTemplate } from '@/components/email-templates/WellcomeTemplate'

const emailTypes = ({ type }: any) => {
	return emailList.find((list) => list.type === type)
}

const emailList = [
	{
		type: 'welcome',
		email: 'notifications@travsus.com',
		password: 'es2e*ghA',
		// password: 'F1!dG3n7*zR@Pq5#',
		subject: 'Welcome to your exclusive travel community!',
		sender: `"Travsus" <notifications@travsus.com>`,
		template: welcomeTemplate,
	},
	{
		type: 'forgetPassword',
		email: 'notifications@travsus.com',
		password: 'es2e*ghA',
		// password: 'F1!dG3n7*zR@Pq5#',
		subject: 'Your Travsus password',
		sender: `"Travsus" <notifications@travsus.com>`,
		template: forgetPassword,
	},
]

export default emailTypes
