'use client'
export const dynamic = "force-dynamic";

import React from 'react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { useRepeatedOverlay } from '@/app/hooks/useRepeatedOverlay'
import { useAuthAction } from '@/app/hooks/useAuthAction'
import AuthModal from '@/components/AuthModal'
import { useTranslations } from '@/lib/i18n'

const ShowLoginAndSignup: React.FC = () => {
	const t = useTranslations('showloginandsignup_page')
	const { toggleOverlay } = useRepeatedOverlay('authModal')

	const showLoginModal = () => {
		toggleOverlay({
			type: 'authModal',
			data: { mode: 'login' },
			isVisible: true,
		})
	}

	const showSignupModal = () => {
		toggleOverlay({
			type: 'authModal',
			data: { mode: 'signup' },
			isVisible: true,
		})
	}

	const handleSave = useAuthAction(() => {
		alert(t('showloginandsignup_page_Item_Saved_Successfully'))
	})

	return (
		<div className="container mx-auto mt-20 text-center">
			<h1 className="mb-10 text-3xl font-bold">
				{t('showloginandsignup_page_Login_And_Signup_Demo')}
			</h1>
			<div className="space-x-4">
				<ButtonPrimary onClick={showLoginModal}>
					{t('showloginandsignup_page_Show_Login_Modal')}
				</ButtonPrimary>
				<ButtonPrimary onClick={showSignupModal}>
					{t('showloginandsignup_page_Show_Signup_Modal')}
				</ButtonPrimary>
				<ButtonPrimary onClick={handleSave}>
					{t('showloginandsignup_page_Save')}
				</ButtonPrimary>
			</div>
			<AuthModal />
		</div>
	)
}

export default ShowLoginAndSignup
