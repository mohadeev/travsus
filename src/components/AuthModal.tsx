'use client'

import React, { useEffect } from 'react'
import LoginClient from '@/app/login/LoginClient'
import SignUpClient from '@/app/signup/SignUpClient'
import { useRepeatedOverlay } from '@/app/hooks/useRepeatedOverlay'
import Logo from '@/shared/Logo'

const AuthModal: React.FC = () => {
	const { overlayState, toggleOverlay, closeOverlay } =
		useRepeatedOverlay('authModal')

	useEffect(() => {
		if (overlayState?.type === 'authModal' && overlayState.data?.mode) {
			// This effect will run when the mode changes
		}
	}, [overlayState])

	const switchMode = () => {
		toggleOverlay({
			type: 'authModal',
			data: { mode: overlayState?.data?.mode === 'login' ? 'signup' : 'login' },
			isVisible: true,
		})
	}

	if (!overlayState?.isVisible || overlayState.type !== 'authModal') {
		return null
	}

	const isLoginMode = overlayState.data?.mode !== 'signup'

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="relative w-full max-w-md rounded-lg bg-white p-6 dark:bg-neutral-800">
				<div className="absolute left-6 top-6">
					<Logo />
				</div>
				<button
					onClick={closeOverlay}
					className="absolute right-4 top-4 p-2 text-3xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" // Updated this line
				>
					&times;
				</button>
				<div className="mt-12">
					{isLoginMode ? (
						<LoginClient
							isModal={true}
							onClose={closeOverlay}
							onSwitchToSignup={switchMode}
							onSwitchToForgotPassword={() =>
								toggleOverlay({
									type: 'authModal',
									data: { mode: 'forgotPassword' },
									isVisible: true,
								})
							}
						/>
					) : (
						<SignUpClient
							isModal={true}
							onClose={closeOverlay}
							onSwitchToLogin={switchMode}
						/>
					)}
				</div>
			</div>
		</div>
	)
}

export default AuthModal
