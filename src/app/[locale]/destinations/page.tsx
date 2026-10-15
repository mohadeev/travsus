// All destinations: countries with a photo, grouped by continent.
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { countryHref, flag, getCountries, type Country } from '@/lib/destinations'
import { bigImage } from './_components/ui'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
	const t = await getTranslations({ locale: params.locale, namespace: 'Destination' })
	return { title: `${t('destinations')} | TRAVSUS`, description: t('index_text'), alternates: { canonical: `/${params.locale}/destinations` } }
}

function CountryCard({ country, locale, big = false }: { country: Country; locale: string; big?: boolean }) {
	return (
		<Link href={countryHref(locale, country) as any} className="group block">
			<div className={`relative overflow-hidden rounded-[28px] bg-neutral-100 dark:bg-neutral-900 ${big ? 'aspect-[4/5] sm:aspect-[16/10]' : 'aspect-[4/5]'}`}>
				{country.image && (
					<Image
						src={big ? bigImage(country.image) : country.image}
						alt={country.name}
						fill
						sizes={big ? '(min-width: 640px) 66vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
						className="object-cover transition duration-700 group-hover:scale-105"
					/>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
				<div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
					<p className="text-2xl leading-none">{flag(country.code)}</p>
					<p className={`mt-2 flex items-center justify-between gap-2 font-bold tracking-tight ${big ? 'text-3xl sm:text-5xl' : 'text-xl'}`}>
						<span className="truncate">{country.name}</span>
						<ArrowUpRight className="h-5 w-5 shrink-0 opacity-0 transition group-hover:opacity-100" />
					</p>
				</div>
			</div>
		</Link>
	)
}

export default async function DestinationsPage({ params }: { params: { locale: string } }) {
	const { locale } = params
	setRequestLocale(locale)
	const t = await getTranslations('Destination')
	const countries = await getCountries(locale)

	// Morocco first (where most TRAVSUS trips are), then by continent
	const featured = countries.find((c) => c.code3 === 'MAR') ?? countries[0]
	const groups = new Map<string, Country[]>()
	for (const c of countries) {
		if (c.id === featured?.id) continue
		const key = c.continent ?? '—'
		groups.set(key, [...(groups.get(key) ?? []), c])
	}

	return (
		<main className="mx-auto max-w-7xl px-5 pb-24 pt-10 text-neutral-950 sm:pt-16 dark:text-white">
			<p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">{t('destinations')}</p>
			<h1 className="mt-3 max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl">{t('index_title')}</h1>
			<p className="mt-4 max-w-xl text-lg text-neutral-500">{t('index_text')}</p>

			{featured && (
				<div className="mt-10">
					<CountryCard country={featured} locale={locale} big />
				</div>
			)}

			{Array.from(groups).map(([continent, list]) => (
				<section key={continent} className="mt-16">
					<div className="flex items-baseline justify-between gap-4">
						<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{continent}</h2>
						<p className="text-sm text-neutral-500">{t('countries_count', { count: list.length })}</p>
					</div>
					<ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{list.map((c) => (
							<li key={c.id}>
								<CountryCard country={c} locale={locale} />
							</li>
						))}
					</ul>
				</section>
			))}
		</main>
	)
}
