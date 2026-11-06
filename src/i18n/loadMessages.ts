// The site's texts for one language (public/messages/<locale>.json).
// Next.js build: bundled in. The Cloudflare build swaps this file for
// loadMessages.cloudflare.ts (see vite.config.ts), which reads the same
// files from the Worker's static assets so they don't count toward the
// Worker size limit.
import enUS from '../../public/messages/en-US.json'
import deDE from '../../public/messages/de-DE.json'
import esES from '../../public/messages/es-ES.json'
import frFR from '../../public/messages/fr-FR.json'
import itIT from '../../public/messages/it-IT.json'
import jaJP from '../../public/messages/ja-JP.json'
import koKR from '../../public/messages/ko-KR.json'
import ptPT from '../../public/messages/pt-PT.json'
import ruRU from '../../public/messages/ru-RU.json'
import zhCN from '../../public/messages/zh-CN.json'

const messages: Record<string, Record<string, any>> = {
	'en-US': enUS,
	'de-DE': deDE,
	'es-ES': esES,
	'fr-FR': frFR,
	'it-IT': itIT,
	'ja-JP': jaJP,
	'ko-KR': koKR,
	'pt-PT': ptPT,
	'ru-RU': ruRU,
	'zh-CN': zhCN,
}

export async function loadMessages(locale: string): Promise<Record<string, any>> {
	return messages[locale]
}
