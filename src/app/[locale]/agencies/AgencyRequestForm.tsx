'use client'
// "Request access" form for tour agencies: company, email, where they run
// tours and an optional website, sent to /api/agencies/request.
import { useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

type Status = 'idle' | 'sending' | 'done' | 'already' | 'invalid' | 'missing' | 'error'

export default function AgencyRequestForm({ id }: { id?: string }) {
	const t = useTranslations('Agencies')
	const locale = useLocale()
	const [status, setStatus] = useState<Status>('idle')

	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const form = new FormData(e.currentTarget)
		setStatus('sending')
		try {
			const res = await fetch('/api/agencies/request', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ company: form.get('company'), email: form.get('email'), location: form.get('location'), website: form.get('website'), locale }),
			})
			const { code } = await res.json().catch(() => ({}))
			setStatus(code === 'REQUESTED' ? 'done' : code === 'ALREADY_REQUESTED' ? 'already' : code === 'INVALID_EMAIL' ? 'invalid' : code === 'MISSING' ? 'missing' : 'error')
		} catch {
			setStatus('error')
		}
	}

	if (status === 'done' || status === 'already') {
		return (
			<div role="status" className="flex items-start gap-3 rounded-3xl bg-white/10 p-5 text-left text-white">
				<CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-current" />
				<div>
					<p className="font-semibold">{t(status === 'done' ? 'form_done_title' : 'form_already_title')}</p>
					<p className="mt-1 text-sm text-white/70">{t('form_done_text')}</p>
				</div>
			</div>
		)
	}

	const reset = () => status !== 'idle' && setStatus('idle')
	const input = 'h-14 w-full rounded-2xl border-0 bg-white/[0.07] px-4 text-base text-white ring-1 ring-white/15 transition placeholder:text-[14px] placeholder:text-white/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white sm:px-5 sm:placeholder:text-base'
	const failed = status === 'invalid' || status === 'missing' || status === 'error'

	return (
		<form id={id} onSubmit={submit} className="w-full scroll-mt-28 text-left">
			<div className="grid gap-2.5 sm:grid-cols-2">
				<label>
					<span className="sr-only">{t('form_company')}</span>
					<input name="company" required minLength={2} maxLength={120} autoComplete="organization" placeholder={t('form_company')} onChange={reset} className={input} />
				</label>
				<label>
					<span className="sr-only">{t('form_email')}</span>
					<input type="email" name="email" required autoComplete="email" inputMode="email" placeholder={t('form_email')} onChange={reset} className={input} />
				</label>
				<label className="sm:col-span-2">
					<span className="sr-only">{t('form_where')}</span>
					<input name="location" required minLength={2} maxLength={120} placeholder={t('form_where')} onChange={reset} className={input} />
				</label>
				<label className="sm:col-span-2">
					<span className="sr-only">{t('form_website')}</span>
					<input name="website" maxLength={200} autoComplete="url" placeholder={t('form_website')} onChange={reset} className={input} />
				</label>
			</div>
			<button
				type="submit"
				disabled={status === 'sending'}
				className="group mt-2.5 inline-flex h-14 w-full items-center justify-between gap-4 rounded-full bg-white pl-7 pr-2 text-base font-semibold text-neutral-950 transition hover:bg-neutral-200 active:scale-[0.99] disabled:opacity-70"
			>
				{t('form_submit')}
				<span className="grid h-10 w-10 place-items-center rounded-full bg-neutral-950 text-white transition-transform group-hover:translate-x-0.5">
					{status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
				</span>
			</button>
			<p role={failed ? 'alert' : undefined} className={`mt-3 px-1 text-center text-xs sm:text-left ${failed ? 'text-red-400' : 'text-white/55'}`}>
				{status === 'invalid' ? t('form_invalid') : status === 'missing' ? t('form_missing') : status === 'error' ? t('form_error') : t('form_note')}
			</p>
		</form>
	)
}
