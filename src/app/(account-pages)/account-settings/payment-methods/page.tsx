'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, CreditCard, Wallet } from 'lucide-react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { useToast } from '@/hooks/useToast'

interface PaymentMethod {
	id: string
	type: string
	last4: string
	brand: string
	expMonth: number
	expYear: number
}

export default function PaymentMethodsPage() {
	const [activeTab, setActiveTab] = useState('payments')
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
	const [loading, setLoading] = useState(true)
	const { toast } = useToast()

	// Mock data for demonstration
	useEffect(() => {
		// In a real app, this would be an API call
		setTimeout(() => {
			setPaymentMethods([
				{
					id: 'pm_1',
					type: 'card',
					last4: '4242',
					brand: 'Visa',
					expMonth: 12,
					expYear: 2025,
				},
			])
			setLoading(false)
		}, 1000)
	}, [])

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
						<h2 className="mb-2 text-xl font-semibold">travsus gift credit</h2>
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
					<div>
						<h2 className="mb-4 text-xl font-semibold">Payout methods</h2>
						<p className="mb-6 text-gray-600">
							When you receive a payment for a reservation, we call that payment
							to you a "payout." Our secure payment system supports several
							payout methods, which can be set up below.
						</p>
						<p className="mb-6 text-gray-600">
							To get paid, you need to set up a payout method. travsus releases
							payouts about 24 hours after a guest's scheduled check-in time.
							The time it takes for the funds to appear in your account depends
							on your payout method.
						</p>
						<ButtonPrimary>Add payout method</ButtonPrimary>
					</div>
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
