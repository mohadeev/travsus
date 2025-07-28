'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslations } from 'next-intl'

const newsletterTypes = [
	{ id: 'deals', label: 'email_subscription_page_Deals' },
	{ id: 'tips', label: 'email_subscription_page_Tips' },
	{ id: 'reviews', label: 'email_subscription_page_Reviews' },
	{ id: 'inspiration', label: 'email_subscription_page_Inspiration' },
]

function SkeletonLoading() {
	return (
		<Card className="w-[350px]">
			<CardHeader>
				<Skeleton className="mb-2 h-8 w-3/4" />
				<Skeleton className="h-4 w-1/2" />
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="flex items-center space-x-2">
							<Skeleton className="h-4 w-4 rounded" />
							<Skeleton className="h-4 w-24" />
						</div>
					))}
				</div>
			</CardContent>
			<CardFooter>
				<Skeleton className="h-10 w-full" />
			</CardFooter>
		</Card>
	)
}

export default function SubscriptionPage() {
	const t = useTranslations('email_subscription_page')
	const searchParams = useSearchParams()
	const [status, setStatus] = useState<
		'loading' | 'idle' | 'success' | 'error'
	>('loading')
	const [message, setMessage] = useState('')
	const [types, setTypes] = useState<string[]>([])
	const [isSubscribed, setIsSubscribed] = useState(true)
	const [emailMismatch, setEmailMismatch] = useState(false)
	const [tokenExpired, setTokenExpired] = useState(false)
	const [greeting, setGreeting] = useState('')
	const [isInitialLoad, setIsInitialLoad] = useState(true)
	const { data: session } = useSession()

	const token = searchParams.get('token')

	useEffect(() => {
		const fetchSubscriptionData = async () => {
			if (!token) {
				setStatus('error')
				setMessage(t('Invalid_Token'))
				setIsInitialLoad(false)
				return
			}

			try {
				const response = await fetch(`/api/subscription-manager?token=${token}`)
				const data = await response.json()

				if (data.success) {
					setTypes(data.types)
					setIsSubscribed(data.subscribed)
					setGreeting(
						data.greeting ||
							t('Hello_Email_Great_To_See_You_Again', { email: data.email }),
					)
					setStatus('idle')
				} else if (data.emailMismatch) {
					setStatus('error')
					setMessage(data.message)
					setEmailMismatch(true)
				} else if (data.tokenExpired) {
					setStatus('error')
					setMessage(data.message)
					setTokenExpired(true)
				} else {
					setStatus('error')
					setMessage(data.message)
				}
			} catch (error) {
				setStatus('error')
				setMessage(t('An_Error_Occurred_Fetching_Subscription_Data'))
			}
			setIsInitialLoad(false)
		}

		fetchSubscriptionData()
	}, [token, t])

	const handleTypeToggle = (typeId: string) => {
		setTypes((prev) =>
			prev.includes(typeId)
				? prev.filter((t) => t !== typeId)
				: [...prev, typeId],
		)
	}

	const handleSubmit = async () => {
		setStatus('loading')
		try {
			const response = await fetch('/api/subscription-manager', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token, types }),
			})

			const data = await response.json()

			if (data.success) {
				setStatus('success')
				setMessage(data.message)
				setTypes(data.types)
				setIsSubscribed(data.types.length > 0)
			} else if (data.emailMismatch) {
				setStatus('error')
				setMessage(data.message)
				setEmailMismatch(true)
			} else if (data.tokenExpired) {
				setStatus('error')
				setMessage(data.message)
				setTokenExpired(true)
			} else {
				setStatus('error')
				setMessage(data.message)
			}
		} catch (error) {
			setStatus('error')
			setMessage(t('An_Error_Occurred_Fetching_Subscription_Data'))
		}
	}

	if (isInitialLoad) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-100">
				<SkeletonLoading />
			</div>
		)
	}

	if (status === 'error' && emailMismatch) {
		return (
			<Alert variant="destructive" className="mx-auto mt-10 w-[350px]">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>{t('Oops_Email_Mismatch')}</AlertTitle>
				<AlertDescription>
					{message}
					{t('Please_Log_Out_And_Try_Again')}
				</AlertDescription>
			</Alert>
		)
	}

	if (status === 'error' && tokenExpired) {
		return (
			<Alert variant="destructive" className="mx-auto mt-10 w-[350px]">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>{t('Token_Expired')}</AlertTitle>
				<AlertDescription>
					{message}
					{t('Please_Request_New_Token')}
				</AlertDescription>
			</Alert>
		)
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>{t('Manage_Your_Subscriptions')}</CardTitle>
					{greeting && (
						<CardDescription className="text-sm font-medium text-green-600">
							{greeting}
						</CardDescription>
					)}
					<CardDescription>{t('Choose_Types_Of_Newsletters')}</CardDescription>
				</CardHeader>
				<CardContent>
					{status === 'loading' && <p>{t('Updating_Your_Preferences')}</p>}
					{status === 'error' && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>{t('Error')}</AlertTitle>
							<AlertDescription>{message}</AlertDescription>
						</Alert>
					)}
					{(status === 'idle' || status === 'success') && (
						<div className="space-y-4">
							{newsletterTypes.map((type) => (
								<div key={type.id} className="flex items-center space-x-2">
									<Checkbox
										id={type.id}
										checked={types.includes(type.id)}
										onCheckedChange={() => handleTypeToggle(type.id)}
									/>
									<label
										htmlFor={type.id}
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										{t(type.label)}
									</label>
								</div>
							))}
						</div>
					)}
					{status === 'success' && (
						<Alert variant="default" className="mt-4">
							<CheckCircle className="h-4 w-4" />
							<AlertDescription>{message}</AlertDescription>
						</Alert>
					)}
				</CardContent>
				<CardFooter>
					<Button
						className="w-full"
						onClick={handleSubmit}
						disabled={status === 'loading'}
					>
						{status === 'loading' ? t('Updating') : t('Update_Preferences')}
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
