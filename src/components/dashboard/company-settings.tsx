'use client'

import type React from 'react'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
	Building2,
	Mail,
	Phone,
	MapPin,
	Globe,
	FileText,
	Landmark,
	CreditCard,
	User,
	Shield,
	AlertCircle,
	ChevronRight,
	Loader2,
} from 'lucide-react'

type InfoItem = {
	id: string
	title: string
	value: string
	description?: string
	icon: React.ElementType
}

export function CompanySettings() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [editingField, setEditingField] = useState<string | null>(null)
	const router = useRouter()

	// Form data state
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phoneNumber: '',
		address: '',
		country: '',
		registrationNumber: '',
		bankName: '',
		accountNumber: '',
		adminName: '',
	})

	// Fetch company data on component mount
	useEffect(() => {
		const fetchCompanyData = async () => {
			setIsLoading(true)
			setError(null)
			try {
				const response = await fetch('/api/dashboard/company/company-data')

				if (response.status === 404) {
					// No company found, redirect to list-my-business page
					router.push('/list-my-business')
					return
				}

				if (!response.ok) {
					throw new Error('Failed to fetch company data')
				}

				const data = await response.json()

				// If data is empty or doesn't have required fields, redirect
				if (!data || (!data.name && !data.email && !data.phoneNumber)) {
					router.push('/list-my-business')
					return
				}

				// Update form values with fetched data
				setFormData({
					name: data.name || '',
					email: data.email || '',
					phoneNumber: data.phoneNumber || '',
					address: data.address || '',
					country: data.country || '',
					registrationNumber: data.registrationNumber || '',
					bankName: data.bankName || '',
					accountNumber: data.accountNumber || '',
					adminName: data.adminName || '',
				})
			} catch (err) {
				setError('Failed to load company data. Please try again later.')
				console.error(err)
			} finally {
				setIsLoading(false)
			}
		}

		fetchCompanyData()
	}, [router])

	// Handle form input changes
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value,
		})
	}

	// Save changes for the current editing field
	const handleSave = async (fieldId: string) => {
		setIsLoading(true)
		try {
			// Create an object with just the field being updated
			const updatedData: Record<string, string> = {}

			switch (fieldId) {
				case 'companyName':
					updatedData.name = formData.name
					break
				case 'country':
					updatedData.country = formData.country
					break
				case 'email':
					updatedData.email = formData.email
					break
				case 'phoneNumber':
					updatedData.phoneNumber = formData.phoneNumber
					break
				case 'adminName':
					updatedData.adminName = formData.adminName
					break
				case 'address':
					updatedData.address = formData.address
					break
				case 'registrationNumber':
					updatedData.registrationNumber = formData.registrationNumber
					break
				case 'bankName':
					updatedData.bankName = formData.bankName
					break
				case 'accountNumber':
					updatedData.accountNumber = formData.accountNumber
					break
				default:
					break
			}

			const response = await fetch('/api/dashboard/company/company-edit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedData),
			})

			if (!response.ok) {
				throw new Error('Failed to update company data')
			}

			// Close the edit form
			setEditingField(null)
		} catch (err) {
			setError('Failed to update company settings. Please try again.')
			console.error(err)
		} finally {
			setIsLoading(false)
		}
	}

	// Cancel editing
	const handleCancel = () => {
		setEditingField(null)
	}

	// Company info items
	const companyInfoItems: InfoItem[] = [
		{
			id: 'companyName',
			title: 'Company Name',
			value: formData.name || 'Not provided',
			icon: Building2,
		},
		{
			id: 'country',
			title: 'Country',
			value: formData.country || 'Not provided',
			icon: Globe,
		},
		{
			id: 'email',
			title: 'Email address',
			value: formData.email || 'Not provided',
			icon: Mail,
		},
		{
			id: 'phoneNumber',
			title: 'Phone number',
			value: formData.phoneNumber || 'Not provided',
			icon: Phone,
		},
		{
			id: 'adminName',
			title: 'Admin Name',
			value: formData.adminName || 'Not provided',
			icon: User,
		},
		{
			id: 'address',
			title: 'Address',
			value: formData.address || 'Not provided',
			icon: MapPin,
		},
		{
			id: 'registrationNumber',
			title: 'Registration Number',
			value: formData.registrationNumber || 'Not provided',
			description: "Your company's registration number (optional).",
			icon: FileText,
		},
		{
			id: 'bankName',
			title: 'Bank Name',
			value: formData.bankName || 'Not provided',
			icon: Landmark,
		},
		{
			id: 'accountNumber',
			title: 'Account Number',
			value: formData.accountNumber || 'Not provided',
			icon: CreditCard,
		},
	]

	// Render edit form for company name
	const renderCompanyNameEditForm = () => (
		<div className="mt-2 space-y-4">
			<div className="relative w-[110%] rounded-lg border border-gray-300">
				<label
					htmlFor="name"
					className="absolute left-3 top-2 text-xs text-gray-500"
				>
					Company Name
				</label>
				<input
					type="text"
					id="name"
					name="name"
					value={formData.name}
					onChange={handleChange}
					className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('companyName')}
					disabled={isLoading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Saving...
						</>
					) : (
						'Save'
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={isLoading}
				>
					Cancel
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
	)

	// Render edit form for country
	const renderCountryEditForm = () => (
		<div className="mt-2 space-y-4">
			<div className="relative w-[110%] rounded-lg border border-gray-300">
				<label
					htmlFor="country"
					className="absolute left-3 top-2 text-xs text-gray-500"
				>
					Country
				</label>
				<input
					type="text"
					id="country"
					name="country"
					value={formData.country}
					onChange={handleChange}
					className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('country')}
					disabled={isLoading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Saving...
						</>
					) : (
						'Save'
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={isLoading}
				>
					Cancel
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
	)

	// Render edit form for email
	const renderEmailEditForm = () => (
		<div className="mt-2 space-y-4">
			<div className="relative w-[110%] rounded-lg border border-gray-300">
				<label
					htmlFor="email"
					className="absolute left-3 top-2 text-xs text-gray-500"
				>
					Email address
				</label>
				<input
					type="email"
					id="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('email')}
					disabled={isLoading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Saving...
						</>
					) : (
						'Save'
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={isLoading}
				>
					Cancel
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
	)

	// Render edit form for phone number
	const renderPhoneNumberEditForm = () => (
		<div className="mt-2 space-y-4">
			<div className="relative w-[110%] rounded-lg border border-gray-300">
				<label
					htmlFor="phoneNumber"
					className="absolute left-3 top-2 text-xs text-gray-500"
				>
					Phone number
				</label>
				<input
					type="tel"
					id="phoneNumber"
					name="phoneNumber"
					value={formData.phoneNumber}
					onChange={handleChange}
					className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('phoneNumber')}
					disabled={isLoading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Saving...
						</>
					) : (
						'Save'
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={isLoading}
				>
					Cancel
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
	)

	// Render edit form for admin name
	const renderAdminNameEditForm = () => (
		<div className="mt-2 space-y-4">
			<div className="relative w-[110%] rounded-lg border border-gray-300">
				<label
					htmlFor="adminName"
					className="absolute left-3 top-2 text-xs text-gray-500"
				>
					Admin Name
				</label>
				<input
					type="text"
					id="adminName"
					name="adminName"
					value={formData.adminName}
					onChange={handleChange}
					className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('adminName')}
					disabled={isLoading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Saving...
						</>
					) : (
						'Save'
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={isLoading}
				>
					Cancel
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
	)

	// Render edit form for address
	const renderAddressEditForm = () => (
		<div className="mt-2 space-y-4">
			<div className="relative w-[110%] rounded-lg border border-gray-300">
				<label
					htmlFor="address"
					className="absolute left-3 top-2 text-xs text-gray-500"
				>
					Address
				</label>
				<textarea
					id="address"
					name="address"
					value={formData.address}
					onChange={handleChange}
					rows={3}
					className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('address')}
					disabled={isLoading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Saving...
						</>
					) : (
						'Save'
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={isLoading}
				>
					Cancel
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
	)

	// Render edit form for registration number
	const renderRegistrationNumberEditForm = () => (
		<div className="mt-2 space-y-4">
			<div className="relative w-[110%] rounded-lg border border-gray-300">
				<label
					htmlFor="registrationNumber"
					className="absolute left-3 top-2 text-xs text-gray-500"
				>
					Registration Number
				</label>
				<input
					type="text"
					id="registrationNumber"
					name="registrationNumber"
					value={formData.registrationNumber}
					onChange={handleChange}
					className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>
			<p className="text-xs text-gray-500">
				Your company's registration number (optional).
			</p>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('registrationNumber')}
					disabled={isLoading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Saving...
						</>
					) : (
						'Save'
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={isLoading}
				>
					Cancel
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
	)

	// Render edit form for bank name
	const renderBankNameEditForm = () => (
		<div className="mt-2 space-y-4">
			<div className="relative w-[110%] rounded-lg border border-gray-300">
				<label
					htmlFor="bankName"
					className="absolute left-3 top-2 text-xs text-gray-500"
				>
					Bank Name
				</label>
				<input
					type="text"
					id="bankName"
					name="bankName"
					value={formData.bankName}
					onChange={handleChange}
					className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('bankName')}
					disabled={isLoading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Saving...
						</>
					) : (
						'Save'
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={isLoading}
				>
					Cancel
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
	)

	// Render edit form for account number
	const renderAccountNumberEditForm = () => (
		<div className="mt-2 space-y-4">
			<div className="relative w-[110%] rounded-lg border border-gray-300">
				<label
					htmlFor="accountNumber"
					className="absolute left-3 top-2 text-xs text-gray-500"
				>
					Account Number
				</label>
				<input
					type="text"
					id="accountNumber"
					name="accountNumber"
					value={formData.accountNumber}
					onChange={handleChange}
					className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('accountNumber')}
					disabled={isLoading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Saving...
						</>
					) : (
						'Save'
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={isLoading}
				>
					Cancel
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
	)

	// Get the appropriate edit form based on the field being edited
	const getEditForm = (fieldId: string) => {
		switch (fieldId) {
			case 'companyName':
				return renderCompanyNameEditForm()
			case 'country':
				return renderCountryEditForm()
			case 'email':
				return renderEmailEditForm()
			case 'phoneNumber':
				return renderPhoneNumberEditForm()
			case 'adminName':
				return renderAdminNameEditForm()
			case 'address':
				return renderAddressEditForm()
			case 'registrationNumber':
				return renderRegistrationNumberEditForm()
			case 'bankName':
				return renderBankNameEditForm()
			case 'accountNumber':
				return renderAccountNumberEditForm()
			default:
				return null
		}
	}

	if (isLoading && Object.values(formData).every((value) => value === '')) {
		return (
			<div className="flex h-[70vh] w-full items-center justify-center">
				<div className="flex flex-col items-center space-y-4">
					<div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
					<p className="text-lg font-medium">Loading company data...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="max-w-full px-6 py-8">
			{/* Breadcrumb */}
			<div className="mb-6 flex items-center text-sm">
				<Link
					href="/dashboard/settings"
					className="text-gray-600 hover:underline"
				>
					Settings
				</Link>
				<ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
				<span className="text-gray-800">Company info</span>
			</div>

			{/* Page Title */}
			<h1 className="mb-8 text-3xl font-semibold">Company Settings</h1>

			{/* Company Info Items */}
			<div className="space-y-6">
				{companyInfoItems.map((item) => (
					<div key={item.id} className="border-b border-gray-200 pb-6">
						<div className="flex items-start justify-between">
							<div className="flex items-start">
								<div className="mr-4 mt-1">
									<item.icon className="h-5 w-5 text-gray-500" />
								</div>
								<div className="flex-1">
									<h2 className="text-base font-medium">{item.title}</h2>
									{editingField !== item.id && (
										<>
											<p className="mt-1 text-gray-700">{item.value}</p>
											{item.description && (
												<p className="mt-1 text-sm text-gray-500">
													{item.description}
												</p>
											)}
										</>
									)}
									{editingField === item.id && getEditForm(item.id)}
								</div>
							</div>
							{editingField !== item.id && (
								<button
									onClick={() => setEditingField(item.id)}
									className="font-medium text-gray-700 hover:underline"
								>
									Edit
								</button>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Info Cards */}
			<div className="mt-12 space-y-6">
				<div className="rounded-xl border border-gray-200 p-6">
					<div className="flex items-start">
						<div className="mr-4 rounded-full bg-gray-100 p-3">
							<Shield className="h-6 w-6 text-gray-500" />
						</div>
						<div>
							<h2 className="mb-2 text-lg font-semibold">
								Why is company information important?
							</h2>
							<p className="text-gray-600">
								Your company information is used for invoices and legal
								documents. Make sure it's accurate and up-to-date.
							</p>
						</div>
					</div>
				</div>

				<div className="rounded-xl border border-gray-200 p-6">
					<div className="flex items-start">
						<div className="mr-4 rounded-full bg-gray-100 p-3">
							<AlertCircle className="h-6 w-6 text-gray-500" />
						</div>
						<div>
							<h2 className="mb-2 text-lg font-semibold">
								What information is shared with customers?
							</h2>
							<p className="text-gray-600">
								Your company name, contact information, and address will be
								visible on invoices and booking confirmations.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
