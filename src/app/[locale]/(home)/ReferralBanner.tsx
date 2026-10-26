// Referral program banner: one slim black strip. A small label, the offer on
// one line (the amount bright, the rest muted), a short sub-line and one button.
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useTranslations } from '@/lib/i18n'

export default function ReferralBanner() {
	const t = useTranslations('ReferralProgramBanner')
	const locale = useLocale()
	// "CLAIM NOW" → "Claim now": calmer than capitals
	const button = t('button_text').toLocaleLowerCase(locale)
	const cta = button.charAt(0).toLocaleUpperCase(locale) + button.slice(1)

	return (
		<section className="relative isolate overflow-hidden rounded-3xl bg-neutral-950 text-white ring-1 ring-white/10">
			{/* A faint light from the top right corner */}
			<div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(520px_circle_at_100%_0%,rgba(255,255,255,0.11),transparent_65%)]" />

			<div className="flex flex-col gap-6 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-10 sm:py-9">
				<div className="min-w-0">
					<p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
						<span className="h-1 w-1 rounded-full bg-white/70" />
						{t('badge_text')}
					</p>
					<h2 className="mt-3 text-[22px] font-semibold leading-tight tracking-tight sm:text-[28px]">
						{t('main_heading_line1')} <span className="text-white/45">{t('main_heading_line2')}</span>
					</h2>
					<p className="mt-2 text-sm text-white/50">{t('sub_heading')}</p>
				</div>

				<Link
					href={'/affiliates' as any}
					className="group inline-flex h-11 shrink-0 items-center justify-center gap-1.5 self-start rounded-full bg-white px-5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 active:scale-[0.98] sm:self-auto"
				>
					{cta}
					<ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
				</Link>
			</div>
		</section>
	)
}
