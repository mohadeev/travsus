'use client'
// Two sliders → an estimate of monthly and yearly commission, using the tiers.
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { rateFor } from './tiers'

export default function EarningsCalculator() {
	const t = useTranslations('Affiliates')
	const locale = useLocale()
	const [bookings, setBookings] = useState(10)
	const [value, setValue] = useState(500)

	const rate = rateFor(bookings)
	const monthly = (bookings * value * rate) / 100
	const money = (n: number) =>
		new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

	const slider = (label: string, shown: string, input: JSX.Element) => (
		<label className="block">
			<span className="flex items-baseline justify-between gap-4 text-sm font-medium text-neutral-500">
				{label}
				<span className="text-lg font-semibold tabular-nums text-neutral-950 dark:text-white">{shown}</span>
			</span>
			{input}
		</label>
	)

	return (
		<div className="grid gap-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-neutral-200 sm:gap-10 sm:p-10 lg:grid-cols-2 lg:items-center dark:bg-neutral-900 dark:ring-neutral-800">
			<div className="space-y-8">
				{slider(
					t('calc_bookings'),
					String(bookings),
					<input
						type="range"
						min={1}
						max={80}
						value={bookings}
						onChange={(e) => setBookings(Number(e.target.value))}
						className="mt-4 w-full accent-amber-500"
					/>,
				)}
				{slider(
					t('calc_value'),
					money(value),
					<input
						type="range"
						min={50}
						max={3000}
						step={50}
						value={value}
						onChange={(e) => setValue(Number(e.target.value))}
						className="mt-4 w-full accent-amber-500"
					/>,
				)}
			</div>

			<div className="relative isolate overflow-hidden rounded-3xl bg-neutral-950 p-6 text-center text-white sm:p-8">
				<div aria-hidden className="absolute -top-20 left-1/2 -z-10 h-40 w-40 -translate-x-1/2 rounded-full bg-amber-400/35 blur-3xl" />
				<p className="text-sm font-medium text-white/60">{t('calc_monthly')}</p>
				<p className="mt-1 bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-5xl font-bold tracking-tight tabular-nums text-transparent sm:text-6xl">{money(monthly)}</p>
				<p className="mt-3 text-sm text-white/60">
					{t('calc_yearly', { amount: money(monthly * 12) })} · {t('calc_rate', { rate })}
				</p>
				<p className="mt-4 text-xs text-white/40">{t('calc_note')}</p>
			</div>
		</div>
	)
}
