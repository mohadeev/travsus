'use client'
// Site footer, TripAdvisor layout: light grey, five columns of links
// (destinations, explore, company, legal, contact), then the logo, copyright,
// legal links and language, and the legal fine print.
import Link from 'next/link'
import { Instagram, Mail, MessageCircle, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Route } from 'next'
import LanguagePreferencesModal from '@/app/(client-components)/(Header)/LanguagePreferencesModal'
import { openCookieSettings } from '@/lib/consent'
import { companyProfile } from '@/constants/companyProfile'
import { useAppDispatch } from '@/store/hooks'
import { openChat } from '@/store/slices/ui'
import { SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_PHONE_TEL } from '@/constants/contact'
import Logo from '@/shared/Logo'

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
			['agencies', '/agencies'],
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

export default function Footer() {
	const t = useTranslations('SiteFooter')
	const tCookies = useTranslations('Cookies')
	const tLinks = useTranslations('footer')
	const tHome = useTranslations('Home')
	const tNav = useTranslations('Nav')
	const tTrust = useTranslations('Trust')
	const dispatch = useAppDispatch()
	const label = (key: string) => (key === 'all_tours' ? t(key) : key === 'blog' || key === 'agencies' ? tNav(key) : tLinks(key))

	return (
		<footer className="bg-[#f2f2f2] text-sm text-black dark:bg-neutral-900 dark:text-white">
			<div className="mx-auto max-w-7xl px-4 pb-7 pt-10 sm:px-5">
				{/* Link columns */}
				<div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
					<nav aria-label={tHome('destinations_title')}>
						<h3 className="mb-2.5 text-sm font-extrabold">{tHome('destinations_title')}</h3>
						<ul className="grid gap-2">
							{DESTINATIONS.map((city) => (
								<li key={city}>
									<Link href={`/search?query=${encodeURIComponent(city)}` as Route} className="hover:underline">
										{city}
									</Link>
								</li>
							))}
						</ul>
					</nav>
					{COLUMNS.map(([heading, links]) => (
						<nav key={heading} aria-label={t(heading)}>
							<h3 className="mb-2.5 text-sm font-extrabold">{t(heading)}</h3>
							<ul className="grid gap-2">
								{links.map(([key, href]) => (
									<li key={key}>
										<Link href={href as Route} className="hover:underline">
											{label(key)}
										</Link>
									</li>
								))}
								{heading === 'legal' && (
									<li>
										<button type="button" onClick={openCookieSettings} className="text-left hover:underline">
											{tCookies('footer_link')}
										</button>
									</li>
								)}
							</ul>
						</nav>
					))}
					<nav aria-label={t('contact')}>
						<h3 className="mb-2.5 text-sm font-extrabold">{t('contact')}</h3>
						<ul className="grid gap-2">
							<li>
								<a href={SUPPORT_PHONE_TEL} className="inline-flex items-center gap-2 hover:underline">
									<Phone className="h-4 w-4" aria-hidden />
									{SUPPORT_PHONE}
								</a>
							</li>
							<li>
								<a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex items-center gap-2 hover:underline">
									<Mail className="h-4 w-4" aria-hidden />
									{SUPPORT_EMAIL}
								</a>
							</li>
							<li>
								<button type="button" onClick={() => dispatch(openChat())} className="inline-flex items-center gap-2 hover:underline">
									<MessageCircle className="h-4 w-4" aria-hidden />
									{t('chat')}
								</button>
							</li>
							<li>
								<a href="https://www.instagram.com/travsusofficial" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline">
									<Instagram className="h-4 w-4" aria-hidden />
									{tLinks('footer_Instagram')}
								</a>
							</li>
						</ul>
						<p className="mt-2.5 text-xs text-neutral-600 dark:text-neutral-400">{tTrust('footer_hours')}</p>
					</nav>
				</div>

				{/* Bottom bar: logo, copyright and legal links; language on the right */}
				<div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-300 pt-5 dark:border-neutral-700">
					<div className="grid gap-2">
						<Logo className="w-24" />
						<p className="flex flex-wrap gap-x-4 gap-y-1 text-neutral-700 dark:text-neutral-300">
							<span>{tLinks('footer_Copyright', { year: new Date().getFullYear() })}</span>
							<Link href={'/general-conditions' as Route} className="hover:underline">{tLinks('Terms of Use')}</Link>
							<Link href={'/privacy-policy' as Route} className="hover:underline">{tLinks('Privacy Policy')}</Link>
						</p>
					</div>
					<LanguagePreferencesModal variant={'footer'} />
				</div>
				<p className="mt-4 whitespace-pre-line text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{tLinks('footer_Disclaimer')}</p>
				{/* Who runs the site, as in the legal notice: name, company number, registered office */}
				{companyProfile?.legalAddress && (
					<p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
						{tTrust('footer_company', { number: companyProfile.registrationNumber ?? '' })} · {companyProfile.legalAddress}
					</p>
				)}
			</div>
		</footer>
	)
}
