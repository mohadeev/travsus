'use client'

import DatePicker from 'react-datepicker'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import React, { FC, Fragment, useEffect, useState } from 'react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import DatePickerCustomHeaderTwoMonth from './DatePickerCustomHeaderTwoMonth'
import DatePickerCustomDay from './DatePickerCustomDay'
import { setSelectedDate } from '@/app/GlobalRedux/Features/bookingSlice/bookingSlice'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { useTranslations } from '@/lib/i18n'

interface ModalSelectDateProps {
	renderChildren?: (p: { openModal: () => void }) => React.ReactNode
	name?: String
	duration?: Number
}

const ModalSelectDate: FC<ModalSelectDateProps> = ({
	renderChildren,
	name,
	duration = 3,
}) => {
	const t = useTranslations("components_ModalSelectDate");
	const [showModal, setShowModal] = useState(false)

	const [startDate, setStartDate] = useState<Date | null>(
		new Date(moment().format('L')),
	)
	const [endDate, setEndDate] = useState<Date | null>(
		new Date(moment().add(3, 'days').format('L')),
	)

	function closeModal() {
		setShowModal(false)
	}

	function openModal() {
		setShowModal(true)
	}

	const renderButtonOpenModal = () => {
		return renderChildren ? (
			renderChildren({ openModal })
		) : (
			<button onClick={openModal}>{t('components_ModalSelectDate_Select_Date')}</button>
		)
	}
	const dispatch = useDispatch()
	const onChange = (date: string) => {
		dispatch(setSelectedDate(date))
	}
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
			setEndDate(newEnd)
		} else {
			// setEndDate(null)
		}
		return { startDate: start?.getTime(), endDate: newEnd?.getTime() }
	}

	return (
		<>
			{renderButtonOpenModal()}
			<Transition appear show={showModal} as={Fragment}>
				<Dialog
					as="div"
					className="HeroSearchFormMobile__Dialog relative z-50"
					onClose={closeModal}
				>
					<div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
						<div className="flex h-full">
							<Transition.Child
								as={Fragment}
								enter="ease-out transition-transform"
								enterFrom="opacity-0 translate-y-52"
								enterTo="opacity-100 translate-y-0"
								leave="ease-in transition-transform"
								leaveFrom="opacity-100 translate-y-0"
								leaveTo="opacity-0 translate-y-52"
							>
								<Dialog.Panel className="relative flex h-full flex-1 flex-col justify-between overflow-hidden">
									<>
										<div className="absolute left-4 top-4">
											<button
												className="focus:outline-none focus:ring-0"
												onClick={closeModal}
											>
												<XMarkIcon className="h-5 w-5 text-black dark:text-white" />
											</button>
										</div>

										<div className="flex flex-1 flex-col overflow-auto p-1 pt-12">
											<div className="flex flex-1 flex-col bg-white dark:bg-neutral-800">
												<div className="flex flex-1 animate-[myblur_0.4s_ease-in-out] flex-col overflow-auto transition-opacity">
													<div className="p-5">
														<span className="block text-xl font-semibold sm:text-2xl">
															{t('components_ModalSelectDate_Whens_Your_Trip')}
														</span>
													</div>
													<div className="relative z-10 flex flex-1">
														<div className="overflow-hidden rounded-3xl">
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
																	<DatePickerCustomDay
																		dayOfMonth={day}
																		date={date}
																	/>
																)}
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="flex justify-between border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900">
											<button
												type="button"
												className="flex-shrink-0 font-semibold underline"
												onClick={() => {
													onChangeDate([null, null])
												}}
											>
												{t('components_ModalSelectDate_Clear_Dates')}
											</button>
											<ButtonPrimary
												sizeClass="px-6 py-3 !rounded-xl"
												onClick={() => {
													closeModal()
												}}
											>
												{t('components_ModalSelectDate_Save')}
											</ButtonPrimary>
										</div>
									</>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

export default ModalSelectDate