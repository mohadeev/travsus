// 'use client'
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
import { headers } from 'next/headers'

const poppins = Poppins({
	subsets: ['latin'],
	display: 'swap',
	weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
	title: 'Travsus - Booking online React Next Template',
	description: 'Booking online & rental online React Next Template',
	keywords: 'Travsus, Booking online, React Next Template',
	// viewport:
	// 	'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
}

export default function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: any
}) {
	const headersList = headers()
	const host = headersList.get('host') || '' // e.g., sub.example.com
	const parts = host.split('.')

	// Check if the environment is local or production
	const isLocalhost = process.env.NODE_ENV === 'development'

	// Determine if there's a subdomain
	const hasSubdomain = parts.length >= 2 // Subdomain exists if more than two parts

	// Combine conditions into one variable
	const subdomainStatus = isLocalhost || hasSubdomain
	return (
		<html lang="en" className={poppins.className}>
			{subdomainStatus ? (
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
			) : (
				<body className="bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
					{children}
				</body>
			)}
		</html>
	)
}
