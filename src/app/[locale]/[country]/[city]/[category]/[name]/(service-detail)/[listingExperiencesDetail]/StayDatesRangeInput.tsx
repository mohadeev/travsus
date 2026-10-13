'use client'
// Trip date picker on the tour page. You pick the first day; the last day
// follows from the tour length. Shows what is saved (nothing pre-filled),
// never allows past days, and closes once a day is picked.
import { Fragment, useEffect, type FC } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { CalendarDays } from 'lucide-react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useLocale, useTranslations } from 'next-intl'
import DatePickerCustomHeaderTwoMonth from '@/components/DatePickerCustomHeaderTwoMonth'
import DatePickerCustomDay from '@/components/DatePickerCustomDay'
import locales from '@/lib/dateFnsLocales'
import { firstBookableDay, formatTripDates, readTripDates, tripDates } from '@/lib/tripDates'
import styles from './StayDatesRangeInput.module.css'

export interface StayDatesRangeInputProps {
	className?: string
	/** Number of days of the tour */
	duration?: number
	onChange: (dates: { startDate: number; endDate: number }) => void
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
	const t = useTranslations('Booking')
	const tHome = useTranslations('Home')
	const locale = useLocale()
	const [start, end] = readTripDates(value)
	useEffect(() => {
		if ((locales as any)[locale]) registerLocale(locale, (locales as any)[locale])
	}, [locale])

	return (
		<Popover id="StayDatesRangeInput_TOUR" className={`StayDatesRangeInput relative z-10 flex ${className}`}>
			{({ open, close }) => (
				<>
					<Popover.Button
						className={`relative flex w-full flex-1 items-center gap-3 p-4 text-left focus:outline-none ${styles.inputWrapper} ${
							isFlashing ? styles.flashing : ''
						} ${open ? 'bg-neutral-50 dark:bg-neutral-900' : ''}`}
					>
						<CalendarDays className="h-6 w-6 shrink-0 text-brand-500" />
						<span className="min-w-0 flex-1">
							<span className={`block text-base font-semibold ${start ? '' : 'text-neutral-500'}`}>
								{start ? formatTripDates(start, end, locale) : t('choose_dates')}
							</span>
							<span className="mt-0.5 block text-sm text-neutral-500">
								{tHome('days_count', { count: Math.max(1, duration || 1) })}
							</span>
						</span>
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
						<Popover.Panel className="absolute inset-x-0 top-full z-30 mt-2 min-w-[300px]">
							<div className="tour-date-picker overflow-hidden rounded-3xl bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)] ring-1 ring-black/5 dark:bg-neutral-800">
								<DatePicker
									locale={locale}
									inline
									selectsRange
									monthsShown={1}
									minDate={firstBookableDay()}
									selected={start}
									startDate={start}
									endDate={end}
									openToDate={start ?? firstBookableDay()}
									showPopperArrow={false}
									onChange={(dates: [Date | null, Date | null]) => {
										// The day clicked is the first day of the trip (with no end
										// saved, the calendar reports the click as the range end)
										const picked = end ? dates[0] : dates[1] ?? dates[0]
										if (!picked) return
										onChange(tripDates(picked, duration))
										close()
									}}
									renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} single />}
									renderDayContents={(day, date) => <DatePickerCustomDay dayOfMonth={day} date={date} />}
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
