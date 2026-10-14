// Affiliate program page: big, calm, Apple-style sections in the site's
// black / white / grey look, with a "request access" form at the top and end.
import type { Metadata } from 'next'
import Image from 'next/image'
import {
	BarChart3,
	Clock3,
	Headphones,
	Megaphone,
	Percent,
	Plus,
	Wallet,
	type LucideIcon,
} from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { PHOTOS } from '@/lib/photos'
import AffiliateRequestForm from './AffiliateRequestForm'
import EarningsCalculator from './EarningsCalculator'
import { TIERS } from './tiers'

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
const STEPS = ['step1', 'step2', 'step3'] as const
const FAQ = ['who', 'earn', 'paid', 'cookie', 'materials', 'sites'] as const

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
		<main className="pb-16 text-neutral-950 [&_h1]:[text-wrap:balance] [&_h2]:[text-wrap:balance] [&_p]:[text-wrap:pretty] sm:pb-24 dark:text-white">
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

			{/* Hero: one idea, one action */}
			<section className="mx-auto max-w-7xl px-5 pt-12 text-center sm:pt-24">
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">{t('eyebrow')}</p>
				<h1 className="mx-auto mt-4 max-w-4xl text-[40px] font-bold leading-[1.04] tracking-tight sm:text-7xl lg:text-8xl">
					{t('hero_title')}
				</h1>
				<p className="mx-auto mt-5 max-w-2xl text-lg text-neutral-500 sm:mt-7 sm:text-2xl">{t('hero_text')}</p>
				<div className="mx-auto mt-8 max-w-xl sm:mt-10">
					<AffiliateRequestForm id="request" />
				</div>

				<div className="relative mt-12 aspect-[4/5] overflow-hidden rounded-[28px] bg-neutral-200 sm:mt-20 sm:aspect-[21/9] sm:rounded-[40px]">
					<Image
						src={PHOTOS.referral}
						alt=""
						fill
						priority
						sizes="(max-width: 1280px) 100vw, 1240px"
						className="object-cover"
					/>
				</div>
			</section>

			{/* The three numbers that matter */}
			<section className="mx-auto mt-16 grid max-w-7xl gap-10 px-5 text-center sm:mt-28 sm:grid-cols-3 sm:gap-6">
				{(['stat_rate', 'stat_cookie', 'stat_payout'] as const).map((key) => (
					<div key={key}>
						<p className="text-6xl font-bold tracking-tight sm:text-7xl">{t(`${key}_value`)}</p>
						<p className="mt-2 text-neutral-500">{t(`${key}_label`)}</p>
					</div>
				))}
			</section>

			{/* How it works */}
			<section className="mx-auto mt-20 max-w-7xl px-5 sm:mt-36">
				<h2 className="text-center text-4xl font-bold tracking-tight sm:text-6xl">{t('steps_title')}</h2>
				<ol className="mt-10 grid gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-5">
					{STEPS.map((key, i) => (
						<li key={key} className="rounded-[28px] bg-neutral-100 p-7 sm:p-9 dark:bg-neutral-900">
							<span className="text-5xl font-bold text-neutral-300 dark:text-neutral-700">{i + 1}</span>
							<h3 className="mt-8 text-2xl font-bold tracking-tight">{t(`${key}_title`)}</h3>
							<p className="mt-2 text-neutral-500">{t(`${key}_text`)}</p>
						</li>
					))}
				</ol>
			</section>

			{/* Why partners choose us: dark band with tiles */}
			<section className="mt-20 bg-neutral-950 py-20 text-white sm:mt-36 sm:py-32">
				<div className="mx-auto max-w-7xl px-5">
					<h2 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">{t('benefits_title')}</h2>
					<p className="mt-4 max-w-2xl text-lg text-white/60 sm:text-xl">{t('benefits_text')}</p>
					<ul className="mt-12 grid gap-px overflow-hidden rounded-[28px] bg-white/10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
						{BENEFITS.map(([Icon, title, text]) => (
							<li key={title} className="bg-neutral-950 p-7 sm:p-9">
								<Icon className="h-7 w-7" strokeWidth={1.75} />
								<h3 className="mt-6 text-xl font-semibold">{t(title)}</h3>
								<p className="mt-2 text-white/60">{t(text)}</p>
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* Commission tiers + calculator */}
			<section className="mx-auto mt-20 max-w-7xl px-5 sm:mt-36">
				<h2 className="text-center text-4xl font-bold tracking-tight sm:text-6xl">{t('tiers_title')}</h2>
				<p className="mx-auto mt-4 max-w-2xl text-center text-lg text-neutral-500 sm:text-xl">{t('tiers_text')}</p>
				<ul className="mt-10 grid grid-cols-3 gap-2.5 sm:mt-16 sm:gap-5">
					{TIERS.map((tier, i) => (
						<li
							key={tier.rate}
							className={`rounded-3xl p-4 text-center sm:rounded-[28px] sm:p-10 ${
								i === TIERS.length - 1
									? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
									: 'bg-neutral-100 dark:bg-neutral-900'
							}`}
						>
							<p className="text-4xl font-bold tracking-tight sm:text-7xl">{tier.rate}%</p>
							<p className="mt-2 text-xs opacity-60 sm:text-base">
								{tier.to
									? t('tier_range', { from: tier.from, to: tier.to })
									: t('tier_plus', { from: tier.from })}
							</p>
						</li>
					))}
				</ul>
				<div className="mt-5">
					<EarningsCalculator />
				</div>
			</section>

			{/* What the traveller gets: the reason links convert */}
			<section className="mx-auto mt-20 grid max-w-7xl items-center gap-10 px-5 sm:mt-36 lg:grid-cols-2 lg:gap-16">
				<div className="relative aspect-[1/1] overflow-hidden rounded-[28px] bg-neutral-200 sm:rounded-[40px]">
					<Image src={PHOTOS.sunsetHug} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
				</div>
				<div>
					<h2 className="text-4xl font-bold tracking-tight sm:text-6xl">{t('audience_title')}</h2>
					<p className="mt-4 text-lg text-neutral-500 sm:text-xl">{t('audience_text')}</p>
					<ul className="mt-8 space-y-4 text-lg">
						{(['audience_1', 'audience_2', 'audience_3'] as const).map((key) => (
							<li key={key} className="flex gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
								<span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-950 dark:bg-white" />
								{t(key)}
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* FAQ: plain <details>, no JavaScript */}
			<section className="mx-auto mt-20 max-w-3xl px-5 sm:mt-36">
				<h2 className="text-center text-4xl font-bold tracking-tight sm:text-6xl">{t('faq_title')}</h2>
				<div className="mt-10 divide-y divide-neutral-200 border-y border-neutral-200 sm:mt-14 dark:divide-neutral-800 dark:border-neutral-800">
					{FAQ.map((key) => (
						<details key={key} className="group py-1">
							<summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
								{t(`faq_${key}_q`)}
								<Plus className="h-5 w-5 shrink-0 transition-transform group-open:rotate-45" />
							</summary>
							<p className="pb-6 pr-10 text-neutral-500">{t(`faq_${key}_a`)}</p>
						</details>
					))}
				</div>
			</section>

			{/* Final call to action */}
			<section className="mx-auto mt-20 max-w-7xl px-5 sm:mt-36">
				<div className="relative isolate overflow-hidden rounded-[28px] bg-neutral-950 px-6 py-16 text-center text-white sm:rounded-[40px] sm:px-10 sm:py-28">
					<Image src={PHOTOS.hiking} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-30" />
					<h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">{t('cta_title')}</h2>
					<p className="mx-auto mt-4 max-w-xl text-lg text-white/70 sm:text-xl">{t('cta_text')}</p>
					<div className="mx-auto mt-10 max-w-xl">
						<AffiliateRequestForm dark />
					</div>
				</div>
			</section>
		</main>
	)
}
