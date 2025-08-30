'use client'

import { slugify } from 'transliteration'
import slugifySecond from '@/utils/slugify'
import type { ExperiencesDataType } from '@/data/types'
import type { Route } from '@/routers/types'
import { useTranslations } from '@/lib/i18n'

export function generateTourLink(
	data?: ExperiencesDataType,
	locale?: string,
): Route {
	const t = useTranslations('Jan03_TourHeader_x9k2', locale)

	if (!data?.days?.[0] || !locale) return '/' as Route

	const day = data.days[0]
	const toursLabel = t('tours_slug')

	return slugifySecond(
		`${locale}/${slugify(day.countryName || '')}/${slugify(day.cityName || '')}/${slugify(toursLabel)}/${slugify(data.name || '')}/${data.id}`,
	) as Route
}
