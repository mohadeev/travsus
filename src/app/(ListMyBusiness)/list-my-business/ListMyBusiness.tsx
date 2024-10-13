'use client'

import React, { useState, useEffect } from 'react'
import { Form, Field } from 'react-final-form'
import { useRouter } from 'next/navigation'
import Input from '@/shared/Input'
import ButtonPrimary from '@/shared/ButtonPrimary'
import updateCompanyInfo from '@/utils/api-utils/updateCompanyInfo'

interface FormValues {
	name: string
	country: string
}

interface CompanyData {
	name: string
	country: string
}

const countries = [
	{ value: 'us', label: 'United States' },
	{ value: 'uk', label: 'United Kingdom' },
	{ value: 'ca', label: 'Canada' },
	{ value: 'au', label: 'Australia' },
	// Add more countries as needed
]

const ListMyBusiness: React.FC<{ companyData: CompanyData }> = ({
	companyData,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [submitSuccess, setSubmitSuccess] = useState(false)
	const router = useRouter()

	const { name, country } = companyData || {}

	useEffect(() => {
		if (submitSuccess) {
			const timer = setTimeout(() => {
				router.push('/dashboard/company')
			}, 3000)
			return () => clearTimeout(timer)
		}
	}, [submitSuccess, router])

	const onSubmit = async (values: FormValues) => {
		setIsSubmitting(true)
		setSubmitError(null)
		setSubmitSuccess(false)

		try {
			const data = await updateCompanyInfo(values)
			console.log('data:', data)
			setSubmitSuccess(true)
		} catch (error) {
			setSubmitError(
				'An error occurred while updating company information. Please try again.',
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	const validate = (values: FormValues) => {
		const errors: Partial<FormValues> = {}
		if (!values.name) errors.name = 'Company name is required'
		if (!values.country) errors.country = 'Country is required'
		return errors
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
			<div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
				<h1 className="mb-4 text-center text-3xl font-bold text-blue-600">
					🚀 Welcome to Your Business Journey!
				</h1>
				<p className="mb-6 text-center text-lg text-gray-700">
					We&apos;re thrilled to help you take the first step in showcasing your
					business to the world. Let&apos;s get your company registered and make
					your mark!
				</p>
				<h3 className="mb-2 text-center font-medium text-black">
					Company Information
				</h3>
				<p className="mb-6 text-center text-sm text-gray-600">
					All elements on this page are necessary to issue your invoices. No
					data will appear on your profile.
				</p>
				<Form
					onSubmit={onSubmit}
					initialValues={{ name, country }}
					validate={validate}
					render={({ handleSubmit, submitting, pristine }) => (
						<form onSubmit={handleSubmit} className="space-y-6">
							<Field name="name">
								{({ input, meta }) => (
									<div className="space-y-2">
										<label
											htmlFor="name"
											className="block text-sm font-medium text-gray-700"
										>
											Company Name
										</label>
										<Input
											{...input}
											id="name"
											type="text"
											placeholder="Acme Inc."
											className={`w-full ${meta.touched && meta.error ? 'border-red-500' : ''}`}
										/>
										{meta.touched && meta.error && (
											<p className="text-sm text-red-500">{meta.error}</p>
										)}
									</div>
								)}
							</Field>
							<Field name="country">
								{({ input, meta }) => (
									<div className="space-y-2">
										<label
											htmlFor="country"
											className="block text-sm font-medium text-gray-700"
										>
											Country of Establishment
										</label>
										<select
											{...input}
											id="country"
											className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
												meta.touched && meta.error ? 'border-red-500' : ''
											}`}
										>
											<option value="">Select a country</option>
											{countries.map((country) => (
												<option key={country.value} value={country.value}>
													{country.label}
												</option>
											))}
										</select>
										{meta.touched && meta.error && (
											<p className="text-sm text-red-500">{meta.error}</p>
										)}
									</div>
								)}
							</Field>
							<ButtonPrimary
								type="submit"
								className="w-full"
								disabled={submitting || pristine || isSubmitting}
							>
								{isSubmitting ? (
									<div className="flex items-center justify-center">
										<svg
											className="mr-3 h-5 w-5 animate-spin text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Launching...
									</div>
								) : (
									'🚀 Continue to Launch!'
								)}
							</ButtonPrimary>
						</form>
					)}
				/>
				{submitError && (
					<div className="mt-4 rounded-md bg-red-50 p-4">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-red-400"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<h3 className="text-sm font-medium text-red-800">Error</h3>
								<div className="mt-2 text-sm text-red-700">{submitError}</div>
							</div>
						</div>
					</div>
				)}
				{submitSuccess && (
					<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
						<div className="rounded-lg bg-white p-8 text-center">
							<div className="mb-4 text-6xl">🎉</div>
							<h2 className="mb-2 text-2xl font-bold text-green-600">
								Success!
							</h2>
							<p className="mb-4 text-gray-600">
								Your company information has been updated.
							</p>
							<p className="text-gray-500">
								Redirecting to dashboard in 3 seconds...
							</p>
							<div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
								<div className="h-full w-full animate-pulse bg-blue-500" />
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default ListMyBusiness
