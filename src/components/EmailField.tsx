'use client'
// An email input that checks the address as the visitor types: format, likely
// typos ("gmial.com" → offers "gmail.com" with one tap) and whether the domain
// can receive mail. Used by the contact form; reusable for other forms.
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { checkEmail, type EmailCheck } from '@/app/actions/checkEmail'
import { cleanEmail, hasEmailFormat } from '@/lib/emailCheck'

export type EmailFieldHandle = {
	/** Checks the current address now; false when it can't be used (shows why). */
	validate: () => Promise<boolean>
}

type Props = {
	name?: string
	className?: string
	label: string
	/** Locked while a code sent to this address is being entered */
	readOnly?: boolean
	/** Called when the visitor edits the address */
	onEdit?: () => void
}

const EmailField = forwardRef<EmailFieldHandle, Props>(function EmailField({ name = 'email', className = '', label, readOnly = false, onEdit }, ref) {
	const t = useTranslations('EmailCheck')
	const [value, setValue] = useState('')
	const [check, setCheck] = useState<EmailCheck | null>(null)
	const [checking, setChecking] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const lastChecked = useRef('')

	async function run(raw: string) {
		const email = cleanEmail(raw)
		if (!email) {
			setCheck(null)
			return null
		}
		if (email === lastChecked.current && check) return check
		lastChecked.current = email
		setChecking(true)
		const result = await checkEmail(email).catch(() => ({ ok: hasEmailFormat(email), email }) as EmailCheck)
		setChecking(false)
		// The visitor kept typing meanwhile: this answer is for an old value
		if (cleanEmail(inputRef.current?.value ?? '') !== email) return result
		setCheck(result)
		return result
	}

	// Check a moment after typing stops, once it looks like an address
	useEffect(() => {
		const email = cleanEmail(value)
		if (!/@.+\..{2,}/.test(email)) {
			if (check) setCheck(null)
			return
		}
		const timer = setTimeout(() => run(email), 900)
		return () => clearTimeout(timer)
	}, [value]) // eslint-disable-line react-hooks/exhaustive-deps

	useImperativeHandle(ref, () => ({
		validate: async () => {
			const result = await run(value)
			if (!result || !result.ok) {
				if (!result) setCheck({ ok: false, email: '', problem: 'format' })
				inputRef.current?.focus()
				return false
			}
			return true
		},
	}))

	const useSuggestion = () => {
		if (!check?.suggestion) return
		setValue(check.suggestion)
		lastChecked.current = ''
		setCheck(null)
		inputRef.current?.focus()
	}

	const bad = check && !check.ok
	const ring = bad ? '!ring-red-500' : check?.problem === 'typo' ? '!ring-amber-500' : check?.ok ? '!ring-emerald-500' : ''

	return (
		<label className="block">
			<span className="mb-1.5 block text-sm font-medium">{label}</span>
			<div className="relative">
				<input
					ref={inputRef}
					name={name}
					type="email"
					inputMode="email"
					required
					maxLength={160}
					autoComplete="email"
					autoCapitalize="off"
					spellCheck={false}
					value={value}
					readOnly={readOnly}
					onChange={(e) => {
						setValue(e.target.value)
						onEdit?.()
					}}
					onBlur={() => value && run(value)}
					aria-invalid={bad ? true : undefined}
					aria-describedby={check || checking ? `${name}-check` : undefined}
					className={`${className} pr-11 ${ring}`}
				/>
				<span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
					{checking ? (
						<Loader2 className="h-4 w-4 animate-spin text-neutral-400" aria-hidden />
					) : bad ? (
						<AlertCircle className="h-5 w-5 text-red-500" aria-hidden />
					) : check?.ok && check.problem !== 'typo' ? (
						<CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden />
					) : null}
				</span>
			</div>
			<div id={`${name}-check`} aria-live="polite" className="mt-1.5 min-h-[1.25rem] text-sm">
				{checking ? (
					<span className="text-neutral-500">{t('checking')}</span>
				) : check?.problem === 'format' ? (
					<span className="text-red-600">{t('format')}</span>
				) : check?.problem === 'no_mail' ? (
					<span className="text-red-600">{t('no_mail', { domain: check.domain ?? '' })}</span>
				) : null}
				{!checking && check?.suggestion && (
					<span className={check.problem === 'typo' ? 'text-amber-700 dark:text-amber-400' : 'ml-1 text-red-600'}>
						{t('typo', { email: check.suggestion })}{' '}
						<button type="button" onClick={useSuggestion} className="font-semibold underline underline-offset-2">
							{t('fix')}
						</button>
					</span>
				)}
			</div>
		</label>
	)
})

export default EmailField
