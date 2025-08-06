'use client'
import converSelectedDateToString from '@/utils/converSelectedDateToString'
import React, { useState } from 'react'
import { GuestsObject } from '../../type'
import GuestsInput from '../GuestsInput'
import LocationInput from '../LocationInput'
import DatesRangeInput from '../DatesRangeInput'
import { useTranslations } from '@/lib/i18n'

const StaySearchForm = () => {
	const t = useTranslations('Jan03_StaySearchForm_m8p4')
	//
	const [fieldNameShow, setFieldNameShow] = useState<
		'location' | 'dates' | 'guests'
	>('location')
	//
	const [locationInputTo, setLocationInputTo] = useState('')
	const [guestInput, setGuestInput] = useState<GuestsObject>({
		guestAdults: 0,
		guestChildren: 0,
		guestInfants: 0,
	})
	const [startDate, setStartDate] = useState<Date | null>(new Date())
	const [endDate, setEndDate] = useState<Date | null>(
		new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
	)

	//
	const onChangeDate = (dates: [Date | null, Date | null]) => {
		const [start, end] = dates
		setStartDate(start)
		setEndDate(end)
	}

	const renderInputLocation = () => {
		const isActive = fieldNameShow === 'location'
		return (
			<div
				className={`w-full bg-white dark:bg-neutral-800 ${
					isActive
						? 'rounded-2xl shadow-lg'
						: 'rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]'
				}`}
			>
				{!isActive ? (
					<button
						className={`flex w-full justify-between p-4 text-sm font-medium`}
						onClick={() => setFieldNameShow('location')}
					>
						<span className="text-neutral-400">{t('Where')}</span>
						<span>{locationInputTo || t('Location')}</span>
					</button>
				) : (
					<LocationInput
						defaultValue={locationInputTo}
						onChange={(value) => {
							setLocationInputTo(value)
							setFieldNameShow('dates')
						}}
					/>
				)}
			</div>
		)
	}

	const renderInputDates = () => {
		const isActive = fieldNameShow === 'dates'
		return (
			<div
				className={`w-full overflow-hidden bg-white dark:bg-neutral-800 ${
					isActive
						? 'rounded-2xl shadow-lg'
						: 'rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]'
				}`}
			>
				{!isActive ? (
					<button
						className={`flex w-full justify-between p-4 text-sm font-medium`}
						onClick={() => setFieldNameShow('dates')}
					>
						<span className="text-neutral-400">{t('When')}</span>
						<span>
							{startDate
								? converSelectedDateToString([startDate, endDate])
								: t('Add_Date')}
						</span>
					</button>
				) : (
					<DatesRangeInput />
				)}
			</div>
		)
	}

	const renderInputGuests = () => {
		const isActive = fieldNameShow === 'guests'
		let guestSelected = ''
		if (guestInput.guestAdults || guestInput.guestChildren) {
			const guest =
				(guestInput.guestAdults || 0) + (guestInput.guestChildren || 0)
			guestSelected +=
				guest === 1
					? t('Guest_Singular', { count: guest })
					: t('Guests_Plural', { count: guest })
		}
		if (guestInput.guestInfants) {
			guestSelected +=
				guestInput.guestInfants === 1
					? `, ${t('Infant_Singular', { count: guestInput.guestInfants })}`
					: `, ${t('Infants_Plural', { count: guestInput.guestInfants })}`
		}

		return (
			<div
				className={`w-full overflow-hidden bg-white dark:bg-neutral-800 ${
					isActive
						? 'rounded-2xl shadow-lg'
						: 'rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]'
				}`}
			>
				{!isActive ? (
					<button
						className={`flex w-full justify-between p-4 text-sm font-medium`}
						onClick={() => setFieldNameShow('guests')}
					>
						<span className="text-neutral-400">{t('Who')}</span>
						<span>{guestSelected || t('Add_Guests')}</span>
					</button>
				) : (
					<GuestsInput defaultValue={guestInput} onChange={setGuestInput} />
				)}
			</div>
		)
	}

	return (
		<div>
			<div className="w-full space-y-5">
				{/*  */}
				{renderInputLocation()}
				{/*  */}
				{renderInputDates()}
				{/*  */}
				{renderInputGuests()}
			</div>
		</div>
	)
}

export default StaySearchForm
