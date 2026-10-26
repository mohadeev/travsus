// Referral program banner shaped like a ticket: orange card with stars, a
// huge two-tone heading and one button; the perks as numbered steps on a dark
// panel. Two round notches (page colour) cut the card between the halves.
import Link from 'next/link'
import { Star } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const PERKS = [
	['feature1_title', 'feature1_desc'],
	['feature2_title', 'feature2_desc'],
	['feature3_title', 'feature3_desc'],
] as const

const ORANGE = '#FA542F'
const BROWN = '#3A0C05'

/** Round cut-out in the page colour */
const notch = 'absolute h-10 w-10 rounded-full bg-white sm:h-12 sm:w-12 dark:bg-neutral-900'

export default function ReferralBanner() {
	const t = useTranslations('ReferralProgramBanner')

	return (
		<section className="relative grid gap-2.5 rounded-[28px] p-2.5 sm:rounded-[36px] sm:p-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)] lg:gap-3" style={{ backgroundColor: ORANGE }}>
			<div className="px-5 pb-6 pt-8 sm:px-12 sm:pb-12 sm:pt-14 lg:py-16">
				<p className="flex items-center gap-1" style={{ color: BROWN }} aria-label="5/5">
					{[0, 1, 2, 3, 4].map((i) => (
						<Star key={i} className="h-5 w-5 fill-current sm:h-6 sm:w-6" strokeWidth={0} />
					))}
				</p>
				<p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] sm:text-xs" style={{ color: BROWN }}>
					{t('badge_text')}
				</p>

				<h2 className="mt-3 text-[40px] font-black leading-[0.95] tracking-[-0.04em] sm:text-[64px] lg:text-[76px]">
					<span className="block text-white">{t('main_heading_line1')}</span>
					<span className="block" style={{ color: BROWN }}>
						{t('main_heading_line2')}
					</span>
				</h2>

				<p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white sm:mt-8 sm:text-lg">{t('sub_heading')}</p>

				<Link
					href={'/affiliates' as any}
					className="mt-7 inline-flex h-12 items-center rounded-full bg-white px-6 text-[15px] font-bold shadow-[0_6px_20px_-6px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 active:scale-[0.98] sm:mt-10 sm:h-14 sm:px-7 sm:text-base"
					style={{ color: BROWN }}
				>
					{t('button_text')}
				</Link>
			</div>

			<div className="relative">
				{/* Notches: left and right on phones, top and bottom from lg */}
				<span aria-hidden className={`${notch} -left-2.5 top-0 -translate-x-1/2 -translate-y-[calc(50%+5px)] sm:-left-3 lg:hidden`} />
				<span aria-hidden className={`${notch} -right-2.5 top-0 -translate-y-[calc(50%+5px)] translate-x-1/2 sm:-right-3 lg:hidden`} />
				<span aria-hidden className={`${notch} -top-3 left-0 hidden -translate-x-[calc(50%+6px)] -translate-y-1/2 lg:block`} />
				<span aria-hidden className={`${notch} -bottom-3 left-0 hidden -translate-x-[calc(50%+6px)] translate-y-1/2 lg:block`} />

				<ol className="flex h-full flex-col justify-center gap-0 rounded-[20px] px-6 py-8 sm:rounded-[26px] sm:px-12 sm:py-12" style={{ backgroundColor: BROWN }}>
					{PERKS.map(([title, desc], i) => (
						<li key={title} className="relative flex gap-4 pb-8 last:pb-0 sm:gap-5 sm:pb-14">
							{/* Line to the next step */}
							{i < PERKS.length - 1 && (
								<span aria-hidden className="absolute left-[22px] top-11 h-full w-1.5 -translate-x-1/2 sm:left-[28px] sm:top-14" style={{ backgroundColor: ORANGE }} />
							)}
							<span
								className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-[15px] font-black text-white ring-[3px] ring-white sm:h-14 sm:w-14 sm:text-lg"
								style={{ backgroundColor: ORANGE }}
							>
								0{i + 1}.
							</span>
							<div className="min-w-0 pt-1.5 sm:pt-3">
								<p className="text-[17px] font-bold leading-tight tracking-tight text-white sm:text-xl">{t(title)}</p>
								<p className="mt-1 text-sm text-white/60">{t(desc)}</p>
							</div>
						</li>
					))}
				</ol>
			</div>
		</section>
	)
}
