'use client'

import type React from 'react'
import { useEffect, Fragment } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
// import LoginClient from '@/app/login/LoginClient'
// import SignUpClient from '@/app/signup/SignUpClient'
import { useRepeatedOverlay } from '@/app/hooks/useRepeatedOverlay'
import Logo from '@/shared/Logo'
import LoginClient from '@/app/[locale]/login/LoginClient'
import SignUpClient from '@/app/[locale]/signup/SignUpClient'

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

	const isModalVisible =
		overlayState?.isVisible && overlayState.type === 'authModal'
	const isLoginMode = overlayState?.data?.mode !== 'signup'

	if (!isModalVisible) {
		return null
	}

	return (
		<Dialog
			as="div"
			className="z-max relative"
			open={isModalVisible}
			onClose={closeOverlay}
		>
			<Transition show={isModalVisible} as={Fragment} appear>
				<div className="fixed inset-0 bg-black bg-opacity-50">
					<div className="flex min-h-full items-center justify-center p-4">
						<Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all dark:bg-neutral-800">
							<div className="absolute left-6 top-6">
								<Logo />
							</div>
							<button
								onClick={closeOverlay}
								className="absolute right-4 top-4 p-2 text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-200"
							>
								<XMarkIcon className="h-5 w-5" />
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
						</Dialog.Panel>
					</div>
				</div>
			</Transition>
		</Dialog>
	)
}

export default AuthModal
