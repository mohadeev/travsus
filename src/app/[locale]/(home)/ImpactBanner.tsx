// Impact banner: €1 from every booking goes to disaster relief, planting trees
// (in Africa and around the world) and fighting CO₂. The promise on the left,
// the three causes on the right as small cards, the young plant photo behind.
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, HeartHandshake, Leaf, Sprout } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PHOTOS } from '@/lib/photos'

const CAUSES = [
	{ key: 'trees', Icon: Sprout },
	{ key: 'relief', Icon: HeartHandshake },
	{ key: 'co2', Icon: Leaf },
] as const

export default function ImpactBanner() {
	const t = useTranslations('Home')

	return (
		<section className="relative isolate overflow-hidden rounded-3xl bg-neutral-950 text-white sm:rounded-[28px]">
			<Image src={PHOTOS.impact} alt="" fill sizes="(max-width: 1280px) 100vw, 1280px" className="-z-10 object-cover" />
			<div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/65 to-black/25 lg:bg-gradient-to-r lg:from-black/85 lg:via-black/55 lg:to-black/30" />

			<div className="grid items-center gap-8 px-6 pb-7 pt-40 sm:px-10 sm:py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:px-14 lg:py-14">
				<div>
					<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-300/30">
						<Leaf className="h-3.5 w-3.5" />
						{t('impact_badge')}
					</span>
					<h2 className="headline mt-4 text-3xl [text-shadow:0_1px_16px_rgb(0_0_0/0.35)] sm:text-5xl">{t('impact_title')}</h2>
					<p className="mt-3 max-w-md text-base text-white/85 sm:mt-4 sm:text-lg">{t('impact_text')}</p>
					<Link
						href={'/search' as any}
						className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-200 sm:mt-8 sm:w-auto"
					>
						{t('impact_cta')}
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Link>
				</div>

				<ul className="space-y-2.5 sm:space-y-3">
					{CAUSES.map(({ key, Icon }) => (
						<li key={key} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 pr-4 ring-1 ring-white/15 backdrop-blur-md sm:gap-4 sm:p-4 sm:pr-5">
							<span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-400 text-neutral-950 sm:h-14 sm:w-14">
								<Icon className="h-6 w-6" />
							</span>
							<span className="min-w-0 flex-1">
								<span className="block text-sm font-semibold leading-snug sm:text-base">{t(`impact_${key}`)}</span>
								<span className="mt-0.5 block text-xs text-white/70 sm:text-sm">{t(`impact_${key}_text`)}</span>
							</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
