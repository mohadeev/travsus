'use client'

import React, { useState, useRef, useEffect, FC } from 'react'
import ClearDataButton from './ClearDataButton'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { searchCountries } from '@/utils/searchCountries'
import { useTranslations } from '@/lib/i18n'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export interface LocationInputDesktopProps {
	onInputDone?: (value: string) => void
	placeHolder?: string
	desc?: string
	className?: string
	divHideVerticalLineClass?: string
	autoFocus?: boolean
}

const LocationInputDesktop: FC<LocationInputDesktopProps> = ({
	autoFocus = false,
	onInputDone,
	placeHolder,
	desc,
	className = 'nc-flex-1.5',
	divHideVerticalLineClass = 'left-10 -right-0.5',
}) => {
	const locationT = useTranslations('location_input')
	const containerRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const [searchResulte, setSearchResulte] = useState([])
	const [value, setValue] = useState('')
	const [showPopover, setShowPopover] = useState(autoFocus)

	useEffect(() => {
		setShowPopover(autoFocus)
		if (autoFocus && !!inputRef.current) {
			setTimeout(() => {
				inputRef.current && inputRef.current.focus()
			}, 200)
		}
	}, [autoFocus])

	useOutsideAlerter(containerRef, () => {
		setShowPopover(false)
	})

	useEffect(() => {
		if (showPopover && inputRef.current) {
			inputRef.current.focus()
		}
	}, [showPopover])

	const handleSelectLocation = (item: string) => {
		setValue(item)
		onInputDone && onInputDone(item)
		setShowPopover(false)
	}

	const renderRecentSearches = () => {
		return (
			<>
				<h3 className="mt-2 block px-4 text-base font-semibold text-neutral-800 dark:text-neutral-100 sm:mt-0 sm:px-8">
					{locationT('location_Recent_Searches')}
				</h3>
				<div className="mt-2">
					{/* {[
						'Hamptons, Suffolk County, NY',
						'Las Vegas, NV, United States lksklvs',
						'Ueno, Taito, Tokyo',
						'Ikebukuro, Toshima, Tokyo',
					].map((item) => (
						<span
							onClick={() => handleSelectLocation(item)}
							key={item}
							className="flex cursor-pointer items-center space-x-3 px-4 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 sm:px-6"
						>
							<span className="block text-neutral-400">
								<MapPinIcon className="h-4 w-4 sm:h-6 sm:w-6" />
							</span>
							<span className="block text-neutral-700 dark:text-neutral-200">
								{item}
							</span>
						</span>
					))} */}
				</div>
			</>
		)
	}

	const renderSearchValue = () => {
		return (
			<>
				{searchResulte?.map((item: any) => (
					<span
						onClick={() => handleSelectLocation(item?.place_name)}
						key={item?.place_name}
						className="flex cursor-pointer items-center space-x-3 px-4 py-4 hover:bg-neutral-100 dark:hover:bg-neutral-700 sm:px-6"
					>
						<span className="block text-neutral-400">
							<MapPinIcon className="h-4 w-4 sm:h-6 sm:w-6" />
						</span>
						<span className="block text-neutral-700 dark:text-neutral-200">
							{item?.place_name}
						</span>
					</span>
				))}
			</>
		)
	}
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()

	function handleSearch(term: string) {
		const params = new URLSearchParams(searchParams)
		if (term) {
			params.set('query', term)
		}
		replace(`${pathname}?${params.toString()}`)
	}

	const handleChangeInput = async (e: any) => {
		const value = e.target.value
		console.log('here', e.target.value)
		handleSearch(e.target.value)
		setValue(e.currentTarget.value)
		const newSearchCountries: any = await searchCountries({ placeName: value })
		setSearchResulte(newSearchCountries)
	}

	return (
		<div className={`relative flex ${className}`} ref={containerRef}>
			<div
				onClick={() => setShowPopover(true)}
				className={`[ nc-hero-field-padding--small ] relative z-10 flex flex-1 flex-shrink-0 cursor-pointer items-center space-x-3 text-left focus:outline-none ${
					showPopover ? 'nc-hero-field-focused--2' : ''
				}`}
			>
				<div className="flex-1">
					<input
						className={`block w-full truncate border-none bg-transparent p-0 font-semibold placeholder-neutral-800 focus:placeholder-neutral-400 focus:outline-none focus:ring-0 dark:placeholder-neutral-200 xl:text-base`}
						placeholder={locationT('location_Placeholder')}
						value={value}
						autoFocus={showPopover}
						onChange={handleChangeInput}
						ref={inputRef}
						// name="location"
					/>
					<span className="mt-0.5 block text-sm font-light text-neutral-400">
						<span className="line-clamp-1">
							{!!value
								? locationT('location_Placeholder')
								: locationT('location_Description')}
						</span>
					</span>
					{value && showPopover && (
						<ClearDataButton onClick={() => setValue('')} />
					)}
				</div>
			</div>

			{showPopover && (
				<div
					className={`absolute top-1/2 z-0 h-8 -translate-y-1/2 self-center bg-white dark:bg-neutral-800 ${divHideVerticalLineClass}`}
				></div>
			)}

			{showPopover && (
				<div className="absolute left-0 top-full z-40 mt-3 max-h-96 w-full min-w-[300px] overflow-y-auto rounded-3xl bg-white py-3 shadow-xl dark:bg-neutral-800 sm:min-w-[400px] sm:py-5">
					{value ? renderSearchValue() : renderRecentSearches()}
				</div>
			)}
		</div>
	)
}

export default LocationInputDesktop
