'use client'
// Promo code at checkout: "Have a promo code?" → field → applied code with
// its discount (and Remove). The payment amount follows automatically.
import { useState, type FormEvent } from 'react'
import { Check, Loader2, Tag, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectBooking, setLineItems } from '@/store/slices/booking'

const ERRORS = ['INVALID_CODE', 'OWN_CODE', 'ALREADY_APPLIED', 'EXPIRED', 'USED_UP', 'ALREADY_PAID', 'NOT_SIGNED_IN', 'NOTHING_TO_DISCOUNT'] as const

export default function PromoCodeForm() {
	const t = useTranslations('Promo')
	const dispatch = useAppDispatch()
	const booking = useAppSelector(selectBooking) as any
	const applied = (booking?.lineItems ?? []).find((item: any) => item?.promoCode || String(item?.description ?? '').startsWith('Promo Code Applied'))
	const [open, setOpen] = useState(false)
	const [code, setCode] = useState('')
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')

	async function send(method: 'POST' | 'DELETE', body: Record<string, string>) {
		setBusy(true)
		setError('')
		const res = await fetch('/api/promo/apply-discount', {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ bookingId: booking?.id, ...body }),
		}).catch(() => null)
		const data = await res?.json().catch(() => null)
		if (res?.ok && data?.lineItems) {
			dispatch(setLineItems(data.lineItems))
			setCode('')
		} else setError(ERRORS.includes(data?.error) ? t(`error_${data.error}`) : t('error_generic'))
		setBusy(false)
	}

	const apply = (e: FormEvent) => {
		e.preventDefault()
		if (code.trim()) send('POST', { code: code.trim() })
	}

	if (!booking?.id) return null

	if (applied) {
		const name = applied.promoCode ?? String(applied.description).match(/\(([^)]+)\)/)?.[1] ?? ''
		return (
			<div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
				<Check className="h-5 w-5 shrink-0" />
				<p className="min-w-0 flex-1 text-sm">
					<span className="font-semibold uppercase tracking-wide">{name}</span>
					{applied.promoPercent ? ` · ${t('percent_off', { percent: applied.promoPercent })}` : ''}
				</p>
				<button type="button" onClick={() => send('DELETE', {})} disabled={busy} className="inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4 disabled:opacity-50">
					{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
					{t('remove')}
				</button>
			</div>
		)
	}

	if (!open) {
		return (
			<button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4">
				<Tag className="h-4 w-4" />
				{t('have_code')}
			</button>
		)
	}

	return (
		<form onSubmit={apply}>
			<label htmlFor="promo-code" className="mb-1.5 block text-sm font-medium">
				{t('label')}
			</label>
			<div className="flex gap-2">
				<input
					id="promo-code"
					value={code}
					onChange={(e) => {
						setCode(e.target.value)
						setError('')
					}}
					autoFocus
					autoCapitalize="none"
					autoComplete="off"
					spellCheck={false}
					maxLength={60}
					placeholder={t('placeholder')}
					className="h-12 min-w-0 flex-1 rounded-full border-0 bg-neutral-100 px-5 text-base ring-1 ring-transparent placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-neutral-950 dark:bg-neutral-800 dark:focus:ring-white"
				/>
				<button
					type="submit"
					disabled={busy || !code.trim()}
					className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-40 dark:bg-white dark:text-neutral-950"
				>
					{busy && <Loader2 className="h-4 w-4 animate-spin" />}
					{t('apply')}
				</button>
			</div>
			{error && (
				<p role="alert" className="mt-2 text-sm text-red-600">
					{error}
				</p>
			)}
		</form>
	)
}
