'use client'
import type React from 'react'
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
	Elements,
	useStripe,
	useElements,
	CardElement,
} from '@stripe/react-stripe-js'
import { Alert } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import NewCardForm from './new-card-form'
// import totalAmount from '@/app/(service-detail)/[listingExperiencesDetail]/totalAmount'
import { useSelector } from 'react-redux'
import Spinner from '@/components/ui/Spinner'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import PromoCodeForm from './PromoCode'
import totalAmount from '../../[country]/[city]/[category]/[name]/(service-detail)/[listingExperiencesDetail]/totalAmount'
import { useTranslations } from '@/lib/i18n'

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

interface CustomStripeFormProps {
	userId?: string
	userEmail?: string
	booking?: any
}

const CustomStripeForm: React.FC<CustomStripeFormProps> = ({
	userId,
	userEmail,
	booking,
}: any) => {
	const t = useTranslations('Jan03_CustomStripeForm_t9k6')
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
		const { id } = bookingData
		return bookingData
	}

	useEffect(() => {
		const fetchPaymentMethods = async () => {
			try {
				const response = await fetch(`/api/payment-methods?userId=${userId}`)
				if (!response.ok) {
					throw new Error(t('Failed_Fetch_Payment_Methods'))
				}
				const data = await response.json()
				setPaymentMethods(data.paymentMethods)
				setPaymentMethodsFetched(true)
				if (data.paymentMethods.length === 0) {
					setShowNewPaymentForm(true)
				} else {
					const defaultMethod = data.paymentMethods.find(
						(method: any) => method.isDefault,
					)
					if (defaultMethod) {
						setSelectedPaymentMethod(defaultMethod.stripePaymentMethodId)
					}
				}
			} catch (error) {
				console.error('Error fetching payment methods:', error)
				setError(t('Failed_Load_Payment_Methods'))
				setPaymentMethodsFetched(true)
			}
		}
		fetchPaymentMethods()
	}, [userId])

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
			await createBooking().then(async () => {
				if (showNewPaymentForm) {
					await initiatePayment(formData)
				} else {
					await processExistingPaymentMethod()
				}
			})
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

		console.log('newPaymentMethodId: ', newPaymentMethod)

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

			const responseData = await response.text()
			let result
			try {
				result = JSON.parse(responseData)
			} catch (parseError) {
				console.error('Error parsing JSON:', responseData)
				throw new Error(t('Invalid_Server_Response'))
			}

			if (result.error) {
				throw new Error(result.err || t('Payment_Processing_Failed'))
			}

			const { paymentIntentId } = result
			const requiresCapture = result.requiresCapture || false

			if (requiresCapture) {
				await capturePayment(paymentIntentId)
			} else {
				setSuccess(t('Payment_Processed_Successfully'))
				setPaymentConfirmed(true)
				router.push(
					`/pay-done/payment?bookingId=${booking.id}&serviceId=${tour?.id}`,
				)
			}
		} catch (error: any) {
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

			if (result.err) {
				throw new Error(result.err || t('Payment_Capture_Failed'))
			}

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

			if (error) {
				console.error(error.message || t('Payment_Confirmation_Failed'))
				setError(error.message || t('Payment_Confirmation_Failed'))
			} else if (paymentIntent.status === 'requires_capture') {
				await capturePayment(paymentIntent.id)
			} else if (paymentIntent.status === 'succeeded') {
				setSuccess(t('Payment_Confirmed_Successfully'))
				setPaymentConfirmed(true)
				router.push(
					`/pay-done/payment?bookingId=${booking.id}&serviceId=${tour?.id}`,
				)
			} else {
				console.error(`Payment failed with status: ${paymentIntent.status}`)
				setError(t('Payment_Failed_Status', { status: paymentIntent.status }))
			}
		} catch (error: any) {
			console.error('Error in payment confirmation:', error)
			setError(error.message || t('Payment_Confirmation_Error'))
		} finally {
			setLoading(false)
		}
	}

	if (!paymentMethodsFetched) {
		return <Spinner />
	}

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
					{paymentMethods.length > 0 && (
						<Card className="mx-auto mb-4 w-full max-w-md">
							<CardHeader>
								<CardTitle className="text-2xl font-bold">
									{t('Select_Payment_Method')}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<RadioGroup
									value={selectedPaymentMethod || ''}
									onValueChange={(value) => {
										setSelectedPaymentMethod(value)
										setShowNewPaymentForm(value === 'new_card')
									}}
									className="space-y-4"
								>
									{paymentMethods.map((method) => (
										<div
											key={method.stripePaymentMethodId}
											className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-slate-100"
										>
											<RadioGroupItem
												value={method.stripePaymentMethodId}
												id={method.stripePaymentMethodId}
											/>
											<Label
												htmlFor={method.stripePaymentMethodId}
												className="flex flex-1 cursor-pointer items-center justify-between"
											>
												<span className="flex items-center">
													<CreditCard className="mr-2 h-5 w-5 text-blue-500" />
													<span>
														{method.brand} •••• {method.last4}
													</span>
												</span>
												<span className="text-sm text-gray-500">
													{t('Expires_Date', {
														month: method.exp_month,
														year: method.exp_year,
													})}
												</span>
											</Label>
										</div>
									))}
									<div className="flex cursor-pointer items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-slate-100">
										<RadioGroupItem value="new_card" id="new_card" />
										<Label
											htmlFor="new_card"
											className="flex flex-1 cursor-pointer items-center"
										>
											<CreditCard className="mr-2 h-5 w-5 text-blue-500" />
											<span>{t('Use_Another_Card')}</span>
										</Label>
									</div>
									<div className="flex cursor-pointer items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-slate-100">
										<RadioGroupItem
											value="book_now_pay_later"
											id="book_now_pay_later"
										/>
										<Label
											htmlFor="book_now_pay_later"
											className="flex flex-1 cursor-pointer items-center"
										>
											<span className="mr-2 h-5 w-5 text-green-500">💸</span>
											<span>{t('Book_Now_Pay_Later')}</span>
										</Label>
									</div>
								</RadioGroup>
							</CardContent>
						</Card>
					)}

					{showNewPaymentForm && (
						<Card className="mx-auto mt-4 w-full max-w-md">
							<CardHeader>
								<CardTitle className="text-2xl font-bold">
									{t('Add_New_Card')}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<NewCardForm onSubmit={handlePayment} loading={loading} />
								<div className="mt-2 flex items-center space-x-2">
									<Checkbox
										id="saveNewPaymentMethod"
										checked={saveAsNewPaymentMethod}
										onCheckedChange={(checked) =>
											setSaveAsNewPaymentMethod(checked as boolean)
										}
									/>
									<label
										htmlFor="saveNewPaymentMethod"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										{t('Save_As_New_Payment_Method')}
									</label>
								</div>
							</CardContent>
						</Card>
					)}

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
