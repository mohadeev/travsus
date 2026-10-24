// Referral program banner: black card with the reward as one huge number,
// the perks as a short list and one button. On larger screens the photo
// sits clear in its own panel on the right, with a floating "instant payout" chip.
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check, Zap } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { PHOTOS } from '@/lib/photos'

const PERKS = ['feature1_title', 'feature2_title', 'feature3_title'] as const

export default function ReferralBanner() {
	const t = useTranslations('ReferralProgramBanner')
	// "Earn Up To €1000" → "Earn Up To" + "€1000" (the whole line when there's no amount)
	const line1 = t('main_heading_line1')
	const amount = /[€$£]\s?[\d.,]+|[\d.,]+\s?[€$£]/.exec(line1)?.[0]
	const lead = amount ? line1.replace(amount, '').trim() : ''

	return (
		<section className="relative isolate overflow-hidden rounded-[28px] bg-black text-white">
			{/* Soft gold glow behind the number */}
			<div aria-hidden className="pointer-events-none absolute -left-24 -top-32 -z-10 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />

			<div className="grid lg:grid-cols-[1.1fr_1fr]">
				<div className="px-6 py-8 sm:px-12 sm:py-14 lg:py-16">
					<p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-white/60 sm:text-[12px] sm:tracking-[0.16em]">
						<span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
						{t('badge_text')}
					</p>

					{amount ? (
						<h2 className="mt-5">
							{lead && <span className="block text-lg font-medium text-white/70 sm:text-2xl">{lead}</span>}
							<span className="block bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-[64px] font-bold leading-none tracking-tighter text-transparent sm:text-[96px]">
								{amount}
							</span>
							<span className="mt-2 block text-[22px] font-semibold leading-tight tracking-tight sm:text-3xl">{t('main_heading_line2')}</span>
						</h2>
					) : (
						<h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
							{line1} <span className="text-amber-400">{t('main_heading_line2')}</span>
						</h2>
					)}

					<p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/60 sm:text-base">{t('sub_heading')}</p>

					<ul className="mt-6 space-y-2.5 border-t border-white/10 pt-6">
						{PERKS.map((key) => (
							<li key={key} className="flex items-center gap-3 text-[15px] font-medium">
								<span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-black">
									<Check className="h-3 w-3" strokeWidth={3} />
								</span>
								{t(key)}
							</li>
						))}
					</ul>

					<Link
						href={'/affiliates' as any}
						className="group mt-8 inline-flex h-12 w-full items-center justify-between gap-6 rounded-full bg-white pl-6 pr-1.5 text-[15px] font-semibold text-black transition hover:bg-amber-100 active:scale-[0.98] sm:w-auto"
					>
						{t('button_text')}
						<span className="grid h-9 w-9 place-items-center rounded-full bg-black text-white transition-transform group-hover:rotate-45">
							<ArrowUpRight className="h-4 w-4" />
						</span>
					</Link>
				</div>

				{/* Larger screens: the photo, clear, in its own panel */}
				<div className="relative hidden p-3 lg:block">
					<div className="relative h-full min-h-[420px] overflow-hidden rounded-[22px]">
						<Image src={PHOTOS.referral} alt="" fill sizes="600px" className="object-cover" />
						<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
						<div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white/15 p-3 pr-5 ring-1 ring-white/25 backdrop-blur-xl">
							<span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400 text-black">
								<Zap className="h-5 w-5" strokeWidth={2.4} />
							</span>
							<div>
								<p className="text-sm font-semibold">{t('feature3_title')}</p>
								<p className="text-xs text-white/75">{t('feature3_desc')}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
