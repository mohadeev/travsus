'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

// Define the form schema with Zod
const tourSchema = z.object({
	title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
	language: z.string().min(1, { message: 'Please select a language.' }),
})

// Define the form values type
type TourFormValues = z.infer<typeof tourSchema>

export function TourBuilder() {
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Initialize the form with React Hook Form and Zod validation
	const form = useForm<TourFormValues>({
		resolver: zodResolver(tourSchema),
		defaultValues: {
			title: '',
			language: 'EN',
		},
	})

	// Handle form submission
	async function onSubmit(data: TourFormValues) {
		setIsSubmitting(true)
		try {
			// Simulate API call
			console.log('Submitting tour data:', data)
			await new Promise((resolve) => setTimeout(resolve, 1000))

			// Reset form after successful submission
			form.reset()
			alert('Tour created successfully!')
		} catch (error) {
			console.error('Error creating tour:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Basic Information</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* Tour Title Field */}
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tour Title</FormLabel>
										<FormControl>
											<Input placeholder="Enter tour title" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Language Field */}
							<FormField
								control={form.control}
								name="language"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Language</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select language" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="EN">English</SelectItem>
												<SelectItem value="ES">Spanish</SelectItem>
												<SelectItem value="FR">French</SelectItem>
												<SelectItem value="DE">German</SelectItem>
												<SelectItem value="IT">Italian</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Submit Button */}
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? 'Creating...' : 'Create Tour'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
