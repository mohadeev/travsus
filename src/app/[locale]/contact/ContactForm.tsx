'use client'
// Contact form: name, email, message → sendEmail (server action).
// So that a mistyped address can't get through (and our reply never bounces):
// the address is checked as it is typed, then a 6-digit code is emailed to it,
// and the message is only sent once the visitor enters that code.
import { useRef, useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, Loader2, MailCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { sendEmail } from '@/app/actions/sendEmail'
import EmailField, { type EmailFieldHandle } from '@/components/EmailField'

type Status = 'idle' | 'sending' | 'sent' | 'INVALID' | 'BAD_EMAIL' | 'TOO_MANY' | 'SEND_FAILED' | 'CODE_WRONG' | 'CODE_EXPIRED'

export default function ContactForm({ email }: { email: string }) {
	const t = useTranslations('Contact')
	const tOld = useTranslations('contact_page')
	const tEmail = useTranslations('EmailCheck')
	const [status, setStatus] = useState<Status>('idle')
	const [replyTo, setReplyTo] = useState('')
	// Set once a code has been emailed: the signed token and the address it went to
	const [codeStep, setCodeStep] = useState<{ token: string; email: string } | null>(null)
	const [code, setCode] = useState('')
	const emailField = useRef<EmailFieldHandle>(null)
	const formRef = useRef<HTMLFormElement>(null)
	const codeRef = useRef<HTMLInputElement>(null)

	async function send(form: HTMLFormElement, withCode: boolean) {
		setStatus('sending')
		// Don't send a message we could never answer: the address is checked first
		if (!withCode && !(await emailField.current?.validate())) {
			setStatus('idle')
			return
		}
		const data = new FormData(form)
		if (!withCode) {
			data.delete('code')
			data.delete('codeToken')
		}
		const result: any = await sendEmail(data).catch(() => ({ success: false, error: 'SEND_FAILED' }))
		if (result.success) {
			setReplyTo(String(data.get('email') ?? '').trim())
			form.reset()
			setCodeStep(null)
			setCode('')
			setStatus('sent')
		} else if (result.error === 'CODE_SENT') {
			setCodeStep({ token: result.token, email: result.email })
			setCode('')
			setStatus('idle')
			setTimeout(() => codeRef.current?.focus(), 50)
		} else setStatus((result.error as Status) || 'SEND_FAILED')
	}

	function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		send(e.currentTarget, !!codeStep)
	}

	if (status === 'sent') {
		return (
			<div role="status" className="rounded-[28px] bg-neutral-100 p-8 text-center sm:p-12 dark:bg-neutral-900">
				<CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" strokeWidth={1.5} />
				<p className="mt-5 text-2xl font-bold tracking-tight">{t('sent_title')}</p>
				<p className="mt-2 text-neutral-500">{t('sent_text')}</p>
				{replyTo && <p className="mt-2 text-sm text-neutral-500">{tEmail('reply_to', { email: replyTo })}</p>}
				<button type="button" onClick={() => setStatus('idle')} className="mt-6 text-sm font-semibold underline underline-offset-4">
					{t('send_another')}
				</button>
			</div>
		)
	}

	const input =
		'w-full rounded-2xl border-0 bg-neutral-100 px-4 py-3.5 text-base ring-1 ring-transparent transition placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-neutral-950 dark:bg-neutral-900 dark:focus:bg-neutral-950 dark:focus:ring-white'
	const error =
		status === 'INVALID'
			? t('error_invalid')
			: status === 'BAD_EMAIL'
				? tEmail('server_bad')
				: status === 'CODE_WRONG'
					? tEmail('code_wrong')
					: status === 'CODE_EXPIRED'
						? tEmail('code_expired')
						: status === 'TOO_MANY'
							? t('error_too_many')
							: status === 'SEND_FAILED'
								? t('error_failed', { email })
								: ''
	const sending = status === 'sending'

	return (
		<form ref={formRef} onSubmit={submit} className="space-y-4">
			<div className="grid gap-4 sm:grid-cols-2">
				<label className="block">
					<span className="mb-1.5 block text-sm font-medium">{tOld('Full_Name')}</span>
					<input name="name" required maxLength={120} autoComplete="name" className={input} />
				</label>
				<EmailField
					ref={emailField}
					label={tOld('Address_Label')}
					className={input}
					readOnly={!!codeStep}
					onEdit={() => codeStep && setCodeStep(null)}
				/>
			</div>
			<label className="block">
				<span className="mb-1.5 block text-sm font-medium">{tOld('Message')}</span>
				<textarea name="message" required minLength={5} maxLength={5000} rows={6} placeholder={t('message_placeholder')} className={`${input} resize-y`} />
			</label>
			{/* Spam trap: hidden from people */}
			<input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

			{codeStep && (
				<div className="rounded-3xl bg-emerald-50 p-5 sm:p-6 dark:bg-emerald-950/40">
					<p className="flex items-start gap-2.5 text-sm leading-6 text-emerald-900 dark:text-emerald-100">
						<MailCheck className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.8} aria-hidden />
						<span>{tEmail('code_sent', { email: codeStep.email })}</span>
					</p>
					<label className="mt-4 block">
						<span className="mb-1.5 block text-sm font-medium">{tEmail('code_label')}</span>
						<input
							ref={codeRef}
							name="code"
							value={code}
							onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
							inputMode="numeric"
							autoComplete="one-time-code"
							pattern="[0-9]{6}"
							required
							placeholder="••••••"
							className={`${input} max-w-[12rem] text-center font-mono text-2xl tracking-[0.4em] !bg-white dark:!bg-neutral-900`}
						/>
					</label>
					<input type="hidden" name="codeToken" value={codeStep.token} />
					<p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
						{tEmail('code_help')}{' '}
						<button type="button" disabled={sending} onClick={() => formRef.current && send(formRef.current, false)} className="font-semibold underline underline-offset-2">
							{tEmail('code_resend')}
						</button>
						{' · '}
						<button type="button" onClick={() => setCodeStep(null)} className="font-semibold underline underline-offset-2">
							{tEmail('code_change')}
						</button>
					</p>
				</div>
			)}

			{error && (
				<p role="alert" className="text-sm text-red-500">
					{error}
				</p>
			)}
			<button
				type="submit"
				disabled={sending || (!!codeStep && code.length !== 6)}
				className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-7 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-70 sm:w-auto dark:bg-white dark:text-ink"
			>
				{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
				{codeStep ? tEmail('code_submit') : tOld('Send_Message_Button')}
				{!sending && <ArrowRight className="h-4 w-4" />}
			</button>
		</form>
	)
}
