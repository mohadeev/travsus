'use client'
// Delete account: what is deleted, a reason, a confirmation, then the
// permanent deletion (TRAVSUS data and the Clerk login), and sign out.
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { useClerk } from '@clerk/nextjs'
import { useLocale, useTranslations } from 'next-intl'

const REASONS = ['reason_not_travelling', 'reason_other_account', 'reason_privacy', 'reason_emails', 'reason_other'] as const

export default function DeleteAccountPage() {
	const t = useTranslations('Account')
	const locale = useLocale()
	const { signOut } = useClerk()
	const [reason, setReason] = useState('')
	const [understood, setUnderstood] = useState(false)
	const [status, setStatus] = useState<'idle' | 'deleting' | 'done' | 'error'>('idle')

	async function remove(e: FormEvent) {
		e.preventDefault()
		if (!understood) return
		setStatus('deleting')
		const res = await fetch('/api/user/delete', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ reason }),
		}).catch(() => null)
		if (!res?.ok) return setStatus('error')
		setStatus('done')
		// The login is gone too: end the session and go home
		setTimeout(() => signOut({ redirectUrl: `/${locale}` }), 2500)
	}

	if (status === 'done') {
		return (
			<div role="status" className="max-w-xl rounded-[28px] bg-neutral-100 p-10 text-center dark:bg-neutral-900">
				<CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" strokeWidth={1.5} />
				<h1 className="mt-5 text-2xl font-bold tracking-tight">{t('deleted_title')}</h1>
				<p className="mt-2 text-neutral-500">{t('deleted_text')}</p>
			</div>
		)
	}

	return (
		<div className="max-w-2xl">
			<h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{t('delete_title')}</h1>
			<p className="mt-2 text-neutral-500">{t('delete_page_text')}</p>

			<div className="mt-10 rounded-3xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/40">
				<p className="flex items-center gap-2 font-semibold text-red-700 dark:text-red-400">
					<AlertTriangle className="h-5 w-5" />
					{t('delete_warning_title')}
				</p>
				<ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-red-800 dark:text-red-300">
					<li>{t('delete_item_bookings')}</li>
					<li>{t('delete_item_saved')}</li>
					<li>{t('delete_item_posts')}</li>
					<li>{t('delete_item_login')}</li>
				</ul>
				<p className="mt-4 text-sm text-red-800 dark:text-red-300">
					{t('delete_upcoming')}{' '}
					<Link href={`/${locale}/contact` as any} className="font-semibold underline underline-offset-4">
						{t('contact_us')}
					</Link>
				</p>
			</div>

			<form onSubmit={remove} className="mt-8 space-y-6">
				<fieldset>
					<legend className="mb-3 text-sm font-medium">{t('delete_reason')}</legend>
					<div className="space-y-2">
						{REASONS.map((key) => (
							<label key={key} className={`flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3.5 ring-1 transition ${reason === key ? 'bg-neutral-100 ring-neutral-950 dark:bg-neutral-900 dark:ring-white' : 'ring-neutral-200 hover:bg-neutral-50 dark:ring-neutral-800 dark:hover:bg-neutral-900'}`}>
								<input type="radio" name="reason" value={key} checked={reason === key} onChange={() => setReason(key)} className="h-4 w-4 accent-neutral-950" />
								<span>{t(key)}</span>
							</label>
						))}
					</div>
				</fieldset>

				<label className="flex cursor-pointer items-start gap-3">
					<input type="checkbox" checked={understood} onChange={(e) => setUnderstood(e.target.checked)} className="mt-1 h-4 w-4 accent-red-600" />
					<span className="text-sm">{t('delete_confirm')}</span>
				</label>

				{status === 'error' && (
					<p role="alert" className="text-sm text-red-600">
						{t('delete_error')}
					</p>
				)}

				<div className="flex flex-col-reverse gap-3 sm:flex-row">
					<Link
						href={`/${locale}/account-settings` as any}
						className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-300 px-7 text-sm font-semibold transition hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white"
					>
						{t('keep_account')}
					</Link>
					<button
						type="submit"
						disabled={!understood || status === 'deleting'}
						className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-red-600 px-7 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
					>
						{status === 'deleting' && <Loader2 className="h-4 w-4 animate-spin" />}
						{t('delete_button')}
					</button>
				</div>
			</form>
		</div>
	)
}
