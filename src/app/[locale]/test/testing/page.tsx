// app/[locale]/[continent]/[country]/[region]/[city]/[category]/[name]/[id]/tours/page.tsx
'use client'
import { useParams } from 'next/navigation'
import { useTranslations } from '@/lib/i18n'

export default function TourPage() {
	const t = useTranslations('test_testing_page')
	const params = useParams()

	const { locale, continent, country, region, city, category, name, id } =
		params

	return (
		<main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
			<h1>{t('test_testing_page_Tour_Details')}</h1>
			<p>
				<strong>{t('test_testing_page_Locale')}:</strong> {locale}
			</p>
			<p>
				<strong>{t('test_testing_page_Continent')}:</strong> {continent}
			</p>
			<p>
				<strong>{t('test_testing_page_Country')}:</strong> {country}
			</p>
			<p>
				<strong>{t('test_testing_page_Region')}:</strong> {region}
			</p>
			<p>
				<strong>{t('test_testing_page_City')}:</strong> {city}
			</p>
			<p>
				<strong>{t('test_testing_page_Category')}:</strong> {category}
			</p>
			<p>
				<strong>{t('test_testing_page_Tour_Name')}:</strong> {name}
			</p>
			<p>
				<strong>{t('test_testing_page_Tour_ID')}:</strong> {id}
			</p>
		</main>
	)
}
