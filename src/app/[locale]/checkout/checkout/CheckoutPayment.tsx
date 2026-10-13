'use client'
// Stripe Payment Element: card, Apple Pay, Google Pay, Link and local methods
// in one form, with 3-D Secure handled by Stripe. The amount always comes
// from the server; it is refreshed whenever the booking's price changes.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Lock } from 'lucide-react'
import { loadStripe, type StripeElementLocale } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useAppSelector } from '@/store/hooks'
import { selectUser } from '@/store/slices/user'
import { totalOf } from '@/store/slices/booking'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const appearance = {
	theme: 'stripe' as const,
	variables: {
		colorPrimary: '#000000',
		colorText: '#171717',
		borderRadius: '12px',
		fontFamily: 'inherit',
		spacingUnit: '4px',
	},
}

type Intent = { clientSecret: string; amount: number; currency: string }

export default function CheckoutPayment({ booking }: { booking: any }) {
	const t = useTranslations('Payment')
	const locale = useLocale()
	const [intent, setIntent] = useState<Intent | null>(null)
	const [version, setVersion] = useState(0) // bumps when the amount changes
	const [error, setError] = useState('')
	const lastSecret = useRef<string | null>(null)
	const total = totalOf(booking.lineItems)

	// Ask the server for the payment (again) whenever the price changes
	useEffect(() => {
		let cancelled = false
		setError('')
		fetch(`/api/bookings/${booking.id}/payment`, { method: 'POST' })
			.then(async (response) => {
				const data = await response.json()
				if (cancelled) return
				if (!response.ok) throw new Error(data.error)
				if (lastSecret.current === data.clientSecret) setVersion((v) => v + 1)
				lastSecret.current = data.clientSecret
				setIntent(data)
			})
			.catch((e) => !cancelled && setError(e.message || t('error_generic')))
		return () => {
			cancelled = true
		}
	}, [booking.id, total, t])

	if (error) {
		return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>
	}
	if (!intent) {
		return (
			<div className="space-y-3" aria-busy="true">
				<p className="text-sm text-neutral-500">{t('preparing')}</p>
				<div className="h-12 animate-pulse rounded-xl bg-neutral-100" />
				<div className="grid grid-cols-2 gap-3">
					<div className="h-12 animate-pulse rounded-xl bg-neutral-100" />
					<div className="h-12 animate-pulse rounded-xl bg-neutral-100" />
				</div>
			</div>
		)
	}

	return (
		<Elements
			key={intent.clientSecret}
			stripe={stripePromise}
			options={{
				clientSecret: intent.clientSecret,
				appearance,
				locale: locale.split('-')[0] as StripeElementLocale,
			}}
		>
			<PayForm bookingId={booking.id} intent={intent} version={version} />
		</Elements>
	)
}

function PayForm({
	bookingId,
	intent,
	version,
}: {
	bookingId: string
	intent: Intent
	version: number
}) {
	const t = useTranslations('Payment')
	const locale = useLocale()
	const router = useRouter()
	const stripe = useStripe()
	const elements = useElements()
	const user = useAppSelector(selectUser)
	const [paying, setPaying] = useState(false)
	const [error, setError] = useState('')

	// Same payment, new amount: let the form pick it up (wallet sheets show it)
	useEffect(() => {
		if (version > 0) elements?.fetchUpdates()
	}, [version, elements])

	const amountLabel = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: intent.currency.toUpperCase(),
	}).format(intent.amount / 100)

	const doneUrl = `/${locale}/pay-done/payment?bookingId=${bookingId}`

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()
		if (!stripe || !elements || paying) return
		setPaying(true)
		setError('')

		const { error: payError } = await stripe.confirmPayment({
			elements,
			confirmParams: { return_url: `${window.location.origin}${doneUrl}` },
			// Cards finish here; bank redirects come back to the return_url
			redirect: 'if_required',
		})

		if (payError) {
			// Stripe's messages are already translated and explain what to do
			setError(payError.message || t('error_generic'))
			setPaying(false)
			return
		}
		router.push(doneUrl as any)
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<PaymentElement
				options={{
					layout: { type: 'tabs', defaultCollapsed: false },
					defaultValues: {
						billingDetails: {
							email: user?.email,
							name: [user?.accountData?.firstname, user?.accountData?.lastname]
								.filter(Boolean)
								.join(' '),
						},
					},
				}}
			/>

			{error && (
				<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
					{error}
				</p>
			)}

			<button
				type="submit"
				disabled={!stripe || paying}
				className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-base font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
			>
				<Lock className="h-4 w-4" />
				{paying ? t('processing') : t('pay', { amount: amountLabel })}
			</button>

			<p className="text-center text-xs text-neutral-500">{t('secure_note')}</p>
		</form>
	)
}
