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
	Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

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
	const [companies, setCompanies] = useState<any[]>([])
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

	// Fetch companies on component mount
	useEffect(() => {
		const fetchCompanies = async () => {
			setIsLoading(true)
			setError(null)
			try {
				const response = await fetch('/api/dashboard/companies')

				if (!response.ok) {
					throw new Error('Failed to fetch companies')
				}

				const data = await response.json()
				setCompanies(data.companies || [])

				// Find the active company
				const activeCompany = data.companies.find(
					(company: any) => company.isActive,
				)

				if (activeCompany) {
					// Update form values with active company data
					setFormData({
						name: activeCompany.name || '',
						email: activeCompany.email || '',
						phoneNumber: activeCompany.phoneNumber || '',
						address: activeCompany.address || '',
						country: activeCompany.country || '',
						registrationNumber: activeCompany.registrationNumber || '',
						bankName: activeCompany.bankName || '',
						accountNumber: activeCompany.accountNumber || '',
						adminName: activeCompany.adminName || '',
					})
				} else if (data.companies.length > 0) {
					// If no active company but companies exist, use the first one
					const firstCompany = data.companies[0]
					setFormData({
						name: firstCompany.name || '',
						email: firstCompany.email || '',
						phoneNumber: firstCompany.phoneNumber || '',
						address: firstCompany.address || '',
						country: firstCompany.country || '',
						registrationNumber: firstCompany.registrationNumber || '',
						bankName: firstCompany.bankName || '',
						accountNumber: firstCompany.accountNumber || '',
						adminName: firstCompany.adminName || '',
					})
				}
			} catch (err) {
				setError('Failed to load companies. Please try again later.')
				console.error(err)
			} finally {
				setIsLoading(false)
			}
		}

		fetchCompanies()
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

	// Set a company as active
	const handleSetActive = async (companyId: string) => {
		try {
			setIsLoading(true)
			const response = await fetch('/api/dashboard/company/set-active', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ companyId }),
			})

			if (!response.ok) {
				throw new Error('Failed to set active company')
			}

			toast({
				title: 'Success',
				description: 'Active company updated successfully',
			})

			// Refresh the page to update all components
			router.refresh()
		} catch (error) {
			console.error('Error setting active company:', error)
			toast({
				title: 'Error',
				description: 'Failed to set active company. Please try again.',
				variant: 'destructive',
			})
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

	// Render companies list
	const renderCompaniesList = () => (
		<div className="mt-8 space-y-4">
			<h2 className="text-xl font-semibold">Your Companies</h2>
			<div className="rounded-lg border border-gray-200">
				{companies.map((company) => (
					<div
						key={company.id}
						className="flex items-center justify-between border-b border-gray-200 p-4 last:border-0"
					>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
								<span className="text-lg font-medium">
									{company.name.charAt(0)}
								</span>
							</div>
							<div>
								<p className="font-medium">{company.name}</p>
								<p className="text-sm text-gray-500">
									{company.type === 'TRAVEL_AGENCY'
										? 'Travel Agency'
										: 'Hotel/Stay'}
								</p>
							</div>
							{company.isActive && (
								<div className="ml-2 flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
									<Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
									Active
								</div>
							)}
						</div>
						{!company.isActive && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleSetActive(company.id)}
								disabled={isLoading}
								className="text-xs"
							>
								{isLoading ? (
									<Loader2 className="h-3 w-3 animate-spin" />
								) : (
									'Set as Active'
								)}
							</Button>
						)}
					</div>
				))}
			</div>
			<div className="flex justify-end">
				<Button
					onClick={() => router.push('/dashboard/company/create')}
					className="mt-2"
				>
					Add New Company
				</Button>
			</div>
		</div>
	)

	if (isLoading && companies.length === 0) {
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

			{/* Active Company Info */}
			<div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
				<div className="flex items-center gap-2">
					<Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
					<h2 className="text-lg font-medium">Active Company</h2>
				</div>
				<p className="mt-1 text-sm text-gray-600">
					This is your currently active company. All dashboard data and
					operations will use this company.
				</p>
			</div>

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

			{/* Companies List */}
			{renderCompaniesList()}

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

	// Get the appropriate edit form based on the field being edited
	function getEditForm(fieldId: string) {
		switch (fieldId) {
			case 'companyName':
				return renderCompanyNameEditForm()
			// Add other edit forms as needed
			default:
				return null
		}
	}
}
