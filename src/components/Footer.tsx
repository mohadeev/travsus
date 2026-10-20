'use client'
// Site footer: newsletter, destination / link / contact columns, payment methods, language and legal fine print, and a large faded
// wordmark to close the page.
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Instagram, MessageCircle, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Route } from 'next'
import LanguagePreferencesModal from '@/app/(client-components)/(Header)/LanguagePreferencesModal'
import { openCookieSettings } from '@/lib/consent'
import { companyProfile } from '@/constants/companyProfile'
import { useAppDispatch } from '@/store/hooks'
import { openChat } from '@/store/slices/ui'
import PaymentMethods from './PaymentMethods'

const PHONE = '+34 643 63 59 62'

// Most booked starting points; each opens the search for that city
const DESTINATIONS = ['Marrakech', 'Fes', 'Merzouga', 'Chefchaouen', 'Essaouira', 'Ouarzazate']

// [heading key (SiteFooter), links as [footer label key, href]]: edit to change the columns
const COLUMNS: [string, [string, string][]][] = [
	[
		'explore',
		[
			['all_tours', '/search?query='],
			['blog', '/blog'],
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
	const tHome = useTranslations('Home')
	const tNav = useTranslations('Nav')
	const dispatch = useAppDispatch()
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

	const label = (key: string) => (key === 'all_tours' ? t(key) : key === 'blog' ? tNav(key) : tLinks(key))

	return (
		<footer className="relative overflow-hidden bg-neutral-950 text-neutral-400">
			<div className="mx-auto max-w-7xl px-5 pt-16 sm:pt-20">
				{/* Newsletter */}
				<div className="grid items-center gap-6 border-b border-white/10 pb-16 lg:grid-cols-2 lg:gap-12">
					<div>
						<h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{t('newsletter_title')}</h2>
						<p className="mt-2 text-sm">{t('newsletter_text')}</p>
					</div>
					<div className="lg:justify-self-end lg:w-full lg:max-w-md">
						<form onSubmit={subscribe} className="flex items-center gap-2 rounded-full bg-white/10 p-1.5 pl-5 ring-1 ring-white/10 focus-within:ring-white/40">
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
				<div className="grid grid-cols-2 gap-x-8 gap-y-12 py-16 sm:grid-cols-3 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.5fr]">
					<nav aria-label={tHome('destinations_title')}>
						<h3 className="text-sm font-semibold text-white">{tHome('destinations_title')}</h3>
						<ul className="mt-4 space-y-3 text-sm">
							{DESTINATIONS.map((city) => (
								<li key={city}>
									<Link href={`/search?query=${encodeURIComponent(city)}` as Route} className="group inline-flex items-center gap-1 transition hover:text-white">
										{city}
										<ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" aria-hidden />
									</Link>
								</li>
							))}
						</ul>
					</nav>
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
					<div className="col-span-2 sm:col-span-1">
						<h3 className="text-sm font-semibold text-white">{t('contact')}</h3>
						<div className="mt-4 space-y-3">
							<a href={`tel:${PHONE.replace(/\s/g, '')}`} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10 transition hover:bg-white/[0.08]">
								<span className="grid h-9 w-9 place-items-center rounded-full bg-white text-neutral-950">
									<Phone className="h-4 w-4" aria-hidden />
								</span>
								<span className="text-sm font-medium text-white">{PHONE}</span>
							</a>
							<button type="button" onClick={() => dispatch(openChat())} className="flex w-full items-center gap-3 rounded-2xl bg-white/[0.04] p-3 text-left ring-1 ring-white/10 transition hover:bg-white/[0.08]">
								<span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white">
									<MessageCircle className="h-4 w-4" aria-hidden />
								</span>
								<span className="text-sm font-medium text-white">{t('chat')}</span>
							</button>
						</div>
						<h3 className="mt-8 text-sm font-semibold text-white">{t('follow')}</h3>
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

				{/* Payment methods */}
				<PaymentMethods />

				{/* Bottom bar */}
				<div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
					<p>{tLinks('footer_Copyright', { year: new Date().getFullYear() })}</p>
					<LanguagePreferencesModal variant={'footer'} dark />
				</div>
				<p className="mt-6 whitespace-pre-line text-[11px] leading-relaxed text-neutral-500">
					{tLinks('footer_Disclaimer')}
				</p>
				{/* Registered office: discreet, same as the legal notice */}
				{companyProfile?.legalAddress && (
					<p className="mt-3 text-[10px] text-neutral-600">
						TRAVSUS LIMITED · {companyProfile.legalAddress}, Ireland
					</p>
				)}
			</div>

			{/* Closing wordmark */}
			<p
				aria-hidden
				className="pointer-events-none mt-10 select-none bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text text-center text-[23vw] font-bold leading-[0.75] tracking-tighter text-transparent lg:text-[290px]"
			>
				TRAVSUS
			</p>
		</footer>
	)
}
