'use client'
// Personal info: one form for name, contact and travel details. The email
// comes from the sign-in and is changed under Login & security.
import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2, Lock } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectUser, selectUserSaving, updateUser } from '@/store/slices/user'

// Stored values stay in English (older accounts use them); labels are translated
const GENDERS = [
	['', 'gender_unset'],
	['Female', 'gender_female'],
	['Male', 'gender_male'],
	['Other', 'gender_other'],
] as const

const input =
	'w-full rounded-2xl border-0 bg-neutral-100 px-4 py-3.5 text-base ring-1 ring-transparent transition placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-neutral-950 dark:bg-neutral-900 dark:focus:bg-neutral-950 dark:focus:ring-white'

export default function PersonalInfoPage() {
	const t = useTranslations('Account')
	const locale = useLocale()
	const dispatch = useAppDispatch()
	const user = useAppSelector(selectUser)
	const saving = useAppSelector(selectUserSaving)
	const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')

	// The account loads a moment after the page: fill the form when it arrives
	const [values, setValues] = useState<Record<string, string>>({})
	useEffect(() => {
		if (!user) return
		setValues({
			firstname: user.accountData?.firstname ?? '',
			lastname: user.accountData?.lastname ?? '',
			phone: user.phone ?? '',
			dateOfBirth: String(user.accountData?.dateOfBirth ?? '').slice(0, 10),
			gender: user.accountData?.gender ?? '',
			address: user.accountData?.address ?? '',
			about: user.accountData?.about ?? '',
		})
	}, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

	const set = (key: string) => (e: { target: { value: string } }) => {
		setValues((v) => ({ ...v, [key]: e.target.value }))
		setStatus('idle')
	}

	async function save(e: FormEvent) {
		e.preventDefault()
		const result = await dispatch(updateUser(values))
		setStatus(updateUser.fulfilled.match(result) ? 'saved' : 'error')
	}

	if (!user) {
		return <div className="h-96 animate-pulse rounded-3xl bg-neutral-100 dark:bg-neutral-900" />
	}

	const field = (key: string, label: string, props: Record<string, any> = {}) => (
		<label className="block">
			<span className="mb-1.5 block text-sm font-medium">{label}</span>
			<input value={values[key] ?? ''} onChange={set(key)} className={input} {...props} />
		</label>
	)

	return (
		<div className="max-w-2xl">
			<h1 className="text-2xl font-bold tracking-tight sm:text-5xl">{t('nav_personal')}</h1>
			<p className="mt-2 text-neutral-500">{t('personal_text')}</p>

			<form onSubmit={save} className="mt-10 space-y-5">
				<div className="grid gap-5 sm:grid-cols-2">
					{field('firstname', t('first_name'), { autoComplete: 'given-name', maxLength: 80 })}
					{field('lastname', t('last_name'), { autoComplete: 'family-name', maxLength: 80 })}
				</div>

				<div className="block">
					<span className="mb-1.5 block text-sm font-medium">{t('email')}</span>
					<div className="flex items-center justify-between gap-3 rounded-2xl bg-neutral-100 px-4 py-3.5 text-neutral-500 dark:bg-neutral-900">
						<span className="truncate">{user.email}</span>
						<Link href={`/${locale}/account-settings/login-and-security` as any} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-neutral-950 underline underline-offset-4 dark:text-white">
							<Lock className="h-3.5 w-3.5" />
							{t('change')}
						</Link>
					</div>
				</div>

				<div className="grid gap-5 sm:grid-cols-2">
					{field('phone', t('phone'), { type: 'tel', autoComplete: 'tel', maxLength: 30, placeholder: '+34 600 000 000' })}
					{field('dateOfBirth', t('birth_date'), { type: 'date', max: new Date().toISOString().slice(0, 10) })}
				</div>

				<label className="block">
					<span className="mb-1.5 block text-sm font-medium">{t('gender')}</span>
					<select value={values.gender ?? ''} onChange={set('gender')} className={input}>
						{GENDERS.map(([value, key]) => (
							<option key={key} value={value}>
								{t(key)}
							</option>
						))}
					</select>
				</label>

				{field('address', t('address'), { autoComplete: 'street-address', maxLength: 300 })}

				<label className="block">
					<span className="mb-1.5 block text-sm font-medium">{t('about')}</span>
					<textarea value={values.about ?? ''} onChange={set('about')} rows={4} maxLength={1000} placeholder={t('about_placeholder')} className={`${input} resize-y`} />
				</label>

				<div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
					<button
						type="submit"
						disabled={saving}
						className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-neutral-950 px-8 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-70 dark:bg-white dark:text-neutral-950"
					>
						{saving && <Loader2 className="h-4 w-4 animate-spin" />}
						{t('save')}
					</button>
					{status === 'saved' && (
						<p role="status" className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
							<CheckCircle2 className="h-4 w-4" />
							{t('saved')}
						</p>
					)}
					{status === 'error' && (
						<p role="alert" className="text-sm text-red-500">
							{t('save_error')}
						</p>
					)}
				</div>
			</form>
		</div>
	)
}
