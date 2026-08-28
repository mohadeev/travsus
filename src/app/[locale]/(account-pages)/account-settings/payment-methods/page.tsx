export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, CreditCard, Wallet } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import PayoutMethodsList from '@/components/payout/payout-methods-list'
import AddPayoutMethodForm from '@/components/payout/add-payout-method-form'
import { useSelector } from 'react-redux'
import { useTranslations } from '@/lib/i18n'

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
	const t = useTranslations('PaymentMethodsPage')
	const [activeTab, setActiveTab] = useState('payments')
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
	const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([])
	const [loading, setLoading] = useState(true)
	const [showAddPayoutForm, setShowAddPayoutForm] = useState(false)
	const { toast } = useToast()
	const { userData } = useSelector((state: any) => state.userReducer)

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				const paymentResponse = await fetch('/api/payment-methods')
				if (paymentResponse.ok) {
					const data = await paymentResponse.json()
					setPaymentMethods(data.paymentMethods || [])
				}

				const payoutResponse = await fetch('/api/payout-methods')
				if (payoutResponse.ok) {
					const data = await payoutResponse.json()
					setPayoutMethods(data.payoutMethods || [])
				}
			} catch (error) {
				console.error('Error fetching data:', error)
				toast({
					title: t('error'),
					description: t('failed_to_load'),
					variant: 'destructive',
				})
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [toast, t])

	const handleAddPaymentMethod = () => {
		toast({
			title: t('add_payment_method'),
			description: t('add_payment_method_desc'),
		})
	}

	const handleManagePayments = () => {
		toast({
			title: t('manage_payments'),
			description: t('keep_track_of_payments'),
		})
	}

	const handleAddGiftCard = () => {
		toast({
			title: t('add_gift_card'),
			description: t('travsus_gift_credit'),
		})
	}

	const handleAddCoupon = () => {
		toast({
			title: t('add_coupon'),
			description: t('your_coupons'),
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
				throw new Error(errorData.message || t('failed_to_add_payout'))
			}

			const result = await response.json()
			setPayoutMethods((prev) => [...prev, result.payoutMethod])
			setShowAddPayoutForm(false)

			toast({
				title: t('success'),
				description: t('payout_method_added'),
			})
		} catch (error) {
			console.error('Error adding payout method:', error)
			toast({
				title: t('error'),
				description:
					error instanceof Error ? error.message : t('failed_to_add_payout'),
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
				throw new Error(errorData.message || t('failed_to_delete_payout'))
			}

			setPayoutMethods((prev) => prev.filter((method) => method.id !== id))

			toast({
				title: t('success'),
				description: t('payout_method_removed'),
			})
		} catch (error) {
			console.error('Error deleting payout method:', error)
			toast({
				title: t('error'),
				description:
					error instanceof Error ? error.message : t('failed_to_delete_payout'),
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
				throw new Error(errorData.message || t('failed_to_update_payout'))
			}

			setPayoutMethods((prev) =>
				prev.map((method) => ({
					...method,
					isDefault: method.id === id,
				})),
			)

			toast({
				title: t('success'),
				description: t('default_payout_updated'),
			})
		} catch (error) {
			console.error('Error setting default payout method:', error)
			toast({
				title: t('error'),
				description:
					error instanceof Error ? error.message : t('failed_to_update_payout'),
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
					{t('account')}
				</Link>
				<ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
				<span className="text-gray-800">{t('payments_payouts')}</span>
			</div>

			{/* Page Title */}
			<h1 className="mb-8 text-3xl font-semibold">{t('payments_payouts')}</h1>

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
						{t('payments')}
					</button>
					<button
						className={`px-1 pb-4 ${
							activeTab === 'payouts'
								? 'border-b-2 border-black font-medium text-black'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab('payouts')}
					>
						{t('payouts')}
					</button>
				</div>
			</div>

			{activeTab === 'payments' ? (
				<div className="space-y-12">
					{/* Your Payments Section */}
					<div>
						<h2 className="mb-2 text-xl font-semibold">{t('your_payments')}</h2>
						<p className="mb-4 text-gray-600">{t('keep_track_of_payments')}</p>
						<button
							onClick={handleManagePayments}
							className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
						>
							{t('manage_payments')}
						</button>
					</div>

					{/* Payment Methods Section */}
					<div>
						<h2 className="mb-2 text-xl font-semibold">
							{t('payment_methods')}
						</h2>
						<p className="mb-4 text-gray-600">{t('add_payment_method_desc')}</p>

						{loading ? (
							<div className="py-4">{t('loading_payment_methods')}</div>
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
													{t('expires')} {method.expMonth}/{method.expYear}
												</p>
											</div>
										</div>
										<button className="font-medium text-black underline">
											{t('edit')}
										</button>
									</div>
								))}

								<button
									onClick={handleAddPaymentMethod}
									className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
								>
									{t('add_payment_method')}
								</button>
							</div>
						)}
					</div>

					{/* Gift Credit Section */}
					<div>
						<h2 className="mb-2 text-xl font-semibold">
							{t('travsus_gift_credit')}
						</h2>
						<button
							onClick={handleAddGiftCard}
							className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
						>
							{t('add_gift_card')}
						</button>
					</div>

					{/* Coupons Section */}
					<div>
						<h2 className="mb-2 text-xl font-semibold">{t('coupons')}</h2>
						<div className="mb-4 flex items-center justify-between">
							<p>{t('your_coupons')}</p>
							<p>0</p>
						</div>
						<button
							onClick={handleAddCoupon}
							className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
						>
							{t('add_coupon')}
						</button>
					</div>
				</div>
			) : (
				<div className="space-y-8">
					{!showAddPayoutForm ? (
						<div>
							<h2 className="mb-2 text-xl font-semibold">
								{t('how_youll_get_paid')}
							</h2>
							<p className="mb-6 text-gray-600">{t('add_payout_method')}</p>

							{loading ? (
								<div className="py-4">{t('loading_payout_methods')}</div>
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
								<h3 className="mb-6 text-xl font-semibold">{t('need_help')}</h3>
								<div className="space-y-4">
									<button className="flex w-full items-center justify-between border-b border-gray-200 py-2">
										<span className="font-medium">{t('when_payout')}</span>
										<ChevronRight className="h-5 w-5" />
									</button>

									<button className="flex w-full items-center justify-between border-b border-gray-200 py-2">
										<span className="font-medium">{t('how_payouts_work')}</span>
										<ChevronRight className="h-5 w-5" />
									</button>

									<button className="flex w-full items-center justify-between border-b border-gray-200 py-2">
										<span className="font-medium">
											{t('transaction_history')}
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
							{t('make_all_payments')}
						</h2>
						<p className="mb-4 text-gray-600">{t('pay_through_travsus')}</p>
						<Link href="#" className="font-medium text-black underline">
							{t('learn_more')}
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
