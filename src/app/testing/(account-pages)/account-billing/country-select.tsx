import React from 'react'
import { Field } from 'react-final-form'

const countries = [
	{ value: 'ES', label: 'Spain' },
	{ value: 'FR', label: 'France' },
	{ value: 'DE', label: 'Germany' },
	{ value: 'IT', label: 'Italy' },
	{ value: 'MA', label: 'Morocco' },
]

export function CountrySelect(props: any) {
	const { options } = props
	console.log('options:', options)
	console.log('countries:', countries)
	return (
		<Field name="country">
			{({ input, meta }) => (
				<div>
					<label style={{ display: 'block', marginBottom: '5px' }}>
						Country:
					</label>
					<select {...input} style={{ width: '100%', padding: '5px' }}>
						<option value="">Select a country</option>
						{options?.slice(0, options.length)?.map((country: any) => (
							<option key={country.value} value={country.value}>
								{country.label}
							</option>
						))}
					</select>
					{meta.error && meta.touched && (
						<span style={{ color: 'red', fontSize: '12px' }}>{meta.error}</span>
					)}
				</div>
			)}
		</Field>
	)
}
