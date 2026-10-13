'use client'
// Full-screen date picker used at checkout. Picking a day saves the trip
// dates (first day + tour length) and closes; past days can't be picked.
import { Fragment, useEffect, useState, type FC, type ReactNode } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { useLocale } from 'next-intl'
import DatePickerCustomHeaderTwoMonth from './DatePickerCustomHeaderTwoMonth'
import DatePickerCustomDay from './DatePickerCustomDay'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectBooking, setSelectedDate } from '@/store/slices/booking'
import { useTranslations } from '@/lib/i18n'
import locales from '@/lib/dateFnsLocales'
import { firstBookableDay, readTripDates, tripDates } from '@/lib/tripDates'

interface ModalSelectDateProps {
	renderChildren?: (p: { openModal: () => void }) => ReactNode
	/** Number of days of the tour */
	duration?: number
	name?: string
}

const ModalSelectDate: FC<ModalSelectDateProps> = ({ renderChildren, duration = 1 }) => {
	const t = useTranslations('components_ModalSelectDate')
	const locale = useLocale()
	const dispatch = useAppDispatch()
	const booking = useAppSelector(selectBooking)
	const [start, end] = readTripDates(booking.selectedDate)
	const [showModal, setShowModal] = useState(false)
	const [months, setMonths] = useState(1)

	useEffect(() => {
		if ((locales as any)[locale]) registerLocale(locale, (locales as any)[locale])
		setMonths(window.matchMedia('(min-width: 768px)').matches ? 2 : 1)
	}, [locale])

	const openModal = () => setShowModal(true)
	const closeModal = () => setShowModal(false)

	return (
		<>
			{renderChildren ? (
				renderChildren({ openModal })
			) : (
				<button type="button" onClick={openModal}>
					{t('components_ModalSelectDate_Select_Date')}
				</button>
			)}

			<Transition appear show={showModal} as={Fragment}>
				<Dialog as="div" className="relative z-50" onClose={closeModal}>
					<div className="fixed inset-0 bg-black/40" />
					<div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-200"
							enterFrom="opacity-0 translate-y-8"
							enterTo="opacity-100 translate-y-0"
							leave="ease-in duration-150"
							leaveFrom="opacity-100 translate-y-0"
							leaveTo="opacity-0 translate-y-8"
						>
							<Dialog.Panel className="relative w-full max-w-3xl rounded-t-3xl bg-white p-6 sm:rounded-3xl sm:p-8 dark:bg-neutral-800">
								<button
									type="button"
									onClick={closeModal}
									aria-label="Close"
									className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
								>
									<X className="h-5 w-5" />
								</button>
								<Dialog.Title className="mb-5 text-xl font-bold sm:text-2xl">
									{t('components_ModalSelectDate_Whens_Your_Trip').trim()}
								</Dialog.Title>
								<DatePicker
									locale={locale}
									inline
									selectsRange
									monthsShown={months}
									minDate={firstBookableDay()}
									selected={start}
									startDate={start}
									endDate={end}
									openToDate={start ?? firstBookableDay()}
									showPopperArrow={false}
									onChange={(dates: [Date | null, Date | null]) => {
										// The day clicked is the first day of the trip
										const picked = end ? dates[0] : dates[1] ?? dates[0]
										if (!picked) return
										dispatch(setSelectedDate(tripDates(picked, duration)))
										closeModal()
									}}
									renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} single={months === 1} />}
									renderDayContents={(day, date) => <DatePickerCustomDay dayOfMonth={day} date={date} />}
								/>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

export default ModalSelectDate
