// Affiliate program page, all in black and white: a dark hero with the request form and an edited
// photo collage (floating "new booking" cards, a dotted travel route,
// sparkles), then the numbers, the three steps, the benefits, the commission
// tiers with the calculator, why travellers book, the FAQ and a final form.
// Sections rise into view on scroll (HomeMotion + home.module.css).
import type { Metadata } from 'next'
import Image from 'next/image'
import {
	BarChart3,
	Check,
	Clock3,
	Headphones,
	Link2,
	MailCheck,
	Megaphone,
	Percent,
	Plus,
	Star,
	Wallet,
	type LucideIcon,
} from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { PHOTOS } from '@/lib/photos'
import HomeMotion from '../(home)/HomeMotion'
import motion from '../(home)/home.module.css'
import AffiliateRequestForm from './AffiliateRequestForm'
import CreatorPhone from './CreatorPhone'
import EarningsCalculator from './EarningsCalculator'
import s from './affiliates.module.css'

type PageProps = { params: { locale: string } }

// [icon, title key, text key]: the benefit tiles
const BENEFITS: [LucideIcon, string, string][] = [
	[Percent, 'b_commission_title', 'b_commission_text'],
	[Clock3, 'b_cookie_title', 'b_cookie_text'],
	[BarChart3, 'b_dashboard_title', 'b_dashboard_text'],
	[Wallet, 'b_payouts_title', 'b_payouts_text'],
	[Megaphone, 'b_materials_title', 'b_materials_text'],
	[Headphones, 'b_support_title', 'b_support_text'],
]
const STEPS: [LucideIcon, string][] = [
	[MailCheck, 'step1'],
	[Link2, 'step2'],
	[Wallet, 'step3'],
]
const STATS = ['stat_rate', 'stat_cookie', 'stat_payout'] as const
const FAQ = ['who', 'earn', 'paid', 'cookie', 'materials', 'sites'] as const

/** Four-point sparkle */
const Sparkle = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 24 24" aria-hidden className={className}>
		<path className={s.twinkle} fill="currentColor" d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z" />
	</svg>
)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const t = await getTranslations({ locale: params.locale, namespace: 'Affiliates' })
	return {
		title: `${t('meta_title')} | TRAVSUS`,
		description: t('meta_description'),
		alternates: {
			canonical: `/${params.locale}/affiliates`,
			languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/affiliates`])),
		},
		openGraph: { images: [PHOTOS.referral] },
	}
}

export default async function AffiliatesPage({ params }: PageProps) {
	setRequestLocale(params.locale)
	const t = await getTranslations('Affiliates')
	const money = (n: number) => new Intl.NumberFormat(params.locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

	// FAQ rich results
	const faqJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: FAQ.map((key) => ({
			'@type': 'Question',
			name: t(`faq_${key}_q`),
			acceptedAnswer: { '@type': 'Answer', text: t(`faq_${key}_a`) },
		})),
	}

	return (
		<main className="overflow-x-clip pb-16 text-neutral-950 [&_h1]:[text-wrap:balance] [&_h2]:[text-wrap:balance] [&_p]:[text-wrap:pretty] sm:pb-24 dark:text-white">
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
			<HomeMotion />

			{/* Hero: black, the form, and the Instagram phone */}
			<section className="relative isolate overflow-hidden bg-black text-white">
				{/* Dot grid */}
				<svg aria-hidden className="absolute inset-0 -z-10 h-full w-full opacity-[0.18] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]">
					<defs>
						<pattern id="aff-dots" width="22" height="22" patternUnits="userSpaceOnUse">
							<circle cx="1.5" cy="1.5" r="1.5" fill="white" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#aff-dots)" />
				</svg>

				<div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-16 pt-12 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28">
					<div className={`${s.heroIn} text-center lg:text-left`}>
						<p className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/75 ring-1 ring-white/10">
							<span className="relative flex h-2 w-2">
								<span className={`absolute inline-flex h-full w-full rounded-full bg-white ${s.ping}`} />
								<span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
							</span>
							{t('eyebrow')}
						</p>
						<h1 className="mx-auto mt-6 max-w-2xl text-[42px] font-bold leading-[1.02] tracking-tight sm:text-7xl lg:mx-0">{t('hero_title')}</h1>
						<p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/65 sm:text-xl lg:mx-0">{t('hero_text')}</p>
						<div className="mx-auto mt-9 max-w-xl rounded-[28px] bg-white/[0.04] p-3 ring-1 ring-white/10 backdrop-blur-sm sm:p-4 lg:mx-0">
							<AffiliateRequestForm id="request" dark />
						</div>
						<ul className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-3 lg:mx-0">
							{STATS.map((key) => (
								<li key={key} className="min-w-0 rounded-2xl bg-white/[0.04] px-2.5 py-4 text-center ring-1 ring-white/10 sm:px-4 lg:text-left">
									<p className={`whitespace-nowrap text-xl font-bold tracking-tight sm:text-3xl`}>{t(`${key}_value`)}</p>
									<p className="mt-1 line-clamp-3 text-[11px] leading-snug text-white/50 sm:line-clamp-2 sm:text-xs">{t(`${key}_label`)}</p>
								</li>
							))}
						</ul>
					</div>

					{/* Instagram phone: the Travsus link in the bio */}
					<CreatorPhone className="lg:mr-6" />
				</div>
			</section>

			{/* How it works */}
			<section className={`mx-auto mt-24 max-w-7xl px-5 sm:mt-36 ${motion.reveal}`}>
				<p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">{t('eyebrow')}</p>
				<h2 className="mt-3 text-center text-4xl font-bold tracking-tight sm:text-6xl">{t('steps_title')}</h2>
				<div className="relative mt-12 sm:mt-16">
					{/* Dotted line joining the steps (larger screens) */}
					<svg aria-hidden className="absolute left-[16%] right-[16%] top-12 hidden h-2 w-[68%] sm:block" preserveAspectRatio="none" viewBox="0 0 100 2">
						<line className={s.route} x1="0" y1="1" x2="100" y2="1" stroke="#a3a3a3" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
					</svg>
					<ol className={`relative grid gap-4 sm:grid-cols-3 sm:gap-6 ${motion.stagger}`}>
						{STEPS.map(([Icon, key], i) => (
							<li key={key} className="group rounded-[32px] bg-neutral-100 p-7 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl sm:p-9 dark:bg-neutral-900 dark:hover:bg-neutral-800">
								<div className="flex items-center justify-between">
									<span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-neutral-950 text-white shadow-lg dark:bg-white dark:text-neutral-950">
										<Icon className="h-6 w-6" strokeWidth={2} />
									</span>
									<span className="text-6xl font-bold tracking-tighter text-neutral-200 transition group-hover:text-neutral-400 dark:text-neutral-800">{i + 1}</span>
								</div>
								<h3 className="mt-8 text-2xl font-bold tracking-tight">{t(`${key}_title`)}</h3>
								<p className="mt-2 leading-relaxed text-neutral-500">{t(`${key}_text`)}</p>
							</li>
						))}
					</ol>
				</div>
			</section>

			{/* Why partners choose us: dark band with tiles */}
			<section className="relative isolate mt-24 overflow-hidden bg-neutral-950 py-20 text-white sm:mt-36 sm:py-32">
				<div className={`mx-auto max-w-7xl px-5 ${motion.reveal}`}>
					<div className="grid gap-6 lg:grid-cols-2 lg:items-end">
						<h2 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">{t('benefits_title')}</h2>
						<p className="max-w-xl text-lg text-white/60 sm:text-xl lg:justify-self-end">{t('benefits_text')}</p>
					</div>
					<ul className={`mt-12 grid gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 ${motion.stagger}`}>
						{BENEFITS.map(([Icon, title, text]) => (
							<li key={title} className="group rounded-[28px] bg-white/[0.04] p-7 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07] hover:ring-white/30 sm:p-8">
								<span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-neutral-950 transition group-hover:scale-110">
									<Icon className="h-6 w-6" strokeWidth={2} />
								</span>
								<h3 className="mt-6 text-xl font-semibold">{t(title)}</h3>
								<p className="mt-2 leading-relaxed text-white/60">{t(text)}</p>
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* Commission tiers + calculator (tap a tier to switch the estimate to it) */}
			<section className={`mx-auto mt-24 max-w-7xl px-5 sm:mt-36 ${motion.reveal}`}>
				<h2 className="text-center text-4xl font-bold tracking-tight sm:text-6xl">{t('tiers_title')}</h2>
				<p className="mx-auto mt-4 max-w-2xl text-center text-lg text-neutral-500 sm:text-xl">{t('tiers_text')}</p>
				<div className="mt-12 sm:mt-16">
					<EarningsCalculator />
				</div>
			</section>

			{/* What the traveller gets: the reason links convert */}
			<section className={`mx-auto mt-24 grid max-w-7xl items-center gap-14 px-5 sm:mt-36 lg:grid-cols-2 lg:gap-20 ${motion.reveal}`}>
				<div className="relative">
					<Sparkle className="absolute -right-2 -top-4 z-20 h-7 w-7 text-neutral-950 dark:text-white" />
					<div className="relative aspect-[1/1] overflow-hidden rounded-[36px] bg-neutral-200 sm:rounded-[44px] dark:bg-neutral-800">
						<Image src={PHOTOS.sunsetHug} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover saturate-[1.1]" />
						<div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
					</div>
					<div className={`absolute -bottom-5 left-5 z-20 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5 sm:left-8 dark:bg-neutral-900 dark:ring-white/10 ${s.float}`}>
						<div className="flex gap-0.5 text-neutral-950 dark:text-white">
							{[0, 1, 2, 3, 4].map((i) => (
								<Star key={i} className="h-4 w-4 fill-current" />
							))}
						</div>
						<p className="mt-1.5 max-w-[200px] text-sm font-semibold leading-snug">{t('audience_3')}</p>
					</div>
				</div>
				<div>
					<h2 className="text-4xl font-bold tracking-tight sm:text-6xl">{t('audience_title')}</h2>
					<p className="mt-4 text-lg text-neutral-500 sm:text-xl">{t('audience_text')}</p>
					<ul className={`mt-8 space-y-3 ${motion.stagger}`}>
						{(['audience_1', 'audience_2', 'audience_3'] as const).map((key) => (
							<li key={key} className="flex items-center gap-4 rounded-2xl bg-neutral-100 p-4 text-lg font-medium dark:bg-neutral-900">
								<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
									<Check className="h-4 w-4" strokeWidth={3} />
								</span>
								{t(key)}
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* FAQ: plain <details>, no JavaScript */}
			<section className={`mx-auto mt-24 max-w-3xl px-5 sm:mt-36 ${motion.reveal}`}>
				<h2 className="text-center text-4xl font-bold tracking-tight sm:text-6xl">{t('faq_title')}</h2>
				<div className="mt-10 space-y-3 sm:mt-14">
					{FAQ.map((key) => (
						<details key={key} className="group rounded-3xl bg-neutral-100 px-6 transition open:bg-white open:shadow-lg open:ring-1 open:ring-neutral-200 dark:bg-neutral-900 dark:open:bg-neutral-900 dark:open:ring-neutral-700">
							<summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
								{t(`faq_${key}_q`)}
								<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white transition group-open:rotate-45 group-open:bg-neutral-950 group-open:text-white dark:bg-neutral-800 dark:group-open:bg-white dark:group-open:text-neutral-950">
									<Plus className="h-4 w-4" />
								</span>
							</summary>
							<p className="pb-6 pr-10 leading-relaxed text-neutral-500">{t(`faq_${key}_a`)}</p>
						</details>
					))}
				</div>
			</section>

			{/* Final call to action */}
			<section className={`mx-auto mt-24 max-w-7xl px-5 sm:mt-36 ${motion.reveal}`}>
				{/* Title and form, with the photo collage */}
				<div className="relative isolate grid items-center gap-14 overflow-hidden rounded-[36px] bg-black px-6 py-16 text-white sm:rounded-[48px] sm:px-12 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:px-16">
					<Image src={PHOTOS.hiking} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-30 saturate-[1.1]" />
					<div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/75 to-black/40" />
					<Sparkle className="absolute left-[8%] top-[10%] h-5 w-5 text-white" />
					<Sparkle className="absolute right-[6%] top-[12%] h-4 w-4 text-white/70" />
					<div className="text-center lg:text-left">
						<h2 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl lg:mx-0">{t('cta_title')}</h2>
						<p className="mx-auto mt-4 max-w-xl text-lg text-white/70 sm:text-xl lg:mx-0">{t('creator_text')}</p>
						<div className="mx-auto mt-10 max-w-xl rounded-[28px] bg-white/[0.05] p-3 text-left ring-1 ring-white/10 backdrop-blur-md sm:p-4 lg:mx-0">
							<AffiliateRequestForm dark />
						</div>
					</div>
					{/* Photo collage */}
					<div className="relative mx-auto w-full max-w-md lg:max-w-none">
						<Sparkle className="absolute -left-2 top-6 z-20 h-6 w-6 text-white sm:-left-6" />
						<Sparkle className="absolute -right-1 top-1/2 z-20 h-4 w-4 text-white/80" />
						<Sparkle className="absolute bottom-10 left-1/3 z-20 h-5 w-5 text-white/70" />

						<div className="relative aspect-[4/5] overflow-hidden rounded-[36px] ring-1 ring-white/10 sm:rounded-[44px]">
							<Image src={PHOTOS.referral} alt="" fill sizes="(max-width: 1024px) 90vw, 600px" className={`object-cover saturate-[1.15] ${s.photo}`} />
							<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
						</div>

						{/* Dotted travel route between the two cards */}
						<svg aria-hidden viewBox="0 0 300 300" className="pointer-events-none absolute inset-0 z-10 h-full w-full">
							<path className={s.route} d="M60 70 C 160 40, 250 120, 210 190 S 120 270, 240 255" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
							<circle cx="240" cy="255" r="5" fill="#ffffff" />
						</svg>

						<div className={`absolute -left-3 top-10 z-20 flex items-center gap-3 rounded-2xl bg-white/90 p-3 pr-4 text-neutral-950 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl sm:-left-10 ${s.float}`}>
							<span className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-950 text-white">
								<Check className="h-5 w-5" strokeWidth={3} />
							</span>
							<div>
								<p className="text-[13px] font-semibold leading-tight">{t('chip_booking')}</p>
								<p className="text-xs text-neutral-500">{t('chip_booking_trip')}</p>
							</div>
						</div>

						<div className={`absolute -right-3 bottom-16 z-20 rounded-2xl bg-neutral-950/85 p-4 text-white shadow-2xl ring-1 ring-white/15 backdrop-blur-xl sm:-right-4 lg:right-5 ${s.floatSlow}`}>
							<p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/55">{t('chip_commission')}</p>
							<p className={`mt-1 text-3xl font-bold tracking-tight`}>+{money(84)}</p>
							<div className="mt-2 flex h-6 items-end gap-1">
								{[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
									<span key={i} className="w-2 rounded-sm bg-white/80" style={{ height: `${h}%` }} />
								))}
							</div>
						</div>

						<div className="absolute -bottom-6 left-6 z-20 h-20 w-20 overflow-hidden rounded-full ring-4 ring-black sm:h-24 sm:w-24">
							<Image src={PHOTOS.sunsetHug} alt="" fill sizes="96px" className="object-cover" />
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}
