'use client'

import React, { Fragment, useState, FC } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { CalendarIcon } from '@heroicons/react/24/outline'
import DatePickerCustomHeaderTwoMonth from '@/components/DatePickerCustomHeaderTwoMonth'
import DatePickerCustomDay from '@/components/DatePickerCustomDay'
import DatePicker from 'react-datepicker'
import ClearDataButton from '@/app/(client-components)/(HeroSearchForm)/ClearDataButton'
import moment from 'moment'
import styles from './StayDatesRangeInput.module.css'
import { useTranslations } from '@/lib/i18n'
import { useLocale } from 'next-intl'
import { registerLocale, setDefaultLocale } from 'react-datepicker'

import ja from 'date-fns/locale/ja'
import locales from '@/lib/dateFnsLocales'

export interface StayDatesRangeInputProps {
	className?: string
	duration?: number
	onChange: (dates: any) => void
	value?: any
	isFlashing?: boolean
}

const StayDatesRangeInput: FC<StayDatesRangeInputProps> = ({
	className = t(
		'newServicedetailListingExperiencesDetailStayDatesRangeInput_Flex_One',
	),
	onChange,
	duration = 3,
	value,
	isFlashing = false,
}) => {
	const t = useTranslations(
		'newServicedetailListingExperiencesDetailStayDatesRangeInput',
	)
	const locale = useLocale()
	// console.log('locale:')
	moment.locale(locale) // ar-ma
	registerLocale(locale, locales[locale])

	const [startDate, setStartDate] = useState<Date | null>(
		new Date(moment().format('L')),
	)
	const [endDate, setEndDate] = useState<Date | null>(
		new Date(moment().add(3, 'days').format('L')),
	)

	const onChangeDate = (dates: [Date | null, Date | null]) => {
		const [start, end] = dates
		let newEnd = null
		setStartDate(start)
		if (start) {
			newEnd = new Date(
				moment(start)
					.add(duration - 1, 'days')
					.format('L'),
			)
			// Set end date to be (duration - 1) days after start date
			setEndDate(newEnd)
		} else {
			// setEndDate(null)
		}
		return { startDate: start?.getTime(), endDate: newEnd?.getTime() }
	}

	const renderInput = () => {
		return (
			<div
				className={
					t(
						'newServicedetailListingExperiencesDetailStayDatesRangeInput_Input_Wrapper_Classes',
					) + `${styles.inputWrapper} ${isFlashing ? styles.flashing : ''}`
				}
			>
				<div
					className={t(
						'newServicedetailListingExperiencesDetailStayDatesRangeInput_Icon_Text_Classes',
					)}
				>
					<CalendarIcon
						className={t(
							'newServicedetailListingExperiencesDetailStayDatesRangeInput_Icon_Size_Classes',
						)}
					/>
				</div>
				<div
					className={t(
						'newServicedetailListingExperiencesDetailStayDatesRangeInput_Content_Layout_Classes',
					)}
				>
					<span
						className={t(
							'newServicedetailListingExperiencesDetailStayDatesRangeInput_Date_Display_Classes',
						)}
					>
						{startDate?.toLocaleDateString(locale, {
							month: 'short',
							day: '2-digit',
						}) ||
							t(
								'newServicedetailListingExperiencesDetailStayDatesRangeInput_Add_Dates',
							)}
						{endDate
							? ' - ' +
								endDate?.toLocaleDateString(locale, {
									month: 'short',
									day: '2-digit',
								})
							: ''}
					</span>
					<span
						className={t(
							'newServicedetailListingExperiencesDetailStayDatesRangeInput_Subtitle_Classes',
						)}
					>
						{t(
							'newServicedetailListingExperiencesDetailStayDatesRangeInput_Check_In_Out',
						)}
					</span>
				</div>
			</div>
		)
	}

	return (
		<Popover
			id="StayDatesRangeInput_TOUR"
			className={
				t(
					'newServicedetailListingExperiencesDetailStayDatesRangeInput_Container_Classes',
				) + ` ${className}`
			}
		>
			{({ open }) => (
				<>
					<Popover.Button
						className={`relative flex flex-1 items-center focus:outline-none ${
							open ? 'shadow-lg' : ''
						}`}
					>
						{renderInput()}
						{startDate && open && (
							<ClearDataButton onClick={() => onChangeDate([null, null])} />
						)}
					</Popover.Button>

					<Transition
						as={Fragment}
						enter="transition ease-out duration-200"
						enterFrom="opacity-0 translate-y-1"
						enterTo="opacity-100 translate-y-0"
						leave="transition ease-in duration-150"
						leaveFrom="opacity-100 translate-y-0"
						leaveTo="opacity-0 translate-y-1"
					>
						<Popover.Panel
							className={t(
								'newServicedetailListingExperiencesDetailStayDatesRangeInput_Panel_Position_Classes',
							)}
						>
							<div
								className={t(
									'newServicedetailListingExperiencesDetailStayDatesRangeInput_Panel_Style_Classes',
								)}
							>
								<DatePicker
									locale={locale}
									selected={startDate}
									onChange={(dates) => {
										console.log('dates-dates:', dates)
										onChange(onChangeDate(dates))
									}}
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
						</Popover.Panel>
					</Transition>
				</>
			)}
		</Popover>
	)
}

export default StayDatesRangeInput
