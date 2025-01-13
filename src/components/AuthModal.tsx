'use client'

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LoginClient from '@/app/login/LoginClient'
import SignUpClient from '@/app/signup/SignUpClient'
import { useRepeatedOverlay } from '@/app/hooks/useRepeatedOverlay'
import Logo from '@/shared/Logo'

const AuthModal: React.FC = () => {
	const {
		overlayState,
		toggleOverlay,
		closeOverlay: originalCloseOverlay,
	} = useRepeatedOverlay('authModal')
	const searchParams = useSearchParams()
	const router = useRouter()

	useEffect(() => {
		const authParam = searchParams.get('auth')
		if (authParam === 'login' || authParam === 'signup') {
			toggleOverlay({
				type: 'authModal',
				data: { mode: authParam },
				isVisible: true,
			})
		}
	}, [searchParams, toggleOverlay])

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

	const closeOverlay = () => {
		// Remove auth-related query parameters
		const currentParams = new URLSearchParams(window.location.search)
		currentParams.delete('auth')
		currentParams.delete('authMode')
		currentParams.delete('verificationCodeToken')
		const newSearch = currentParams.toString()
		const newPath = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`

		router.push(newPath)

		// Call the original closeOverlay function
		originalCloseOverlay()
	}

	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			closeOverlay()
		}
	}

	if (!overlayState?.isVisible || overlayState.type !== 'authModal') {
		return null
	}

	const isLoginMode = overlayState.data?.mode !== 'signup'

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
			onClick={handleOverlayClick}
		>
			<div className="relative w-full max-w-md rounded-lg bg-white p-6 dark:bg-neutral-800">
				<div className="absolute left-6 top-6">
					<Logo />
				</div>
				<button
					onClick={closeOverlay}
					className="absolute right-4 top-4 p-2 text-3xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
