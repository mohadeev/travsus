const fs = require('fs')
const path = require('path')

// List of unique locale codes
const localeCodes = [
	'en_US',
	'cs_CZ',
	'da_DK',
	'de_AT',
	'de_CH',
	'de_DE',
	'el_GR',
	'en_AU',
	'en_CA',
	'en_GB',
	'en_HK',
	'en_IE',
	'en_IN',
	'en_MY',
	'en_NZ',
	'en_PH',
	'en_SG',
	'eu',
	'en_ZA',
	'es_AR',
	'es_CL',
	'es_CO',
	'es_ES',
	'es_MX',
	'es_PE',
	'es_VE',
	'fi_FI',
	'fr_BE',
	'fr_CA',
	'fr_CH',
	'fr_FR',
	'hu_HU',
	'id_ID',
	'it_CH',
	'it_IT',
	'ja_JP',
	'ko_KR',
	'nb_NO',
	'nl_BE',
	'nl_NL',
	'pl_PL',
	'pt_BR',
	'pt_PT',
	'ru_RU',
	'sk_SK',
	'sr_Latn_RS',
	'sv_SE',
	'th_TH',
	'tr_TR',
	'vi_VN',
	'zh_CN',
	'zh_Hant_HK',
	'zh_TW',
	'en',
]

// Make sure directory exists
const messagesDir = path.join(__dirname, 'messages')
if (!fs.existsSync(messagesDir)) {
	fs.mkdirSync(messagesDir)
}

// Create JSON files if they don't already exist
localeCodes.forEach((code) => {
	const filePath = path.join(messagesDir, `${code}.json`)
	if (!fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, '{}', 'utf8')
		console.log(`Created: ${code}.json`)
	} else {
		console.log(`Skipped (exists): ${code}.json`)
	}
})
