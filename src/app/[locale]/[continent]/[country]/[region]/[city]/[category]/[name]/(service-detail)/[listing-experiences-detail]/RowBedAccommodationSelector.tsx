'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
	ChevronLeft,
	ChevronRight,
	UserPlusIcon,
	BedDoubleIcon,
	BedSingleIcon,
	UserIcon,
	UserRoundIcon,
	DoorClosedIcon as CloseIcon,
} from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

type AccommodationType = 'Standard' | 'Luxury'
type BedType = 'single' | 'twin' | 'couple'
type GuestType = 'adult' | 'child'

interface BedTypeInfo {
	name: string
	icon: React.ElementType
	minPeople: number
	maxPeople: number
}

const useClickOutside = (handler: () => void) => {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				handler()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [handler])

	return ref
}

interface BedTypeSelection {
	[key: string]: {
		adult: number
		child: number
	}
}

const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null)

	useEffect(() => {
		let modalElement = document.getElementById('modal-root')
		if (!modalElement) {
			modalElement = document.createElement('div')
			modalElement.id = 'modal-root'
			document.body.insertBefore(modalElement, document.body.firstChild)
		}
		setModalRoot(modalElement)

		return () => {
			if (modalElement && modalElement.parentNode) {
				modalElement.parentNode.removeChild(modalElement)
			}
		}
	}, [])

	return modalRoot ? createPortal(children, modalRoot) : null
}

interface BedTypeSelectorProps {
	accommodationType: AccommodationType
	onChange: (
		accommodationType: AccommodationType,
		selection: BedTypeSelection,
	) => void
	defaultValue: BedTypeSelection | null | undefined
}

const BedTypeSelector: React.FC<BedTypeSelectorProps> = ({
	accommodationType,
	onChange,
	defaultValue,
}) => {
	const t = useTranslations("app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_RowBedAccommodationSelector");

	const bedTypes: Record<BedType, BedTypeInfo> = {
		single: {
			name: t('Single_Bed'),
			icon: BedSingleIcon,
			minPeople: 1,
			maxPeople: 1,
		},
		twin: { name: t('Twin_Beds'), icon: BedSingleIcon, minPeople: 1, maxPeople: 2 },
		couple: {
			name: t('Couple_Bed'),
			icon: BedDoubleIcon,
			minPeople: 1,
			maxPeople: 2,
		},
	}

	const [selectedBedType, setSelectedBedType] = useState<BedType>('single')
	const [bedCount, setBedCount] = useState<BedTypeSelection>(
		defaultValue || {
			single: { adult: 0, child: 0 },
			twin: { adult: 0, child: 0 },
			couple: { adult: 0, child: 0 },
		},
	)
	useEffect(() => {
		setBedCount(
			defaultValue || {
				single: { adult: 0, child: 0 },
				twin: { adult: 0, child: 0 },
				couple: { adult: 0, child: 0 },
			},
		)
	}, [defaultValue])
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const totalBeds = Object.values(bedCount).reduce(
		(sum, count) => sum + (count?.adult || 0) + (count?.child || 0),
		0,
	)
	const totalPeople = Object.entries(bedCount).reduce((sum, [type, count]) => {
		return (
			sum +
			((count?.adult || 0) + (count?.child || 0)) *
				bedTypes[type as BedType].maxPeople
		)
	}, 0)

	const handlePrev = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex > 0 ? prevIndex - 1 : Object.keys(bedTypes).length - 1,
		)
	}

	const handleNext = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex < Object.keys(bedTypes).length - 1 ? prevIndex + 1 : 0,
		)
	}

	const handleBedCountChange = (
		type: BedType,
		guestType: GuestType,
		value: number,
	) => {
		const newBedCount = {
			...bedCount,
			[type]: {
				...bedCount[type],
				[guestType]: Math.max(0, value),
			},
		}
		setBedCount(newBedCount)
		onChange(accommodationType, newBedCount)
	}

	useEffect(() => {
		setSelectedBedType(Object.keys(bedTypes)[currentIndex] as BedType)
	}, [currentIndex])

	return (
		<div className="relative flex flex-col">
			<button
				onClick={() => setIsModalOpen(true)}
				className="flex items-center space-x-3 rounded-2xl border border-b border-l border-r border-t border-neutral-200 p-3 text-left focus:outline-none"
			>
				<div className="text-neutral-300 dark:text-neutral-400">
					<UserPlusIcon className="h-5 w-5 lg:h-7 lg:w-7" />
				</div>
				<div className="flex-grow">
					<span className="block font-semibold xl:text-lg">
						{totalBeds || ''} {t('Beds')} - {accommodationType}
					</span>
					<span className="mt-1 block text-sm font-light leading-none text-neutral-400">
						{totalPeople ? `${totalPeople} ${t('People')}` : t('Select_Beds')}
					</span>
				</div>
			</button>

			<AnimatePresence>
				{isModalOpen && (
					<ModalPortal>
						<div className="fixed inset-0 z-[9999]">
							<div className="flex h-full">
								<motion.div
									initial={{ opacity: 0, translateY: '100%' }}
									animate={{ opacity: 1, translateY: 0 }}
									exit={{ opacity: 0, translateY: '100%' }}
									transition={{ duration: 0.3 }}
									className="fixed inset-0 flex flex-col justify-between overflow-hidden bg-white"
								>
									<div className="absolute left-4 top-4 z-10">
										<button
											onClick={() => setIsModalOpen(false)}
											className="focus:outline-none focus:ring-0"
										>
											<CloseIcon className="h-5 w-5 text-black" />
										</button>
									</div>

									<div className="flex flex-1 flex-col overflow-hidden p-1 pb-16 pt-12">
										<div className="flex flex-1 animate-[myblur_0.4s_ease-in-out] flex-col overflow-auto transition-opacity">
											<div className="relative z-10 flex flex-1 overflow-y-auto">
												<div className="w-full p-6">
													<h2 className="mb-6 text-2xl font-bold">
														{t('Select_Beds_Title')}
													</h2>
													<div className="relative mb-4 h-[150px] overflow-hidden">
														<AnimatePresence
															initial={false}
															custom={currentIndex}
														>
															<motion.div
																key={currentIndex}
																custom={currentIndex}
																variants={{
																	enter: (direction) => ({
																		x: direction > 0 ? '100%' : '-100%',
																		opacity: 0,
																	}),
																	center: { x: 0, opacity: 1 },
																	exit: (direction) => ({
																		x: direction < 0 ? '100%' : '-100%',
																		opacity: 0,
																	}),
																}}
																initial="enter"
																animate="center"
																exit="exit"
																transition={{
																	type: 'tween',
																	ease: 'easeInOut',
																	duration: 0.3,
																}}
																className="absolute inset-0 flex items-center justify-center"
															>
																<div className="flex w-full flex-col items-center justify-between rounded-lg border p-4">
																	{React.createElement(
																		bedTypes[selectedBedType].icon,
																		{
																			className: 'h-16 w-16 mb-2',
																		},
																	)}
																	<span className="text-sm font-medium">
																		{bedTypes[selectedBedType].name}
																	</span>
																	<span className="mt-1 text-xs">
																		{bedTypes[selectedBedType].minPeople} -{' '}
																		{bedTypes[selectedBedType].maxPeople} {t('People')}
																	</span>
																</div>
															</motion.div>
														</AnimatePresence>
														<button
															onClick={handlePrev}
															className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
															aria-label={t('Previous_Bed_Type')}
														>
															<ChevronLeft className="h-6 w-6" />
														</button>
														<button
															onClick={handleNext}
															className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
															aria-label={t('Next_Bed_Type')}
														>
															<ChevronRight className="h-6 w-6" />
														</button>
													</div>

													<div className="mt-4 flex justify-center space-x-2">
														{Object.keys(bedTypes).map((_, index) => (
															<button
																key={index}
																onClick={() => setCurrentIndex(index)}
																className={`h-2 w-2 rounded-full ${
																	currentIndex === index
																		? 'bg-black'
																		: 'bg-gray-300'
																}`}
																aria-label={`${t('Go_To_Bed_Type')} ${index + 1}`}
															/>
														))}
													</div>

													<div className="mt-4">
														{Object.entries(bedTypes).map(([type, info]) => (
															<div
																key={type}
																className="mb-4 flex flex-col items-start justify-between"
															>
																<span className="mb-2 font-medium">
																	{info.name}
																</span>
																<div className="flex w-full items-center justify-between">
																	<div className="flex items-center">
																		<UserIcon className="mr-2 h-5 w-5" />
																		<span>{t('Adults')}</span>
																	</div>
																	<div className="flex items-center">
																		<button
																			onClick={() =>
																				handleBedCountChange(
																					type as BedType,
																					'adult',
																					(bedCount[type]?.adult || 0) - 1,
																				)
																			}
																			className="rounded-l-md border border-black bg-white px-2 py-1 text-black hover:bg-gray-100"
																		>
																			-
																		</button>
																		<span className="border-y border-black bg-white px-4 py-1 text-black">
																			{bedCount[type]?.adult || 0}
																		</span>
																		<button
																			onClick={() =>
																				handleBedCountChange(
																					type as BedType,
																					'adult',
																					(bedCount[type]?.adult || 0) + 1,
																				)
																			}
																			className="rounded-r-md border border-black bg-white px-2 py-1 text-black hover:bg-gray-100"
																		>
																			+
																		</button>
																	</div>
																</div>
																<div className="mt-2 flex w-full items-center justify-between">
																	<div className="flex items-center">
																		<UserRoundIcon className="mr-2 h-5 w-5" />
																		<span>{t('Children')}</span>
																	</div>
																	<div className="flex items-center">
																		<button
																			onClick={() =>
																				handleBedCountChange(
																					type as BedType,
																					'child',
																					(bedCount[type]?.child || 0) - 1,
																				)
																			}
																			className="rounded-l-md border border-black bg-white px-2 py-1 text-black hover:bg-gray-100"
																		>
																			-
																		</button>
																		<span className="border-y border-black bg-white px-4 py-1 text-black">
																			{bedCount[type]?.child || 0}
																		</span>
																		<button
																			onClick={() =>
																				handleBedCountChange(
																					type as BedType,
																					'child',
																					(bedCount[type]?.child || 0) + 1,
																				)
																			}
																			className="rounded-r-md border border-black bg-white px-2 py-1 text-black hover:bg-gray-100"
																		>
																			+
																		</button>
																	</div>
																</div>
															</div>
														))}
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="flex justify-between border-t border-neutral-200 bg-white px-4 py-3">
										<button
											onClick={() => setIsModalOpen(false)}
											className="rounded-full border border-black bg-white px-4 py-2 text-black hover:bg-gray-100"
										>
											{t('Cancel')}
										</button>
										<button
											onClick={() => setIsModalOpen(false)}
											className="rounded-full border border-black bg-black px-4 py-2 text-white hover:bg-gray-800"
										>
											{t('OK')}
										</button>
									</div>
								</motion.div>
							</div>
						</div>
					</ModalPortal>
				)}
			</AnimatePresence>
		</div>
	)
}

interface RowBedAccommodationSelectorProps {
	onChange: (selection: Record<AccommodationType, BedTypeSelection>) => void
	defaultValue: Record<AccommodationType, BedTypeSelection> | null | undefined
}

const RowBedAccommodationSelector: React.FC<
	RowBedAccommodationSelectorProps
> = ({ onChange, defaultValue }) => {
	const accommodationTypes: AccommodationType[] = ['Standard', 'Luxury']
	
	const [selection, setSelection] = useState<
		Record<AccommodationType, BedTypeSelection>
	>(
		defaultValue || {
			Standard: {
				single: { adult: 0, child: 0 },
				twin: { adult: 0, child: 0 },
				couple: { adult: 0, child: 0 },
			},
			Luxury: {
				single: { adult: 0, child: 0 },
				twin: { adult: 0, child: 0 },
				couple: { adult: 0, child: 0 },
			},
		},
	)
	useEffect(() => {
		setSelection(
			defaultValue || {
				Standard: {
					single: { adult: 0, child: 0 },
					twin: { adult: 0, child: 0 },
					couple: { adult: 0, child: 0 },
				},
				Luxury: {
					single: { adult: 0, child: 0 },
					twin: { adult: 0, child: 0 },
					couple: { adult: 0, child: 0 },
				},
			},
		)
	}, [defaultValue])

	const handleChange = (
		accommodationType: AccommodationType,
		bedSelection: BedTypeSelection,
	) => {
		const newSelection = { ...selection, [accommodationType]: bedSelection }
		setSelection(newSelection)
		onChange(newSelection)
	}

	return (
		<div className="mx-full max-w-2xl p-4">
			<div className="space-y-4">
				{accommodationTypes.map((type) => (
					<BedTypeSelector
						key={type}
						accommodationType={type}
						onChange={handleChange}
						defaultValue={selection[type]}
					/>
				))}
			</div>
		</div>
	)
}

export default RowBedAccommodationSelector