'use client'
import type React from 'react'
import { useState, useEffect } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { useSelector } from 'react-redux'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Alert } from '@/components/ui/alert'
import Spinner from '@/components/ui/Spinner'
import ButtonPrimary from '@/shared/ButtonPrimary'
import PaymentMethods from './PaymentMethods'
import PromoCodeForm from './PromoCode'
import totalAmount from '../../[country]/[city]/[category]/[name]/(service-detail)/[listingExperiencesDetail]/totalAmount'
import { useTranslations } from '@/lib/i18n'

interface CustomStripeFormProps {
	userId?: string
	userEmail?: string
	booking?: any
}

const CustomStripeForm: React.FC<CustomStripeFormProps> = ({
	userId,
	userEmail,
	booking,
}) => {
	const t = useTranslations('Jan03_CustomStripeForm_t9k6')
	const stripeErrorsMessage = useTranslations('StripeErrorsMessage')

	const router = useRouter()
	const stripe: any = useStripe()
	const elements: any = useElements()
	const [error, setError] = useState<string>('')
	const [success, setSuccess] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)
	const [paymentMethods, setPaymentMethods] = useState<any[]>([])
	const [paymentMethodsFetched, setPaymentMethodsFetched] =
		useState<boolean>(false)
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const [showNewPaymentForm, setShowNewPaymentForm] = useState(false)
	const [saveAsNewPaymentMethod, setSaveAsNewPaymentMethod] = useState(false)
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
		string | null
	>(null)
	const [clientSecret, setClientSecret] = useState<string | null>(null)
	const [paymentConfirmed, setPaymentConfirmed] = useState<boolean>(false)
	const newTotalAmount = totalAmount(booking?.lineItems)
	const { status } = useSelector((state: any) => state.bookingSlice)
	const { tour }: any = booking
	const [currentStatus, setCurrentStatus] = useState('')

	const handleAddParam = (param: any) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set(param.key, param.value)
		router.push(`${pathname}?${params.toString()}`)
	}

	const createBooking = async () => {
		setCurrentStatus('loading')
		const response = await fetch('/api/bookings', {
			method: 'POST',
			body: JSON.stringify(booking),
		})
		if (!response.ok) {
			setCurrentStatus('')
			console.error('Failed to create booking')
			throw new Error(t('Failed_Create_Booking'))
		}
		setCurrentStatus('')
		const bookingData = await response.json()
		return bookingData
	}

	useEffect(() => {
		const fetchPaymentMethods = async () => {
			try {
				const response = await fetch(`/api/payment-methods?userId=${userId}`)
				if (!response.ok) throw new Error(t('Failed_Fetch_Payment_Methods'))
				const data = await response.json()
				setPaymentMethods(data.paymentMethods)
				setPaymentMethodsFetched(true)
				if (data.paymentMethods.length === 0) setShowNewPaymentForm(true)
				else {
					const defaultMethod = data.paymentMethods.find(
						(m: any) => m.isDefault,
					)
					if (defaultMethod)
						setSelectedPaymentMethod(defaultMethod.stripePaymentMethodId)
				}
			} catch (error) {
				console.error('Error fetching payment methods:', error)
				setError(t('Failed_Load_Payment_Methods'))
				setPaymentMethodsFetched(true)
			}
		}
		fetchPaymentMethods()
	}, [userId])

	// --- Payment Functions ---
	const handlePayment = async (formData: any) => {
		setLoading(true)
		setError('')
		setSuccess('')
		if (!stripe || !elements) {
			setError(t('Stripe_Not_Loaded'))
			setLoading(false)
			return
		}

		try {
			await createBooking()
			if (showNewPaymentForm) {
				await initiatePayment(formData)
			} else {
				await processExistingPaymentMethod()
			}
		} catch (error: any) {
			console.error('Error in payment handling:', error)
			setError(error.message || t('Unexpected_Error'))
		} finally {
			setLoading(false)
		}
	}

	const initiatePayment = async (formData: any) => {
		const cardElement = elements.getElement(CardElement)
		if (!cardElement) {
			console.error(t('Card_Element_Not_Found'))
			return
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
				paymentMethodError.message || t('Failed_Create_Payment_Method'),
			)
			return
		}

		if (!paymentMethod || !paymentMethod.id) {
			console.error(t('Failed_Create_Payment_Method'))
			return
		}

		const paymentMethodId = paymentMethod.id
		const saveResponse: any = await fetch('/api/payment-methods', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId,
				userEmail,
				paymentMethodId,
				saveAsNewPaymentMethod,
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
			console.error(t('Failed_Process_Payment_Method'))
			return
		}

		const newPaymentMethod: any = await saveResponse.json()
		const newPaymentMethodId =
			newPaymentMethod?.paymentMethod?.stripePaymentMethodId

		const response = await fetch('/api/initiate-payment', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId,
				userEmail,
				paymentMethodId: newPaymentMethodId,
				stripePaymentMethodId: paymentMethodId,
				currency: 'eur',
			}),
		})

		const result = await response.json()
		if (!response.ok) {
			console.error(result.message || t('Failed_Initiate_Payment'))
			return
		}

		const { clientSecret } = result
		setClientSecret(clientSecret)
		await confirmPayment(clientSecret)
	}

	const processExistingPaymentMethod = async () => {
		if (!selectedPaymentMethod) {
			const defaultMethod = paymentMethods.find((method) => method.isDefault)
			if (!defaultMethod) {
				setError(t('Please_Select_Payment_Method'))
				return
			}
			setSelectedPaymentMethod(defaultMethod.stripePaymentMethodId)
		}

		try {
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
			const result = await response.json()
			console.log('response: ', result, response)
			if (!response.ok)
				throw new Error(
					result.err || stripeErrorsMessage(result.stripeCardError),
				)
			// let result
			// try {
			// 	result = JSON.parse(responseData)
			// } catch (parseError) {
			// 	console.error('Error parsing JSON:', responseData)
			// 	throw new Error(t('Invalid_Server_Response'))
			// }

			const { paymentIntentId } = result
			const requiresCapture = result.requiresCapture || false

			if (requiresCapture) await capturePayment(paymentIntentId)
			else {
				setSuccess(t('Payment_Processed_Successfully'))
				setPaymentConfirmed(true)
				// router.push(
				// 	`/pay-done/payment?bookingId=${booking.id}&serviceId=${tour?.id}`,
				// )
			}
		} catch (error: any) {
			console.log('here eror')
			console.error('Payment processing error:', error)
			setError(error.message || t('Payment_Processing_Error'))
		}
	}

	const capturePayment = async (paymentIntentId: string) => {
		try {
			const response = await fetch('/api/capture-payment', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ paymentIntentId }),
			})

			const responseData = await response.text()
			let result
			try {
				result = JSON.parse(responseData)
			} catch (parseError) {
				console.error('Error parsing JSON:', responseData)
				throw new Error(t('Invalid_Server_Response'))
			}

			if (result.err) throw new Error(result.err || t('Payment_Capture_Failed'))

			setSuccess(t('Payment_Captured_Successfully'))
			setPaymentConfirmed(true)
			router.push(
				`/pay-done/payment?bookingId=${booking.id}&serviceId=${tour?.id}`,
			)
		} catch (error: any) {
			console.error('Payment capture error:', error)
			setError(error.message || t('Payment_Capture_Error'))
		}
	}

	const confirmPayment = async (clientSecret: string) => {
		setLoading(true)
		setError('')
		setSuccess('')

		if (!stripe || !clientSecret) {
			setError(t('Unable_Confirm_Payment'))
			setLoading(false)
			return
		}

		try {
			const { paymentIntent, error } =
				await stripe.confirmCardPayment(clientSecret)

			if (error) setError(error.message || t('Payment_Confirmation_Failed'))
			else if (paymentIntent.status === 'requires_capture')
				await capturePayment(paymentIntent.id)
			else if (paymentIntent.status === 'succeeded') {
				setSuccess(t('Payment_Confirmed_Successfully'))
				setPaymentConfirmed(true)
				router.push(
					`/pay-done/payment?bookingId=${booking.id}&serviceId=${tour?.id}`,
				)
			} else
				setError(t('Payment_Failed_Status', { status: paymentIntent.status }))
		} catch (error: any) {
			console.error('Error in payment confirmation:', error)
			setError(error.message || t('Payment_Confirmation_Error'))
		} finally {
			setLoading(false)
		}
	}

	if (!paymentMethodsFetched) return <Spinner />

	const bookingId = searchParams.get('bookingId')

	return (
		<div className="mx-auto w-full max-w-md">
			{!bookingId && (
				<ButtonPrimary
					className="mt-4 w-full"
					onClick={createBooking}
					loading={currentStatus === 'loading'}
					disabled={currentStatus === 'loading'}
				>
					{currentStatus === 'loading' ? t('Processing') : t('Reserve')}
				</ButtonPrimary>
			)}

			{bookingId && (
				<>
					<PaymentMethods
						paymentMethods={paymentMethods}
						selectedPaymentMethod={selectedPaymentMethod}
						setSelectedPaymentMethod={setSelectedPaymentMethod}
						showNewPaymentForm={showNewPaymentForm}
						setShowNewPaymentForm={setShowNewPaymentForm}
						saveAsNewPaymentMethod={saveAsNewPaymentMethod}
						setSaveAsNewPaymentMethod={setSaveAsNewPaymentMethod}
						handlePayment={handlePayment}
						loading={loading}
						t={t}
					/>

					<PromoCodeForm />

					{!clientSecret && !paymentConfirmed && (
						<ButtonPrimary
							className="mt-4 w-full"
							onClick={() => handlePayment({})}
							loading={
								loading || status === 'loading' || currentStatus === 'loading'
							}
							disabled={loading || currentStatus === 'loading'}
						>
							{loading || currentStatus === 'loading'
								? t('Processing')
								: t('Pay_Amount', { amount: newTotalAmount })}
						</ButtonPrimary>
					)}

					{error && <Alert variant="destructive">{error}</Alert>}
					{success && <Alert variant="default">{success}</Alert>}
				</>
			)}
		</div>
	)
}

export default CustomStripeForm
