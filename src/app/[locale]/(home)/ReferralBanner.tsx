// Affiliate program banner in the TRAVSUS colours: black with warm yellow and
// amber glows, yellow accents, no photo. The invitation and button on the left; the program in three
// glass cards on the right (top commission, cookie, payouts). Same texts as the
// affiliates page.
import Link from 'next/link'
import { ArrowUpRight, CalendarClock, Percent, Wallet } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ReferralBanner() {
	const t = useTranslations('Affiliates')

	const card = (Icon: typeof Percent, value: string, label: string, big = false) => (
		<div className={`flex items-center gap-4 rounded-2xl bg-white/[0.06] ring-1 ring-white/10 backdrop-blur-md ${big ? 'p-5 sm:p-6' : 'p-4'}`}>
			<span className={`grid shrink-0 place-items-center rounded-xl bg-[#FDE047] text-neutral-950 ${big ? 'h-14 w-14' : 'h-11 w-11'}`}>
				<Icon className={big ? 'h-7 w-7' : 'h-5 w-5'} />
			</span>
			<span className="min-w-0">
				<span className={`headline block ${big ? 'text-5xl text-[#FDE047] sm:text-6xl' : 'text-2xl sm:text-3xl'}`}>{value}</span>
				<span className="mt-1 block text-xs leading-snug text-white/60 sm:text-sm">{label}</span>
			</span>
		</div>
	)

	return (
		<section className="relative isolate overflow-hidden rounded-3xl bg-neutral-950 text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:rounded-[28px]">
			{/* Soft glows and a faint dot grid */}
			<div aria-hidden className="absolute -right-16 -top-32 -z-10 h-96 w-96 rounded-full bg-[#FDE047]/30 blur-3xl" />
			<div aria-hidden className="absolute -bottom-40 right-1/3 -z-10 h-80 w-80 rounded-full bg-amber-500/25 blur-3xl" />
			<div aria-hidden className="absolute -left-24 -top-24 -z-10 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />
			<div aria-hidden className="absolute inset-0 -z-10 opacity-[0.12] [background-image:radial-gradient(rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_right,transparent,black_60%)]" />

			<div className="grid items-center gap-8 px-6 py-8 sm:px-10 sm:py-12 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:px-14 lg:py-14">
				<div>
					<span className="inline-flex items-center gap-2 rounded-full bg-[#FDE047]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#FDE047] ring-1 ring-[#FDE047]/30">
						<span className="h-1.5 w-1.5 rounded-full bg-[#FDE047]" />
						{t('eyebrow')}
					</span>
					<h2 className="headline mt-4 text-[34px] sm:text-6xl">{t('hero_title')}</h2>
					<p className="mt-3 max-w-md text-base text-white/75 sm:mt-4 sm:text-lg">{t('hero_text')}</p>
					<div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-5">
						<Link
							href={'/affiliates' as any}
							className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#FDE047] px-7 py-3.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-[#FDE047]/20 transition hover:bg-white active:scale-[0.98]"
						>
							{t('form_submit')}
							<ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
						</Link>
						<p className="text-center text-sm text-white/55 sm:text-left">{t('cta_text')}</p>
					</div>
				</div>

				<div className="space-y-3">
					{card(Percent, t('stat_rate_value'), t('stat_rate_label'), true)}
					<div className="grid grid-cols-2 gap-3">
						{card(CalendarClock, t('stat_cookie_value'), t('stat_cookie_label'))}
						{card(Wallet, t('stat_payout_value'), t('stat_payout_label'))}
					</div>
				</div>
			</div>
		</section>
	)
}
