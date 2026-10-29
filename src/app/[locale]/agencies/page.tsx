// Page for tour agencies, guides and activity providers who want to list their
// tours, in the black and white of the affiliates page: a dark hero with the
// request form and a live bookings board, then the numbers, the three steps,
// the benefits, who it's for, the FAQ and a final form. Sections rise into
// view on scroll (HomeMotion + home.module.css).
import type { Metadata } from 'next'
import Image from 'next/image'
import { Check, ClipboardList, CreditCard, Globe2, Headphones, LayoutDashboard, MailCheck, Plus, Store, Wallet, type LucideIcon } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { PHOTOS } from '@/lib/photos'
import HomeMotion from '../(home)/HomeMotion'
import motion from '../(home)/home.module.css'
import s from '../affiliates/affiliates.module.css'
import AgencyBoard from './AgencyBoard'
import AgencyRequestForm from './AgencyRequestForm'

type PageProps = { params: { locale: string } }

// [icon, title key, text key]: the benefit tiles
const BENEFITS: [LucideIcon, string, string][] = [
	[Store, 'b_fee_title', 'b_fee_text'],
	[Globe2, 'b_world_title', 'b_world_text'],
	[LayoutDashboard, 'b_dashboard_title', 'b_dashboard_text'],
	[Wallet, 'b_payouts_title', 'b_payouts_text'],
	[CreditCard, 'b_payments_title', 'b_payments_text'],
	[Headphones, 'b_support_title', 'b_support_text'],
]
const STEPS: [LucideIcon, string][] = [
	[MailCheck, 'step1'],
	[ClipboardList, 'step2'],
	[Wallet, 'step3'],
]
const STATS = ['stat_fee', 'stat_languages', 'stat_payout'] as const
const FAQ = ['who', 'cost', 'paid', 'listing', 'prices', 'languages'] as const
// A desert camp at night, from our tour photos
const CTA_PHOTO = 'https://res.cloudinary.com/travsus/image/upload/v1750849730/ljj21rdgiuzarfl9sp6u.webp'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const t = await getTranslations({ locale: params.locale, namespace: 'Agencies' })
	return {
		title: `${t('meta_title')} | TRAVSUS`,
		description: t('meta_description'),
		alternates: {
			canonical: `/${params.locale}/agencies`,
			languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/agencies`])),
		},
		openGraph: { images: [PHOTOS.sahara] },
	}
}

export default async function AgenciesPage({ params }: PageProps) {
	setRequestLocale(params.locale)
	const t = await getTranslations('Agencies')
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

			{/* Hero: black, the form, and the bookings board */}
			<section className="relative isolate overflow-hidden bg-black text-white">
				{/* Dot grid */}
				<svg aria-hidden className="absolute inset-0 -z-10 h-full w-full opacity-[0.18] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]">
					<defs>
						<pattern id="agency-dots" width="22" height="22" patternUnits="userSpaceOnUse">
							<circle cx="1.5" cy="1.5" r="1.5" fill="white" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#agency-dots)" />
				</svg>

				<div className="mx-auto grid max-w-7xl items-center gap-16 px-5 pb-16 pt-12 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28">
					<div className={`${s.heroIn} text-center lg:text-left`}>
						<p className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/75 ring-1 ring-white/10">
							<span className="relative flex h-2 w-2">
								<span className={`absolute inline-flex h-full w-full rounded-full bg-white ${s.ping}`} />
								<span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
							</span>
							{t('eyebrow')}
						</p>
						<h1 className="headline mx-auto mt-6 max-w-2xl text-[42px] sm:text-7xl lg:mx-0">{t('hero_title')}</h1>
						<p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/65 sm:text-xl lg:mx-0">{t('hero_text')}</p>
						<div className="mx-auto mt-9 max-w-xl rounded-[28px] bg-white/[0.04] p-3 ring-1 ring-white/10 backdrop-blur-sm sm:p-4 lg:mx-0">
							<AgencyRequestForm id="request" />
						</div>
						<ul className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-3 lg:mx-0">
							{STATS.map((key) => (
								<li key={key} className="min-w-0 rounded-2xl bg-white/[0.04] px-2.5 py-4 text-center ring-1 ring-white/10 sm:px-4 lg:text-left">
									<p className="whitespace-nowrap text-xl font-bold tracking-tight sm:text-3xl">{t(`${key}_value`)}</p>
									<p className="mt-1 line-clamp-3 text-[11px] leading-snug text-white/50 sm:line-clamp-2 sm:text-xs">{t(`${key}_label`)}</p>
								</li>
							))}
						</ul>
					</div>

					<AgencyBoard className="lg:mr-6" />
				</div>
			</section>

			{/* How it works */}
			<section className={`mx-auto mt-24 max-w-7xl px-5 sm:mt-36 ${motion.reveal}`}>
				<p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">{t('eyebrow')}</p>
				<h2 className="headline mt-3 text-center text-4xl sm:text-6xl">{t('steps_title')}</h2>
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

			{/* Why agencies list with us: dark band with tiles */}
			<section className="relative isolate mt-24 overflow-hidden bg-neutral-950 py-20 text-white sm:mt-36 sm:py-32">
				<div className={`mx-auto max-w-7xl px-5 ${motion.reveal}`}>
					<div className="grid gap-6 lg:grid-cols-2 lg:items-end">
						<h2 className="headline max-w-3xl text-4xl sm:text-6xl">{t('benefits_title')}</h2>
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

			{/* Who it's for */}
			<section className={`mx-auto mt-24 grid max-w-7xl items-center gap-14 px-5 sm:mt-36 lg:grid-cols-2 lg:gap-20 ${motion.reveal}`}>
				<div className="relative">
					<div className="relative aspect-[1/1] overflow-hidden rounded-[36px] bg-neutral-200 sm:rounded-[44px] dark:bg-neutral-800">
						<Image src={PHOTOS.sahara} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover saturate-[1.1]" />
						<div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
					</div>
					<div className={`absolute -bottom-5 left-5 z-20 flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 shadow-2xl ring-1 ring-black/5 sm:left-8 dark:bg-neutral-900 dark:ring-white/10 ${s.float}`}>
						<span className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
							<Check className="h-5 w-5" strokeWidth={3} />
						</span>
						<div>
							<p className="text-[13px] font-semibold leading-tight">{t('chip_booking')}</p>
							<p className="text-xs text-neutral-500">{t('chip_booking_trip')}</p>
						</div>
					</div>
					<div className={`absolute -right-2 top-6 z-20 rounded-2xl bg-neutral-950/85 p-4 text-white shadow-2xl ring-1 ring-white/15 backdrop-blur-xl sm:-right-5 ${s.floatSlow}`}>
						<p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/55">{t('chip_payout')}</p>
						<p className="mt-1 text-3xl font-bold tracking-tight">{money(4860)}</p>
					</div>
				</div>
				<div>
					<h2 className="headline text-4xl sm:text-6xl">{t('audience_title')}</h2>
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
				<h2 className="headline text-center text-4xl sm:text-6xl">{t('faq_title')}</h2>
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
				<div className="relative isolate overflow-hidden rounded-[36px] bg-black px-6 py-16 text-white sm:rounded-[48px] sm:px-12 sm:py-24 lg:px-16">
					<Image src={CTA_PHOTO} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-35 saturate-[1.1]" />
					<div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-black/30" />
					<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
						<div className="text-center lg:text-left">
							<h2 className="headline mx-auto max-w-2xl text-4xl sm:text-6xl lg:mx-0">{t('cta_title')}</h2>
							<p className="mx-auto mt-4 max-w-xl text-lg text-white/70 sm:text-xl lg:mx-0">{t('cta_text')}</p>
						</div>
						<div className="rounded-[28px] bg-white/[0.05] p-3 ring-1 ring-white/10 backdrop-blur-md sm:p-4">
							<AgencyRequestForm />
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}
