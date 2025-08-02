'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
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
import { getCompanyData, updateCompanyData } from '@/lib/api-client'

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
				const data = await getCompanyData()
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
			await updateCompanyData(data)
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
		<Card>
			<CardHeader>
				<CardTitle>Company Information</CardTitle>
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

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="grid gap-4 md:grid-cols-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Company Name</FormLabel>
										<FormControl>
											<Input placeholder="Acme Tours" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="info@acmetours.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="adminName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Admin Name</FormLabel>
										<FormControl>
											<Input placeholder="John Doe" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="phoneNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number</FormLabel>
										<FormControl>
											<Input placeholder="+1 (555) 123-4567" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="country"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Country</FormLabel>
										<FormControl>
											<Input placeholder="United States" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address</FormLabel>
										<FormControl>
											<Textarea
												placeholder="123 Main St, Suite 100"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="registrationNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Registration Number</FormLabel>
										<FormControl>
											<Input placeholder="ABC123456" {...field} />
										</FormControl>
										<FormDescription>
											Your company's registration number (optional).
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="md:col-span-2">
								<h3 className="mb-4 text-lg font-medium">
									Banking Information
								</h3>
							</div>
							<FormField
								control={form.control}
								name="bankName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Bank Name</FormLabel>
										<FormControl>
											<Input placeholder="Global Bank" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="accountNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Account Number</FormLabel>
										<FormControl>
											<Input placeholder="1234567890" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? 'Updating...' : 'Update Company Settings'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
