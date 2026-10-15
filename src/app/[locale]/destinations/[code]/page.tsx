// A country: photo, key numbers, description, its cities, top places,
// TRAVSUS tours there, and the map. /destinations/mar (old ?lcId= links work).
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Building2, ChevronRight, Globe2, Map as MapIcon, Route } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import TourCard from '../../(home)/TourCard'
import { countPlacesOfCountry, countryHref, flag, getCitiesOf, getCountry, getPlacesOfCountry, getToursFor } from '@/lib/destinations'
import { bigImage, CityCard, MapEmbed, PlaceCard, Section } from '../_components/ui'

type Props = { params: { locale: string; code: string } }

export const revalidate = 1800

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const country = await getCountry(params.code, params.locale)
	if (!country) return {}
	const t = await getTranslations({ locale: params.locale, namespace: 'Destination' })
	const title = `${country.name}: ${t('travel_guide')} | TRAVSUS`
	return {
		title,
		description: country.description.slice(0, 160),
		alternates: { canonical: countryHref(params.locale, country.code3) },
		openGraph: { title, description: country.description.slice(0, 200), images: country.image ? [bigImage(country.image)] : [] },
	}
}

export default async function CountryPage({ params }: Props) {
	const { locale } = params
	setRequestLocale(locale)
	const country = await getCountry(params.code, locale)
	if (!country) notFound()

	const t = await getTranslations('Destination')
	const [cities, places, tours, placesCount] = await Promise.all([
		getCitiesOf(country, locale, 24),
		getPlacesOfCountry(country, locale, 9),
		getToursFor([country.englishName, country.name], locale),
		countPlacesOfCountry(country),
	])

	const facts = [
		country.continent && { icon: Globe2, label: t('continent'), value: country.continent },
		{ icon: Building2, label: t('k_cities'), value: String(cities.length) },
		{ icon: MapIcon, label: t('k_places'), value: String(placesCount) },
		{ icon: Route, label: t('k_tours'), value: String(tours.length) },
	].filter(Boolean) as { icon: typeof Globe2; label: string; value: string }[]

	return (
		<main className="mx-auto max-w-7xl px-5 pb-24 pt-6 text-neutral-950 dark:text-white">
			<nav aria-label="Breadcrumb">
				<ol className="flex flex-wrap items-center gap-1 text-sm text-neutral-500">
					<li>
						<Link href={`/${locale}/destinations` as any} className="hover:text-neutral-950 dark:hover:text-white">{t('destinations')}</Link>
					</li>
					<ChevronRight className="h-3.5 w-3.5" />
					<li className="font-medium text-neutral-950 dark:text-white" aria-current="page">{country.name}</li>
				</ol>
			</nav>

			<header className="relative mt-4 overflow-hidden rounded-[32px] bg-neutral-900">
				<div className="relative h-[52vh] min-h-[340px] sm:h-[64vh]">
					{country.image && <Image src={bigImage(country.image)} alt={country.name} fill priority sizes="(min-width: 1280px) 1240px, 100vw" className="object-cover" />}
					<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/0" />
				</div>
				<div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
					<p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
						{flag(country.code)} {country.continent}
					</p>
					<h1 className="mt-2 text-5xl font-bold tracking-tight sm:text-7xl">{country.name}</h1>
				</div>
			</header>

			<dl className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
				{facts.map(({ icon: Icon, label, value }) => (
					<div key={label} className="min-w-0 rounded-3xl bg-neutral-100 p-5 dark:bg-neutral-900">
						<dt className="flex items-center gap-2 truncate text-sm font-medium text-neutral-500">
							<Icon className="h-4 w-4 shrink-0" />
							<span className="truncate">{label}</span>
						</dt>
						<dd className="mt-2 truncate text-2xl font-bold tabular-nums tracking-tight">{value}</dd>
					</div>
				))}
			</dl>

			<section className="mt-16 max-w-3xl">
				<span aria-hidden className="mb-3 block h-1 w-10 rounded-full bg-brand-500" />
				<h2 className="text-2xl font-bold tracking-tight sm:text-4xl">{t('about', { name: country.name })}</h2>
				<p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">{country.description}</p>
			</section>

			{cities.length > 0 && (
				<Section title={t('top_cities', { country: country.name })}>
					<ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{cities.map((c) => (
							<li key={c.id}>
								<CityCard city={c} label={c.region ?? undefined} />
							</li>
						))}
					</ul>
				</Section>
			)}

			<Section
				title={t('tours_title', { name: country.name })}
				text={t('tours_text', { name: country.name })}
				action={
					<Link href={`/${locale}/search?query=${encodeURIComponent(country.englishName)}` as any} className="text-sm font-semibold underline underline-offset-4">
						{t('all_tours')}
					</Link>
				}
			>
				{tours.length ? (
					<ul className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
						{tours.slice(0, 6).map((tour) => (
							<li key={tour.id}>
								<TourCard tour={tour} />
							</li>
						))}
					</ul>
				) : (
					<Link href={`/${locale}/search?query=` as any} className="block rounded-[28px] bg-neutral-100 px-6 py-10 text-center font-medium text-neutral-600 transition hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-300">
						{t('tours_empty')}
					</Link>
				)}
			</Section>

			{places.length > 0 && (
				<Section title={t('top_places', { country: country.name })}>
					<ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{places.map((place) => (
							<li key={place.id}>
								<PlaceCard place={place} directions={t('directions')} website={t('website')} cityLabel={place.city ?? undefined} />
							</li>
						))}
					</ul>
				</Section>
			)}

			{country.point && (
				<Section title={t('on_the_map')}>
					<MapEmbed point={country.point} zoom={4} title={country.name} openLabel={t('open_map')} />
				</Section>
			)}
		</main>
	)
}
