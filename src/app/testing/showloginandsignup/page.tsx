'use client'

import React from 'react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { useRepeatedOverlay } from '@/app/hooks/useRepeatedOverlay'
import { useAuthAction } from '@/app/hooks/useAuthAction'
import AuthModal from '@/components/AuthModal'

const ShowLoginAndSignup: React.FC = () => {
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
		alert('Item saved successfully!')
	})

	return (
		<div className="container mx-auto mt-20 text-center">
			<h1 className="mb-10 text-3xl font-bold">Login and Signup Demo</h1>
			<div className="space-x-4">
				<ButtonPrimary onClick={showLoginModal}>Show Login Modal</ButtonPrimary>
				<ButtonPrimary onClick={showSignupModal}>
					Show Signup Modal
				</ButtonPrimary>
				<ButtonPrimary onClick={handleSave}>Save</ButtonPrimary>
			</div>
			<AuthModal />
		</div>
	)
}

export default ShowLoginAndSignup
