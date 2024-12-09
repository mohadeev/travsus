import React, { FC } from 'react'
import LocationInput from '../LocationInput'
import PriceRangeInput from './PriceRangeInput'
import PropertyTypeSelect from './PropertyTypeSelect'

export interface RealEstateSearchFormProps {}

const RealEstateSearchForm: FC<RealEstateSearchFormProps> = ({}) => {
	const renderForm = () => {
		return (
			<form className="relative flex w-full flex-col divide-y divide-neutral-200 rounded-3xl bg-white shadow-xl dark:divide-neutral-700 dark:bg-neutral-800 dark:shadow-2xl lg:flex-row lg:items-center lg:divide-y-0 lg:rounded-full xl:mt-8">
				<LocationInput className="flex-[1.5]" />
				<div className="h-8 self-center border-r border-slate-200 dark:border-slate-700"></div>
				<PropertyTypeSelect />
				<div className="h-8 self-center border-r border-slate-200 dark:border-slate-700"></div>
				<PriceRangeInput />
			</form>
		)
	}

	return renderForm()
}

export default RealEstateSearchForm
