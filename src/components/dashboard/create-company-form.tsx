'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
	Building2,
	Mail,
	Phone,
	MapPin,
	Globe,
	FileText,
	Home,
	Plane,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export function CreateCompanyForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phoneNumber: '',
		address: '',
		country: '',
		registrationNumber: '',
		type: 'TRAVEL_AGENCY', // Default to travel agency
	})
	const router = useRouter()

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleTypeChange = (value: string) => {
		setFormData((prev) => ({ ...prev, type: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!formData.name || !formData.email) {
			toast({
				title: 'Error',
				description: 'Company name and email are required',
				variant: 'destructive',
			})
			return
		}

		try {
			setIsLoading(true)

			const response = await fetch('/api/dashboard/company/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})

			if (!response.ok) {
				throw new Error('Failed to create company')
			}

			const data = await response.json()

			toast({
				title: 'Success',
				description: 'Company created successfully',
			})

			// Redirect to dashboard with the new company
			router.push(`/dashboard?company=${data.company.id}`)
		} catch (error) {
			console.error('Error creating company:', error)
			toast({
				title: 'Error',
				description: 'Failed to create company. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-6">
			<Card>
				<CardHeader className="pb-4">
					<div className="flex items-center space-x-2">
						<Building2 className="h-5 w-5 text-slate-500" />
						<CardTitle className="text-xl">Company Information</CardTitle>
					</div>
					<CardDescription>
						Basic information about your company that will appear on invoices
						and your profile.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Company Type Selection */}
					<div className="space-y-3">
						<Label className="text-base">Company Type</Label>
						<RadioGroup
							defaultValue={formData.type}
							value={formData.type}
							onValueChange={handleTypeChange}
							className="grid grid-cols-1 gap-4 md:grid-cols-2"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="TRAVEL_AGENCY"
									id="travel_agency"
									className="peer sr-only"
								/>
								<Label
									htmlFor="travel_agency"
									className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-4 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
								>
									<Plane className="mb-3 h-6 w-6" />
									<div className="text-center">
										<p className="font-medium">Travel Agency</p>
										<p className="text-muted-foreground text-sm">
											For tour operators and travel agencies
										</p>
									</div>
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="STAY"
									id="stay"
									className="peer sr-only"
								/>
								<Label
									htmlFor="stay"
									className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-4 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
								>
									<Home className="mb-3 h-6 w-6" />
									<div className="text-center">
										<p className="font-medium">Hotel / Stay</p>
										<p className="text-muted-foreground text-sm">
											For hotels, houses and other accommodations
										</p>
									</div>
								</Label>
							</div>
						</RadioGroup>
					</div>

					<div>
						<Label htmlFor="name" className="text-base">
							Company Name *
						</Label>
						<div className="relative mt-1">
							<Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								required
								className="h-12 pl-10"
								placeholder="Enter company name"
							/>
						</div>
					</div>

					<div>
						<Label htmlFor="email" className="text-base">
							Email Address *
						</Label>
						<div className="relative mt-1">
							<Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
							<Input
								id="email"
								name="email"
								type="email"
								value={formData.email}
								onChange={handleChange}
								required
								className="h-12 pl-10"
								placeholder="Enter email address"
							/>
						</div>
					</div>

					<div>
						<Label htmlFor="phoneNumber" className="text-base">
							Phone Number
						</Label>
						<div className="relative mt-1">
							<Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
							<Input
								id="phoneNumber"
								name="phoneNumber"
								value={formData.phoneNumber}
								onChange={handleChange}
								className="h-12 pl-10"
								placeholder="Enter phone number"
							/>
						</div>
					</div>

					<div>
						<Label htmlFor="address" className="text-base">
							Address
						</Label>
						<div className="relative mt-1">
							<MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
							<textarea
								id="address"
								name="address"
								value={formData.address}
								onChange={handleChange}
								className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[80px] w-full rounded-md border px-3 py-2 pl-10 pt-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								placeholder="Enter company address"
							/>
						</div>
					</div>

					<div>
						<Label htmlFor="country" className="text-base">
							Country
						</Label>
						<div className="relative mt-1">
							<Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
							<Input
								id="country"
								name="country"
								value={formData.country}
								onChange={handleChange}
								className="h-12 pl-10"
								placeholder="Enter country"
							/>
						</div>
					</div>

					<div>
						<Label htmlFor="registrationNumber" className="text-base">
							Registration Number
						</Label>
						<div className="relative mt-1">
							<FileText className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
							<Input
								id="registrationNumber"
								name="registrationNumber"
								value={formData.registrationNumber}
								onChange={handleChange}
								className="h-12 pl-10"
								placeholder="Enter registration number (optional)"
							/>
						</div>
						<p className="text-muted-foreground mt-1 text-sm">
							Your company's registration number (optional).
						</p>
					</div>
				</CardContent>
			</Card>

			<div className="flex flex-col items-center gap-4 pt-2 sm:flex-row">
				<Button
					type="submit"
					disabled={isLoading}
					className="h-12 w-full text-base sm:w-auto"
				>
					{isLoading ? (
						<>
							<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
							Creating...
						</>
					) : (
						'Create Company'
					)}
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={() => router.back()}
					disabled={isLoading}
					className="h-12 w-full text-base sm:w-auto"
				>
					Cancel
				</Button>
			</div>
		</form>
	)
}
