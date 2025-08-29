'use client'

import Script from 'next/script'
import { useLocale, useMessages } from 'next-intl'
import tawkWidgets from '@/constants/tawkWidgets.json'
import { useSelector } from 'react-redux'

export default function TawkToWidget() {
	const overlayState = useSelector((state: any) => state.overlaySlice)
	const messages = useMessages() as Record<string, Record<string, string>>

	const isModalVisible = overlayState?.toggleTawdWidget
	const locale = useLocale()
	const tawkLocale = locale || 'en-US'
	return isModalVisible ? (
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
	) : null
}
