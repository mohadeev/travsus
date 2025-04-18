'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, CreditCard, Wallet } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import PayoutMethodsList from '@/components/payout/payout-methods-list'
import AddPayoutMethodForm from '@/components/payout/add-payout-method-form'
import { useSelector } from 'react-redux'

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
					description: 'Failed to load your payment and payout methods',
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
			title: 'Add Payment Method',
			description:
				'This feature would open a form to add a new payment method.',
		})
	}

	const handleManagePayments = () => {
		toast({
			title: 'Manage Payments',
			description: 'This would show your payment history and details.',
		})
	}

	const handleAddGiftCard = () => {
		toast({
			title: 'Add Gift Card',
			description: 'This would open a form to add a gift card.',
		})
	}

	const handleAddCoupon = () => {
		toast({
			title: 'Add Coupon',
			description: 'This would open a form to add a coupon code.',
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
				throw new Error(errorData.message || 'Failed to add payout method')
			}

			const result = await response.json()

			// Add the new payout method to the state
			setPayoutMethods((prev) => [...prev, result.payoutMethod])
			setShowAddPayoutForm(false)

			toast({
				title: 'Success',
				description: 'Payout method added successfully',
			})
		} catch (error) {
			console.error('Error adding payout method:', error)
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: 'Failed to add payout method',
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
				throw new Error(errorData.message || 'Failed to delete payout method')
			}

			// Remove the deleted payout method from the state
			setPayoutMethods((prev) => prev.filter((method) => method.id !== id))

			toast({
				title: 'Success',
				description: 'Payout method removed successfully',
			})
		} catch (error) {
			console.error('Error deleting payout method:', error)
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: 'Failed to delete payout method',
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
				throw new Error(errorData.message || 'Failed to update payout method')
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
				description: 'Default payout method updated',
			})
		} catch (error) {
			console.error('Error setting default payout method:', error)
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: 'Failed to update payout method',
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
					Account
				</Link>
				<ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
				<span className="text-gray-800">Payments & payouts</span>
			</div>

			{/* Page Title */}
			<h1 className="mb-8 text-3xl font-semibold">Payments & payouts</h1>

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
						Payments
					</button>
					<button
						className={`px-1 pb-4 ${
							activeTab === 'payouts'
								? 'border-b-2 border-black font-medium text-black'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab('payouts')}
					>
						Payouts
					</button>
				</div>
			</div>

			{activeTab === 'payments' ? (
				<div className="space-y-12">
					{/* Your Payments Section */}
					<div>
						<h2 className="mb-2 text-xl font-semibold">Your payments</h2>
						<p className="mb-4 text-gray-600">
							Keep track of all your payments and refunds.
						</p>
						<button
							onClick={handleManagePayments}
							className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
						>
							Manage payments
						</button>
					</div>

					{/* Payment Methods Section */}
					<div>
						<h2 className="mb-2 text-xl font-semibold">Payment methods</h2>
						<p className="mb-4 text-gray-600">
							Add a payment method using our secure payment system, then start
							planning your next trip.
						</p>

						{loading ? (
							<div className="py-4">Loading payment methods...</div>
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
									Add payment method
								</button>
							</div>
						)}
					</div>

					{/* travsus Gift Credit Section */}
					<div>
						<h2 className="mb-2 text-xl font-semibold">Travsus gift credit</h2>
						<button
							onClick={handleAddGiftCard}
							className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
						>
							Add gift card
						</button>
					</div>

					{/* Coupons Section */}
					<div>
						<h2 className="mb-2 text-xl font-semibold">Coupons</h2>
						<div className="mb-4 flex items-center justify-between">
							<p>Your coupons</p>
							<p>0</p>
						</div>
						<button
							onClick={handleAddCoupon}
							className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
						>
							Add coupon
						</button>
					</div>
				</div>
			) : (
				<div className="space-y-8">
					{!showAddPayoutForm ? (
						<div>
							<h2 className="mb-2 text-xl font-semibold">
								How you'll get paid
							</h2>
							<p className="mb-6 text-gray-600">
								Add at least one payout method so we know where to send your
								money.
							</p>

							{loading ? (
								<div className="py-4">Loading payout methods...</div>
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
								<h3 className="mb-6 text-xl font-semibold">Need help?</h3>
								<div className="space-y-4">
									<button className="flex w-full items-center justify-between border-b border-gray-200 py-2">
										<span className="font-medium">
											When you'll get your payout
										</span>
										<ChevronRight className="h-5 w-5" />
									</button>

									<button className="flex w-full items-center justify-between border-b border-gray-200 py-2">
										<span className="font-medium">How payouts work</span>
										<ChevronRight className="h-5 w-5" />
									</button>

									<button className="flex w-full items-center justify-between border-b border-gray-200 py-2">
										<span className="font-medium">
											Go to your transaction history
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
							Make all payments through travsus
						</h2>
						<p className="mb-4 text-gray-600">
							Always pay and communicate through travsus to ensure you're
							protected under our Terms of Service, Payments Terms of Service,
							cancellation, and other safeguards.
						</p>
						<Link href="#" className="font-medium text-black underline">
							Learn more
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
