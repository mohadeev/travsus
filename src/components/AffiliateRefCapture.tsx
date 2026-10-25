'use client'
// Links shared by affiliates carry ?ref=CODE. When a page opens with one, the
// server counts the click and keeps the code for 60 days (cookie), so a
// booking made later is credited to the affiliate.
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { CODE } from '@/lib/affiliateCode'

export default function AffiliateRefCapture() {
	const pathname = usePathname()
	const ref = useSearchParams().get('ref')

	useEffect(() => {
		const code = ref?.trim().toLowerCase()
		if (!code || !CODE.test(code)) return
		// Once per code per browser tab
		const key = `travsus_ref_sent:${code}`
		try {
			if (sessionStorage.getItem(key)) return
			sessionStorage.setItem(key, '1')
		} catch {}
		fetch('/api/affiliates/click', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ code, path: pathname }),
			keepalive: true,
		}).catch(() => {})
	}, [ref, pathname])

	return null
}
