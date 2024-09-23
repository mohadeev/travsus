'use client'
import { Poppins } from 'next/font/google'
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

const poppins = Poppins({
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
	console.log('pathname', pathname)
	const hasSubdomain = pathname.includes('coming-soon')
	//  parts.length >= 2 // Subdomain exists if more than two parts
	// if (!pathname.includes('coming-soon')) {
	// 	redirect('coming-soon')
	// }

	const [windowIn, setWindowIn] = useState(false)
	// useEffect(() => {
	// 	if (typeof window !== 'undefined') {
	// 		setWindowIn(true)
	// 		const hostname = window.location.hostname
	// 		const domainParts = hostname.split('.')
	// 		if (domainParts.length <= 1 && !hasSubdomain) {
	// 			redirect('coming-soon')
	// 		}
	// 	}
	// }, [pathname])
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const script = document.createElement('script')
			script.async = true
			script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-WHQK9Z5M'
			document.head.appendChild(script)
		}
	}, [])

	return (
		<html lang="en" className={poppins.className}>
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
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'

export async function GetServerSideProps(context: any) {
	const { req } = context
	const host = req.headers.host // localhost:3000
	const protocol = req.headers['x-forwarded-proto'] || 'http' // Get protocol

	// Get the full URL, including path
	const fullUrl = `${protocol}://${host}${req.url}`
	console.log('fullUrl', fullUrl)

	return {
		props: {
			fullUrl, // Pass full URL to the component as a prop
		},
	}
}
