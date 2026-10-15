'use client'
// The time right now in a place, ticking every minute.
import { useEffect, useState } from 'react'

export default function LocalTime({ timezone, locale }: { timezone: string; locale: string }) {
	const format = () => {
		try {
			return new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', timeZone: timezone })
		} catch {
			return ''
		}
	}
	const [time, setTime] = useState<string | null>(null)
	useEffect(() => {
		setTime(format())
		const timer = setInterval(() => setTime(format()), 30_000)
		return () => clearInterval(timer)
	}, [timezone, locale]) // eslint-disable-line react-hooks/exhaustive-deps
	// Rendered after load only, so server and browser never disagree
	return <span suppressHydrationWarning>{time ?? '––:––'}</span>
}
