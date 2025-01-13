'use client'

import React from 'react'
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

const data = {
	cardHolder: 'John Doe',
	line1: '123 Test Street',
	line2: 'Apt 4B',
	city: 'Test City',
	state: 'Gipozcoa',
	postal_code: '20490',
	country: 'ES',
}

const NewCardForm: React.FC<NewCardFormProps> = ({
	onSubmit,
	loading,
	showButton,
}) => {
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
					<Field name="cardHolder" component="input">
						{({ input, meta }) => (
							<div>
								<Label htmlFor="cardHolder">Card Holder</Label>
								<Input
									{...input}
									id="cardHolder"
									type="text"
									required
									className="mt-1 block w-full"
									placeholder="Enter card holder name"
									//defaultValue={data.cardHolder} // Hardcoded value
								/>
							</div>
						)}
					</Field>
					<div className="space-y-4">
						<div className="flex flex-row gap-5">
							<Field name="line1" component="input">
								{({ input, meta }) => (
									<div className="w-1/2">
										<Label htmlFor="line1">Address Line 1</Label>
										<Input
											{...input}
											id="line1"
											type="text"
											required
											className="mt-1 block w-full"
											placeholder="Enter address line 1"
											//defaultValue={data.line1} // Hardcoded value
										/>
									</div>
								)}
							</Field>
							<Field name="line2" component="input">
								{({ input, meta }) => (
									<div className="w-1/2">
										<Label htmlFor="line2">Address Line 2</Label>
										<Input
											{...input}
											id="line2"
											type="text"
											className="mt-1 block w-full"
											placeholder="Enter address line 2 (optional)"
											//defaultValue={data.line2} // Hardcoded value
										/>
									</div>
								)}
							</Field>
						</div>
						<div className="flex flex-row gap-5">
							<Field name="city" component="input">
								{({ input, meta }) => (
									<div className="w-1/2">
										<Label htmlFor="city">City</Label>
										<Input
											{...input}
											id="city"
											type="text"
											required
											className="mt-1 block w-full"
											placeholder="Enter city"
											//defaultValue={data.city} // Hardcoded value
										/>
									</div>
								)}
							</Field>
							<Field name="state" component="input">
								{({ input, meta }) => (
									<div className="w-1/2">
										<Label htmlFor="state">State</Label>
										<Input
											{...input}
											id="state"
											type="text"
											required
											className="mt-1 block w-full"
											placeholder="Enter state"
											//defaultValue={data.state} // Hardcoded value
										/>
									</div>
								)}
							</Field>
						</div>
						<div className="flex flex-row gap-5">
							<Field name="postal_code" component="input">
								{({ input, meta }) => (
									<div className="w-1/2">
										<Label htmlFor="postal_code">Postal Code</Label>
										<Input
											{...input}
											id="postal_code"
											type="text"
											required
											className="mt-1 block w-full"
											placeholder="Enter postal code"
											//defaultValue={data.postal_code} // Hardcoded value
										/>
									</div>
								)}
							</Field>
							<Field name="country" component="input">
								{({ input, meta }) => (
									<div className="w-1/2">
										<Label htmlFor="country">Country</Label>
										<Input
											{...input}
											id="country"
											type="text"
											required
											className="mt-1 block w-full"
											placeholder="Enter country"
											//defaultValue={data.country} // Hardcoded value
										/>
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
