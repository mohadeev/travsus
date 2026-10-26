// Referral program banner as a slim boarding pass. The black main part has the
// pass header, a "flight" from you to the reward and three pass fields; the
// white stub, past a dashed perforation with round notches, has a barcode and
// the button.
import Link from 'next/link'
import { ArrowUpRight, Plane } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useTranslations } from '@/lib/i18n'

// Bar widths for the stub's barcode (decorative)
const BARS = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 2, 3, 1, 1, 2]

/** Round cut-out in the page colour */
const notch = 'absolute h-6 w-6 rounded-full bg-white dark:bg-neutral-900'

export default function ReferralBanner() {
	const t = useTranslations('ReferralProgramBanner')
	const locale = useLocale()
	// "CLAIM NOW" → "Claim now": calmer than capitals
	const button = t('button_text').toLocaleLowerCase(locale)
	const cta = button.charAt(0).toLocaleUpperCase(locale) + button.slice(1)
	// "Earn Up To €1000" → "€1000" for the route (the whole line when there's no amount)
	const line1 = t('main_heading_line1')
	const amount = /[€$£]\s?[\d.,]+|[\d.,]+\s?[€$£]/.exec(line1)?.[0] ?? line1

	const field = (label: string, value: string) => (
		<div className="min-w-0">
			<dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">{label}</dt>
			<dd className="mt-1 text-sm font-semibold leading-tight">{value}</dd>
		</div>
	)

	return (
		<section className="relative flex flex-col overflow-hidden rounded-3xl shadow-[0_24px_50px_-28px_rgba(0,0,0,0.55)] sm:flex-row">
			{/* Main part */}
			<div className="relative isolate flex-1 bg-neutral-950 px-6 py-6 text-white sm:px-9 sm:py-7">
				<div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(480px_circle_at_0%_0%,rgba(255,255,255,0.09),transparent_60%)]" />

				{/* Pass header */}
				<div className="flex items-center justify-between gap-4 border-b border-dashed border-white/15 pb-4">
					<p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em]">
						<span className="font-black tracking-[0.08em]">TRAVSUS</span>
						<span className="h-3 w-px bg-white/25" />
						<span className="text-white/55">{t('pass_title')}</span>
					</p>
					<p className="font-mono text-[11px] text-white/40">TRV · 1000</p>
				</div>

				{/* The route: you → the reward */}
				<div className="mt-5 flex items-center gap-3 sm:gap-6">
					<div className="shrink-0">
						<p className="text-2xl font-black uppercase leading-none tracking-tight sm:text-4xl">{t('pass_you')}</p>
						<p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-white/45">{t('pass_your_link')}</p>
					</div>
					<div aria-hidden className="relative flex min-w-[48px] flex-1 items-center">
						<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
						<span className="mx-1 flex-1 border-t-2 border-dotted border-white/25" />
						<Plane className="h-4 w-4 shrink-0 rotate-45 text-white" />
						<span className="mx-1 flex-1 border-t-2 border-dotted border-white/25" />
						<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
					</div>
					<div className="min-w-0 max-w-[45%] text-right sm:max-w-none">
						<p className="text-2xl font-black leading-none tracking-tight tabular-nums sm:text-4xl">{amount}</p>
						<p className="mt-1.5 text-[10px] uppercase leading-snug tracking-[0.12em] text-white/45 sm:text-[11px] sm:tracking-[0.14em]">{t('main_heading_line2')}</p>
					</div>
				</div>
				<h2 className="sr-only">
					{line1} {t('main_heading_line2')}
				</h2>

				{/* Pass fields */}
				<dl className="mt-5 grid grid-cols-3 gap-4 border-t border-dashed border-white/15 pt-4">
					{field(t('pass_class'), t('pass_class_value'))}
					{field(t('pass_commission'), t('feature2_title'))}
					{field(t('pass_boarding'), t('pass_boarding_value'))}
				</dl>
			</div>

			{/* Stub, past the perforation */}
			<div className="relative flex flex-col items-start justify-between gap-4 border-t-2 border-dashed border-neutral-300 bg-white px-6 py-6 text-neutral-950 sm:w-64 sm:border-l-2 sm:border-t-0 sm:px-7 sm:py-7 dark:bg-neutral-100">
				<span aria-hidden className={`${notch} -left-3 -top-3 sm:-top-3 sm:left-0 sm:-translate-x-1/2`} />
				<span aria-hidden className={`${notch} -right-3 -top-3 sm:-bottom-3 sm:left-0 sm:right-auto sm:top-auto sm:-translate-x-1/2`} />

				<div className="w-full">
					<p className="text-[10px] font-semibold uppercase leading-snug tracking-[0.16em] text-neutral-500">{t('badge_text')}</p>
					{/* Barcode */}
					<div aria-hidden className="mt-3 flex h-10 items-stretch gap-[2px]">
						{BARS.map((w, i) => (
							<span key={i} className="bg-neutral-950" style={{ width: w + 0.5 }} />
						))}
					</div>
				</div>

				<div className="w-full">
					<Link
						href={'/affiliates' as any}
						className="group inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98]"
					>
						{cta}
						<ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
					</Link>
					<p className="mt-2.5 text-[11px] leading-snug text-neutral-500">{t('sub_heading')}</p>
				</div>
			</div>
		</section>
	)
}
