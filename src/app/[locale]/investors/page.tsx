// Investors & partners: TRAVSUS as a TravelTech platform. Live numbers come
// from the database; everything not yet done is labelled as a plan.
// English only (investor audience); other languages point to the English page.
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Globe2, LayoutDashboard, Megaphone, ShieldCheck, ShoppingCart, Users } from 'lucide-react'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getHomeData } from '@/lib/homeData'
import { PHOTOS } from '@/lib/photos'
import { TIERS } from '../affiliates/tiers'

// Rendered per request: the build has no database to read from
export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ locale: string }> }

const EN = routing.defaultLocale

export async function generateMetadata(props: PageProps): Promise<Metadata> {
	const { locale } = await props.params
	return {
		title: 'Investors & Partners: The TRAVSUS TravelTech Platform | TRAVSUS',
		description:
			'TRAVSUS is a multilingual travel marketplace: booking engine, supplier and agency dashboards, a creator affiliate programme and an SEO content engine in 10 languages. Live, taking bookings, and expanding to the Middle East.',
		alternates: { canonical: `/${EN}/investors` },
		robots: locale === EN ? undefined : { index: false, follow: true },
		openGraph: { images: [PHOTOS.sahara] },
	}
}

const PLATFORM = [
	[ShoppingCart, 'Booking engine', 'Per-person pricing by date and group size, online checkout and booking management for tours, experiences and multi-day trips.'],
	[LayoutDashboard, 'Supplier & agency dashboards', 'Local operators and agencies apply, are reviewed by our team and manage their own listings and bookings.'],
	[Megaphone, 'Creator affiliate programme', `Tracked links with a 60-day cookie and tiered commission (${TIERS[0].rate}% to ${TIERS[TIERS.length - 1].rate}%), monthly payouts and a partner dashboard.`],
	[Globe2, 'Multilingual content engine', `Every tour page, FAQ and URL is published in ${routing.locales.length} languages, built to rank on search engines in each European market.`],
	[Users, 'Verified reviews', 'Reviews from real travellers, with verified bookings flagged, shown on every listing.'],
	[ShieldCheck, 'Admin & quality control', 'Supplier, agency and affiliate approvals in bulk, content quality checks and per-request database handling built for scale.'],
] as const

const ROADMAP = [
	['Live', 'Proof of concept', 'Platform live and taking bookings in its first destination, Morocco, with the full stack: marketplace, dashboards, affiliates and 10-language content.'],
	['Planned · Year 1', 'Qatar', 'Regional base in Doha. Onboard Qatari hotels, tour operators and DMCs; market Qatar to European travellers.'],
	['Planned · Year 2', 'UAE and Oman', 'Replicate the supplier-onboarding playbook in two more Gulf markets.'],
	['Planned · Year 3', 'Saudi Arabia and Jordan', 'Extend to the region’s fastest-growing tourism destinations.'],
] as const

const MARKETS = ['Spain', 'France', 'Germany', 'United Kingdom', 'Italy', 'Netherlands']

export default async function InvestorsPage(props: PageProps) {
	const { locale } = await props.params
	setRequestLocale(locale)
	const { tours, destinations, rating } = await getHomeData(EN)
	const countries = new Set(destinations.map((d) => d.country).filter(Boolean)).size

	const stats = [
		{ value: String(tours.length), label: 'bookable tours live' },
		{ value: String(destinations.length), label: `destinations in ${countries} ${countries === 1 ? 'country' : 'countries'}` },
		rating.average && rating.count > 0 ? { value: rating.average.toFixed(1), label: `average rating, ${rating.count} reviews` } : null,
		{ value: String(routing.locales.length), label: 'languages, every page' },
	].filter(Boolean) as { value: string; label: string }[]

	return (
		<main lang="en" className="pb-16 text-ink sm:pb-24 dark:text-white [&_h1]:[text-wrap:balance] [&_h2]:[text-wrap:balance]">
			{/* Hero */}
			<section className="mx-auto max-w-7xl px-6 pt-12 text-center sm:pt-20">
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Investors &amp; partners</p>
				<h1 className="mx-auto mt-4 max-w-5xl text-[40px] font-bold leading-[1.04] tracking-tight sm:text-7xl">
					The marketplace connecting European travellers with trusted local experiences.
				</h1>
				<p className="mx-auto mt-5 max-w-3xl text-lg text-neutral-500 sm:mt-7 sm:text-2xl">
					TRAVSUS is a TravelTech platform, not a travel agency: one multilingual marketplace where verified local suppliers reach international travellers, and travellers book with clear prices.
				</p>
			</section>

			{/* Live numbers */}
			<section className="mx-auto mt-14 max-w-7xl px-6 sm:mt-20">
				<div className="grid grid-cols-2 gap-y-10 rounded-[28px] bg-neutral-100 px-6 py-12 text-center sm:rounded-[40px] lg:grid-cols-4 dark:bg-neutral-900">
					{stats.map((s) => (
						<div key={s.label}>
							<p className="text-5xl font-bold tracking-tight sm:text-6xl">{s.value}</p>
							<p className="mt-2 text-sm text-neutral-500 sm:text-base">{s.label}</p>
						</div>
					))}
				</div>
				<p className="mt-3 text-center text-xs text-neutral-500">Figures read live from the TRAVSUS database.</p>
			</section>

			{/* Problem / solution */}
			<section className="mx-auto mt-20 grid max-w-7xl gap-10 px-6 sm:mt-32 lg:grid-cols-2 lg:gap-16">
				<div>
					<h2 className="text-4xl font-bold tracking-tight sm:text-5xl">The problem</h2>
					<p className="mt-5 text-lg leading-relaxed text-neutral-500 sm:text-xl">
						European travellers struggle to find and trust local experiences in emerging destinations, and the best local operators have no affordable way to reach them in their own language. Global platforms are generic and favour large suppliers.
					</p>
				</div>
				<div>
					<h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Our answer</h2>
					<p className="mt-5 text-lg leading-relaxed text-neutral-500 sm:text-xl">
						A specialist marketplace: verified local suppliers, content written for each European market in its own language, transparent prices and a creator network that drives demand. Suppliers join free and pay commission only on bookings.
					</p>
				</div>
			</section>

			{/* Platform */}
			<section className="mt-20 bg-neutral-950 py-20 text-white sm:mt-32 sm:py-28">
				<div className="mx-auto max-w-7xl px-6">
					<h2 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">The technology</h2>
					<p className="mt-4 max-w-2xl text-lg text-white/60">Built in-house and running in production on a global edge network.</p>
					<ul className="mt-12 grid gap-px overflow-hidden rounded-[28px] bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
						{PLATFORM.map(([Icon, title, text]) => (
							<li key={title} className="bg-neutral-950 p-7 sm:p-9">
								<Icon className="h-7 w-7" strokeWidth={1.75} />
								<h3 className="mt-6 text-xl font-semibold">{title}</h3>
								<p className="mt-2 text-white/60">{text}</p>
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* Business model */}
			<section className="mx-auto mt-20 max-w-7xl px-6 sm:mt-32">
				<h2 className="text-4xl font-bold tracking-tight sm:text-6xl">Business model</h2>
				<ul className="mt-10 grid gap-4 sm:grid-cols-3">
					{[
						['Booking commission', 'A commission on every booking made on the platform. Suppliers pay nothing to join.'],
						['Premium supplier services (planned)', 'Featured listings and promotion for suppliers who want more visibility.'],
						['Partner distribution', 'Agencies and creators bring demand through tracked links and are paid only on completed bookings.'],
					].map(([title, text]) => (
						<li key={title} className="rounded-[24px] border border-neutral-200 p-7 dark:border-neutral-800">
							<h3 className="text-xl font-semibold">{title}</h3>
							<p className="mt-2 text-neutral-500">{text}</p>
						</li>
					))}
				</ul>
			</section>

			{/* Markets */}
			<section className="mx-auto mt-20 grid max-w-7xl items-center gap-10 px-6 sm:mt-32 lg:grid-cols-2 lg:gap-16">
				<div>
					<h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Europe to the Middle East</h2>
					<p className="mt-5 text-lg leading-relaxed text-neutral-500 sm:text-xl">
						Our demand comes from Europe&rsquo;s largest outbound travel markets. Our next destinations are in the Gulf and the wider Middle East, where tourism is a national growth priority and local suppliers need international reach.
					</p>
					<ul className="mt-6 flex flex-wrap gap-2">
						{MARKETS.map((m) => (
							<li key={m} className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold dark:bg-neutral-900">{m}</li>
						))}
					</ul>
				</div>
				<div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-neutral-200 sm:rounded-[40px]">
					<Image src={PHOTOS.sahara} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
				</div>
			</section>

			{/* Roadmap */}
			<section className="mx-auto mt-20 max-w-7xl px-6 sm:mt-32">
				<h2 className="text-4xl font-bold tracking-tight sm:text-6xl">Roadmap</h2>
				<ol className="mt-10 grid gap-4 lg:grid-cols-4">
					{ROADMAP.map(([when, title, text], i) => (
						<li key={title} className={`rounded-[24px] p-7 ${i === 0 ? 'bg-neutral-950 text-white' : 'border border-neutral-200 dark:border-neutral-800'}`}>
							<p className={`text-xs font-semibold uppercase tracking-[0.15em] ${i === 0 ? 'text-emerald-400' : 'text-neutral-500'}`}>{when}</p>
							<h3 className="mt-3 text-2xl font-semibold">{title}</h3>
							<p className={`mt-2 ${i === 0 ? 'text-white/70' : 'text-neutral-500'}`}>{text}</p>
						</li>
					))}
				</ol>
				<p className="mt-4 text-sm text-neutral-500">Planned stages are subject to funding and partner agreements.</p>
			</section>

			{/* Company + contact */}
			<section className="mx-auto mt-20 max-w-7xl px-6 sm:mt-32">
				<div className="relative isolate overflow-hidden rounded-[28px] bg-neutral-950 px-6 py-16 text-white sm:rounded-[40px] sm:px-16 sm:py-24">
					<Image src={PHOTOS.sunsetHug} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-30" />
					<h2 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Talk to us</h2>
					<p className="mt-4 max-w-2xl text-lg text-white/75 sm:text-xl">
						TRAVSUS LIMITED, registered in Ireland. Founder &amp; CEO: Mohamed Skendoul. We welcome conversations with investors, tourism boards, DMCs and distribution partners.
					</p>
					<div className="mt-10 flex flex-col gap-3 sm:flex-row">
						<Link href={`/${locale}/contact` as any} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-ink transition hover:bg-neutral-200">
							Contact the founder
							<ArrowRight className="h-4 w-4" />
						</Link>
						<Link href={`/${locale}/agencies` as any} className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-7 text-sm font-semibold transition hover:border-white">
							Become a supplier or partner
						</Link>
					</div>
				</div>
			</section>
		</main>
	)
}
