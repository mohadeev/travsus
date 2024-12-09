'use client'

import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
	Elements,
	useStripe,
	useElements,
	CardElement,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import NewCardForm from './new-card-form'
import totalAmount from '@/app/(service-detail)/[listing-experiences-detail]/totalAmount'
import { useSelector } from 'react-redux'
import Spinner from '@/components/ui/Spinner'
import { Route } from 'next'
import { useRouter } from 'next/navigation'
import ButtonPrimary from '@/shared/ButtonPrimary'

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

interface CustomStripeFormProps {
	userId: string
	userEmail: string
	booking: any
}

const CustomStripeForm: React.FC<CustomStripeFormProps> = ({
	userId,
	userEmail,
	booking,
}: any) => {
	const router = useRouter()
	const stripe: any = useStripe()
	const elements: any = useElements()
	const [error, setError] = useState<string>('')
	const [success, setSuccess] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)
	const [paymentMethods, setPaymentMethods] = useState<any[]>([])
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
		string | null
	>(null)
	const [newPaymentMethod, setNewPaymentMethod] = useState<boolean>(false)
	const [clientSecret, setClientSecret] = useState<string | null>(null)
	const [paymentConfirmed, setPaymentConfirmed] = useState<boolean>(false)
	const newTotalAmount = totalAmount(booking?.lineItems)
	const { status } = useSelector((state: any) => state.bookingSlice)
	const { tour }: any = booking
	const [currentStatus, setCurrentStatus] = useState('')

	const createBooking = async () => {
		setCurrentStatus('loading')
		const response = await fetch('/api/bookings', {
			method: 'POST',
			body: JSON.stringify(booking),
		})

		if (!response.ok) {
			setCurrentStatus('')
			console.error('Failed to create booking')
		}
		setCurrentStatus('')

		return response.json()
	}

	useEffect(() => {
		const fetchPaymentMethods = async () => {
			try {
				const response = await fetch(`/api/payment-methods?userId=${userId}`)
				if (!response.ok) {
					console.error('Failed to fetch payment methods')
				}
				const data = await response.json()
				setPaymentMethods(data.paymentMethods)
			} catch (error) {
				console.error('Error fetching payment methods:', error)
				setError('Failed to load payment methods. Please try again.')
			}
		}

		fetchPaymentMethods()
	}, [userId])

	const handlePayment = async (formData: any) => {
		setLoading(true)
		setError('')
		setSuccess('')

		if (!stripe || !elements) {
			setError('Stripe has not loaded yet. Please try again.')
			setLoading(false)
			return
		}

		try {
			await createBooking()
			if (newPaymentMethod) {
				await initiatePayment(formData)
			} else {
				await processExistingPaymentMethod()
			}
		} catch (error: any) {
			console.error('Error in payment handling:', error)
			setError(
				error.message || 'An unexpected error occurred. Please try again.',
			)
		} finally {
			setLoading(false)
			router.push(
				`/checkout/checkout?bookingId=${booking.id}&serviceId=${tour.id}` as Route,
			)
		}
	}

	const initiatePayment = async (formData: any) => {
		const cardElement = elements.getElement(CardElement)
		if (!cardElement) {
			console.error('Card element not found. Please refresh and try again.')
		}

		const { paymentMethod, error: paymentMethodError } =
			await stripe.createPaymentMethod({
				type: 'card',
				card: cardElement,
				billing_details: {
					name: formData.cardHolder,
					address: {
						line1: formData.line1,
						line2: formData.line2,
						city: formData.city,
						state: formData.state,
						postal_code: formData.postal_code,
						country: formData.country,
					},
				},
			})

		if (paymentMethodError) {
			console.error(
				paymentMethodError.message || 'Failed to create payment method',
			)
		}

		if (!paymentMethod || !paymentMethod.id) {
			console.error('Failed to create payment method. Please try again.')
		}

		const paymentMethodId = paymentMethod.id

		const saveResponse = await fetch('/api/payment-methods', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId,
				userEmail,
				paymentMethodId,
				cardHolder: formData.cardHolder,
				billingAddress: {
					line1: formData.line1,
					line2: formData.line2,
					city: formData.city,
					state: formData.state,
					postal_code: formData.postal_code,
					country: formData.country,
				},
			}),
		})

		if (!saveResponse.ok) {
			console.error('Failed to save new payment method. Please try again.')
		}

		const response = await fetch('/api/initiate-payment', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId,
				userEmail,
				paymentMethodId,
				currency: 'eur',
			}),
		})

		if (!response.ok) {
			const result = await response.json()
			console.error(result.message || 'Failed to initiate payment')
		}

		const { clientSecret } = await response.json()
		setClientSecret(clientSecret)

		setSuccess('Payment initiated. Please confirm the payment.')
	}

	const processExistingPaymentMethod = async () => {
		if (!selectedPaymentMethod) {
			console.error('Please select a payment method to charge.')
		}

		const response = await fetch('/api/process-payment', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId,
				userEmail,
				paymentMethodId: selectedPaymentMethod,
				amount: 55,
				currency: 'eur',
			}),
		})

		if (!response.ok) {
			const result = await response.json()
			console.error(result.message || 'Payment processing failed')
		}

		const { paymentIntentId, requiresCapture } = await response.json()

		if (requiresCapture) {
			await capturePayment(paymentIntentId)
		} else {
			setSuccess('Payment processed successfully!')
			setPaymentConfirmed(true)
		}
	}

	const capturePayment = async (paymentIntentId: string) => {
		const response = await fetch('/api/capture-payment', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ paymentIntentId }),
		})

		if (!response.ok) {
			const result = await response.json()
			console.error(result.message || 'Payment capture failed')
		}

		setSuccess('Payment captured successfully!')
		setPaymentConfirmed(true)
	}

	const confirmPayment = async () => {
		setLoading(true)
		setError('')
		setSuccess('')

		if (!stripe || !clientSecret) {
			setError('Unable to confirm payment. Please try again.')
			setLoading(false)
			return
		}

		try {
			await createBooking()

			const { paymentIntent, error } =
				await stripe.confirmCardPayment(clientSecret)

			if (error) {
				console.error(error.message || 'Payment confirmation failed')
			}

			if (paymentIntent.status === 'requires_capture') {
				await capturePayment(paymentIntent.id)
			} else if (paymentIntent.status === 'succeeded') {
				setSuccess('Payment confirmed and captured successfully!')
				setPaymentConfirmed(true)
			} else {
				console.error(`Payment failed with status: ${paymentIntent.status}`)
			}
		} catch (error) {
			console.error('Error in payment confirmation:', error)
			setError(error.message || 'An error occurred during payment confirmation')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="mx-auto w-full max-w-md">
			{paymentMethods.length > 0 && (
				<div className="mb-4">
					<Label htmlFor="existingPaymentMethods">
						Select Existing Payment Method:
					</Label>
					<select
						id="existingPaymentMethods"
						value={selectedPaymentMethod || ''}
						onChange={(e) => {
							setSelectedPaymentMethod(e.target.value)
							setNewPaymentMethod(false)
						}}
						className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
					>
						<option value="">-- Select a payment method --</option>
						{paymentMethods.map((method) => (
							<option
								key={method.stripePaymentMethodId}
								value={method.stripePaymentMethodId}
							>
								{method.brand} **** **** **** {method.last4} -{' '}
								{method.cardHolder}
							</option>
						))}
					</select>
				</div>
			)}

			<div className="mb-4">
				<label className="inline-flex items-center">
					<input
						type="checkbox"
						checked={newPaymentMethod}
						onChange={(e) => {
							setNewPaymentMethod(e.target.checked)
							if (e.target.checked) {
								setSelectedPaymentMethod(null)
							}
						}}
						className="form-checkbox h-5 w-5 text-indigo-600"
					/>
					<span className="ml-2 text-sm text-gray-700">
						Save as new payment method
					</span>
				</label>
			</div>

			{newPaymentMethod && (
				<NewCardForm onSubmit={handlePayment} loading={loading} />
			)}

			{!clientSecret && !paymentConfirmed && (
				<ButtonPrimary
					className="mt-4 w-full"
					onClick={() => handlePayment({})}
					loading={
						loading || status === 'loading' || currentStatus === 'loading'
					}
					disabled={loading || currentStatus === 'loading'}
				>
					{newPaymentMethod
						? 'Add new card'
						: loading || currentStatus === 'loading'
							? 'Processing...'
							: `Pay €${newTotalAmount}`}
				</ButtonPrimary>
			)}

			{clientSecret && !paymentConfirmed && (
				<ButtonPrimary
					className="mt-4 w-full"
					onClick={confirmPayment}
					loading={
						loading || status === 'loading' || currentStatus === 'loading'
					}
					disabled={
						loading || status === 'loading' || currentStatus === 'loading'
					}
				>
					{loading || currentStatus === 'loading'
						? 'Processing...'
						: 'Confirm Payment'}
				</ButtonPrimary>
			)}

			{paymentConfirmed && (
				<ButtonPrimary
					className="mt-4 w-full"
					onClick={() => handlePayment({})}
					loading={
						loading || status === 'loading' || currentStatus === 'loading'
					}
					disabled={loading || currentStatus === 'loading'}
				>
					{newPaymentMethod
						? 'Add new card'
						: loading || currentStatus === 'loading'
							? 'Processing...'
							: `Pay €${newTotalAmount}`}
				</ButtonPrimary>
			)}

			{error && <Alert variant="destructive">{error}</Alert>}
			{success && <Alert variant="default">{success}</Alert>}
		</div>
	)
}

const StripeContainer: React.FC<CustomStripeFormProps> = ({
	userId,
	userEmail,
	booking,
}) => {
	return (
		<Elements stripe={stripePromise}>
			<CustomStripeForm
				userId={userId}
				booking={booking}
				userEmail={userEmail}
			/>
		</Elements>
	)
}

export default StripeContainer
