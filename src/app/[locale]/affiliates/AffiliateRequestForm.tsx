'use client'
// "Request access" form: email (+ optional website), sent to /api/affiliates/request.
import { useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

type Status = 'idle' | 'sending' | 'done' | 'already' | 'invalid' | 'error'

export default function AffiliateRequestForm({ dark = false, id }: { dark?: boolean; id?: string }) {
	const t = useTranslations('Affiliates')
	const locale = useLocale()
	const [status, setStatus] = useState<Status>('idle')

	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const form = new FormData(e.currentTarget)
		setStatus('sending')
		try {
			const res = await fetch('/api/affiliates/request', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: form.get('email'), website: form.get('website'), locale }),
			})
			const { code } = await res.json().catch(() => ({}))
			setStatus(code === 'REQUESTED' ? 'done' : code === 'ALREADY_REQUESTED' ? 'already' : code === 'INVALID_EMAIL' ? 'invalid' : 'error')
		} catch {
			setStatus('error')
		}
	}

	if (status === 'done' || status === 'already') {
		return (
			<div
				role="status"
				className={`flex items-start gap-3 rounded-3xl p-5 text-left ${dark ? 'bg-white/10 text-white' : 'bg-neutral-100 dark:bg-neutral-900'}`}
			>
				<CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
				<div>
					<p className="font-semibold">{t(status === 'done' ? 'form_done_title' : 'form_already_title')}</p>
					<p className={`mt-1 text-sm ${dark ? 'text-white/70' : 'text-neutral-500'}`}>{t('form_done_text')}</p>
				</div>
			</div>
		)
	}

	const field = dark
		? 'bg-neutral-950/60 text-white placeholder:text-white/60 ring-white/25 backdrop-blur-md focus:ring-white'
		: 'bg-white text-neutral-950 placeholder:text-neutral-400 ring-neutral-200 focus:ring-neutral-950 dark:bg-neutral-900 dark:text-white dark:ring-neutral-700 dark:focus:ring-white'

	return (
		<form id={id} onSubmit={submit} className="w-full text-left">
			<div className="flex flex-col gap-2.5 sm:flex-row">
				<label className="flex-1">
					<span className="sr-only">{t('form_email')}</span>
					<input
						type="email"
						name="email"
						required
						autoComplete="email"
						placeholder={t('form_email')}
						onChange={() => status !== 'idle' && setStatus('idle')}
						className={`h-14 w-full rounded-full border-0 px-6 text-base ring-1 transition focus:outline-none focus:ring-2 ${field}`}
					/>
				</label>
				<button
					type="submit"
					disabled={status === 'sending'}
					className={`inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold transition disabled:opacity-70 ${
						dark
							? 'bg-white text-neutral-950 hover:bg-neutral-200'
							: 'bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950'
					}`}
				>
					{status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
					{t('form_submit')}
					{status !== 'sending' && <ArrowRight className="h-5 w-5" />}
				</button>
			</div>
			<label className="mt-2.5 block">
				<span className="sr-only">{t('form_website')}</span>
				<input
					type="text"
					name="website"
					maxLength={200}
					placeholder={t('form_website')}
					className={`h-12 w-full rounded-full border-0 px-6 text-sm ring-1 transition focus:outline-none focus:ring-2 ${field}`}
				/>
			</label>
			<p
				role={status === 'invalid' || status === 'error' ? 'alert' : undefined}
				className={`mt-3 px-2 text-xs ${
					status === 'invalid' || status === 'error' ? 'text-red-500' : dark ? 'text-white/55' : 'text-neutral-500'
				}`}
			>
				{status === 'invalid' ? t('form_invalid') : status === 'error' ? t('form_error') : t('form_note')}
			</p>
		</form>
	)
}
