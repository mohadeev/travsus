'use client'

import SiteHeader from './(client-components)/(Header)/SiteHeader'
import ClientCommons from './ClientCommons'
import './globals.css'
import '@/fonts/line-awesome-1.3.0/css/line-awesome.css'
import '@/styles/index.scss'
import 'rc-slider/assets/index.css'
import Footer from '@/components/Footer'
import FooterNav from '@/components/FooterNav'
import ThemeProvider from './theme-provider'
import { Providers } from './GlobalRedux/provider'
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
import createMailRelayUser from '@/utils/crm/createMailRelayUser'
import NewsletterModal from './newsletter-modal'
import { PlanTripModal } from './plan-trip-modal'
import TrackingScript from './tracking-script'

export default function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: any
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
		<html lang="en">
			<head>
				<meta name="google-adsense-account" content="ca-pub-9261275339248060" />
				<link rel="preconnect" href="//fdn.fontcdn.ir" />
				<link rel="preconnect" href="//v1.fontapi.ir" />
				<link
					href="https://v1.fontapi.ir/css/SFProDisplay"
					rel="stylesheet"
				></link>
				{/* Google Tag Manager */}
				<Script
					id="gtm-init"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WHQK9Z5M');`,
					}}
				/>
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-C7S8V9MJWG"
					strategy="afterInteractive"
				/>
				<Script id="ga-init" strategy="afterInteractive">
					{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-C7S8V9MJWG');`}
				</Script>
				{/* Google Tag Manager - GTM */}
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WHQK9Z5M');`,
					}}
				/>

				{!isLocalhost && (
					<Script
						id="hotjar-init"
						strategy="afterInteractive"
						dangerouslySetInnerHTML={{
							__html: `(function(h,o,t,j,a,r){
								h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
								h._hjSettings={hjid:5171033,hjsv:6};
								a=o.getElementsByTagName('head')[0];
								r=o.createElement('script');r.async=1;
								r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
								a.appendChild(r);
							})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
						}}
					/>
				)}
			</head>
			{/* Google Tag Manager (noscript) */}
			<noscript>
				<iframe
					src="https://www.googletagmanager.com/ns.html?id=GTM-WHQK9Z5M"
					height="0"
					width="0"
					style={{ display: 'none', visibility: 'hidden' }}
				></iframe>
			</noscript>

			{!hasSubdomain ? (
				<>
					<ThemeProvider>
						<AuthProvider>
							<Providers>
								<AuthWatcher />
								<body className="bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
									{/* <NewsletterModal /> */}
									<AuthModal />
									<div>
										<CombinedCookieConsent />
										<AuthModal />
										{/* <PlanTripModal isOpen={true} onClose={()=>{}}/> */}
										{!isDashboardPath && (
											<ConditionalComponent
												show={true}
												component={SiteHeader}
											/>
										)}
										{children}
										{!isDashboardPath && (
											<>
												<ConditionalComponent
													show={true}
													component={FooterNav}
												/>
												<ConditionalComponent show={true} component={Footer} />
												{/* <FooterNav />
												<Footer /> */}
											</>
										)}
									</div>
									<ClientCommons />
									{/* <TrackingScript /> */}
								</body>
							</Providers>
						</AuthProvider>
					</ThemeProvider>
				</>
			) : (
				<body className="bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
					{children}
				</body>
			)}
		</html>
	)
}
