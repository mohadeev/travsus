
import { NextIntlClientProvider } from 'next-intl'
import { fontVariables } from '@/lib/fonts'

import '../globals.css'
import '@/fonts/line-awesome-1.3.0/css/line-awesome.css'
import '@/styles/index.scss'
import 'rc-slider/assets/index.css'
import logoImg from '@/images/logos/dark/travsus_black_and_white.png'

import Script from 'next/script'
import { CONSENT_DEFAULT_SCRIPT } from '@/lib/consent'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

import LocaleLayoutClient from './LocaleLayoutClient'

// Lets pages be cached per language instead of rendered on every request
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
	children,
	params: { locale },
}: Readonly<{
	children: React.ReactNode
	params: { locale: string }
}>) {
	setRequestLocale(locale)
	const messages = await getMessages({ locale })

	return (
		<html className={fontVariables} lang={locale}>
			<head>
				{/* Fonts */}
				<link
					href="https://fonts.cdnfonts.com/css/helvetica-neue-55"
					rel="stylesheet"
				/>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap"
					rel="stylesheet"
				/>
				<link rel="preconnect" href="//fdn.fontcdn.ir" />
				<link rel="preconnect" href="//v1.fontapi.ir" />
				<link href="https://v1.fontapi.ir/css/SFProDisplay" rel="stylesheet" />

				{/* Favicon */}
				<link rel="icon" type="image/png" href={logoImg.src} />

				{/* Google Adsense */}
				<meta name="google-adsense-account" content="ca-pub-9261275339248060" />
			</head>

			<>
				{/* Google Tag Manager */}
				<Script
					id="gtm-init"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						// Consent Mode v2: everything denied until the visitor chooses (lib/consent.ts)
						__html: CONSENT_DEFAULT_SCRIPT + `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
						new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
						j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
						j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
						f.parentNode.insertBefore(j,f);
						})(window,document,'script','dataLayer','GTM-WHQK9Z5M');`,
					}}
				/>

				{/* Global gtag (GA + Google Ads) */}
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-C7S8V9MJWG"
					strategy="afterInteractive"
				/>
				<Script id="gtag-init" strategy="afterInteractive">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());

						// Google Analytics
						gtag('config', 'G-C7S8V9MJWG');

						// Google Ads
						gtag('config', 'AW-17494341245');
					`}
				</Script>

				{/* Hotjar loads from <CookieConsent />, only after analytics consent */}

				<NextIntlClientProvider messages={messages}>
					<LocaleLayoutClient>{children}</LocaleLayoutClient>
				</NextIntlClientProvider>
			</>
		</html>
	)
}
