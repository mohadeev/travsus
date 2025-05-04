'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserData, updateUserData } from '@/lib/api-client'

const accountFormSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	username: z
		.string()
		.min(2, {
			message: 'Username must be at least 2 characters.',
		})
		.optional(),
	phone: z
		.string()
		.min(10, {
			message: 'Phone number must be at least 10 characters.',
		})
		.optional(),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountSettings() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [avatarUrl, setAvatarUrl] = useState<string>('/')

	// Initialize form with empty values
	const form = useForm<AccountFormValues>({
		resolver: zodResolver(accountFormSchema),
		defaultValues: {
			name: '',
			email: '',
			username: '',
			phone: '',
		},
	})

	// Fetch user data on component mount
	useEffect(() => {
		const fetchUserData = async () => {
			setIsLoading(true)
			setError(null)
			try {
				const data = await getUserData()
				// Update form values with fetched data
				form.reset({
					name: data.name || '',
					email: data.email || '',
					username: data.username || '',
					phone: data.phone || '',
				})

				// Set avatar URL if available
				if (data.profileImage && data.profileImage.url) {
					setAvatarUrl(data.profileImage.url)
				}
			} catch (err) {
				setError('Failed to load user data. Please try again later.')
				console.error(err)
			} finally {
				setIsLoading(false)
			}
		}

		fetchUserData()
	}, [form])

	async function onSubmit(data: AccountFormValues) {
		setIsLoading(true)
		try {
			await updateUserData(data)
			toast({
				title: 'Account settings updated',
				description: 'Your account settings have been updated successfully.',
			})
		} catch (err) {
			toast({
				title: 'Error',
				description: 'Failed to update account settings. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Account Information</CardTitle>
				<CardDescription>
					Update your account details and preferences.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{error && (
					<div className="mb-4 rounded-md bg-red-100 p-3 text-red-800">
						{error}
					</div>
				)}

				<div className="mb-6 flex items-center space-x-4">
					<Avatar className="h-20 w-20">
						<AvatarImage src={avatarUrl} alt="Profile" />
						<AvatarFallback>
							{form.getValues().name?.charAt(0) || 'U'}
						</AvatarFallback>
					</Avatar>
					<div>
						<Button variant="outline" size="sm">
							Change Avatar
						</Button>
					</div>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="grid gap-4 md:grid-cols-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="John Doe" {...field} />
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
											<Input placeholder="john.doe@example.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input placeholder="johndoe" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone</FormLabel>
										<FormControl>
											<Input placeholder="+1 (555) 987-6543" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? 'Updating...' : 'Update Account Settings'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
