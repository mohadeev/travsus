'use client'
import React, { FC, Fragment, useState } from 'react'
import DatePicker from 'react-datepicker'
import DatePickerCustomHeaderTwoMonth from '@/components/DatePickerCustomHeaderTwoMonth'
import DatePickerCustomDay from '@/components/DatePickerCustomDay'
import moment from 'moment'
import { useTranslations } from '@/lib/i18n'

const SectionDateRange = () => {
	const [startDate, setStartDate] = useState<Date | null>(
		new Date(moment().format('L')),
	)
	const [endDate, setEndDate] = useState<Date | null>(
		new Date(moment().add(7, 'days').format('L')),
	)
	const t = useTranslations('servicedetailSectionDateRange')

	const onChangeDate = (dates: [Date | null, Date | null]) => {
		const [start, end] = dates
		setStartDate(start)
		setEndDate(end)
	}

	const renderSectionCheckIndate = () => {
		return (
			<div className="listingSection__wrap overflow-hidden">
				{/* HEADING */}
				<div>
					<h2 className="text-2xl font-semibold">
						{t('servicedetailSectionDateRange_Availability')}
					</h2>
					<span className="mt-2 block text-neutral-500 dark:text-neutral-400">
						{t('servicedetailSectionDateRange_Prices_May_Increase')}
					</span>
				</div>
				<div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
				{/* CONTENT */}

				<div className="">
					<DatePicker
						selected={startDate}
						onChange={onChangeDate}
						startDate={startDate}
						endDate={endDate}
						selectsRange
						monthsShown={2}
						showPopperArrow={false}
						inline
						renderCustomHeader={(p) => (
							<DatePickerCustomHeaderTwoMonth {...p} />
						)}
						renderDayContents={(day, date) => (
							<DatePickerCustomDay dayOfMonth={day} date={date} />
						)}
					/>
				</div>
			</div>
		)
	}

	return renderSectionCheckIndate()
}

export default SectionDateRange
