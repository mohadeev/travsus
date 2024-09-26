'use client'

import allins from 'next/font/google'

import SiteHeader from './(client-components)/(Header)/SiteHeader'
import ClientCommons from './ClientCommons'
import './globals.css'
import '@/fonts/line-awesome-1.3.0/css/line-awesome.css'
import '@/styles/index.scss'
import 'rc-slider/assets/index.css'
import Footer from '@/components/Footer'
import FooterNav from '@/components/FooterNav'
import { Metadata } from 'next'
import ThemeProvider from './theme-provider'
import { Provider } from 'react-redux'
import { Providers } from './GlobalRedux/provider'
import AuthProvider from './context/AuthProvider'
import AuthWatcher from './context/AuthWatcher'
import TestAnything from './TestAnything'
// import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Inter_Tight } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter_Tight({
	subsets: ['latin'],
	display: 'swap',
	weight: ['300', '400', '500', '600', '700'],
})

// export const metadata: Metadata = {
// 	title: 'Travsus - Booking online React Next Template',
// 	description: 'Booking online & rental online React Next Template',
// 	keywords: 'Travsus, Booking online, React Next Template',
// 	// viewport:
// 	// 	'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
// }

export default function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: any
}) {
	// const headersList = headers()
	// const host = headersList.get('host') || '' // e.g., sub.example.com
	// const parts = host.split('.')

	// Check if the environment is local or production
	const isLocalhost = process.env.NODE_ENV === 'development'
	const pathname = usePathname()
	const hasSubdomain = pathname.includes('coming-soon')

	const [windowIn, setWindowIn] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			// Add Google Tag Manager Script
			const gtmScript = document.createElement('script')
			gtmScript.async = true
			gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-WHQK9Z5M'
			document.head.appendChild(gtmScript)

			// Add Google Analytics Script (gtag.js)
			const gaScript = document.createElement('script')
			gaScript.async = true
			gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-C7S8V9MJWG'
			document.head.appendChild(gaScript)

			// Google Analytics configuration
			const gaInitScript = document.createElement('script')
			gaInitScript.innerHTML = `
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', 'G-C7S8V9MJWG');
			`
			document.head.appendChild(gaInitScript)
		}
	}, [])

	return (
		<html lang="en" className={inter.className}>
			<head>
				{/* Google Tag Manager - GTM */}
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WHQK9Z5M');`,
					}}
				/>
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
									<div>
										<SiteHeader />
										{children}
										<FooterNav />
										<Footer />
									</div>
									<ClientCommons />
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
