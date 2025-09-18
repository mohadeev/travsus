import { slugify } from 'transliteration'
import slugifySecond from '@/utils/slugify'
import { useTranslations } from '@/lib/i18n'

export function generateTourLink(
	data?: ExperiencesDataType,
	locale?: string,
): any {
	const t = useTranslations('Jan03_TourHeader_x9k2', locale)

	if (!data?.days?.[0] || !locale) return '/' as Route

	const day = data.days[0]
	const toursLabel = t('tours_slug')
	const like = slugifySecond(
		`/${slugify(day.countryName || 'morocco')}/${slugify(day.cityName || 'marrakech')}/${slugify(toursLabel)}/${slugify(data.name || '')}/${data.id}`,
	)
	return `${locale}${like}`
}
