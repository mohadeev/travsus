'use client'
// The commission tiers and an earnings estimate. Tapping a tier switches to
// it (the bookings slider jumps into its range); moving the slider switches
// the highlighted tier.
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { rateFor, TIERS } from './tiers'

/** A bookings count inside each tier, used when it's tapped */
const START = TIERS.map((tier) => (tier.to ? Math.round((tier.from + tier.to) / 2) : tier.from + 9))

export default function EarningsCalculator() {
	const t = useTranslations('Affiliates')
	const locale = useLocale()
	const [bookings, setBookings] = useState(10)
	const [value, setValue] = useState(500)

	const rate = rateFor(bookings)
	const active = TIERS.findIndex((tier) => tier.rate === rate)
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
		<div>
			<div role="radiogroup" aria-label={t('tiers_title')} className="grid grid-cols-3 items-end gap-2.5 sm:gap-5">
				{TIERS.map((tier, i) => {
					const on = i === active
					return (
						<button
							key={tier.rate}
							type="button"
							role="radio"
							aria-checked={on}
							onClick={() => setBookings(START[i])}
							className={`relative overflow-hidden rounded-3xl px-3 text-center transition-all duration-300 active:scale-[0.97] sm:rounded-[32px] sm:px-10 ${
								on
									? 'bg-neutral-950 py-8 text-white shadow-2xl sm:py-14 dark:bg-white dark:text-neutral-950'
									: 'bg-neutral-100 py-6 text-neutral-950 hover:bg-neutral-200 sm:py-10 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800'
							}`}
						>
							<span className="block text-4xl font-bold tracking-tight sm:text-7xl">{tier.rate}%</span>
							<span className="mt-2 block text-xs opacity-60 sm:text-base">
								{tier.to ? t('tier_range', { from: tier.from, to: tier.to }) : t('tier_plus', { from: tier.from })}
							</span>
							{/* Grows with the tier */}
							<span className="mx-auto mt-4 block h-1.5 w-full max-w-[160px] overflow-hidden rounded-full" style={{ backgroundColor: 'color-mix(in srgb, currentColor 15%, transparent)' }}>
								<span className="block h-full rounded-full bg-current transition-all duration-500" style={{ width: `${((i + 1) / TIERS.length) * 100}%` }} />
							</span>
						</button>
					)
				})}
			</div>

			<div className="mt-5 grid gap-8 rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-neutral-200 sm:gap-10 sm:p-10 lg:grid-cols-2 lg:items-center dark:bg-neutral-900 dark:ring-neutral-800">
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

				<div className="relative isolate overflow-hidden rounded-3xl bg-neutral-950 p-6 text-center text-white sm:p-8">
					<p className="text-sm font-medium text-white/60">{t('calc_monthly')}</p>
					<p className="mt-1 text-5xl font-bold tracking-tight tabular-nums sm:text-6xl">{money(monthly)}</p>
					<p className="mt-3 text-sm text-white/60">
						{t('calc_yearly', { amount: money(monthly * 12) })} · {t('calc_rate', { rate })}
					</p>
					<p className="mt-4 text-xs text-white/40">{t('calc_note')}</p>
				</div>
			</div>
		</div>
	)
}
