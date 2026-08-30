'use client'
export const dynamic = "force-dynamic";
import { useTranslations } from '@/lib/i18n'
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
	const t = useTranslations('Jan03_DeleteAccount_k5p9')
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
		t('Safety_Privacy_Concerns'),
		t('Cannot_Host_Anymore'),
		t('Cannot_Comply_Terms'),
		t('Other_Reason'),
	]

	const handleContinue = () => {
		if (!selectedReason) {
			toast({
				title: t('Select_Reason_Required'),
				description: t('Select_Reason_Description'),
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
		router.push('/account-settings')
		toast({
			title: t('Glad_Staying_Title'),
			description: t('Glad_Staying_Description'),
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
				throw new Error(data.message || t('Failed_Delete_Account'))
			}

			// Move to the success step
			setCurrentStep(DeletionStep.DONE)
		} catch (error) {
			console.error('Error deleting account:', error)
			setErrorMessage(
				error instanceof Error
					? error.message
					: t('Unexpected_Error_Contact_Support'),
			)
			setCurrentStep(DeletionStep.ERROR)
			toast({
				title: t('Error_Title'),
				description: t('Error_Delete_Description'),
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
			title: t('Signed_Out_Title'),
			description: t('Signed_Out_Description'),
		})
	}

	const handleContactSupport = () => {
		// In a real app, this would open a support form or email
		toast({
			title: t('Contact_Support_Title'),
			description: t('Contact_Support_Description'),
		})
	}

	return (
		<div className="mx-auto max-w-4xl px-6 py-8">
			{/* Breadcrumb */}
			<div className="mb-6 flex items-center text-sm">
				<Link
					href="/account-settings"
					className="text-gray-600 hover:underline"
				>
					{t('Account_Breadcrumb')}
				</Link>
				<ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
				<span className="text-gray-800">{t('Delete_Account_Breadcrumb')}</span>
			</div>

			{/* Progress Bar */}
			<div className="mb-8">
				<div className="flex items-center justify-center space-x-4 text-sm">
					<div className="flex items-center">
						<span
							className={`mr-2 ${currentStep >= DeletionStep.SELECT_REASON ? 'font-medium' : 'text-gray-500'}`}
						>
							{t('Step_Select_Reason')}
						</span>
						<ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
					</div>
					<div className="flex items-center">
						<span
							className={`mr-2 ${currentStep >= DeletionStep.CONFIRM ? 'font-medium' : 'text-gray-500'}`}
						>
							{t('Step_Confirm')}
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
							{t('Step_Done')}
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
						{t('What_Prompted_Delete')}
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
							{t('Continue_Button')}
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
						{t('Will_Miss_You', { userName })}
					</h1>
					<div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
						<p className="mb-4 text-lg">{t('Before_You_Go')}</p>
						<ul className="space-y-3 text-left">
							<li className="flex items-start">
								<span className="mr-2 mt-1 text-pink-500">•</span>
								<span>{t('Unique_Experiences_Lost')}</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 mt-1 text-pink-500">•</span>
								<span>{t('Lose_Access_Trips')}</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 mt-1 text-pink-500">•</span>
								<span>{t('Community_Miss_Contributions')}</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2 mt-1 text-pink-500">•</span>
								<span>{t('Constantly_Improving_Feedback')}</span>
							</li>
						</ul>
						<div className="mt-6 border-t border-gray-200 pt-6">
							<p className="mb-4 font-medium">
								{t('Anything_Help_Before_Decision')}
							</p>
							<div className="flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
								<Link href="/help" className="text-black underline">
									{t('Get_Help_Account')}
								</Link>
								<Link href="/contact" className="text-black underline">
									{t('Contact_Customer_Support')}
								</Link>
								<Link href="/feedback" className="text-black underline">
									{t('Share_Feedback')}
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
							{t('Back_Button')}
						</button>
						<div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
							<button
								onClick={handleStayWithUs}
								className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800"
							>
								{t('Stay_With_Travsus')}
							</button>
							<button
								onClick={handleProceedToConfirm}
								className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-100"
							>
								{t('Continue_To_Deletion')}
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
						{t('Delete_Account_Question')}
					</h1>
					<p className="text-center text-gray-600">{userEmail}</p>
					<div className="space-y-6 pt-4">
						<div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
							<p className="font-medium">{t('Warning_Cannot_Undo')}</p>
							<p className="mt-1 text-sm">{t('Warning_Permanent_Delete')}</p>
						</div>
						<div className="flex">
							<div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-black text-black">
								<Check className="h-4 w-4" />
							</div>
							<p>{t('Profile_Data_Deleted')}</p>
						</div>
						<div className="flex">
							<div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-black text-black">
								<Check className="h-4 w-4" />
							</div>
							<p>{t('No_Access_Ever_Again')}</p>
						</div>
						<div className="flex">
							<div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-black text-black">
								<Check className="h-4 w-4" />
							</div>
							<p>{t('Reviews_Messages_Removed')}</p>
						</div>
					</div>
					<div className="flex flex-col space-y-3 pt-8 sm:flex-row sm:justify-between sm:space-y-0">
						<button
							onClick={handleBack}
							className="flex items-center justify-center text-black hover:underline"
						>
							<ArrowLeft className="mr-1 h-4 w-4" />
							{t('Back_Button')}
						</button>
						<div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
							<button
								onClick={handleStayWithUs}
								className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800"
							>
								{t('Keep_My_Account')}
							</button>
							<button
								onClick={handleDeleteAccount}
								disabled={isDeleting}
								className="rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700 disabled:opacity-50"
							>
								{isDeleting
									? t('Deleting_Progress')
									: t('Delete_Account_Permanently')}
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
					<h1 className="text-3xl font-semibold">
						{t('Account_Deleted_Title')}
					</h1>
					<div className="space-y-6 px-6">
						<div className="flex">
							<div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-black text-black">
								<Check className="h-4 w-4" />
							</div>
							<p className="text-left">
								{t('Account_Data_Permanently_Deleted')}
							</p>
						</div>
						<div className="flex">
							<div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-black text-black">
								<Check className="h-4 w-4" />
							</div>
							<p className="text-left">{t('No_Access_Information_Again')}</p>
						</div>
						<div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
							<p className="text-gray-700">{t('Sorry_To_See_Go')}</p>
							<p className="mt-2 text-gray-700">
								{t('Appreciate_Time_Wish_Best')}
							</p>
						</div>
					</div>
					<div className="pt-6">
						<button
							onClick={handleClose}
							className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800"
						>
							{t('Sign_Out_Close')}
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
						{t('Unable_Delete_Account')}
					</h1>
					<div className="rounded-lg border border-red-200 bg-red-50 p-6">
						<p className="mb-4 font-medium">{t('Problem_Deleting_Account')}</p>
						<p className="text-red-700">{errorMessage}</p>
						<p className="mt-4">{t('Active_Bookings_Resolution')}</p>
					</div>
					<div className="flex justify-between pt-6">
						<button
							onClick={handleBack}
							className="flex items-center text-black hover:underline"
						>
							<ArrowLeft className="mr-1 h-4 w-4" />
							{t('Back_Button')}
						</button>
						<button
							onClick={handleContactSupport}
							className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800"
						>
							{t('Contact_Support_Button')}
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
