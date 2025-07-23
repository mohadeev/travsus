'use client'

import React from 'react'
import { Form } from 'react-final-form'
import { CountrySelect } from './country-select'

export default function CountrySelectForm() {
	const [selectedCountry, setSelectedCountry] = React.useState<string>('Spain')

	const onSubmit = (values: { country: string }) => {
		const selected = countries.find(
			(country) => country.value === values.country,
		)
		setSelectedCountry(selected ? selected.label : '')
	}

	const validate = (values: { country: string }) => {
		const errors: { country?: string } = {}
		if (!values.country) {
			errors.country = 'Please select a country'
		}
		return errors
	}

	return (
		<div style={{ maxWidth: '300px', margin: '20px auto' }}>
			<Form
				onSubmit={onSubmit}
				validate={validate}
				initialValues={{ country: 'ES' }}
				render={({ handleSubmit }) => (
					<form onSubmit={handleSubmit}>
						<CountrySelect />
						<button
							type="submit"
							style={{ marginTop: '10px', padding: '5px 10px' }}
						>
							Submit
						</button>
					</form>
				)}
			/>
			<p style={{ marginTop: '20px' }}>Selected country: {selectedCountry}</p>
		</div>
	)
}

const countries = [
	{ value: 'ES', label: 'Spain' },
	{ value: 'FR', label: 'France' },
	{ value: 'DE', label: 'Germany' },
	{ value: 'IT', label: 'Italy' },
]
