'use client'

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

const accountFormSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	username: z.string().min(2, {
		message: 'Username must be at least 2 characters.',
	}),
	phone: z.string().min(10, {
		message: 'Phone number must be at least 10 characters.',
	}),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API
const defaultValues: Partial<AccountFormValues> = {
	name: 'John Doe',
	email: 'john.doe@example.com',
	username: 'johndoe',
	phone: '+1 (555) 987-6543',
}

export function AccountSettings() {
	const form = useForm<AccountFormValues>({
		resolver: zodResolver(accountFormSchema),
		defaultValues,
	})

	function onSubmit(data: AccountFormValues) {
		toast({
			title: 'Account settings updated',
			description: 'Your account settings have been updated successfully.',
		})
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
				<div className="mb-6 flex items-center space-x-4">
					<Avatar className="h-20 w-20">
						<AvatarImage
							src="/placeholder.svg?height=80&width=80"
							alt="Profile"
						/>
						<AvatarFallback>JD</AvatarFallback>
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
						<Button type="submit">Update Account Settings</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
