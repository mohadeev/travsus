'use client'
// Contact form: name, email, message → sendEmail (server action).
import { useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { sendEmail } from '@/app/actions/sendEmail'

type Status = 'idle' | 'sending' | 'sent' | 'INVALID' | 'TOO_MANY' | 'SEND_FAILED'

export default function ContactForm({ email }: { email: string }) {
	const t = useTranslations('Contact')
	const tOld = useTranslations('contact_page')
	const [status, setStatus] = useState<Status>('idle')

	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const form = e.currentTarget
		setStatus('sending')
		const result = await sendEmail(new FormData(form)).catch(() => ({ success: false, error: 'SEND_FAILED' }))
		if (result.success) {
			form.reset()
			setStatus('sent')
		} else setStatus((result.error as Status) || 'SEND_FAILED')
	}

	if (status === 'sent') {
		return (
			<div role="status" className="rounded-[28px] bg-neutral-100 p-8 text-center sm:p-12 dark:bg-neutral-900">
				<CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" strokeWidth={1.5} />
				<p className="mt-5 text-2xl font-bold tracking-tight">{t('sent_title')}</p>
				<p className="mt-2 text-neutral-500">{t('sent_text')}</p>
				<button type="button" onClick={() => setStatus('idle')} className="mt-6 text-sm font-semibold underline underline-offset-4">
					{t('send_another')}
				</button>
			</div>
		)
	}

	const input =
		'w-full rounded-2xl border-0 bg-neutral-100 px-4 py-3.5 text-base ring-1 ring-transparent transition placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-neutral-950 dark:bg-neutral-900 dark:focus:bg-neutral-950 dark:focus:ring-white'
	const error =
		status === 'INVALID' ? t('error_invalid') : status === 'TOO_MANY' ? t('error_too_many') : status === 'SEND_FAILED' ? t('error_failed', { email }) : ''

	return (
		<form onSubmit={submit} className="space-y-4">
			<div className="grid gap-4 sm:grid-cols-2">
				<label className="block">
					<span className="mb-1.5 block text-sm font-medium">{tOld('Full_Name')}</span>
					<input name="name" required maxLength={120} autoComplete="name" className={input} />
				</label>
				<label className="block">
					<span className="mb-1.5 block text-sm font-medium">{tOld('Address_Label')}</span>
					<input name="email" type="email" required maxLength={160} autoComplete="email" className={input} />
				</label>
			</div>
			<label className="block">
				<span className="mb-1.5 block text-sm font-medium">{tOld('Message')}</span>
				<textarea name="message" required minLength={5} maxLength={5000} rows={6} placeholder={t('message_placeholder')} className={`${input} resize-y`} />
			</label>
			{/* Spam trap: hidden from people */}
			<input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

			{error && (
				<p role="alert" className="text-sm text-red-500">
					{error}
				</p>
			)}
			<button
				type="submit"
				disabled={status === 'sending'}
				className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-7 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-70 sm:w-auto dark:bg-white dark:text-neutral-950"
			>
				{status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
				{tOld('Send_Message_Button')}
				{status !== 'sending' && <ArrowRight className="h-4 w-4" />}
			</button>
		</form>
	)
}
