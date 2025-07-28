'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, CreditCard, Wallet } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import PayoutMethodsList from '@/components/payout/payout-methods-list'
import AddPayoutMethodForm from '@/components/payout/add-payout-method-form'
import { useSelector } from 'react-redux'
import { useTranslations } from 'next-intl'

interface PaymentMethod {
	id: string
	type: string
	last4: string
	brand: string
	expMonth: number
	expYear: number
}

interface PayoutMethod {
	id: string
	type: string
	email?: string
	accountHolderName?: string
	accountNumber?: string
	bankName?: string
	country: string
	currency: string
	isDefault: boolean
}

export default function PaymentMethodsPage() {
	const t = useTranslations('accountsettings_paymentmethods_page')
	const [activeTab, setActiveTab] = useState('payments')
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
	const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([])
	const [loading, setLoading] = useState(true)
	const [showAddPayoutForm, setShowAddPayoutForm] = useState(false)
	const { toast } = useToast()
	const { userData } = useSelector((state: any) => state.userReducer)

	// Fetch payment methods and payout methods
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				// Fetch payment methods
				const paymentResponse = await fetch('/api/payment-methods')
				if (paymentResponse.ok) {
					const data = await paymentResponse.json()
					setPaymentMethods(data.paymentMethods || [])
				}

				// Fetch payout methods
				const payoutResponse = await fetch('/api/payout-methods')
				if (payoutResponse.ok) {
					const data = await payoutResponse.json()
					setPayoutMethods(data.payoutMethods || [])
				}
			} catch (error) {
				console.error('Error fetching data:', error)
				toast({
					title: 'Error',
					description: t('Failed_to_load_your_payment_and_payout_methods'),
					variant: 'destructive',
				})
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [toast])

	const handleAddPaymentMethod = () => {
		// This would open a modal or redirect to add payment method page
		toast({
			title: t('Add_Payment_Method'),
			description: t(
				'This_feature_would_open_a_form_to_add_a_new_payment_method',
			),
		})
	}

	const handleManagePayments = () => {
		toast({
			title: t('Manage_Payments'),
			description: t('This_would_show_your_payment_history_and_details'),
		})
	}

	const handleAddGiftCard = () => {
		toast({
			title: t('Add_Gift_Card'),
			description: t('This_would_open_a_form_to_add_a_gift_card'),
		})
	}

	const handleAddCoupon = () => {
		toast({
			title: t('Add_Coupon'),
			description: t('This_would_open_a_form_to_add_a_coupon_code'),
		})
	}

	const handleAddPayoutMethod = () => {
		setShowAddPayoutForm(true)
	}

	const handlePayoutFormCancel = () => {
		setShowAddPayoutForm(false)
	}

	const handlePayoutFormSubmit = async (data: any) => {
		try {
			const response = await fetch('/api/payout-methods', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || t('Failed_to_add_payout_method'))
			}

			const result = await response.json()

			// Add the new payout method to the state
			setPayoutMethods((prev) => [...prev, result.payoutMethod])
			setShowAddPayoutForm(false)

			toast({
				title: 'Success',
				description: t('Payout_method_added_successfully'),
			})
		} catch (error) {
			console.error('Error adding payout method:', error)
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: t('Failed_to_add_payout_method'),
				variant: 'destructive',
			})
		}
	}

	const handleDeletePayoutMethod = async (id: string) => {
		try {
			const response = await fetch('/api/payout-methods', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id }),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(
					errorData.message || t('Failed_to_delete_payout_method'),
				)
			}

			// Remove the deleted payout method from the state
			setPayoutMethods((prev) => prev.filter((method) => method.id !== id))

			toast({
				title: 'Success',
				description: t('Payout_method_removed_successfully'),
			})
		} catch (error) {
			console.error('Error deleting payout method:', error)
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: t('Failed_to_delete_payout_method'),
				variant: 'destructive',
			})
		}
	}

	const handleSetDefaultPayoutMethod = async (id: string) => {
		try {
			const response = await fetch('/api/payout-methods', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id, action: 'setDefault' }),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(
					errorData.message || t('Failed_to_update_payout_method'),
				)
			}

			// Update the state to reflect the new default payout method
			setPayoutMethods((prev) =>
				prev.map((method) => ({
					...method,
					isDefault: method.id === id,
				})),
			)

			toast({
				title: 'Success',
				description: t('Default_payout_method_updated'),
			})
		} catch (error) {
			console.error('Error setting default payout method:', error)
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: t('Failed_to_update_payout_method'),
				variant: 'destructive',
			})
		}
	}

	return (
		<div className="mx-auto max-w-4xl px-6 py-8">
			{/* Breadcrumb */}
			<div className="mb-6 flex items-center text-sm">
				<Link
					href="/account-settings"
					className="text-gray-600 hover:underline"
				>
					{t('Account')}
				</Link>
				<ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
				<span className="text-gray-800">{t('Payments_Payouts')}</span>
			</div>

			{/* Page Title */}
			<h1 className="mb-8 text-3xl font-semibold">{t('Payments_Payouts')}</h1>

			{/* Tabs */}
			<div className="mb-8 border-b border-gray-200">
				<div className="flex space-x-8">
					<button
						className={`px-1 pb-4 ${
							activeTab === 'payments'
								? 'border-b-2 border-black font-medium text-black'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab('payments')}
					>
						{t('Payments')}
					</button>
					<button
						className={`px-1 pb-4 ${
							activeTab === 'payouts'
								? 'border-b-2 border-black font-medium text-black'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab('payouts')}
					>
						{t('Payouts')}
					</button>
				</div>
			</div>

			{activeTab === 'payments' ? (
				<div className="space-y-12">
					{/* Your Payments Section */}
					<div>
						<h2 className="mb-2 text-xl font-semibold">{t('Your_Payments')}</h2>
						<p className="mb-4 text-gray-600">
							{t('Keep_Track_Of_All_Your_Payments')}
						</p>
						<button
							onClick={handleManagePayments}
							className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
						>
							{t('Manage_Payments')}
						</button>
					</div>

					{/* Payment Methods Section */}
					<div>
						<h2 className="mb-2 text-xl font-semibold">
							{t('Payment_Methods')}
						</h2>
						<p className="mb-4 text-gray-600">{t('Add_A_Payment_Method')}</p>

						{loading ? (
							<div className="py-4">{t('Loading_Payment_Methods')}</div>
						) : (
							<div className="space-y-4">
								{paymentMethods.map((method) => (
									<div
										key={method.id}
										className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
									>
										<div className="flex items-center">
											<CreditCard className="mr-3 h-6 w-6 text-gray-500" />
											<div>
												<p className="font-medium">
													{method.brand} •••• {method.last4}
												</p>
												<p className="text-sm text-gray-500">
													Expires {method.expMonth}/{method.expYear}
												</p>
											</div>
										</div>
										<button className="font-medium text-black underline">
											Edit
										</button>
									</div>
								))}

								<button
									onClick={handleAddPaymentMethod}
									className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
								>
									{t('Add_Payment_Method')}
								</button>
							</div>
						)}
					</div>

					{/* travsus Gift Credit Section */}
					<div>
						<h2 className="mb-2 text-xl font-semibold">
							{t('Travsus_Gift_Credit')}
						</h2>
						<button
							onClick={handleAddGiftCard}
							className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
						>
							{t('Add_Gift_Card')}
						</button>
					</div>

					{/* Coupons Section */}
					<div>
						<h2 className="mb-2 text-xl font-semibold">{t('Coupons')}</h2>
						<div className="mb-4 flex items-center justify-between">
							<p>{t('Your_Coupons')}</p>
							<p>0</p>
						</div>
						<button
							onClick={handleAddCoupon}
							className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
						>
							{t('Add_Coupon')}
						</button>
					</div>
				</div>
			) : (
				<div className="space-y-8">
					{!showAddPayoutForm ? (
						<div>
							<h2 className="mb-2 text-xl font-semibold">
								{t('How_Youll_Get_Paid')}
							</h2>
							<p className="mb-6 text-gray-600">
								{t('Add_At_Least_One_Payout_Method')}
							</p>

							{loading ? (
								<div className="py-4">{t('Loading_Payout_Methods')}</div>
							) : (
								<PayoutMethodsList
									payoutMethods={payoutMethods}
									onAddMethod={handleAddPayoutMethod}
									onDeleteMethod={handleDeletePayoutMethod}
									onSetDefault={handleSetDefaultPayoutMethod}
								/>
							)}

							{/* Help section */}
							<div className="mt-12 rounded-lg bg-gray-50 p-6">
								<h3 className="mb-6 text-xl font-semibold">{t('Need_Help')}</h3>
								<div className="space-y-4">
									<button className="flex w-full items-center justify-between border-b border-gray-200 py-2">
										<span className="font-medium">
											{t('When_Youll_Get_Your_Payout')}
										</span>
										<ChevronRight className="h-5 w-5" />
									</button>

									<button className="flex w-full items-center justify-between border-b border-gray-200 py-2">
										<span className="font-medium">{t('How_Payouts_Work')}</span>
										<ChevronRight className="h-5 w-5" />
									</button>

									<button className="flex w-full items-center justify-between border-b border-gray-200 py-2">
										<span className="font-medium">
											{t('Go_To_Your_Transaction_History')}
										</span>
										<ChevronRight className="h-5 w-5" />
									</button>
								</div>
							</div>
						</div>
					) : (
						<AddPayoutMethodForm
							onCancel={handlePayoutFormCancel}
							onSubmit={handlePayoutFormSubmit}
						/>
					)}
				</div>
			)}

			{/* Info Card */}
			<div className="mt-12 rounded-xl border border-gray-200 p-6">
				<div className="flex items-start">
					<div className="mr-4 rounded-full bg-pink-100 p-3">
						<Wallet className="h-6 w-6 text-pink-500" />
					</div>
					<div>
						<h2 className="mb-2 text-lg font-semibold">
							{t('Make_All_Payments_Through_Travsus')}
						</h2>
						<p className="mb-4 text-gray-600">
							{t('Always_Pay_And_Communicate_Through_Travsus')}
						</p>
						<Link href="#" className="font-medium text-black underline">
							{t('Learn_More')}
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
