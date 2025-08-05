'use client'

import React from 'react'
import moment from 'moment'
import 'moment/locale/ja' // ✅ import Japanese locale
import { useLocale } from 'next-intl'

const MomentLocaleExample = () => {
	const locale = useLocale() // e.g., "ja" or "ja-JP"

	// Normalize locale for Moment
	const momentLocale = locale.toLowerCase().startsWith('ja') ? 'ja' : 'en'
	moment.locale(momentLocale)

	const now = moment().format('LLLL') // full localized date/time

	return <div>{now}</div>
}

export default MomentLocaleExample
