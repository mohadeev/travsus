// Referral program banner: offer and button on the left, the three perks on the
// right as icon cards, photo dimmed behind. On phones it stays short: a small
// eyebrow line, a two-line headline, the perks as a compact row, one button.
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Gem, Trophy, Zap } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { PHOTOS } from '@/lib/photos'

// [icon, title key, description key]: edit to change the perks
const FEATURES = [
	[Trophy, 'feature1_title', 'feature1_desc'],
	[Gem, 'feature2_title', 'feature2_desc'],
	[Zap, 'feature3_title', 'feature3_desc'],
] as const

export default function ReferralBanner() {
	const t = useTranslations('ReferralProgramBanner')

	return (
		<section className="relative isolate overflow-hidden rounded-3xl bg-neutral-950 text-white sm:rounded-[28px]">
			{/* Photo dimmed behind everything; darker on phones, where the text covers it */}
			<div className="absolute inset-0 -z-10">
				<Image src={PHOTOS.referral} alt="" fill sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover object-[65%_center]" />
				<div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-neutral-950/55 sm:bg-gradient-to-r sm:from-neutral-950 sm:via-neutral-950/85 sm:to-neutral-950/55" />
			</div>

			<div className="relative grid items-center gap-8 px-5 py-7 sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-14">
				<div>
					<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300 sm:hidden">{t('badge_text')}</p>
					<span className="hidden rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-950 sm:inline-block">
						{t('badge_text')}
					</span>
					<h2 className="mt-3 text-[28px] font-bold leading-[1.08] tracking-tight sm:mt-4 sm:text-5xl sm:leading-[1.1]">
						{t('main_heading_line1')}
						<span className="block text-amber-300">{t('main_heading_line2')}</span>
					</h2>
					<p className="mt-2.5 max-w-md text-[15px] leading-snug text-white/75 sm:mt-4 sm:text-lg sm:leading-normal sm:text-white/80">{t('sub_heading')}</p>

					{/* Phones: the perks as one compact row */}
					<ul className="mt-5 grid grid-cols-3 gap-2 sm:hidden">
						{FEATURES.map(([Icon, title]) => (
							<li key={title} className="rounded-2xl bg-white/[0.08] px-2 py-3 text-center ring-1 ring-white/10">
								<Icon className="mx-auto h-5 w-5 text-amber-300" strokeWidth={2.2} />
								<p className="mt-1.5 text-[12px] font-semibold leading-tight">{t(title)}</p>
							</li>
						))}
					</ul>

					<div className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-5">
						<Link
							href={'/affiliates' as any}
							className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-7 text-[15px] font-semibold text-neutral-950 transition hover:bg-amber-200 active:scale-[0.98] sm:h-auto sm:w-auto sm:py-3.5 sm:text-sm"
						>
							{t('button_text')}
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Link>
						<p className="hidden max-w-xs text-xs leading-snug text-white/60 sm:block">{t('footer_text')}</p>
					</div>
				</div>

				{/* Larger screens: the perks as cards */}
				<ul className="hidden gap-3 sm:grid sm:grid-cols-3 lg:gap-4">
					{FEATURES.map(([Icon, title, desc]) => (
						<li key={title} className="flex flex-col items-start gap-4 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-md">
							<span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-300 text-neutral-950">
								<Icon className="h-5 w-5" strokeWidth={2.2} />
							</span>
							<div>
								<p className="text-base font-semibold leading-snug">{t(title)}</p>
								<p className="mt-1 text-sm leading-snug text-white/70">{t(desc)}</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
