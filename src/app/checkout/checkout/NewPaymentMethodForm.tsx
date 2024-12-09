import React from 'react'

const NewPaymentMethodForm = () => {
	return <div>NewPaymentMethodForm</div>
}

export default NewPaymentMethodForm
;('use client')

import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
	Elements,
	CardElement,
	useStripe,
	useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

interface CustomStripeFormProps {
	userId: string
	userEmail: string
}

const CustomStripeForm: React.FC<CustomStripeFormProps> = ({
	userId,
	userEmail,
}) => {
	const stripe = useStripe()
	const elements = useElements()
	const [error, setError] = useState<string>('')
	const [success, setSuccess] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)
	const [paymentMethods, setPaymentMethods] = useState<any[]>([])
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
		string | null
	>(null)
	const [newPaymentMethod, setNewPaymentMethod] = useState<boolean>(false)
	const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
	const [clientSecret, setClientSecret] = useState<string | null>(null)
	const [cardHolder, setCardHolder] = useState<string>('')
	const [billingAddress, setBillingAddress] = useState({
		line1: '',
		line2: '',
		city: '',
		state: '',
		postal_code: '',
		country: '',
	})

	useEffect(() => {
		const fetchPaymentMethods = async () => {
			try {
				const response = await fetch(`/api/payment-methods?userId=${userId}`)
				if (!response.ok) {
					throw new Error('Failed to fetch payment methods')
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

	const handlePayment = async (event: React.FormEvent) => {
		event.preventDefault()
		setLoading(true)
		setError('')
		setSuccess('')

		if (!stripe || !elements) {
			setError('Stripe has not loaded yet. Please try again.')
			setLoading(false)
			return
		}

		try {
			if (newPaymentMethod) {
				await initiatePayment()
			} else {
				await processExistingPaymentMethod()
			}
		} catch (error) {
			console.error('Error in payment handling:', error)
			setError(
				error.message || 'An unexpected error occurred. Please try again.',
			)
		} finally {
			setLoading(false)
		}
	}

	const initiatePayment = async () => {
		const cardElement = elements.getElement(CardElement)
		if (!cardElement) {
			throw new Error('Card element not found. Please refresh and try again.')
		}

		const { paymentMethod, error: paymentMethodError } =
			await stripe.createPaymentMethod({
				type: 'card',
				card: cardElement,
				billing_details: {
					name: cardHolder,
					address: billingAddress,
				},
			})

		if (paymentMethodError) {
			throw new Error(
				paymentMethodError.message || 'Failed to create payment method',
			)
		}

		if (!paymentMethod || !paymentMethod.id) {
			throw new Error('Failed to create payment method. Please try again.')
		}

		const paymentMethodId = paymentMethod.id

		// Save the new payment method
		const saveResponse = await fetch('/api/payment-methods', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId,
				userEmail,
				paymentMethodId,
				cardHolder,
				billingAddress,
			}),
		})

		if (!saveResponse.ok) {
			throw new Error('Failed to save new payment method. Please try again.')
		}

		// Initiate the payment
		const response = await fetch('/api/initiate-payment', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId,
				userEmail,
				paymentMethodId,
				amount: 55, // 55 cents in EUR
				currency: 'eur',
			}),
		})

		if (!response.ok) {
			const result = await response.json()
			throw new Error(result.message || 'Failed to initiate payment')
		}

		const { paymentIntentId, clientSecret } = await response.json()
		setPaymentIntentId(paymentIntentId)
		setClientSecret(clientSecret)

		setSuccess('Payment initiated. Please confirm the payment.')
	}

	const processExistingPaymentMethod = async () => {
		if (!selectedPaymentMethod) {
			throw new Error('Please select a payment method to charge.')
		}

		const response = await fetch('/api/process-payment', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId,
				userEmail,
				paymentMethodId: selectedPaymentMethod,
				currency: 'eur',
			}),
		})

		if (!response.ok) {
			const result = await response.json()
			throw new Error(result.message || 'Payment processing failed')
		}

		const { paymentIntentId, requiresCapture } = await response.json()

		if (requiresCapture) {
			await capturePayment(paymentIntentId)
		} else {
			setSuccess('Payment processed successfully!')
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
			throw new Error(result.message || 'Payment capture failed')
		}

		setSuccess('Payment captured successfully!')
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
			const { paymentIntent, error } =
				await stripe.confirmCardPayment(clientSecret)

			if (error) {
				throw new Error(error.message || 'Payment confirmation failed')
			}

			if (paymentIntent.status === 'requires_capture') {
				await capturePayment(paymentIntent.id)
			} else if (paymentIntent.status === 'succeeded') {
				setSuccess('Payment confirmed and captured successfully!')
			} else {
				throw new Error(`Payment failed with status: ${paymentIntent.status}`)
			}
		} catch (error) {
			console.error('Error in payment confirmation:', error)
			setError(error.message || 'An error occurred during payment confirmation')
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<div>
				<Label htmlFor="cardHolder">Card Holder</Label>
				<Input
					id="cardHolder"
					type="text"
					value={cardHolder}
					onChange={(e) => setCardHolder(e.target.value)}
					required
					className="mt-1 block w-full"
				/>
			</div>
			<div className="space-y-4">
				<div className="flex flex-row gap-5">
					<div className="w-1/2">
						<Label htmlFor="line1">Address Line 1</Label>
						<Input
							id="line1"
							type="text"
							value={billingAddress.line1}
							onChange={(e) =>
								setBillingAddress({
									...billingAddress,
									line1: e.target.value,
								})
							}
							required
							className="mt-1 block w-full"
						/>
					</div>
					<div className="w-1/2">
						<Label htmlFor="line2">Address Line 2</Label>
						<Input
							id="line2"
							type="text"
							value={billingAddress.line2}
							onChange={(e) =>
								setBillingAddress({
									...billingAddress,
									line2: e.target.value,
								})
							}
							className="mt-1 block w-full"
						/>
					</div>
				</div>
				<div className="flex flex-row gap-5">
					<div className="w-1/2">
						<Label htmlFor="city">City</Label>
						<Input
							id="city"
							type="text"
							value={billingAddress.city}
							onChange={(e) =>
								setBillingAddress({
									...billingAddress,
									city: e.target.value,
								})
							}
							required
							className="mt-1 block w-full"
						/>
					</div>
					<div className="w-1/2">
						<Label htmlFor="state">State</Label>
						<Input
							id="state"
							type="text"
							value={billingAddress.state}
							onChange={(e) =>
								setBillingAddress({
									...billingAddress,
									state: e.target.value,
								})
							}
							required
							className="mt-1 block w-full"
						/>
					</div>
				</div>
				<div className="flex flex-row gap-5">
					<div className="w-1/2">
						<Label htmlFor="postal_code">Postal Code</Label>
						<Input
							id="postal_code"
							type="text"
							value={billingAddress.postal_code}
							onChange={(e) =>
								setBillingAddress({
									...billingAddress,
									postal_code: e.target.value,
								})
							}
							required
							className="mt-1 block w-full"
						/>
					</div>
					<div className="w-1/2">
						<Label htmlFor="country">Country</Label>
						<Input
							id="country"
							type="text"
							value={billingAddress.country}
							onChange={(e) =>
								setBillingAddress({
									...billingAddress,
									country: e.target.value,
								})
							}
							required
							className="mt-1 block w-full"
						/>
					</div>
				</div>
			</div>
		</>
	)
}
