'use client'

import React, { useState } from 'react'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import SocialsList from '@/shared/SocialsList'
import Label from '@/components/Label'
import Input from '@/shared/Input'
import Textarea from '@/shared/Textarea'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { sendEmail } from '@/app/actions/sendEmail'
import { useTranslations } from 'use-intl'

export interface PageContactProps {}

const info = [
	{
		title: 'Email',
		desc: 'Address',
	},
	{
		title: 'Phone',
		desc: 'Phone_Number',
	},
]

const PageContact: React.FC<PageContactProps> = () => {
	const t = useTranslations('contact_page')
	const [isLoading, setIsLoading] = useState(false)
	const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>(
		'idle',
	)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsLoading(true)
		setFormStatus('idle')

		const formData = new FormData(event.currentTarget)
		const result = await sendEmail(formData)

		setIsLoading(false)
		setFormStatus(result.success ? 'success' : 'error')
	}

	return (
		<div className={`nc-PageContact overflow-hidden`}>
			<div className="mb-24 lg:mb-32">
				<h2 className="my-16 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 sm:my-20 md:text-5xl md:leading-[115%]">
					{t('Contact')}
				</h2>
				<div className="container mx-auto max-w-7xl">
					<div className="grid flex-shrink-0 grid-cols-1 gap-12 sm:grid-cols-2">
						<div className="max-w-sm space-y-8">
							{info.map((item, index) => (
								<div key={index}>
									<h3 className="text-sm font-semibold uppercase tracking-wider dark:text-neutral-200">
										{t(item.title)}
									</h3>
									<span className="mt-2 block text-neutral-500 dark:text-neutral-400">
										{t(item.desc)}
									</span>
								</div>
							))}
							<div>
								<h3 className="text-sm font-semibold uppercase tracking-wider dark:text-neutral-200">
									{t('Socials')}
								</h3>
								<SocialsList className="mt-2" />
							</div>
						</div>
						<div>
							<form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
								<label className="block">
									<Label>{t('Full_Name')}</Label>
									<Input
										placeholder={t('Full_Name_Placeholder')}
										type="text"
										className="mt-1"
										name="name"
										required
									/>
								</label>
								<label className="block">
									<Label>{t('Address_Label')}</Label>
									<Input
										type="email"
										placeholder={t('Address_Placeholder')}
										className="mt-1"
										name="email"
										required
									/>
								</label>
								<label className="block">
									<Label>{t('Message')}</Label>
									<Textarea className="mt-1" rows={6} name="message" required />
								</label>
								<div>
									<ButtonPrimary type="submit" disabled={isLoading}>
										{isLoading ? t('Sending_Button') : t('Send_Message_Button')}
									</ButtonPrimary>
								</div>
								{formStatus === 'success' && (
									<p className="text-green-600">
										{t('Message_Sent_Successfully')}
									</p>
								)}
								{formStatus === 'error' && (
									<p className="text-red-600">{t('Failed_To_Send_Message')}</p>
								)}
							</form>
						</div>
					</div>
				</div>
			</div>

			{/* OTHER SECTIONS */}
			<div className="container">
				<SectionSubscribe2 className="pb-24 lg:pb-32" />
			</div>
		</div>
	)
}

export default PageContact
