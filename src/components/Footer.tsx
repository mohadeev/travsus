'use client'
// Site footer: brand + newsletter, link columns, language and legal fine print.
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowRight, Instagram } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Route } from 'next'
import logoImg from '@/images/logo.png'
import LanguagePreferencesModal from '@/app/(client-components)/(Header)/LanguagePreferencesModal'
import { openCookieSettings } from '@/lib/consent'

// [heading key (SiteFooter), links as [footer label key, href]]: edit to change the columns
const COLUMNS: [string, [string, string][]][] = [
	[
		'explore',
		[
			['all_tours', '/search?query='],
			['Forum', '/forum'],
			['Affiliate Program', '/affiliates'],
		],
	],
	[
		'company',
		[
			['About', '/about'],
			['Contact', '/contact'],
		],
	],
	[
		'legal',
		[
			['Legal', '/legal-notice'],
			['Privacy Policy', '/privacy-policy'],
			['Cookies', '/cookie-policy'],
			['Terms of Use', '/general-conditions'],
		],
	],
]

type SignupState = 'idle' | 'sending' | 'done' | 'already' | 'error'

export default function Footer() {
	const t = useTranslations('SiteFooter')
	const tCookies = useTranslations('Cookies')
	const tLinks = useTranslations('footer')
	const [email, setEmail] = useState('')
	const [signup, setSignup] = useState<SignupState>('idle')

	// Same newsletter as the pop-up, with every topic selected
	const subscribe = async (event: FormEvent) => {
		event.preventDefault()
		setSignup('sending')
		try {
			const response = await fetch('/api/user/post/newsletter', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, types: ['deals', 'tips', 'reviews', 'inspiration'] }),
			})
			const { code } = await response.json()
			setSignup(code === 'ALREADY_SUBSCRIBED' ? 'already' : response.ok ? 'done' : 'error')
			if (response.ok) setEmail('')
		} catch {
			setSignup('error')
		}
	}

	const label = (key: string) => (key === 'all_tours' ? t(key) : tLinks(key))

	return (
		<footer className="bg-neutral-950 text-neutral-400">
			<div className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:pt-20">
				{/* Brand + newsletter */}
				<div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1fr_1.1fr]">
					<div>
						<Link href={"/" as Route} aria-label="TRAVSUS">
							{/* eslint-disable-next-line @next/next/no-img-element -- small static logo */}
							<img src={logoImg.src} alt="TRAVSUS" className="h-7 w-auto invert" />
						</Link>
						<p className="mt-5 max-w-sm text-2xl font-semibold leading-snug tracking-tight text-white">
							{t('tagline')}
						</p>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-white">{t('newsletter_title')}</h2>
						<p className="mt-1 text-sm">{t('newsletter_text')}</p>
						<form onSubmit={subscribe} className="mt-5 flex max-w-md items-center gap-2 rounded-full bg-white/10 p-1.5 pl-5 ring-1 ring-white/10 focus-within:ring-white/40">
							<label className="flex-1">
								<span className="sr-only">{t('email_placeholder')}</span>
								<input
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder={t('email_placeholder')}
									className="w-full border-0 bg-transparent p-0 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-0"
								/>
							</label>
							<button
								type="submit"
								disabled={signup === 'sending'}
								className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-60"
							>
								{t('subscribe')}
								<ArrowRight className="h-4 w-4" />
							</button>
						</form>
						{signup !== 'idle' && signup !== 'sending' && (
							<p role="status" className="mt-3 text-sm text-white">
								{signup === 'done' ? t('subscribed') : signup === 'already' ? t('already') : t('error')}
							</p>
						)}
					</div>
				</div>

				{/* Link columns */}
				<div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-4">
					{COLUMNS.map(([heading, links]) => (
						<nav key={heading} aria-label={t(heading)}>
							<h3 className="text-sm font-semibold text-white">{t(heading)}</h3>
							<ul className="mt-4 space-y-3 text-sm">
								{links.map(([key, href]) => (
									<li key={key}>
										<Link href={href as Route} className="transition hover:text-white">
											{label(key)}
										</Link>
									</li>
								))}
								{heading === 'legal' && (
									<li>
										<button type="button" onClick={openCookieSettings} className="transition hover:text-white">
											{tCookies('footer_link')}
										</button>
									</li>
								)}
							</ul>
						</nav>
					))}
					<div>
						<h3 className="text-sm font-semibold text-white">{t('follow')}</h3>
						<a
							href="https://www.instagram.com/travsusofficial"
							target="_blank"
							rel="noopener noreferrer"
							className="mt-4 inline-grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-neutral-950"
						>
							<span className="sr-only">{tLinks('footer_Instagram')}</span>
							<Instagram className="h-5 w-5" aria-hidden />
						</a>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
					<p>{tLinks('footer_Copyright', { year: new Date().getFullYear() })}</p>
					<LanguagePreferencesModal variant={'footer'} dark />
				</div>
				<p className="mt-6 whitespace-pre-line text-[11px] leading-relaxed text-neutral-500">
					{tLinks('footer_Disclaimer')}
				</p>
			</div>
		</footer>
	)
}
