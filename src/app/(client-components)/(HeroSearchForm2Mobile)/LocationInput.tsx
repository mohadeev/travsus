'use client'

import { useTranslations } from '@/lib/i18n'
import { searchCountries } from '@/utils/searchCountries'
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useState, useEffect, useRef, FC } from 'react'

interface Props {
	onClick?: () => void
	onChange?: (value: string) => void
	className?: string
	defaultValue?: string
	headingText?: string
}

const LocationInput: FC<Props> = ({
	onChange = () => {},
	className = '',
	defaultValue = '',
	headingText = '',
}) => {
	const t = useTranslations("app_clientcomponents_HeroSearchForm2Mobile_LocationInput");
	const [value, setValue] = useState<any>({})
	const containerRef = useRef(null)
	const inputRef = useRef(null)

	useEffect(() => {
		setValue(defaultValue || t('app_clientcomponents_HeroSearchForm2Mobile_LocationInput_Default_Country'))
	}, [defaultValue, t])

	const handleSelectLocation = (item: any) => {
		// DO NOT REMOVE SETTIMEOUT FUNC
		setTimeout(() => {
			setValue(item)
			onChange && onChange(item.name)
		}, 0)
	}

	const renderSearchValues = ({
		heading,
		items,
	}: {
		heading: any
		items: any
	}) => {
		return (
			<>
				<p className="block text-base font-semibold">
					{heading || t('app_clientcomponents_HeroSearchForm2Mobile_LocationInput_Destinations_Heading')}
				</p>
				<div className="mt-3">
					{items?.map((item: any) => {
						return (
							<div
								className="mb-1 flex items-center space-x-3 py-2 text-sm"
								onClick={() => handleSelectLocation(item)}
								key={item.name}
							>
								<MapPinIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
								<span className="">{item?.name}</span>
							</div>
						)
					})}
				</div>
			</>
		)
	}
	const [searchResulte, setSearchResulte] = useState([])
	const handleChangeInput = async (e: any) => {
		const value = e.target.value
		setValue(e.currentTarget.value)
		const newSearchCountries: any = await searchCountries({ placeName: value })
		setSearchResulte(newSearchCountries)
	}

	return (
		<div className={`${className}`} ref={containerRef}>
			<div className="p-5">
				<span className="block text-xl font-semibold sm:text-2xl">
					{headingText || t('app_clientcomponents_HeroSearchForm2Mobile_LocationInput_Where_To_Heading')}
				</span>
				<div className="relative mt-5">
					<input
						className={`block w-full truncate rounded-xl border border-neutral-900 bg-transparent px-4 py-3 pr-12 text-base font-bold leading-none placeholder-neutral-500 placeholder:truncate focus:outline-none focus:ring-0 dark:border-neutral-200 dark:placeholder-neutral-300`}
						placeholder={t('app_clientcomponents_HeroSearchForm2Mobile_LocationInput_Search_Placeholder')}
						value={value}
						onChange={handleChangeInput}
						ref={inputRef}
					/>
					<span className="absolute right-2.5 top-1/2 -translate-y-1/2">
						<MagnifyingGlassIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-400" />
					</span>
				</div>
				<div className="mt-7">
					{value
						? renderSearchValues({
								heading: t('app_clientcomponents_HeroSearchForm2Mobile_LocationInput_Locations_Heading'),
								items: searchResulte,
							})
						: renderSearchValues({
								heading: t('app_clientcomponents_HeroSearchForm2Mobile_LocationInput_Popular_Destinations_Heading'),
								items: [
									{ name: t('app_clientcomponents_HeroSearchForm2Mobile_LocationInput_Country_Morocco') },
									{ name: t('app_clientcomponents_HeroSearchForm2Mobile_LocationInput_Country_Australia') },
									{ name: t('app_clientcomponents_HeroSearchForm2Mobile_LocationInput_Country_Canada') },
									{ name: t('app_clientcomponents_HeroSearchForm2Mobile_LocationInput_Country_Germany') },
									{ name: t('app_clientcomponents_HeroSearchForm2Mobile_LocationInput_Country_United_Kingdom') },
									{ name: t('app_clientcomponents_HeroSearchForm2Mobile_LocationInput_Country_United_Arab_Emirates') },
								],
							})}
				</div>
			</div>
		</div>
	)
}

export default LocationInput