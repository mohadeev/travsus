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
import { ReduxProvider } from './GlobalRedux/provider'
import AuthProvider from './context/AuthProvider'
import AuthWatcher from './context/AuthWatcher'
import { usePathname } from 'next/navigation'
import AuthModal from '@/components/AuthModal'

import { Inter_Tight } from 'next/font/google'
import Script from 'next/script'
import { CombinedCookieConsent } from './privacy-policy/CombinedCookieConsent'
import ConditionalComponent from '@/components/ConditionalComponent'
import { useEffect } from 'react'
import { wakeUpServer } from '@/utils/wakeUpServer'
// import createMailRelayUser from '@/utils/crm/createMailRelayUser'
import NewsletterModal from './newsletter-modal'
import { PlanTripModal } from './plan-trip-modal'
import TawkToWidget from '@/components/TawkToWidget'

export default function LocaleLayoutClient({
	children,
}: {
	children: React.ReactNode
}) {
	const isLocalhost = process.env.NODE_ENV === 'development'
	const pathname = usePathname()
	const hasSubdomain = pathname.includes('coming-soon')
	const isDashboardPath = pathname?.startsWith('/dashboard') ?? false
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
		<ThemeProvider>
			<AuthProvider>
				<ReduxProvider>
					<AuthWatcher />
					<body className=".theme-animals theme-animals overflow-auto bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
						<NewsletterModal />
						<AuthModal />
						<div className="overflow-auto">
							<CombinedCookieConsent />
							<AuthModal />
							<TawkToWidget />

							{/* <PlanTripModal isOpen={true} onClose={()=>{}}/> */}
							{!isDashboardPath && (
								<ConditionalComponent show={true} component={SiteHeader} />
							)}
							{children}
							{!isDashboardPath && (
								<>
									<ConditionalComponent show={true} component={FooterNav} />
									<ConditionalComponent show={true} component={Footer} />
									{/* <FooterNav />
												<Footer /> */}
								</>
							)}
						</div>
						<ClientCommons />
					</body>
				</ReduxProvider>
			</AuthProvider>
		</ThemeProvider>
	)
}

// import React from 'react'

// const LocaleLayoutClient = ({ children }) => {
// 	return <div>{children}</div>
// }

// export default LocaleLayoutClient
