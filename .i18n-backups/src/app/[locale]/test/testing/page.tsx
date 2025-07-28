// app/[locale]/[continent]/[country]/[region]/[city]/[category]/[name]/[id]/tours/page.tsx
'use client'
import { useParams } from 'next/navigation'

export default function TourPage() {
	const params = useParams()

	const { locale, continent, country, region, city, category, name, id } =
		params

	return (
		<main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
			<h1>Tour Details</h1>
			<p>
				<strong>Locale:</strong> {locale}
			</p>
			<p>
				<strong>Continent:</strong> {continent}
			</p>
			<p>
				<strong>Country:</strong> {country}
			</p>
			<p>
				<strong>Region:</strong> {region}
			</p>
			<p>
				<strong>City:</strong> {city}
			</p>
			<p>
				<strong>Category:</strong> {category}
			</p>
			<p>
				<strong>Tour Name:</strong> {name}
			</p>
			<p>
				<strong>Tour ID:</strong> {id}
			</p>
		</main>
	)
}
