'use client'
// Hero picture of the agencies page: an agency's bookings board where new
// bookings from travellers around the world keep coming in, with this
// month's total and a little chart. Sample data, for illustration.
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import s from './agencies.module.css'

const photo = (path: string) => `https://res.cloudinary.com/travsus/image/upload/${path}`

// [tour, photo, country code, travellers, price in €]
const BOOKINGS: [string, string, string, number, number][] = [
	['3-day Sahara tour', photo('v1750846907/tkwk1giydalwhzz4s479.jpg'), 'DE', 2, 590],
	['Todra & Dades gorges', photo('v1750846953/pw5niksa94jekylv8hsl.webp'), 'JP', 4, 760],
	['Night in a desert camp', photo('v1750849730/ljj21rdgiuzarfl9sp6u.webp'), 'FR', 2, 320],
	['5-day desert tour', photo('v1750845576/eoclrvznrfogy4q7y3gi.jpg'), 'US', 3, 1240],
	['10-day Morocco tour', photo('v1750840519/zwjusytrr97d0gqrgigm.jpg'), 'KR', 2, 2380],
	['Fes to Marrakech', photo('v1750847437/cslmpxxgrj90ebzmfuew.jpg'), 'ES', 5, 1150],
]
const VISIBLE = 4
const EVERY = 2800
const BARS = [38, 52, 45, 63, 58, 74, 69, 88, 80, 96]

const flag = (code: string) => String.fromCodePoint(...code.split('').map((c) => 0x1f1a5 + c.charCodeAt(0)))

export default function AgencyBoard({ className = '' }: { className?: string }) {
	const t = useTranslations('Agencies')
	const locale = useLocale()
	const [tick, setTick] = useState(0)

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
		const id = setInterval(() => setTick((n) => n + 1), EVERY)
		return () => clearInterval(id)
	}, [])

	const country = (code: string) => {
		try {
			return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code
		} catch {
			return code
		}
	}
	const money = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
	// Newest first: each tick, the next booking arrives on top
	const rows = Array.from({ length: VISIBLE }, (_, i) => (tick - i + BOOKINGS.length * 100) % BOOKINGS.length)
	const newest = BOOKINGS[rows[0]]

	return (
		<div className={`relative mx-auto w-full max-w-[460px] ${className}`}>
			{/* Notification: the booking that just came in */}
			<div key={tick} className={`absolute -right-2 -top-14 z-20 flex items-center gap-2.5 rounded-2xl bg-white py-2.5 pl-2.5 pr-4 text-neutral-950 shadow-2xl sm:-right-8 ${s.notify}`}>
				<span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FDE047] text-lg">{flag(newest[2])}</span>
				<span>
					<span className="block text-[13px] font-bold leading-tight">{t('board_new')} · +{money(newest[4])}</span>
					<span className="block text-xs text-neutral-500">{newest[0]}</span>
				</span>
			</div>

			<div className="relative overflow-hidden rounded-[28px] bg-neutral-900 p-4 ring-1 ring-white/10 shadow-[0_40px_120px_-20px_rgba(255,255,255,0.12)] sm:p-5">
				<div className="flex items-center justify-between px-1">
					<p className="text-[15px] font-bold">{t('board_title')}</p>
					<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
						<span className={`h-1.5 w-1.5 rounded-full bg-emerald-400 ${s.blink}`} />
						{t('board_live')}
					</span>
				</div>

				<ul className="mt-4 space-y-2">
					{rows.map((index, i) => {
						const [tour, src, code, guests, price] = BOOKINGS[index]
						return (
							<li
								key={`${tick - i}`}
								className={`flex items-center gap-3 rounded-2xl p-2.5 ring-1 transition-colors duration-700 ${i === 0 ? `bg-white/[0.09] ring-white/20 ${s.arrive}` : 'bg-white/[0.03] ring-white/[0.06]'}`}
							>
								<span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-800">
									<Image src={src} alt="" fill sizes="48px" className="object-cover" />
								</span>
								<span className="min-w-0 flex-1">
									<span className="block truncate text-sm font-semibold">{tour}</span>
									<span className="mt-0.5 block truncate text-xs text-white/50">
										{flag(code)} {t('board_from', { country: country(code) })} · {t('board_guests', { count: guests })}
									</span>
								</span>
								<span className="text-right">
									<span className="block text-sm font-bold tabular-nums">{money(price)}</span>
									<span className="block text-[11px] text-white/40">{t('board_today')}</span>
								</span>
							</li>
						)
					})}
				</ul>

				{/* This month */}
				<div className="mt-4 flex items-end justify-between gap-4 rounded-2xl bg-white p-4 text-neutral-950">
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">{t('board_month')}</p>
						<p className="mt-1 text-3xl font-black tabular-nums tracking-tight">
							{48 + tick} <span className="text-base font-semibold text-neutral-500">{t('board_bookings')}</span>
						</p>
					</div>
					<div className="flex h-12 items-end gap-1">
						{BARS.map((h, i) => (
							<span key={i} className={`w-2 rounded-sm ${i === BARS.length - 1 ? 'bg-neutral-950' : 'bg-neutral-300'}`} style={{ height: `${h}%` }} />
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
