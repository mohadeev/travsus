'use client'
// Pay button: opens Stripe's secure checkout page for this booking. The amount
// is set by the server from the booking (promo codes included).
// Book now, pay later: the customer can pay €20 now and the rest is charged to
// the same card on the first tour day. After a failed tour-day charge, this
// pays the balance instead.
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CalendarClock, CreditCard, Loader2, Lock } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useClerk } from '@clerk/nextjs'
import { totalOf } from '@/store/slices/booking'
import { DEPOSIT_EUR, balanceAfterDeposit, balanceDueAt, depositAvailable, type PaymentPlan } from '@/lib/payLater'

const ERRORS: Record<string, string> = {
	PAYMENTS_UNAVAILABLE: 'error_unavailable',
	ALREADY_PAID: 'already_paid',
	NOT_SIGNED_IN: 'error_signin',
	DEPOSIT_UNAVAILABLE: 'deposit_unavailable',
}

export default function CheckoutPayment({ booking }: { booking: any }) {
	const t = useTranslations('Payment')
	const locale = useLocale()
	const searchParams = useSearchParams()
	const { openSignIn } = useClerk()
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')
	const [plan, setPlan] = useState<PaymentPlan>(searchParams.get('plan') === 'full' ? 'full' : 'deposit')

	const money = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(n)
	const total = totalOf(booking.lineItems)
	const payingBalance = booking.bookingState === 'balance_failed' || booking.bookingState === 'deposit_paid'
	const balance = Number(booking.balanceAmount) || balanceAfterDeposit(total)
	const canDeposit = !payingBalance && depositAvailable(total, booking.selectedDate)
	const chosen: PaymentPlan | 'balance' = payingBalance ? 'balance' : canDeposit ? plan : 'full'
	const dueAt = balanceDueAt(booking.selectedDate)
	const dueDay = dueAt ? dueAt.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }) : ''

	const nowAmount = chosen === 'deposit' ? DEPOSIT_EUR : chosen === 'balance' ? balance : total

	async function pay() {
		setBusy(true)
		setError('')
		const res = await fetch(`/api/bookings/${booking.id}/checkout`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ locale, plan: chosen }),
		}).catch(() => null)
		const data = await res?.json().catch(() => null)
		// Not signed in (or the session expired): open the sign-in, then come back to this page
		if (res?.status === 401) {
			setBusy(false)
			openSignIn({ forceRedirectUrl: window.location.href })
			return
		}
		if (res?.ok && data?.url) {
			window.location.href = data.url // stays "busy" while Stripe opens
			return
		}
		setError(t(ERRORS[data?.error] ?? 'error_generic'))
		setBusy(false)
	}

	return (
		<div>
			{payingBalance && (
				<div className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
					<p className="font-semibold">{t('balance_title')}</p>
					<p className="mt-0.5">{t('balance_text', { amount: money(balance) })}</p>
				</div>
			)}

			{canDeposit && (
				<div className="mb-4 space-y-2" role="radiogroup" aria-label={t('plan_title')}>
					<p className="text-base font-semibold">{t('plan_title')}</p>
					<PlanOption
						selected={chosen === 'deposit'}
						onSelect={() => setPlan('deposit')}
						icon={<CalendarClock className="h-5 w-5" />}
						title={t('plan_deposit', { amount: money(DEPOSIT_EUR) })}
						hint={t('plan_deposit_hint', { rest: money(balanceAfterDeposit(total)), date: dueDay })}
					/>
					<PlanOption
						selected={chosen === 'full'}
						onSelect={() => setPlan('full')}
						icon={<CreditCard className="h-5 w-5" />}
						title={t('plan_full')}
						hint={t('plan_full_hint', { amount: money(total) })}
					/>
				</div>
			)}

			<button
				type="button"
				onClick={pay}
				disabled={busy || total <= 0}
				className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-8 text-base font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-white dark:text-neutral-950"
			>
				{busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
				{busy ? t('redirecting') : t(chosen === 'full' ? 'pay_secure' : 'pay_now', { amount: money(nowAmount) })}
			</button>
			{chosen === 'deposit' && (
				<p className="mt-3 rounded-2xl bg-sand-100 px-4 py-3 text-sm text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
					{t('deposit_note', { rest: money(balanceAfterDeposit(total)), date: dueDay })}
				</p>
			)}
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

function PlanOption({ selected, onSelect, icon, title, hint }: { selected: boolean; onSelect: () => void; icon: React.ReactNode; title: string; hint: string }) {
	return (
		<button
			type="button"
			role="radio"
			aria-checked={selected}
			onClick={onSelect}
			className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
				selected ? 'border-neutral-950 bg-neutral-50 dark:border-white dark:bg-neutral-900' : 'border-neutral-200 hover:border-neutral-400 dark:border-neutral-800'
			}`}
		>
			<span className={selected ? 'text-neutral-950 dark:text-white' : 'text-neutral-400'}>{icon}</span>
			<span className="min-w-0 flex-1">
				<span className="block text-sm font-semibold sm:text-base">{title}</span>
				<span className="block text-xs text-neutral-500 sm:text-sm">{hint}</span>
			</span>
			<span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${selected ? 'border-neutral-950 dark:border-white' : 'border-neutral-300'}`}>
				{selected && <span className="h-2.5 w-2.5 rounded-full bg-neutral-950 dark:bg-white" />}
			</span>
		</button>
	)
}
