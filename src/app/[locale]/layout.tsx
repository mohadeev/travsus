import { NextIntlClientProvider, hasLocale } from 'next-intl'

import '../globals.css'
import '@/fonts/line-awesome-1.3.0/css/line-awesome.css'
import '@/styles/index.scss'
import 'rc-slider/assets/index.css'

import { Inter_Tight } from 'next/font/google'
import Script from 'next/script'
import { getMessages } from 'next-intl/server'

import LocaleLayoutClient from './LocaleLayoutClient'

export default async function RootLayout({
	children,
	params: { locale },
}: Readonly<{
	children: React.ReactNode
	params: { locale: string }
}>) {
	const messages = await getMessages()

	const isLocalhost = process.env.NODE_ENV === 'development'

	return (
		<html lang="en">
			<head>
				<meta name="google-adsense-account" content="ca-pub-9261275339248060" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					// crossOrigin="true"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap"
					rel="stylesheet"
				></link>
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
				{/* Google Tag Manager (noscript) */}
				<noscript>
					<iframe
						src="https://www.googletagmanager.com/ns.html?id=GTM-WHQK9Z5M"
						height="0"
						width="0"
						style={{ display: 'none', visibility: 'hidden' }}
					></iframe>
				</noscript>
			</head>
			<body>
				<NextIntlClientProvider messages={messages}>
					<LocaleLayoutClient> {children}</LocaleLayoutClient>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
