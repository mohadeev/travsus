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
		<div className="grid gap-10 rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-10 lg:grid-cols-2 lg:items-center dark:bg-neutral-900 dark:ring-neutral-800">
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
						className="mt-4 w-full accent-neutral-950 dark:accent-white"
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
						className="mt-4 w-full accent-neutral-950 dark:accent-white"
					/>,
				)}
			</div>

			<div className="rounded-3xl bg-neutral-100 p-6 text-center sm:p-8 dark:bg-neutral-950">
				<p className="text-sm font-medium text-neutral-500">{t('calc_monthly')}</p>
				<p className="mt-1 text-5xl font-bold tracking-tight tabular-nums sm:text-6xl">{money(monthly)}</p>
				<p className="mt-3 text-sm text-neutral-500">
					{t('calc_yearly', { amount: money(monthly * 12) })} · {t('calc_rate', { rate })}
				</p>
				<p className="mt-4 text-xs text-neutral-400">{t('calc_note')}</p>
			</div>
		</div>
	)
}
