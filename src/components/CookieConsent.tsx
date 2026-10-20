'use client'
// Cookie banner: Accept all / Reject all / Choose, and a settings panel that
// the footer's "Cookie settings" link reopens. Hotjar loads only with analytics
// consent; Google tags follow Consent Mode (see lib/consent.ts).
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { Cookie, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { OPEN_SETTINGS_EVENT, readConsent, saveConsent, type ConsentChoice } from '@/lib/consent'

export default function CookieConsent() {
	const t = useTranslations('Cookies')
	const locale = useLocale()
	const [choice, setChoice] = useState<ConsentChoice | null>(null)
	const [banner, setBanner] = useState(false)
	const [panel, setPanel] = useState(false)
	const [draft, setDraft] = useState<ConsentChoice>({ analytics: false, marketing: false })

	useEffect(() => {
		const saved = readConsent()
		setChoice(saved)
		setBanner(!saved)
		const open = () => {
			setDraft(readConsent() ?? { analytics: false, marketing: false })
			setPanel(true)
		}
		window.addEventListener(OPEN_SETTINGS_EVENT, open)
		return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open)
	}, [])

	const decide = (next: ConsentChoice) => {
		saveConsent(next)
		setChoice(next)
		setBanner(false)
		setPanel(false)
	}

	return (
		<>
			{/* Hotjar (session recordings): only with analytics consent, never on localhost */}
			{choice?.analytics && typeof window !== 'undefined' && !/^(localhost|127\.)/.test(window.location.hostname) && (
				<Script id="hotjar-init" strategy="afterInteractive">
					{`(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:5171033,hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
				</Script>
			)}

			{banner && !panel && (
				<div role="dialog" aria-live="polite" aria-label={t('title')} className="fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-md">
					<div className="rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-neutral-200 sm:p-6 dark:bg-neutral-900 dark:ring-neutral-800">
						<div className="flex items-start gap-3">
							<span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
								<Cookie className="h-5 w-5" />
							</span>
							<div>
								<p className="text-base font-bold">{t('title')}</p>
								<p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
									{t('text')}{' '}
									<Link href={`/${locale}/cookie-policy` as any} className="font-semibold text-neutral-950 underline underline-offset-2 dark:text-white">
										{t('policy')}
									</Link>
								</p>
							</div>
						</div>
						<div className="mt-4 grid grid-cols-2 gap-2">
							<button type="button" onClick={() => decide({ analytics: false, marketing: false })} className="h-11 rounded-full border border-neutral-300 text-sm font-semibold transition hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white">
								{t('reject')}
							</button>
							<button type="button" onClick={() => decide({ analytics: true, marketing: true })} className="h-11 rounded-full bg-neutral-950 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950">
								{t('accept')}
							</button>
						</div>
						<button type="button" onClick={() => { setDraft({ analytics: false, marketing: false }); setPanel(true) }} className="mt-3 w-full text-center text-sm font-semibold text-neutral-600 underline underline-offset-4 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white">
							{t('choose')}
						</button>
					</div>
				</div>
			)}

			{panel && (
				<div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-3 sm:items-center" role="dialog" aria-modal="true" aria-label={t('settings_title')}>
					<div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl sm:p-7 dark:bg-neutral-900">
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="text-xl font-bold">{t('settings_title')}</p>
								<p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{t('settings_text')}</p>
							</div>
							{choice && (
								<button type="button" onClick={() => setPanel(false)} aria-label={t('close')} className="grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
									<X className="h-5 w-5" />
								</button>
							)}
						</div>

						<ul className="mt-5 divide-y divide-neutral-200 dark:divide-neutral-800">
							<Row title={t('necessary')} text={t('necessary_text')} checked disabled label={t('always_on')} />
							<Row title={t('analytics')} text={t('analytics_text')} checked={draft.analytics} onChange={(v) => setDraft({ ...draft, analytics: v })} />
							<Row title={t('marketing')} text={t('marketing_text')} checked={draft.marketing} onChange={(v) => setDraft({ ...draft, marketing: v })} />
						</ul>

						<div className="mt-5 grid grid-cols-2 gap-2">
							<button type="button" onClick={() => decide(draft)} className="h-11 rounded-full border border-neutral-300 text-sm font-semibold transition hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white">
								{t('save')}
							</button>
							<button type="button" onClick={() => decide({ analytics: true, marketing: true })} className="h-11 rounded-full bg-neutral-950 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950">
								{t('accept')}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

function Row({ title, text, checked, disabled, label, onChange }: { title: string; text: string; checked: boolean; disabled?: boolean; label?: string; onChange?: (value: boolean) => void }) {
	return (
		<li className="flex items-start justify-between gap-4 py-4">
			<div>
				<p className="text-sm font-semibold">{title}</p>
				<p className="mt-0.5 text-xs leading-relaxed text-neutral-500">{text}</p>
			</div>
			{disabled ? (
				<span className="shrink-0 text-xs font-semibold text-emerald-700 dark:text-emerald-400">{label}</span>
			) : (
				<button
					type="button"
					role="switch"
					aria-checked={checked}
					aria-label={title}
					onClick={() => onChange?.(!checked)}
					className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? 'bg-neutral-950 dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'}`}
				>
					<span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all dark:bg-neutral-900 ${checked ? 'left-6' : 'left-1'}`} />
				</button>
			)}
		</li>
	)
}
