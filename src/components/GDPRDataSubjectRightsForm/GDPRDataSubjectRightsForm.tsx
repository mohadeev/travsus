'use client'

import React, { useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import PDFDocument from './PDFDocument'
import { companyProfile } from '@/constants/companyProfile'

const gdprRights = [
	{ value: 'access', label: 'Right of Access' },
	{ value: 'rectification', label: 'Right to Rectification' },
	{ value: 'object', label: 'Right to Object' },
	{ value: 'erasure', label: 'Right to Erasure ("Right to be Forgotten")' },
	{ value: 'restriction', label: 'Right to Restriction of Processing' },
	{ value: 'portability', label: 'Right to Data Portability' },
	{
		value: 'automated-decision',
		label: 'Right not to be Subject to Automated Decision-Making',
	},
]

export const GDPRDataSubjectRightsForm: React.FC = () => {
	const [formData, setFormData] = useState({
		gdprRight: '',
		customerType: '',
		otherCustomerType: '',
		firstName: '',
		surname: '',
		dateOfBirth: '',
		mobileNo: '',
		address: '',
		email: '',
		accountNumbers: '',
		requestDetails: '',
	})
	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log('Form submitted:', formData)
		setIsSubmitted(true)
	}

	return (
		<div className="flex min-h-screen flex-col justify-center bg-gray-100 py-6 sm:py-12">
			<div className="relative py-3 sm:mx-auto sm:max-w-xl">
				<div className="absolute inset-0 -skew-y-6 transform bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl"></div>
				<div className="relative bg-white px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20">
					<div className="mx-auto max-w-md">
						<div className="mb-8 flex items-center justify-between">
							<img
								src="https://www.travsus.com/_next/static/media/logo.d4fff429.png"
								alt="Travsus Logo"
								className="w-24"
							/>
							<div className="text-right">
								<h1 className="text-2xl font-semibold text-gray-800">
									GDPR - Data Subject Rights Form
								</h1>
								<p className="text-sm text-gray-600">Exercise Your Rights</p>
							</div>
						</div>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label
									htmlFor="gdprRight"
									className="block text-sm font-medium text-gray-700"
								>
									Select Your GDPR Right*
								</label>
								<select
									id="gdprRight"
									name="gdprRight"
									required
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
								>
									<option value="">Select a right</option>
									{gdprRights.map((right) => (
										<option key={right.value} value={right.label}>
											{right.label}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Customer Type
								</label>
								<div className="mt-2 space-x-4">
									{['Personal Customer', 'Business Customer', 'Other'].map(
										(type) => (
											<label key={type} className="inline-flex items-center">
												<input
													type="radio"
													name="customerType"
													value={type}
													onChange={handleInputChange}
													className="form-radio h-4 w-4 text-blue-600"
												/>
												<span className="ml-2 text-sm text-gray-700">
													{type}
												</span>
											</label>
										),
									)}
								</div>
							</div>
							{formData.customerType === 'Other' && (
								<div>
									<label
										htmlFor="otherCustomerType"
										className="block text-sm font-medium text-gray-700"
									>
										If other, please specify
									</label>
									<input
										type="text"
										name="otherCustomerType"
										id="otherCustomerType"
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									/>
								</div>
							)}
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<div>
									<label
										htmlFor="firstName"
										className="block text-sm font-medium text-gray-700"
									>
										First Name*
									</label>
									<input
										type="text"
										name="firstName"
										id="firstName"
										required
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									/>
								</div>
								<div>
									<label
										htmlFor="surname"
										className="block text-sm font-medium text-gray-700"
									>
										Surname*
									</label>
									<input
										type="text"
										name="surname"
										id="surname"
										required
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									/>
								</div>
								<div>
									<label
										htmlFor="dateOfBirth"
										className="block text-sm font-medium text-gray-700"
									>
										Date of Birth*
									</label>
									<input
										type="date"
										name="dateOfBirth"
										id="dateOfBirth"
										required
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									/>
								</div>
								<div>
									<label
										htmlFor="mobileNo"
										className="block text-sm font-medium text-gray-700"
									>
										Mobile No*
									</label>
									<input
										type="tel"
										name="mobileNo"
										id="mobileNo"
										required
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									/>
								</div>
							</div>
							<div>
								<label
									htmlFor="address"
									className="block text-sm font-medium text-gray-700"
								>
									Address*
								</label>
								<input
									type="text"
									name="address"
									id="address"
									required
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
								/>
							</div>
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700"
								>
									Email*
								</label>
								<input
									type="email"
									name="email"
									id="email"
									required
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
								/>
							</div>
							<div>
								<label
									htmlFor="accountNumbers"
									className="block text-sm font-medium text-gray-700"
								>
									Account and Policy Numbers
								</label>
								<textarea
									name="accountNumbers"
									id="accountNumbers"
									rows={3}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									placeholder="Please list all your account and policy numbers that are relevant to your request"
								></textarea>
							</div>
							<div>
								<label
									htmlFor="requestDetails"
									className="block text-sm font-medium text-gray-700"
								>
									Request Details*
								</label>
								<textarea
									name="requestDetails"
									id="requestDetails"
									rows={4}
									required
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									placeholder="Please provide specific details about your request"
								></textarea>
							</div>
							<div>
								<button
									type="submit"
									className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
								>
									Submit Request
								</button>
							</div>
						</form>
						{isSubmitted && (
							<div className="mt-6">
								<PDFDownloadLink
									document={<PDFDocument data={formData} />}
									fileName="gdpr_data_subject_rights_form.pdf"
									className="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
								>
									{({ blob, url, loading, error }) => {
										if (error) {
											console.error('Error generating PDF:', error)
											return 'Error generating PDF'
										}
										return loading ? 'Generating PDF...' : 'Download PDF'
									}}
								</PDFDownloadLink>
							</div>
						)}
						<div className="mt-6 text-center text-xs text-gray-500">
							<p>
								{companyProfile.fullLegalName} | {companyProfile.legalAddress}
							</p>
							<p>
								VAT: {companyProfile.vatNumber} | Reg. No:{' '}
								{companyProfile.registrationNumber}
							</p>
							<p className="mt-1">
								This form is your formal request to exercise your rights under
								GDPR.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default GDPRDataSubjectRightsForm
