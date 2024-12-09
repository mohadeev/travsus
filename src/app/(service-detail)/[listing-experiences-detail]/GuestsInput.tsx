'use client'

import React, { Fragment, FC } from 'react'
import { Popover, Transition } from '@headlessui/react'
import NcInputNumber from '@/components/NcInputNumber'
import { UserPlusIcon } from '@heroicons/react/24/outline'
import ClearDataButton from '@/app/(client-components)/(HeroSearchForm)/ClearDataButton'

export interface GuestsObject {
	guestAdults: number
	guestChildren: number
}

export interface GuestsInputProps {
	className?: string
	onChange: (value: { guests: GuestsObject }) => void
	defaultValue: GuestsObject
}

const GuestsInput: FC<GuestsInputProps> = ({
	className = 'flex-1',
	onChange,
	defaultValue,
}) => {
	const totalGuests = defaultValue.guestAdults + defaultValue.guestChildren

	const handleChangeData = (value: number, type: keyof GuestsObject) => {
		const newValue = {
			...defaultValue,
			[type]: value,
		}
		return { guests: newValue }
	}

	const handleClearData = () => {
		onChange({ guests: { guestAdults: 0, guestChildren: 0 } })
	}

	return (
		<Popover className={`relative flex ${className}`}>
			{({ open }) => (
				<>
					<div
						className={`flex flex-1 items-center rounded-b-3xl focus:outline-none ${
							open ? 'shadow-lg' : ''
						}`}
					>
						<Popover.Button
							className={`relative z-10 flex flex-1 items-center space-x-3 p-3 text-left focus:outline-none`}
						>
							<div className="text-neutral-300 dark:text-neutral-400">
								<UserPlusIcon className="h-5 w-5 lg:h-7 lg:w-7" />
							</div>
							<div className="flex-grow">
								<span className="block font-semibold xl:text-lg">
									{totalGuests || ''} Guests
								</span>
								<span className="mt-1 block text-sm font-light leading-none text-neutral-400">
									{totalGuests ? 'Guests' : 'Add guests'}
								</span>
							</div>

							{!!totalGuests && open && (
								<ClearDataButton onClick={handleClearData} />
							)}
						</Popover.Button>
					</div>

					<Transition
						as={Fragment}
						enter="transition ease-out duration-200"
						enterFrom="opacity-0 translate-y-1"
						enterTo="opacity-100 translate-y-0"
						leave="transition ease-in duration-150"
						leaveFrom="opacity-100 translate-y-0"
						leaveTo="opacity-0 translate-y-1"
					>
						<Popover.Panel className="absolute right-0 top-full z-10 mt-3 w-full max-w-sm rounded-3xl bg-white px-4 py-5 shadow-xl ring-1 ring-black ring-opacity-5 dark:bg-neutral-800 sm:min-w-[340px] sm:px-8 sm:py-6">
							<NcInputNumber
								className="w-full"
								defaultValue={defaultValue.guestAdults}
								onChange={(value) =>
									onChange(handleChangeData(value, 'guestAdults'))
								}
								label="Adults"
								desc="Ages 13 or above"
							/>
							<NcInputNumber
								className="mt-6 w-full"
								defaultValue={defaultValue.guestChildren}
								onChange={(value) =>
									onChange(handleChangeData(value, 'guestChildren'))
								}
								label="Children"
								desc="Ages 1–13"
							/>
						</Popover.Panel>
					</Transition>
				</>
			)}
		</Popover>
	)
}

export default GuestsInput
