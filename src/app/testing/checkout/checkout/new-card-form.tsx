'use client'

import React, { useEffect, useState } from 'react'
import { Form, Field } from 'react-final-form'
import { CardElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Spinner from '@/components/ui/Spinner'

interface NewCardFormProps {
	onSubmit: (formData: any) => void
	loading: boolean
	showButton?: boolean
}

const NewCardForm: React.FC<NewCardFormProps> = ({
	onSubmit,
	loading,
	showButton,
}) => {
	const [countries, setCountries] = useState<{ code: string; name: string }[]>(
		[],
	)

	useEffect(() => {
		const fetchCountries = async () => {
			try {
				const response = await fetch('/api/location/get/all-countries')
				const data = await response.json()
				setCountries(data.counties || []) // Fallback to empty array if no data
			} catch (error) {
				console.error('Error fetching countries:', error)
			}
		}

		fetchCountries()
	}, [])

	return (
		<Form
			onSubmit={onSubmit}
			render={({ handleSubmit }) => (
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="cardNumber">Card Details</Label>
						<CardElement
							id="cardNumber"
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
						/>
					</div>

					<Field name="cardHolder">
						{({ input }) => (
							<div>
								<Label htmlFor="cardHolder">Card Holder</Label>
								<Input
									{...input}
									id="cardHolder"
									type="text"
									required
									className="mt-1 block w-full"
									placeholder="Enter card holder name"
								/>
							</div>
						)}
					</Field>

					<div className="space-y-4">
						<div className="flex flex-row gap-5">
							<Field name="line1">
								{({ input }) => (
									<div className="w-1/2">
										<Label htmlFor="line1">Address Line 1</Label>
										<Input
											{...input}
											id="line1"
											type="text"
											required
											className="mt-1 block w-full"
											placeholder="Enter address line 1"
										/>
									</div>
								)}
							</Field>
							<Field name="line2">
								{({ input }) => (
									<div className="w-1/2">
										<Label htmlFor="line2">Address Line 2</Label>
										<Input
											{...input}
											id="line2"
											type="text"
											className="mt-1 block w-full"
											placeholder="Enter address line 2 (optional)"
										/>
									</div>
								)}
							</Field>
						</div>

						<div className="flex flex-row gap-5">
							<Field name="city">
								{({ input }) => (
									<div className="w-1/2">
										<Label htmlFor="city">City</Label>
										<Input
											{...input}
											id="city"
											type="text"
											required
											className="mt-1 block w-full"
											placeholder="Enter city"
										/>
									</div>
								)}
							</Field>
							<Field name="state">
								{({ input }) => (
									<div className="w-1/2">
										<Label htmlFor="state">State</Label>
										<Input
											{...input}
											id="state"
											type="text"
											required
											className="mt-1 block w-full"
											placeholder="Enter state"
										/>
									</div>
								)}
							</Field>
						</div>

						<div className="flex flex-row gap-5">
							<Field name="postal_code">
								{({ input }) => (
									<div className="w-1/2">
										<Label htmlFor="postal_code">Postal Code</Label>
										<Input
											{...input}
											id="postal_code"
											type="text"
											required
											className="mt-1 block w-full"
											placeholder="Enter postal code"
										/>
									</div>
								)}
							</Field>

							{/* Country Dropdown */}
							<Field name="country">
								{({ input }) => (
									<div className="w-1/2">
										<Label htmlFor="country">Country</Label>
										<select
											{...input}
											id="country"
											required
											className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
										>
											<option value="">Select a country</option>
											{countries.map((country) => (
												<option key={country.code} value={country.code}>
													{country.name}
												</option>
											))}
										</select>
									</div>
								)}
							</Field>
						</div>
					</div>

					{showButton && (
						<Button className="w-full" type="submit" disabled={loading}>
							{loading ? 'Processing...' : 'Add New Card'}
						</Button>
					)}
				</form>
			)}
		/>
	)
}

export default NewCardForm
