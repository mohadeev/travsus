'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useDispatch } from 'react-redux'
import { fetchCompanies } from '@/app/GlobalRedux/Features/companySlice/companySlice'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from '@/components/ui/use-toast'
import { Building, Hotel } from 'lucide-react'
import type { AppDispatch } from '@/app/GlobalRedux/store'

// Define the form schema
const formSchema = z.object({
	name: z.string().min(2, {
		message: 'Company name must be at least 2 characters.',
	}),
	description: z.string().optional(),
	type: z.enum(['travel_agency', 'hotel'], {
		required_error: 'You need to select a company type.',
	}),
})

type FormValues = z.infer<typeof formSchema>

interface EditCompanyFormProps {
	company: any
}

export function EditCompanyForm({ company }: EditCompanyFormProps) {
	const router = useRouter()
	const dispatch = useDispatch<AppDispatch>()
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Initialize the form with company data
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: company.name || '',
			description: company.description || '',
			type: company.type || 'travel_agency',
		},
	})

	async function onSubmit(data: FormValues) {
		try {
			setIsSubmitting(true)

			const response = await fetch(`/api/dashboard/company/${company.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				throw new Error('Failed to update company')
			}

			// Refresh the companies list in Redux
			await dispatch(fetchCompanies())

			toast({
				title: 'Company Updated',
				description: 'Your company has been updated successfully.',
			})

			// Redirect back to settings
			router.push('/dashboard/settings')
		} catch (error) {
			console.error('Error updating company:', error)
			toast({
				title: 'Error',
				description: 'Failed to update company. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Company Name</FormLabel>
							<FormControl>
								<Input placeholder="Enter company name" {...field} />
							</FormControl>
							<FormDescription>
								This is the name that will be displayed to users.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Enter a brief description of your company"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Provide a short description of your company.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormLabel>Company Type</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									className="flex flex-col space-y-1"
								>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="travel_agency" />
										</FormControl>
										<FormLabel className="flex items-center gap-2 font-normal">
											<Building className="h-4 w-4" />
											Travel Agency
										</FormLabel>
									</FormItem>
									<FormItem className="flex items-center space-x-3 space-y-0">
										<FormControl>
											<RadioGroupItem value="hotel" />
										</FormControl>
										<FormLabel className="flex items-center gap-2 font-normal">
											<Hotel className="h-4 w-4" />
											Hotel/Stay
										</FormLabel>
									</FormItem>
								</RadioGroup>
							</FormControl>
							<FormDescription>
								Select the type of company you are managing.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.push('/dashboard/settings')}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Updating...' : 'Update Company'}
					</Button>
				</div>
			</form>
		</Form>
	)
}
