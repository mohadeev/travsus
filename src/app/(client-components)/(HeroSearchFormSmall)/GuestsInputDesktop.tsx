'use client'

import React, { useEffect, useState } from 'react'
import { FC } from 'react'
import ClearDataButton from './ClearDataButton'
import ButtonSubmit from './ButtonSubmit'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'
import { PathName } from '@/routers/types'
import NcInputNumber from '@/components/NcInputNumber'
import { GuestsObject } from '../type'
import { useTranslations } from '@/lib/i18n'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export interface GuestsInputProps {
	className?: string
	fieldClassName?: string
	autoFocus?: boolean
	submitLink: PathName
}

const GuestsInputDesktop: FC<GuestsInputProps> = ({
	fieldClassName = '[ nc-hero-field-padding--small ]',
	className = '',
	autoFocus = false,
	submitLink,
}) => {
	const guestsT = useTranslations('GuestsInput')
	const refContainer = React.createRef<HTMLDivElement>()
	const [isOpen, setIsOpen] = useState(false)
	useOutsideAlerter(refContainer, () => setIsOpen(false))

	const [guestAdultsInputValue, setGuestAdultsInputValue] = useState(2)
	const [guestChildrenInputValue, setGuestChildrenInputValue] = useState(1)
	const [guestInfantsInputValue, setGuestInfantsInputValue] = useState(1)
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()
	useEffect(() => {
		setIsOpen(autoFocus)
	}, [autoFocus])

	function travlers(
		name: 'guestAdults' | 'guestChildren' | 'guestInfants',
		value: Number,
	) {
		const params = new URLSearchParams(searchParams) // clone current params
		params.set(name, value.toString()) // ISO format for safe parsing
		router.replace(`${pathname}?${params.toString()}`)
	}

	const handleChangeData = (value: number, type: keyof GuestsObject) => {
		if (type === 'guestAdults') {
			setGuestAdultsInputValue(value)
		}
		if (type === 'guestChildren') {
			setGuestChildrenInputValue(value)
		}
		if (type === 'guestInfants') {
			setGuestInfantsInputValue(value)
		}
		travlers(type, value)
	}

	const totalGuests =
		guestChildrenInputValue + guestAdultsInputValue + guestInfantsInputValue

	return (
		<div className={`relative z-10 flex ${className}`} ref={refContainer}>
			<div
				className={`relative z-10 flex flex-1 cursor-pointer items-center justify-between text-left focus:outline-none ${
					isOpen ? 'nc-hero-field-focused--2' : ''
				}`}
			>
				<div
					className={`${fieldClassName} flex-1`}
					onClick={() => {
						setIsOpen(!isOpen)
					}}
				>
					<div className="flex-1 text-left">
						<span className="block font-semibold">
							{totalGuests || ''} {guestsT('guests')}
						</span>
						<span className="mt-1 block text-sm font-light leading-none text-neutral-400">
							{totalGuests ? guestsT('guests') : guestsT('add_guests')}
						</span>
					</div>
				</div>
				<div className="relative">
					{!!totalGuests && isOpen && (
						<ClearDataButton
							onClick={() => {
								setGuestAdultsInputValue(0)
								setGuestChildrenInputValue(0)
								setGuestInfantsInputValue(0)
							}}
						/>
					)}
				</div>
				<div className="pr-2">
					<ButtonSubmit href={submitLink} />
				</div>
			</div>

			{isOpen && (
				<div className="absolute -left-0.5 right-10 top-1/2 z-0 h-8 -translate-y-1/2 self-center bg-white dark:bg-neutral-800"></div>
			)}

			{isOpen && (
				<div className="absolute right-0 top-full z-30 mt-3 w-full max-w-sm rounded-3xl bg-white px-4 py-5 shadow-xl dark:bg-neutral-800 sm:min-w-[340px] sm:px-8 sm:py-6">
					<NcInputNumber
						className="w-full"
						defaultValue={guestAdultsInputValue}
						onChange={(value) => handleChangeData(value, 'guestAdults')}
						max={10}
						min={1}
						label={guestsT('adults')}
						desc={guestsT('adults_desc')}
					/>
					<NcInputNumber
						className="mt-6 w-full"
						defaultValue={guestChildrenInputValue}
						onChange={(value) => handleChangeData(value, 'guestChildren')}
						max={4}
						label={guestsT('children')}
						desc={guestsT('children_desc')}
					/>

					<NcInputNumber
						className="mt-6 w-full"
						defaultValue={guestInfantsInputValue}
						onChange={(value) => handleChangeData(value, 'guestInfants')}
						max={4}
						label={guestsT('infants')}
						desc={guestsT('infants_desc')}
					/>
				</div>
			)}
		</div>
	)
}

export default GuestsInputDesktop
