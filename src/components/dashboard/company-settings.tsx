'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
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
} from 'lucide-react'

const companyFormSchema = z.object({
	name: z.string().min(2, {
		message: 'Company name must be at least 2 characters.',
	}),
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	phoneNumber: z.string().min(10, {
		message: 'Phone number must be at least 10 characters.',
	}),
	address: z.string().min(5, {
		message: 'Address must be at least 5 characters.',
	}),
	country: z.string().min(2, {
		message: 'Country must be at least 2 characters.',
	}),
	registrationNumber: z.string().optional(),
	bankName: z.string().optional(),
	accountNumber: z.string().optional(),
	adminName: z.string().optional(),
})

type CompanyFormValues = z.infer<typeof companyFormSchema>

export function CompanySettings() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Initialize form with empty values
	const form = useForm<CompanyFormValues>({
		resolver: zodResolver(companyFormSchema),
		defaultValues: {
			name: '',
			email: '',
			phoneNumber: '',
			address: '',
			country: '',
			registrationNumber: '',
			bankName: '',
			accountNumber: '',
			adminName: '',
		},
	})

	// Fetch company data on component mount
	useEffect(() => {
		const fetchCompanyData = async () => {
			setIsLoading(true)
			setError(null)
			try {
				const response = await fetch('/api/dashboard/company/company-data')
				if (!response.ok) {
					throw new Error('Failed to fetch company data')
				}

				const data = await response.json()

				// Update form values with fetched data
				form.reset({
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
	}, [form])

	async function onSubmit(data: CompanyFormValues) {
		setIsLoading(true)
		try {
			const response = await fetch('/api/dashboard/company/company-edit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				throw new Error('Failed to update company data')
			}

			toast({
				title: 'Company settings updated',
				description: 'Your company settings have been updated successfully.',
			})
		} catch (err) {
			toast({
				title: 'Error',
				description: 'Failed to update company settings. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Company Settings</h1>
				<p className="text-muted-foreground">Manage your company information</p>
			</div>

			<Card>
				<CardHeader className="pb-0">
					<CardTitle className="text-lg font-medium">
						Company Information
					</CardTitle>
					<CardDescription>
						Update your company details and information.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<div className="mb-4 rounded-md bg-red-100 p-3 text-red-800">
							{error}
						</div>
					)}

					{isLoading && !error ? (
						<div className="flex items-center justify-center p-6">
							<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
							<span className="ml-2">Loading company data...</span>
						</div>
					) : (
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								{/* Basic Information Section */}
								<div className="mb-4">
									<div className="mb-2 flex items-center">
										<Building2 className="mr-2 h-5 w-5 text-slate-500" />
										<h3 className="text-md font-medium">Basic Information</h3>
									</div>

									<div className="flex justify-center">
										<div className="grid w-full max-w-md grid-cols-2 gap-[10px]">
											<div>
												<p className="mb-1 text-sm font-medium">Company Name</p>
												<div className="relative">
													<Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
													<Input
														placeholder="Acme Tours"
														className="pl-10"
														{...form.register('name')}
													/>
												</div>
												{form.formState.errors.name && (
													<p className="mt-1 text-xs text-red-500">
														{form.formState.errors.name.message}
													</p>
												)}
											</div>
											<div>
												<p className="mb-1 text-sm font-medium">Country</p>
												<div className="relative">
													<Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
													<Input
														placeholder="United States"
														className="pl-10"
														{...form.register('country')}
													/>
												</div>
												{form.formState.errors.country && (
													<p className="mt-1 text-xs text-red-500">
														{form.formState.errors.country.message}
													</p>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* Contact Information Section */}
								<div className="mb-4">
									<div className="mb-2 flex items-center">
										<Phone className="mr-2 h-5 w-5 text-slate-500" />
										<h3 className="text-md font-medium">Contact Information</h3>
									</div>

									<div className="flex justify-center">
										<div className="grid w-full max-w-md grid-cols-2 gap-[10px]">
											<div>
												<p className="mb-1 text-sm font-medium">Email</p>
												<div className="relative">
													<Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
													<Input
														placeholder="info@acmetours.com"
														className="pl-10"
														{...form.register('email')}
													/>
												</div>
												{form.formState.errors.email && (
													<p className="mt-1 text-xs text-red-500">
														{form.formState.errors.email.message}
													</p>
												)}
											</div>
											<div>
												<p className="mb-1 text-sm font-medium">Phone Number</p>
												<div className="relative">
													<Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
													<Input
														placeholder="+1 (555) 123-4567"
														className="pl-10"
														{...form.register('phoneNumber')}
													/>
												</div>
												{form.formState.errors.phoneNumber && (
													<p className="mt-1 text-xs text-red-500">
														{form.formState.errors.phoneNumber.message}
													</p>
												)}
											</div>
										</div>
									</div>

									<div className="mt-[10px] flex justify-center">
										<div className="w-full max-w-md">
											<p className="mb-1 text-sm font-medium">Admin Name</p>
											<div className="relative">
												<User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
												<Input
													placeholder="John Doe"
													className="pl-10"
													{...form.register('adminName')}
												/>
											</div>
											{form.formState.errors.adminName && (
												<p className="mt-1 text-xs text-red-500">
													{form.formState.errors.adminName.message}
												</p>
											)}
										</div>
									</div>

									<div className="mt-[10px] flex justify-center">
										<div className="w-full max-w-md">
											<p className="mb-1 text-sm font-medium">Address</p>
											<div className="relative">
												<MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
												<Textarea
													placeholder="123 Main St, Suite 100"
													className="min-h-[80px] pl-10"
													{...form.register('address')}
												/>
											</div>
											{form.formState.errors.address && (
												<p className="mt-1 text-xs text-red-500">
													{form.formState.errors.address.message}
												</p>
											)}
										</div>
									</div>
								</div>

								{/* Registration Information */}
								<div className="mb-4">
									<div className="mb-2 flex items-center">
										<FileText className="mr-2 h-5 w-5 text-slate-500" />
										<h3 className="text-md font-medium">
											Registration Details
										</h3>
									</div>

									<div className="flex justify-center">
										<div className="w-full max-w-md">
											<p className="mb-1 text-sm font-medium">
												Registration Number
											</p>
											<div className="relative">
												<FileText className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
												<Input
													placeholder="ABC123456"
													className="pl-10"
													{...form.register('registrationNumber')}
												/>
											</div>
											<p className="text-muted-foreground mt-1 text-xs">
												Your company's registration number (optional).
											</p>
										</div>
									</div>
								</div>

								{/* Banking Information */}
								<div className="mb-4">
									<div className="mb-2 flex items-center">
										<Landmark className="mr-2 h-5 w-5 text-slate-500" />
										<h3 className="text-md font-medium">Banking Information</h3>
									</div>

									<div className="flex justify-center">
										<div className="grid w-full max-w-md grid-cols-2 gap-[10px]">
											<div>
												<p className="mb-1 text-sm font-medium">Bank Name</p>
												<div className="relative">
													<Landmark className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
													<Input
														placeholder="Global Bank"
														className="pl-10"
														{...form.register('bankName')}
													/>
												</div>
											</div>
											<div>
												<p className="mb-1 text-sm font-medium">
													Account Number
												</p>
												<div className="relative">
													<CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
													<Input
														placeholder="1234567890"
														className="pl-10"
														{...form.register('accountNumber')}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="mt-4 flex justify-center">
									<Button
										type="submit"
										className="bg-slate-800 hover:bg-slate-700"
										disabled={isLoading}
									>
										{isLoading ? 'Updating...' : 'Update Company Settings'}
									</Button>
								</div>
							</form>
						</Form>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
