'use client'
// Newsletter pop-up: opens once after 30 seconds on content pages for
// visitors who aren't signed in. Closing it hides it for 30 days; subscribing
// hides it for good. A link to #newsletter opens it right away.
import { Fragment, useEffect, useState, type FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'
import { ArrowRight, Check, Lightbulb, Loader2, Mail, MapPinned, Sparkles, Tag, X, type LucideIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useAppSelector } from '@/store/hooks'
import { selectIsLoggedIn } from '@/store/slices/user'

const TOPICS: [string, LucideIcon][] = [
	['deals', Tag],
	['tips', Lightbulb],
	['reviews', MapPinned],
	['inspiration', Sparkles],
]
const IMAGE = 'https://res.cloudinary.com/travsus/image/upload/v1744996477/ChatGPT_Image_Apr_16_2025_09_15_13_PM_redfxm.png'
const DELAY_MS = 30_000
const SNOOZE_DAYS = 30
const KEY = 'travsus_newsletter' // "subscribed" or the time it was closed
// No pop-up while booking, paying or working in the account / admin
const QUIET = /^\/(checkout|pay-done|account|bookings|admin|cms-admin|dashboard|sign-in|sign-up)/

type Status = 'idle' | 'sending' | 'done' | 'already'
const ERRORS: Record<string, string> = {
	EMAIL_REQUIRED: 'err_email',
	INVALID_EMAIL: 'err_email',
	TYPES_REQUIRED: 'err_topics',
	RATE_LIMIT_EXCEEDED: 'err_limit',
}

const read = () => {
	try {
		return localStorage.getItem(KEY) ?? (localStorage.getItem('hasClosedNewsletterModal') === 'true' ? String(Date.now()) : null)
	} catch {
		return null
	}
}
const remember = (value: string) => {
	try {
		localStorage.setItem(KEY, value)
	} catch {}
}

export default function NewsletterModal() {
	const t = useTranslations('Newsletter')
	const locale = useLocale()
	const pathname = usePathname()
	const isLoggedIn = useAppSelector(selectIsLoggedIn)
	const [open, setOpen] = useState(false)
	const [email, setEmail] = useState('')
	const [topics, setTopics] = useState(TOPICS.map(([id]) => id))
	const [status, setStatus] = useState<Status>('idle')
	const [error, setError] = useState('')

	const quiet = QUIET.test(pathname.replace(`/${locale}`, ''))

	// Open after a while, unless closed lately or already subscribed
	useEffect(() => {
		if (isLoggedIn || quiet) return
		if (window.location.hash === '#newsletter') return setOpen(true)
		const seen = read()
		if (seen === 'subscribed' || (seen && Date.now() - Number(seen) < SNOOZE_DAYS * 86400_000)) return
		const timer = setTimeout(() => setOpen(true), DELAY_MS)
		return () => clearTimeout(timer)
	}, [isLoggedIn, quiet])

	useEffect(() => {
		if (isLoggedIn) setOpen(false)
	}, [isLoggedIn])

	const close = () => {
		setOpen(false)
		if (status !== 'done' && status !== 'already') remember(String(Date.now()))
	}

	const toggle = (id: string) => {
		setError('')
		setTopics((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]))
	}

	async function submit(e: FormEvent) {
		e.preventDefault()
		if (!topics.length) return setError(t('err_topics'))
		setStatus('sending')
		setError('')
		try {
			const res = await fetch('/api/user/post/newsletter', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: email.trim(), types: topics }),
			})
			const { code } = await res.json().catch(() => ({}))
			if (res.ok) {
				setStatus(code === 'ALREADY_SUBSCRIBED' ? 'already' : 'done')
				remember('subscribed')
				return
			}
			setError(t(ERRORS[code] ?? 'err_server'))
		} catch {
			setError(t('err_server'))
		}
		setStatus('idle')
	}

	const finished = status === 'done' || status === 'already'

	return (
		<Transition show={open} as={Fragment}>
			<Dialog className="relative z-[60]" onClose={close}>
				<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
					<div className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm" />
				</Transition.Child>

				<div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="translate-y-10 opacity-0 sm:translate-y-4 sm:scale-95"
						enterTo="translate-y-0 opacity-100 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="translate-y-0 opacity-100 sm:scale-100"
						leaveTo="translate-y-10 opacity-0 sm:translate-y-4 sm:scale-95"
					>
						<Dialog.Panel className="relative grid max-h-[94dvh] w-full overflow-y-auto rounded-t-[32px] bg-white text-neutral-950 shadow-2xl sm:max-w-4xl sm:rounded-[32px] md:grid-cols-[0.9fr_1.1fr] md:overflow-hidden dark:bg-neutral-900 dark:text-white">
							<button
								type="button"
								onClick={close}
								aria-label={t('close')}
								className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-neutral-950 shadow-sm backdrop-blur transition hover:bg-white md:bg-neutral-100 md:hover:bg-neutral-200 dark:md:bg-neutral-800 dark:md:text-white"
							>
								<X className="h-5 w-5" />
							</button>

							{/* Photo with what subscribers get */}
							<div className="relative h-44 overflow-hidden sm:h-56 md:h-auto md:min-h-[560px]">
								<Image src={IMAGE} alt="" fill sizes="(min-width: 768px) 400px, 100vw" className="object-cover" priority />
								<div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent" />
								<ul className="absolute inset-x-0 bottom-0 hidden space-y-2.5 p-8 text-white md:block">
									{(['perk_1', 'perk_2', 'perk_3'] as const).map((key) => (
										<li key={key} className="flex items-center gap-3 text-sm font-medium">
											<span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/20 backdrop-blur">
												<Check className="h-3.5 w-3.5" strokeWidth={3} />
											</span>
											{t(key)}
										</li>
									))}
								</ul>
							</div>

							<div className="flex flex-col justify-center p-6 pb-8 sm:p-10">
								{finished ? (
									<div className="py-6 text-center md:text-left">
										<span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 md:mx-0">
											<Check className="h-8 w-8" strokeWidth={3} />
										</span>
										<Dialog.Title className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{t(status === 'done' ? 'done_title' : 'already_title')}</Dialog.Title>
										<p className="mt-3 text-lg text-neutral-500">{t(status === 'done' ? 'done_text' : 'already_text')}</p>
										<button
											type="button"
											onClick={close}
											className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-neutral-950 px-7 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950"
										>
											{t('continue')}
											<ArrowRight className="h-4 w-4" />
										</button>
									</div>
								) : (
									<>
										<p className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
											<Mail className="h-3.5 w-3.5" />
											{t('eyebrow')}
										</p>
										<Dialog.Title className="mt-5 text-3xl font-bold leading-[1.05] tracking-tight sm:text-[44px]">{t('title')}</Dialog.Title>
										<p className="mt-3 text-neutral-500 sm:text-lg">{t('text')}</p>

										<form onSubmit={submit} className="mt-7" noValidate>
											<fieldset>
												<legend className="text-sm font-semibold">{t('topics')}</legend>
												<div className="mt-3 flex flex-wrap gap-2">
													{TOPICS.map(([id, Icon]) => {
														const on = topics.includes(id)
														return (
															<button
																key={id}
																type="button"
																role="switch"
																aria-checked={on}
																onClick={() => toggle(id)}
																className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold ring-1 transition active:scale-95 ${
																	on
																		? 'bg-neutral-950 text-white ring-neutral-950 dark:bg-white dark:text-neutral-950 dark:ring-white'
																		: 'text-neutral-600 ring-neutral-200 hover:ring-neutral-400 dark:text-neutral-300 dark:ring-neutral-700'
																}`}
															>
																{on ? <Check className="h-4 w-4" strokeWidth={3} /> : <Icon className="h-4 w-4" />}
																{t(`topic_${id}`)}
															</button>
														)
													})}
												</div>
											</fieldset>

											<label className="mt-6 block">
												<span className="sr-only">{t('email')}</span>
												<span className="relative block">
													<Mail className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
													<input
														type="email"
														required
														autoComplete="email"
														maxLength={60}
														value={email}
														onChange={(e) => {
															setEmail(e.target.value)
															setError('')
														}}
														placeholder={t('email')}
														disabled={status === 'sending'}
														className="h-14 w-full rounded-full border-0 bg-neutral-100 pl-14 pr-5 text-base ring-1 ring-transparent transition placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-800 dark:focus:bg-neutral-900 dark:focus:ring-white"
													/>
												</span>
											</label>

											{error && (
												<p role="alert" className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
													{error}
												</p>
											)}

											<button
												type="submit"
												disabled={status === 'sending'}
												className="group mt-3 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 text-base font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-70 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
											>
												{status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
												{t('submit')}
												{status !== 'sending' && <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />}
											</button>

											<p className="mt-4 text-center text-xs leading-relaxed text-neutral-500">
												{t.rich('consent', {
													terms: (chunks) => (
														<Link href={`/${locale}/general-conditions` as any} onClick={close} className="font-medium text-neutral-700 underline underline-offset-2 dark:text-neutral-300">
															{chunks}
														</Link>
													),
													privacy: (chunks) => (
														<Link href={`/${locale}/privacy-policy` as any} onClick={close} className="font-medium text-neutral-700 underline underline-offset-2 dark:text-neutral-300">
															{chunks}
														</Link>
													),
												})}
											</p>
										</form>
									</>
								)}
							</div>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	)
}
