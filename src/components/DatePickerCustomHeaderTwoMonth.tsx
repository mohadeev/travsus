import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { ReactDatePickerCustomHeaderProps } from 'react-datepicker'
import { useTranslations } from '@/lib/i18n'
import { useLocale } from 'next-intl'
import { registerLocale, setDefaultLocale } from 'react-datepicker'

import ja from 'date-fns/locale/ja'
import locales from '@/lib/dateFnsLocales'

const DatePickerCustomHeaderTwoMonth = ({
	monthDate,
	customHeaderCount,
	decreaseMonth,
	increaseMonth,
	prevMonthButtonDisabled,
	single = false,
}: ReactDatePickerCustomHeaderProps & {
	/** One month shown: both arrows on it (with two, each month shows one) */
	single?: boolean
}) => {
	const hidePrev = prevMonthButtonDisabled || (!single && customHeaderCount === 1)
	const hideNext = !single && customHeaderCount === 0
	const t = useTranslations('components_DatePickerCustomHeaderTwoMonth')
	const locale = useLocale()
	return (
		<div>
			<button
				aria-label={t(
					'components_DatePickerCustomHeaderTwoMonth_Previous_Month',
				)}
				className={
					'react-datepicker__navigation react-datepicker__navigation--previous absolute -top-1 left-0 flex items-center justify-center rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700'
				}
				style={hidePrev ? { visibility: 'hidden' } : {}}
				onClick={decreaseMonth}
				type="button"
			>
				<span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous">
					<ChevronLeftIcon className="h-5 w-5" />
				</span>
			</button>
			<span className="react-datepicker__current-month">
				{monthDate.toLocaleString(locale, {
					month: 'long',
					year: 'numeric',
				})}
			</span>
			<button
				aria-label={t('components_DatePickerCustomHeaderTwoMonth_Next_Month')}
				className="react-datepicker__navigation react-datepicker__navigation--next absolute -right-0 -top-1 flex items-center justify-center rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
				style={hideNext ? { visibility: 'hidden' } : {}}
				type="button"
				onClick={increaseMonth}
			>
				<span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--next">
					<ChevronRightIcon className="h-5 w-5" />
				</span>
			</button>
		</div>
	)
}

export default DatePickerCustomHeaderTwoMonth
