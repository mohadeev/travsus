'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
	ArrowLeft,
	Check,
	ChevronRight,
	AlertTriangle,
	Heart,
	UserX,
} from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { useSelector } from 'react-redux'
import { signOut } from 'next-auth/react'

// Steps in the deletion process
enum DeletionStep {
	SELECT_REASON = 0,
	RECONSIDER = 1,
	CONFIRM = 2,
	DONE = 3,
	ERROR = 4,
}

export default function DeleteAccountPage() {
	const [currentStep, setCurrentStep] = useState<DeletionStep>(
		DeletionStep.SELECT_REASON,
	)
	const [selectedReason, setSelectedReason] = useState<string>('')
	const [errorMessage, setErrorMessage] = useState<string>('')
	const [isDeleting, setIsDeleting] = useState<boolean>(false)
	const router = useRouter()
	const { toast } = useToast()
	const { userData } = useSelector((state: any) => state.userReducer)

	// Get user email from Redux state
	const userEmail = userData?.email || 'user@example.com'
	const userName =
		userData?.name || userData?.accountData?.firstname || 'traveler'

	const reasons = [
		'I have safety or privacy concerns.',
		"I can't host anymore.",
		"I can't comply with travsus's Terms of Service / Community Commitment.",
		'Other',
	]

	const handleContinue = () => {
		if (!selectedReason) {
			toast({
				title: 'Please select a reason',
				description: 'You need to select a reason to continue.',
				variant: 'destructive',
			})
			return
		}

		// Go to reconsider step first
		setCurrentStep(DeletionStep.RECONSIDER)
	}

	const handleProceedToConfirm = () => {
		setCurrentStep(DeletionStep.CONFIRM)
	}

	const handleBack = () => {
		if (currentStep === DeletionStep.RECONSIDER) {
			setCurrentStep(DeletionStep.SELECT_REASON)
		} else if (currentStep === DeletionStep.CONFIRM) {
			setCurrentStep(DeletionStep.RECONSIDER)
		} else if (currentStep === DeletionStep.ERROR) {
			setCurrentStep(DeletionStep.CONFIRM)
		}
	}

	const handleStayWithUs = () => {
		router.push('/account')
		toast({
			title: "We're glad you're staying!",
			description: 'Thank you for continuing your journey with us.',
		})
	}

	const handleDeleteAccount = async () => {
		setIsDeleting(true)
		try {
			// Call the API to permanently delete the account
			const response = await fetch('/api/user/delete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ reason: selectedReason }),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.message || 'Failed to delete account')
			}

			// Move to the success step
			setCurrentStep(DeletionStep.DONE)
		} catch (error) {
			console.error('Error deleting account:', error)
			setErrorMessage(
				error instanceof Error
					? error.message
					: 'An unexpected error occurred. Please contact support.',
			)
			setCurrentStep(DeletionStep.ERROR)
			toast({
				title: 'Error',
				description:
					'There was a problem deleting your account. Please try again or contact support.',
				variant: 'destructive',
			})
		} finally {
			setIsDeleting(false)
		}
	}

	const handleClose = async () => {
		// Sign out the user using NextAuth
		await signOut({ redirect: false })

		// Redirect to home page
		router.push('/')

		// Show a toast message
		toast({
			title: 'Signed out',
			description: 'You have been signed out successfully.',
		})
	}

	const handleContactSupport = () => {
		// In a real app, this would open a support form or email
		toast({
			title: 'Contact Support',
			description:
				'This would open a support form or email in a real application.',
		})
	}

	return (
		<div className="mx-auto max-w-4xl px-6 py-8">
			{/* Breadcrumb */}
			<div className="mb-6 flex items-center text-sm">
				<Link href="/account" className="text-gray-600 hover:underline">
					Account
				</Link>
				<ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
				<span className="text-gray-800">Delete account</span>
			</div>

			{/* Progress Bar */}
			<div className="mb-8">
				<div className="flex items-center justify-center space-x-4 text-sm">
					<div className="flex items-center">
						<span
							className={`mr-2 ${currentStep >= DeletionStep.SELECT_REASON ? 'font-medium' : 'text-gray-500'}`}
						>
							1. Select reason
						</span>
						<ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
					</div>
					<div className="flex items-center">
						<span
							className={`mr-2 ${currentStep >= DeletionStep.CONFIRM ? 'font-medium' : 'text-gray-500'}`}
						>
							2. Confirm
						</span>
						<ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
					</div>
					<div>
						<span
							className={
								currentStep === DeletionStep.DONE ||
								currentStep === DeletionStep.ERROR
									? 'font-medium'
									: 'text-gray-500'
							}
						>
							3. Done
						</span>
					</div>
				</div>
				<div className="mt-2 h-2 w-full rounded-full bg-gray-200">
					<div
						className={`h-full rounded-full transition-all ${
							currentStep === DeletionStep.ERROR ? 'bg-red-500' : 'bg-black'
						}`}
						style={{
							width:
								currentStep === DeletionStep.SELECT_REASON
									? '33%'
									: currentStep === DeletionStep.RECONSIDER ||
										  currentStep === DeletionStep.CONFIRM
										? '67%'
										: '100%',
						}}
					/>
				</div>
			</div>

			{/* Step 1: Select Reason */}
			{currentStep === DeletionStep.SELECT_REASON && (
				<div className="space-y-6">
					<h1 className="text-center text-3xl font-semibold">
						What prompted you to delete your account?
					</h1>

					<div className="space-y-4 pt-4">
						{reasons.map((reason) => (
							<div key={reason} className="border-b border-gray-200 pb-4">
								<label className="flex cursor-pointer items-center space-x-3">
									<input
										type="radio"
										className="h-5 w-5 cursor-pointer"
										checked={selectedReason === reason}
										onChange={() => setSelectedReason(reason)}
									/>
									<span>{reason}</span>
								</label>
							</div>
						))}
					</div>

					<div className="flex justify-end pt-4">
						<button
							onClick={handleContinue}
							className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800"
						>
							Continue
						</button>
					</div>
				</div>
			)}

			{/* Reconsider Step */}
			{currentStep === DeletionStep.RECONSIDER && (
				<div className="space-y-6">
					<div className="flex justify-center">
						<div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-pink-100 bg-pink-50">
							<Heart className="h-10 w-10 text-pink-500" />
						</div>
					</div>

					<h1 className="text-center text-3xl font-semibold">
						We'll miss you, {userName}!
					</h1>

					<div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
						<p className="mb-4 text-lg">
							Before you go, we wanted to let you know that:
						</p>
						<ul className="space-y-3 text-left">
							<li className="flex items-start">
								<span className="mr-2 mt-1 text-pink-500">•</span>
								<span>
									Your unique travel experiences and memories with us can't be
									recovered once deleted
								</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 mt-1 text-pink-500">•</span>
								<span>
									You'll lose access to all your saved trips, bookings, and
									special offers
								</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 mt-1 text-pink-500">•</span>
								<span>
									The community will miss your valuable contributions and
									insights
								</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 mt-1 text-pink-500">•</span>
								<span>
									We're constantly improving based on feedback - we'd love to
									hear how we can do better
								</span>
							</li>
						</ul>

						<div className="mt-6 border-t border-gray-200 pt-6">
							<p className="mb-4 font-medium">
								Is there anything we can help with before you make your final
								decision?
							</p>
							<div className="flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
								<Link href="/help" className="text-black underline">
									Get help with your account
								</Link>
								<Link href="/contact" className="text-black underline">
									Contact customer support
								</Link>
								<Link href="/feedback" className="text-black underline">
									Share feedback
								</Link>
							</div>
						</div>
					</div>

					<div className="flex flex-col space-y-3 pt-6 sm:flex-row sm:justify-between sm:space-y-0">
						<button
							onClick={handleBack}
							className="flex items-center justify-center text-black hover:underline"
						>
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back
						</button>

						<div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
							<button
								onClick={handleStayWithUs}
								className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800"
							>
								I'll stay with Travsus
							</button>
							<button
								onClick={handleProceedToConfirm}
								className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-100"
							>
								Continue to deletion
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Step 2: Confirm */}
			{currentStep === DeletionStep.CONFIRM && (
				<div className="space-y-6">
					<div className="flex justify-center">
						<div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-red-100 bg-red-50">
							<UserX className="h-10 w-10 text-red-500" />
						</div>
					</div>

					<h1 className="text-center text-3xl font-semibold">
						Delete account?
					</h1>
					<p className="text-center text-gray-600">{userEmail}</p>

					<div className="space-y-6 pt-4">
						<div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
							<p className="font-medium">
								Warning: This action cannot be undone
							</p>
							<p className="mt-1 text-sm">
								Deleting your account will permanently remove all your data from
								our systems. You will not be able to recover your account or any
								of your information.
							</p>
						</div>

						<div className="flex">
							<div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-black text-black">
								<Check className="h-4 w-4" />
							</div>
							<p>
								Your profile, listings, and all personal data will be
								permanently deleted.
							</p>
						</div>

						<div className="flex">
							<div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-black text-black">
								<Check className="h-4 w-4" />
							</div>
							<p>
								You won't be able to access this account or any of its data ever
								again.
							</p>
						</div>

						<div className="flex">
							<div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-black text-black">
								<Check className="h-4 w-4" />
							</div>
							<p>
								All your reviews, messages, and transaction history will be
								removed.
							</p>
						</div>
					</div>

					<div className="flex flex-col space-y-3 pt-8 sm:flex-row sm:justify-between sm:space-y-0">
						<button
							onClick={handleBack}
							className="flex items-center justify-center text-black hover:underline"
						>
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back
						</button>

						<div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
							<button
								onClick={handleStayWithUs}
								className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800"
							>
								Keep my account
							</button>
							<button
								onClick={handleDeleteAccount}
								disabled={isDeleting}
								className="rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700 disabled:opacity-50"
							>
								{isDeleting ? 'Deleting...' : 'Delete account permanently'}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Step 3: Done */}
			{currentStep === DeletionStep.DONE && (
				<div className="space-y-8 text-center">
					<div className="flex justify-center">
						<div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-gray-100 bg-gray-50">
							<Check className="h-10 w-10 text-black" />
						</div>
					</div>

					<h1 className="text-3xl font-semibold">Account deleted</h1>

					<div className="space-y-6 px-6">
						<div className="flex">
							<div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-black text-black">
								<Check className="h-4 w-4" />
							</div>
							<p className="text-left">
								Your account and all associated data have been permanently
								deleted.
							</p>
						</div>

						<div className="flex">
							<div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-black text-black">
								<Check className="h-4 w-4" />
							</div>
							<p className="text-left">
								You won't be able to access this account or any of its
								information again.
							</p>
						</div>

						<div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
							<p className="text-gray-700">
								We're sorry to see you go. If you ever want to come back, you're
								always welcome to create a new account.
							</p>
							<p className="mt-2 text-gray-700">
								We appreciate the time you spent with us and wish you all the
								best on your future travels.
							</p>
						</div>
					</div>

					<div className="pt-6">
						<button
							onClick={handleClose}
							className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800"
						>
							Sign out and close
						</button>
					</div>
				</div>
			)}

			{/* Error State */}
			{currentStep === DeletionStep.ERROR && (
				<div className="space-y-8">
					<div className="flex justify-center">
						<div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-red-100 bg-red-50">
							<AlertTriangle className="h-10 w-10 text-red-500" />
						</div>
					</div>

					<h1 className="text-center text-3xl font-semibold">
						Unable to delete account
					</h1>

					<div className="rounded-lg border border-red-200 bg-red-50 p-6">
						<p className="mb-4 font-medium">
							We encountered a problem while trying to delete your account:
						</p>
						<p className="text-red-700">{errorMessage}</p>
						<p className="mt-4">
							This could be because you have active bookings, listings, or other
							data that needs to be resolved first.
						</p>
					</div>

					<div className="flex justify-between pt-6">
						<button
							onClick={handleBack}
							className="flex items-center text-black hover:underline"
						>
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back
						</button>
						<button
							onClick={handleContactSupport}
							className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800"
						>
							Contact support
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
