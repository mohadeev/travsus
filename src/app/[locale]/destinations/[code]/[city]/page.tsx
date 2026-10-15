// A city: photo, live weather and local time, description, travel guide,
// TRAVSUS tours that go there, things to do, map, and more of the country.
// Address: /destinations/morocco/tangier. Older ones (/mar/tangier,
// ?lcId=<city id>) redirect there for good.
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { ChevronRight, Clock3, Compass, Lightbulb, MapPin, Plane, Sun, Wind } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import TourCard from '../../../(home)/TourCard'
import { countryHref, flag, getCitiesOf, getCity, getPlacesOfCity, getToursFor, getWeather, weatherKey } from '@/lib/destinations'
import guides from '@/content/destination-guides.json'
import LocalTime from '../../_components/LocalTime'
import { bigImage, CityCard, MapEmbed, PlaceCard, Section } from '../../_components/ui'

type Props = { params: { locale: string; code: string; city: string }; searchParams: { lcId?: string } }

export const revalidate = 1800

const guideFor = (id: string, locale: string) => {
	const g = (guides as Record<string, Record<string, { bestTime: string; stay: string; gettingThere: string; tip: string }>>)[id]
	return g ? g[locale] ?? g['en-US'] : null
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
	const city = await getCity(params.code, params.city, params.locale, searchParams.lcId)
	if (!city) return {}
	const t = await getTranslations({ locale: params.locale, namespace: 'Destination' })
	const title = `${city.name}, ${city.country.name}: ${t('travel_guide')} | TRAVSUS`
	return {
		title,
		description: city.description.slice(0, 160),
		alternates: { canonical: city.href },
		openGraph: { title, description: city.description.slice(0, 200), images: city.image ? [bigImage(city.image)] : [] },
	}
}

export default async function CityPage({ params, searchParams }: Props) {
	const { locale } = params
	setRequestLocale(locale)
	const city = await getCity(params.code, params.city, locale, searchParams.lcId)
	if (!city) notFound()
	if (searchParams.lcId || decodeURIComponent(`/${locale}/destinations/${params.code}/${params.city}`) !== city.href) permanentRedirect(city.href)

	const t = await getTranslations('Destination')
	const [weather, places, tours, others] = await Promise.all([
		getWeather(city.point),
		getPlacesOfCity(city.id, locale),
		getToursFor([city.englishName, city.name], locale),
		getCitiesOf(city.country, locale, 12),
	])
	const guide = guideFor(city.id, locale)
	const more = others.filter((c) => c.id !== city.id).slice(0, 8)
	const dayName = (date: string, i: number) => (i === 0 ? t('today') : new Date(`${date}T12:00:00Z`).toLocaleDateString(locale, { weekday: 'short', timeZone: 'UTC' }))

	const facts = [
		weather?.now && {
			icon: Sun,
			label: t('weather_now'),
			value: `${weather.now.temp}°C`,
			note: `${t(weatherKey(weather.now.code))} · ${t('wind', { speed: weather.now.wind })}`,
		},
		weather?.timezone && { icon: Clock3, label: t('local_time'), value: <LocalTime timezone={weather.timezone} locale={locale} />, note: weather.timezone.replace(/_/g, ' ') },
		{ icon: MapPin, label: t('country'), value: `${flag(city.country.code)} ${city.country.name}`, note: city.region ?? city.country.continent ?? undefined, href: countryHref(locale, city.country) },
		city.point && { icon: Compass, label: t('on_the_map'), value: `${city.point.lat.toFixed(2)}°, ${city.point.lng.toFixed(2)}°`, note: city.country.continent ?? undefined, href: '#map' },
	].filter(Boolean) as { icon: typeof Sun; label: string; value: React.ReactNode; note?: string; href?: string }[]

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'TouristDestination',
		name: city.name,
		description: city.description,
		...(city.image ? { image: city.image } : {}),
		...(city.point ? { geo: { '@type': 'GeoCoordinates', latitude: city.point.lat, longitude: city.point.lng } } : {}),
		containedInPlace: { '@type': 'Country', name: city.country.name },
		...(places.length ? { includesAttraction: places.slice(0, 10).map((p) => ({ '@type': 'TouristAttraction', name: p.name })) } : {}),
	}

	return (
		<main className="mx-auto max-w-7xl px-5 pb-24 pt-6 text-neutral-950 dark:text-white">
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

			<nav aria-label="Breadcrumb">
				<ol className="flex flex-wrap items-center gap-1 text-sm text-neutral-500">
					<li>
						<Link href={`/${locale}/destinations` as any} className="hover:text-neutral-950 dark:hover:text-white">{t('destinations')}</Link>
					</li>
					<ChevronRight className="h-3.5 w-3.5" />
					<li>
						<Link href={countryHref(locale, city.country) as any} className="hover:text-neutral-950 dark:hover:text-white">{city.country.name}</Link>
					</li>
					<ChevronRight className="h-3.5 w-3.5" />
					<li className="font-medium text-neutral-950 dark:text-white" aria-current="page">{city.name}</li>
				</ol>
			</nav>

			{/* Hero */}
			<header className="relative mt-4 overflow-hidden rounded-[32px] bg-neutral-900">
				<div className="relative h-[52vh] min-h-[340px] sm:h-[64vh]">
					{city.image && <Image src={bigImage(city.image)} alt={city.name} fill priority sizes="(min-width: 1280px) 1240px, 100vw" className="object-cover" />}
					<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/0" />
				</div>
				<div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
					<p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
						{flag(city.country.code)} {[city.region, city.country.name].filter(Boolean).join(' · ')}
					</p>
					<h1 className="mt-2 text-5xl font-bold tracking-tight sm:text-7xl">{city.name}</h1>
				</div>
			</header>

			{/* Quick facts */}
			<dl className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
				{facts.map(({ icon: Icon, label, value, note, href }) => {
					const inner = (
						<>
							<dt className="flex items-center gap-2 text-sm font-medium text-neutral-500">
								<Icon className="h-4 w-4" />
								{label}
							</dt>
							<dd className="mt-2 truncate text-2xl font-bold tabular-nums tracking-tight">{value}</dd>
							{note && <dd className="mt-0.5 truncate text-xs text-neutral-500">{note}</dd>}
						</>
					)
					return href ? (
						<Link key={label} href={href as any} className="min-w-0 rounded-3xl bg-neutral-100 p-5 transition hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800">
							{inner}
						</Link>
					) : (
						<div key={label} className="min-w-0 rounded-3xl bg-neutral-100 p-5 dark:bg-neutral-900">
							{inner}
						</div>
					)
				})}
			</dl>

			{/* About + guide */}
			<div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
				<section>
					<span aria-hidden className="mb-3 block h-1 w-10 rounded-full bg-brand-500" />
					<h2 className="text-2xl font-bold tracking-tight sm:text-4xl">{t('about', { name: city.name })}</h2>
					<p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">{city.description}</p>

					{weather && weather.days.length > 1 && (
						<div className="mt-10">
							<h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">{t('forecast')}</h3>
							<ul className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-6 sm:px-0">
								{weather.days.map((d, i) => (
									<li key={d.date} className="w-24 shrink-0 rounded-3xl bg-neutral-100 px-3 py-4 text-center sm:w-auto dark:bg-neutral-900">
										<p className="text-xs font-semibold capitalize text-neutral-500">{dayName(d.date, i)}</p>
										<p className="mt-2 text-lg font-bold tabular-nums">{d.max}°</p>
										<p className="text-sm tabular-nums text-neutral-500">{d.min}°</p>
										<p className="mt-1 truncate text-[11px] text-neutral-500" title={t(weatherKey(d.code))}>
											{d.rain >= 30 ? t('rain', { pct: d.rain }) : t(weatherKey(d.code))}
										</p>
									</li>
								))}
							</ul>
						</div>
					)}
				</section>

				{guide && (
					<aside className="h-fit rounded-[32px] bg-neutral-950 p-7 text-white sm:p-9 dark:bg-white dark:text-neutral-950">
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60 dark:text-neutral-500">{t('travel_guide')}</p>
						<dl className="mt-6 space-y-6">
							{(
								[
									[Sun, t('best_time'), guide.bestTime],
									[Clock3, t('how_long'), guide.stay],
									[Plane, t('getting_there'), guide.gettingThere],
									[Lightbulb, t('local_tip'), guide.tip],
								] as const
							).map(([Icon, label, text]) => (
								<div key={label} className="flex gap-4">
									<span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 dark:bg-neutral-100">
										<Icon className="h-5 w-5" />
									</span>
									<div>
										<dt className="font-semibold">{label}</dt>
										<dd className="mt-1 text-[15px] leading-relaxed text-white/75 dark:text-neutral-600">{text}</dd>
									</div>
								</div>
							))}
						</dl>
					</aside>
				)}
			</div>

			{/* Tours */}
			<Section
				title={t('tours_title', { name: city.name })}
				text={t('tours_text', { name: city.name })}
				action={
					<Link href={`/${locale}/search?query=${encodeURIComponent(city.englishName)}` as any} className="text-sm font-semibold underline underline-offset-4">
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

			{/* Things to do */}
			{places.length > 0 && (
				<Section title={t('things_to_do', { name: city.name })}>
					<ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{places.map((place) => (
							<li key={place.id}>
								<PlaceCard place={place} directions={t('directions')} website={t('website')} />
							</li>
						))}
					</ul>
				</Section>
			)}

			{/* Map */}
			{city.point && (
				<Section id="map" title={t('on_the_map')}>
					<MapEmbed point={city.point} title={city.name} openLabel={t('open_map')} />
				</Section>
			)}

			{/* More in the country */}
			{more.length > 0 && (
				<Section
					title={t('more_in', { country: city.country.name })}
					action={
						<Link href={countryHref(locale, city.country) as any} className="text-sm font-semibold underline underline-offset-4">
							{t('explore')} {city.country.name}
						</Link>
					}
				>
					<ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{more.map((c) => (
							<li key={c.id}>
								<CityCard city={c} label={c.region ?? undefined} />
							</li>
						))}
					</ul>
				</Section>
			)}
		</main>
	)
}
