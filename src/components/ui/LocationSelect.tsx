import FieldSelectFormItem from '@/app/add-listing/FieldSelectFormItem'
import allCountries from '@/constants/allCountries'
import React from 'react'

const LocationSelect = (props: any) => {
	return (
		<>
			{props.name}
			<FieldSelectFormItem
				{...props}
				name={props.name}
				options={allCountries.map((country: any) => ({
					label: country?.name?.common,
					value: country?.cca3,
				}))}
			/>
		</>
	)
}

export default LocationSelect
