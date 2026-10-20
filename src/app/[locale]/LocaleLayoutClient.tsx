'use client'

import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

import SiteHeader from '@/app/(client-components)/(Header)/SiteHeader'
import ClientCommons from './ClientCommons'
import '../globals.css'
import '@/fonts/line-awesome-1.3.0/css/line-awesome.css'
import '@/styles/index.scss'
import 'rc-slider/assets/index.css'
import Footer from '@/components/Footer'
import FooterNav from '@/components/FooterNav'
import ThemeProvider from '../theme-provider'
import { ReduxProvider } from '@/store/ReduxProvider'
import AuthProvider from './context/AuthProvider'
import AuthWatcher from './context/AuthWatcher'
import { usePathname } from 'next/navigation'

import { Inter_Tight } from 'next/font/google'
import Script from 'next/script'
import CookieConsent from '@/components/CookieConsent'
import ConditionalComponent from '@/components/ConditionalComponent'
import { Suspense, useEffect } from 'react'
import { wakeUpServer } from '@/utils/wakeUpServer'
// import createMailRelayUser from '@/utils/crm/createMailRelayUser'
import NewsletterModal from './newsletter-modal'
import { PlanTripModal } from './plan-trip-modal'
import TawkToWidget from '@/components/TawkToWidget'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import AffiliateRefCapture from '@/components/AffiliateRefCapture'

export default function LocaleLayoutClient({
	children,
}: {
	children: React.ReactNode
}) {
	const isLocalhost = process.env.NODE_ENV === 'development'
	const pathname = usePathname()
	const hasSubdomain = pathname.includes('coming-soon')
	const isDashboardPath = pathname?.startsWith('/dashboard') ?? false
	// The mobile bottom menu would cover the Reserve / Pay buttons: hidden on tour pages
	// (their address ends with the tour id), checkout and the payment result
	const hideBottomMenu = /\/[0-9a-f]{24}\/?$/.test(pathname ?? '') || /\/(checkout|pay-done)(\/|$)/.test(pathname ?? '')
	useEffect(() => {
		wakeUpServer()
		// ;(async () => {
		// 	try {
		// 		const response = await createMailRelayUser({
		// 			email: 'dev@travsus.com',
		// 			name: 'Ghalo',
		// 			group_ids: [1],
		// 		})
		// 		alert('User created:' + response)
		// 	} catch (error) {
		// 		console.log('Error:', (error as Error).message)
		// 	}
		// })()
	}, [])

	return (
		<body className=".theme-animals theme-animals overflow-auto bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
			<AuthProvider>
				<ThemeProvider>
					<ReduxProvider>
						<AuthWatcher />
						<Suspense fallback={null}>
							<AnalyticsTracker />
							<AffiliateRefCapture />
						</Suspense>
						{/* Google Tag Manager (noscript) — must be inside <body> */}
						<noscript>
							<iframe
								src="https://www.googletagmanager.com/ns.html?id=GTM-WHQK9Z5M"
								height="0"
								width="0"
								style={{ display: 'none', visibility: 'hidden' }}
							/>
						</noscript>
						<NewsletterModal />
						<div className="overflow-auto">
							<TawkToWidget />
							<CookieConsent />

							{/* <PlanTripModal isOpen={true} onClose={()=>{}}/> */}
							{!isDashboardPath && (
								<ConditionalComponent show={true} component={SiteHeader} />
							)}
							<div id="main">{children}</div>
							{!isDashboardPath && (
								<>
									{!hideBottomMenu && <ConditionalComponent show={true} component={FooterNav} />}
									<ConditionalComponent show={true} component={Footer} />
									{/* <FooterNav />
												<Footer /> */}
								</>
							)}
						</div>
						<ClientCommons />
					</ReduxProvider>
				</ThemeProvider>
			</AuthProvider>
		</body>
	)
}

// import React from 'react'

// const LocaleLayoutClient = ({ children }) => {
// 	return <div>{children}</div>
// }

// export default LocaleLayoutClient
