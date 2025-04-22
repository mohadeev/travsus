'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
	Building2,
	Mail,
	Phone,
	MapPin,
	Globe,
	FileText,
	Save,
} from 'lucide-react'

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
})

type CompanyFormValues = z.infer<typeof companyFormSchema>

export function CreateCompanyForm() {
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

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
		},
	})

	async function onSubmit(data: CompanyFormValues) {
		setIsLoading(true)
		try {
			const response = await fetch('/api/dashboard/company/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.message || 'Failed to create company')
			}

			toast({
				title: 'Company created',
				description: 'Your company has been created successfully.',
			})

			// Redirect to dashboard with the new company selected
			if (result.company && result.company.id) {
				router.push(`/dashboard?company=${result.company.id}`)
			} else {
				router.push('/dashboard')
			}
		} catch (err: any) {
			toast({
				title: 'Error',
				description:
					err.message || 'Failed to create company. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
						<div className="grid gap-6 md:grid-cols-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Company Name</FormLabel>
										<div className="relative">
											<Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
											<FormControl>
												<Input
													placeholder="Acme Tours"
													className="pl-10"
													{...field}
												/>
											</FormControl>
										</div>
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
										<div className="relative">
											<Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
											<FormControl>
												<Input
													placeholder="United States"
													className="pl-10"
													{...field}
												/>
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email Address</FormLabel>
										<div className="relative">
											<Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
											<FormControl>
												<Input
													type="email"
													placeholder="info@acmetours.com"
													className="pl-10"
													{...field}
												/>
											</FormControl>
										</div>
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
										<div className="relative">
											<Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
											<FormControl>
												<Input
													placeholder="+1 (555) 123-4567"
													className="pl-10"
													{...field}
												/>
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<div className="relative">
										<MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
										<FormControl>
											<Textarea
												placeholder="123 Main St, Suite 100"
												className="min-h-[100px] pl-10 pt-2"
												{...field}
											/>
										</FormControl>
									</div>
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
									<div className="relative">
										<FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
										<FormControl>
											<Input
												placeholder="ABC123456"
												className="pl-10"
												{...field}
											/>
										</FormControl>
									</div>
									<FormDescription>
										Your company's registration number (optional).
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				<div className="flex justify-end">
					<Button
						type="submit"
						disabled={isLoading}
						className="w-full sm:w-auto"
					>
						{isLoading ? (
							<>
								<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
								Creating...
							</>
						) : (
							<>
								<Save className="mr-2 h-4 w-4" />
								Create Company
							</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	)
}
