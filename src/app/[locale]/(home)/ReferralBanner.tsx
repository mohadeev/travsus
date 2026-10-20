// Referral program banner: offer and button on the left, the three perks on the
// right as icon cards, photo dimmed behind. Wide and compact so it uses the row.
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
			{/* Phones: the photo is a strip on top. Larger screens: dimmed behind everything. */}
			<div className="relative h-36 sm:absolute sm:inset-0 sm:-z-10 sm:h-auto">
				<Image src={PHOTOS.referral} alt="" fill sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" />
				<div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-950 sm:bg-gradient-to-r sm:from-neutral-950 sm:via-neutral-950/85 sm:to-neutral-950/55" />
			</div>

			<div className="relative grid items-center gap-8 px-6 pb-8 pt-2 sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-14">
				<div>
					<span className="inline-block rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-950 sm:text-xs">
						{t('badge_text')}
					</span>
					<h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
						{t('main_heading_line1')}
						<span className="block text-amber-300">{t('main_heading_line2')}</span>
					</h2>
					<p className="mt-3 max-w-md text-base text-white/80 sm:mt-4 sm:text-lg">{t('sub_heading')}</p>

					<div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-5">
						<Link
							href={'/affiliates' as any}
							className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-neutral-950 transition hover:bg-amber-200 sm:w-auto"
						>
							{t('button_text')}
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Link>
						<p className="max-w-xs text-xs leading-snug text-white/60">{t('footer_text')}</p>
					</div>
				</div>

				<ul className="grid gap-3 sm:grid-cols-3 lg:gap-4">
					{FEATURES.map(([Icon, title, desc]) => (
						<li
							key={title}
							className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-md sm:flex-col sm:items-start sm:gap-4 sm:p-5"
						>
							<span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-300 text-neutral-950">
								<Icon className="h-5 w-5" strokeWidth={2.2} />
							</span>
							<div>
								<p className="text-sm font-semibold leading-snug sm:text-base">{t(title)}</p>
								<p className="mt-0.5 text-xs leading-snug text-white/70 sm:mt-1 sm:text-sm">{t(desc)}</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
