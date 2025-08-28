'use client'

import Script from 'next/script'
import { useLocale } from 'next-intl'
import { useEffect } from 'react'
import tawkWidgets from '@/constants/tawkWidgets.json'

export default function TawkToWidget() {
	const locale = useLocale()

	// normalize: convert "es-ES" -> "es"
	const tawkLocale = locale || 'en-US'

	useEffect(() => {
		// if (typeof window !== 'undefined' && window.Tawk_API) {
		// 	window.Tawk_API.onLoad = function () {
		// 		window.Tawk_API.setLanguage(tawkLocale)
		// 	}
		// }

		if (typeof window !== 'undefined' && window.Tawk_API) {
			window.Tawk_API.onLoad = () => {
				const locale = navigator.language.split('-')[0] // e.g. "es"
				const messages: Record<string, string> = {
					en: '👋 Hi! How can we help?',
					es: '👋 ¡Hola! ¿En qué podemos ayudarte?',
					de: '👋 Hallo! Wie können wir helfen?',
				}

				// Send a custom greeting dynamically
				if (messages[locale]) {
					window.Tawk_API.addEvent('custom_greeting', {
						message: messages[locale],
					})
				}
			}
		}
	}, [tawkLocale])

	return (
		<Script
			id="tawk-to-widget"
			strategy="afterInteractive"
			dangerouslySetInnerHTML={{
				__html: `
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/68af54897190b019215672e6/${tawkWidgets[tawkLocale]}';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
          })();
        `,
			}}
		/>
	)
}
