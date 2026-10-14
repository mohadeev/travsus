// About TRAVSUS: who we are, real numbers from the database, what we stand
// for, where we travel, and a way to get in touch.
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, CalendarCheck, Headphones, Users } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getHomeData } from '@/lib/homeData'
import { PHOTOS } from '@/lib/photos'

export const revalidate = 3600

type PageProps = { params: { locale: string } }

// [icon, title key, text key]
const VALUES = [
	[BadgeCheck, 'value_price_title', 'value_price_text'],
	[Users, 'value_guides_title', 'value_guides_text'],
	[CalendarCheck, 'value_flex_title', 'value_flex_text'],
	[Headphones, 'value_support_title', 'value_support_text'],
] as const

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const t = await getTranslations({ locale: params.locale, namespace: 'About' })
	return {
		title: `${t('meta_title')} | TRAVSUS`,
		description: t('meta_description'),
		alternates: {
			canonical: `/${params.locale}/about`,
			languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/about`])),
		},
		openGraph: { images: [PHOTOS.hiking] },
	}
}

export default async function AboutPage({ params }: PageProps) {
	const { locale } = params
	setRequestLocale(locale)
	const t = await getTranslations('About')
	const { tours, destinations, rating } = await getHomeData(locale)
	const countries = new Set(destinations.map((d) => d.country).filter(Boolean)).size

	const stats = [
		{ value: String(tours.length), label: t('stat_tours') },
		{ value: String(countries), label: t('stat_countries') },
		rating.average && rating.count > 0
			? { value: rating.average.toFixed(1), label: t('stat_rating', { count: rating.count }) }
			: null,
		{ value: String(routing.locales.length), label: t('stat_languages') },
	].filter(Boolean) as { value: string; label: string }[]

	return (
		<main className="pb-16 text-neutral-950 sm:pb-24 dark:text-white [&_h1]:[text-wrap:balance] [&_h2]:[text-wrap:balance]">
			{/* Hero */}
			<section className="mx-auto max-w-7xl px-5 pt-12 text-center sm:pt-20">
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">{t('eyebrow')}</p>
				<h1 className="mx-auto mt-4 max-w-4xl text-[40px] font-bold leading-[1.04] tracking-tight sm:text-7xl lg:text-8xl">{t('hero_title')}</h1>
				<p className="mx-auto mt-5 max-w-2xl text-lg text-neutral-500 sm:mt-7 sm:text-2xl">{t('hero_text')}</p>
				<div className="relative mt-12 aspect-[4/5] overflow-hidden rounded-[28px] bg-neutral-200 sm:mt-16 sm:aspect-[21/9] sm:rounded-[40px]">
					<Image src={PHOTOS.hiking} alt="" fill priority sizes="(max-width: 1280px) 100vw, 1240px" className="object-cover" />
				</div>
			</section>

			{/* Real numbers */}
			<section className="mx-auto mt-16 grid max-w-7xl grid-cols-2 gap-y-10 px-5 text-center sm:mt-24 lg:grid-cols-4">
				{stats.map((s) => (
					<div key={s.label}>
						<p className="text-5xl font-bold tracking-tight sm:text-7xl">{s.value}</p>
						<p className="mt-2 text-sm text-neutral-500 sm:text-base">{s.label}</p>
					</div>
				))}
			</section>

			{/* Story */}
			<section className="mx-auto mt-20 grid max-w-7xl items-center gap-10 px-5 sm:mt-36 lg:grid-cols-2 lg:gap-16">
				<div>
					<h2 className="text-4xl font-bold tracking-tight sm:text-6xl">{t('story_title')}</h2>
					<p className="mt-5 text-lg leading-relaxed text-neutral-500 sm:text-xl">{t('story_text_1')}</p>
					<p className="mt-4 text-lg leading-relaxed text-neutral-500 sm:text-xl">{t('story_text_2')}</p>
				</div>
				<div className="relative aspect-[1/1] overflow-hidden rounded-[28px] bg-neutral-200 sm:rounded-[40px]">
					<Image src={PHOTOS.sahara} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
				</div>
			</section>

			{/* What we stand for */}
			<section className="mt-20 bg-neutral-950 py-20 text-white sm:mt-36 sm:py-32">
				<div className="mx-auto max-w-7xl px-5">
					<h2 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">{t('values_title')}</h2>
					<ul className="mt-12 grid gap-px overflow-hidden rounded-[28px] bg-white/10 sm:mt-16 sm:grid-cols-2">
						{VALUES.map(([Icon, title, text]) => (
							<li key={title} className="bg-neutral-950 p-7 sm:p-10">
								<Icon className="h-7 w-7" strokeWidth={1.75} />
								<h3 className="mt-6 text-2xl font-semibold">{t(title)}</h3>
								<p className="mt-2 text-white/60 sm:text-lg">{t(text)}</p>
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* Where we travel */}
			{destinations.length > 0 && (
				<section className="mx-auto mt-20 max-w-7xl px-5 text-center sm:mt-36">
					<h2 className="text-4xl font-bold tracking-tight sm:text-6xl">{t('places_title')}</h2>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-500 sm:text-xl">{t('places_text')}</p>
					<ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2.5">
						{destinations.slice(0, 12).map((d) => (
							<li key={d.city}>
								<Link
									href={`/${locale}/search?query=${encodeURIComponent(d.city)}` as any}
									className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-5 py-3 font-semibold transition hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
								>
									{d.city}
									<span className="text-sm font-normal text-neutral-500">{d.country}</span>
								</Link>
							</li>
						))}
					</ul>
				</section>
			)}

			{/* Call to action */}
			<section className="mx-auto mt-20 max-w-7xl px-5 sm:mt-36">
				<div className="relative isolate overflow-hidden rounded-[28px] bg-neutral-950 px-6 py-16 text-center text-white sm:rounded-[40px] sm:py-28">
					<Image src={PHOTOS.sunsetHug} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-40" />
					<h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">{t('cta_title')}</h2>
					<p className="mx-auto mt-4 max-w-xl text-lg text-white/75 sm:text-xl">{t('cta_text')}</p>
					<div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
						<Link href={`/${locale}/search?query=` as any} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200">
							{t('cta_tours')}
							<ArrowRight className="h-4 w-4" />
						</Link>
						<Link href={`/${locale}/contact` as any} className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-7 text-sm font-semibold transition hover:border-white">
							{t('cta_contact')}
						</Link>
					</div>
				</div>
			</section>
		</main>
	)
}
