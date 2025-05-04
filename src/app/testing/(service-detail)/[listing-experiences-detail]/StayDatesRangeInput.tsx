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

export interface StayDatesRangeInputProps {
	className?: string
	duration?: number
	onChange: (dates: any) => void
	value?: any
	isFlashing?: boolean
}

const StayDatesRangeInput: FC<StayDatesRangeInputProps> = ({
	className = 'flex-1',
	onChange,
	duration = 3,
	value,
	isFlashing = false,
}) => {
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
				className={`relative flex w-full flex-1 items-center gap-1 focus:outline-none ${styles.inputWrapper} ${isFlashing ? styles.flashing : ''}`}
			>
				<div className="text-neutral-300 dark:text-neutral-400">
					<CalendarIcon className="h-5 w-5 lg:h-7 lg:w-7" />
				</div>
				<div className="flex-grow text-left">
					<span className="block font-semibold xl:text-lg">
						{startDate?.toLocaleDateString('en-US', {
							month: 'short',
							day: '2-digit',
						}) || 'Add dates'}
						{endDate
							? ' - ' +
								endDate?.toLocaleDateString('en-US', {
									month: 'short',
									day: '2-digit',
								})
							: ''}
					</span>
					<span className="mt-1 block text-sm font-light leading-none text-neutral-400">
						{'Check in - Check out'}
					</span>
				</div>
			</div>
		)
	}

	return (
		<Popover className={`StayDatesRangeInput relative z-10 flex ${className}`}>
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
						<Popover.Panel className="absolute left-auto right-0 top-full z-10 mt-3 w-screen max-w-sm px-4 sm:px-0 lg:max-w-3xl xl:-right-10">
							<div className="overflow-hidden rounded-3xl bg-white p-8 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-800">
								<DatePicker
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
