'use client'
// Pay button: opens Stripe's secure checkout page for this booking. The amount
// is set by the server from the booking (promo codes included).
import { useState } from 'react'
import { Loader2, Lock } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { totalOf } from '@/store/slices/booking'

const ERRORS: Record<string, string> = {
	PAYMENTS_UNAVAILABLE: 'error_unavailable',
	ALREADY_PAID: 'already_paid',
	NOT_SIGNED_IN: 'error_signin',
}

export default function CheckoutPayment({ booking }: { booking: any }) {
	const t = useTranslations('Payment')
	const locale = useLocale()
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')
	const total = totalOf(booking.lineItems)
	const amount = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(total)

	async function pay() {
		setBusy(true)
		setError('')
		const res = await fetch(`/api/bookings/${booking.id}/checkout`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ locale }),
		}).catch(() => null)
		const data = await res?.json().catch(() => null)
		if (res?.ok && data?.url) {
			window.location.href = data.url // stays "busy" while Stripe opens
			return
		}
		setError(t(ERRORS[data?.error] ?? 'error_generic'))
		setBusy(false)
	}

	return (
		<div>
			<button
				type="button"
				onClick={pay}
				disabled={busy || total <= 0}
				className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-8 text-base font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-white dark:text-neutral-950"
			>
				{busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
				{busy ? t('redirecting') : t('pay_secure', { amount })}
			</button>
			{error && (
				<p role="alert" className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
					{error}
				</p>
			)}
			<p className="mt-3 text-center text-xs leading-relaxed text-neutral-500">
				{t('stripe_note')}
				<br />
				{t('methods')}
			</p>
		</div>
	)
}
