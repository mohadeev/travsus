// Referral program banner shaped like a ticket, in the black and white of the
// affiliates page: black card with a faint dot grid, stars, a huge two-tone
// heading and the pill button; the perks as numbered steps on a white stub,
// torn off along a dashed line with a round notch at each end.
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const PERKS = [
	['feature1_title', 'feature1_desc'],
	['feature2_title', 'feature2_desc'],
	['feature3_title', 'feature3_desc'],
] as const

/** Round cut-out in the page colour */
const notch = 'absolute z-10 h-10 w-10 rounded-full bg-white sm:h-12 sm:w-12 dark:bg-neutral-900'

export default function ReferralBanner() {
	const t = useTranslations('ReferralProgramBanner')

	return (
		<section className="relative grid overflow-visible rounded-[28px] bg-black text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:rounded-[36px] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)] dark:ring-1 dark:ring-white/10">
			{/* Dot grid, as on the affiliates page */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.18]"
				style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
			/>

			<div className="relative px-6 pb-10 pt-9 sm:px-12 sm:pb-14 sm:pt-14 lg:py-16">
				<p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ring-1 ring-white/15 sm:text-[11px]">
					<span className="h-1.5 w-1.5 rounded-full bg-white" />
					{t('badge_text')}
				</p>

				<p className="mt-6 flex items-center gap-1" aria-label="5/5">
					{[0, 1, 2, 3, 4].map((i) => (
						<Star key={i} className="h-5 w-5 fill-current sm:h-6 sm:w-6" strokeWidth={0} />
					))}
				</p>

				<h2 className="mt-3 text-[40px] font-black leading-[0.95] tracking-[-0.04em] sm:text-[64px] lg:text-[76px]">
					<span className="block">{t('main_heading_line1')}</span>
					<span className="block text-white/40">{t('main_heading_line2')}</span>
				</h2>

				<p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/70 sm:mt-8 sm:text-lg">{t('sub_heading')}</p>

				<Link
					href={'/affiliates' as any}
					className="group mt-8 inline-flex h-14 w-full items-center justify-between gap-6 rounded-full bg-white pl-7 pr-2 text-[15px] font-bold text-black transition hover:bg-neutral-200 active:scale-[0.98] sm:mt-10 sm:w-auto sm:text-base"
				>
					{t('button_text')}
					<span className="grid h-10 w-10 place-items-center rounded-full bg-black text-white transition-transform group-hover:translate-x-0.5">
						<ArrowRight className="h-5 w-5" />
					</span>
				</Link>
			</div>

			{/* The stub */}
			<div className="relative p-2.5 pt-0 sm:p-3 sm:pt-0 lg:pl-0 lg:pt-3">
				{/* Tear line and notches: across on phones, down the side from lg */}
				<span aria-hidden className="absolute inset-x-8 top-0 border-t-2 border-dashed border-white/25 lg:hidden" />
				<span aria-hidden className={`${notch} left-0 top-0 -translate-x-1/2 -translate-y-1/2 lg:hidden`} />
				<span aria-hidden className={`${notch} right-0 top-0 -translate-y-1/2 translate-x-1/2 lg:hidden`} />
				<span aria-hidden className="absolute inset-y-8 left-0 hidden -translate-x-6 border-l-2 border-dashed border-white/25 lg:block" />
				<span aria-hidden className={`${notch} -translate-x-[calc(50%+24px)] left-0 top-0 hidden -translate-y-1/2 lg:block`} />
				<span aria-hidden className={`${notch} -translate-x-[calc(50%+24px)] bottom-0 left-0 hidden translate-y-1/2 lg:block`} />

				<ol className="relative mt-2.5 flex h-[calc(100%-10px)] flex-col justify-center rounded-[20px] bg-white px-6 py-8 text-black sm:mt-3 sm:h-[calc(100%-12px)] sm:rounded-[26px] sm:px-12 sm:py-12 lg:mt-0 lg:h-full">
					{PERKS.map(([title, desc], i) => (
						<li key={title} className="relative flex gap-4 pb-8 last:pb-0 sm:gap-5 sm:pb-14">
							{/* Line to the next step */}
							{i < PERKS.length - 1 && (
								<span aria-hidden className="absolute left-[22px] top-11 h-full -translate-x-1/2 border-l-2 border-dashed border-black/25 sm:left-[28px] sm:top-14" />
							)}
							<span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-black text-[15px] font-black text-white ring-4 ring-neutral-100 sm:h-14 sm:w-14 sm:text-lg">
								0{i + 1}
							</span>
							<div className="min-w-0 pt-1.5 sm:pt-3">
								<p className="text-[17px] font-bold leading-tight tracking-tight sm:text-xl">{t(title)}</p>
								<p className="mt-1 text-sm text-neutral-500">{t(desc)}</p>
							</div>
						</li>
					))}
				</ol>
			</div>
		</section>
	)
}
