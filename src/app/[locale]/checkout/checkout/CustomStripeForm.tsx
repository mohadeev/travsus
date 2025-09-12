'use client'
import type React from 'react'
import { useState, useEffect } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { useSelector } from 'react-redux'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Alert } from '@/components/ui/alert'
import Spinner from '@/components/ui/Spinner'
import ButtonPrimary from '@/shared/ButtonPrimary'
import NewCardForm from './new-card-form'
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

	// Booking creation
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

	// Fetch payment methods
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

	// Payment handler (existing/new)
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
					await PaymentMethods.initiatePayment(formData, {
						stripe,
						elements,
						userId,
						userEmail,
						saveAsNewPaymentMethod,
						setClientSecret,
						setError,
						t,
					})
				} else {
					await PaymentMethods.processExistingPaymentMethod({
						selectedPaymentMethod,
						paymentMethods,
						userId,
						userEmail,
						booking,
						tour,
						router,
						setError,
						setSuccess,
						t,
					})
				}
			})
		} catch (error: any) {
			console.error('Error in payment handling:', error)
			setError(error.message || t('Unexpected_Error'))
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
