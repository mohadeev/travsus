export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { BookingsList } from '@/components/dashboard/bookings-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
	title: 'Bookings',
	description: 'Manage your bookings',
}

export default function BookingsPage() {
	return (
		<DashboardShell>
			<DashboardHeader
				heading="Bookings"
				text="View and manage your tour bookings"
			/>

			<Suspense fallback={<BookingStatsSkeleton />}>
				<BookingStats />
			</Suspense>

			<Tabs defaultValue="all" className="mt-6 w-full">
				<TabsList className="grid w-full grid-cols-4 md:w-[400px]">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="pending">Pending</TabsTrigger>
					<TabsTrigger value="confirmed">Confirmed</TabsTrigger>
					<TabsTrigger value="cancelled">Cancelled</TabsTrigger>
				</TabsList>
				<TabsContent value="all">
					<BookingsList />
				</TabsContent>
				<TabsContent value="pending">
					<BookingsList statusFilter="pending" />
				</TabsContent>
				<TabsContent value="confirmed">
					<BookingsList statusFilter="confirmed" />
				</TabsContent>
				<TabsContent value="cancelled">
					<BookingsList statusFilter="cancelled" />
				</TabsContent>
			</Tabs>
		</DashboardShell>
	)
}

async function BookingStats() {
	try {
		// For server components in Next.js, we need to construct a full URL
		const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
		const host =
			process.env.VERCEL_URL ||
			process.env.NEXT_PUBLIC_VERCEL_URL ||
			'localhost:3001'
		const baseUrl = `${protocol}://${host}`

		const response = await fetch(`${baseUrl}/api/dashboard/bookings/stats`, {
			cache: 'no-store', // Disable caching to always get fresh data
		})

		if (!response.ok) {
			console.error('API response error:', response.status, response.statusText)
			return <DefaultBookingStats />
		}

		const stats = await response.json()

		return (
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Booking Overview</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-6 md:grid-cols-4">
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">{stats.total}</h3>
						<p className="text-muted-foreground text-sm">Total Bookings</p>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">{stats.pending}</h3>
						<p className="text-muted-foreground text-sm">Pending</p>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">{stats.confirmed}</h3>
						<p className="text-muted-foreground text-sm">Confirmed</p>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">{stats.cancelled}</h3>
						<p className="text-muted-foreground text-sm">Cancelled</p>
					</div>
				</CardContent>
			</Card>
		)
	} catch (error) {
		console.error('Error in BookingStats component:', error)
		return <DefaultBookingStats />
	}
}

function DefaultBookingStats() {
	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>Booking Overview</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-6 md:grid-cols-4">
				<div className="flex flex-col gap-1">
					<h3 className="text-xl font-bold">0</h3>
					<p className="text-muted-foreground text-sm">Total Bookings</p>
				</div>
				<div className="flex flex-col gap-1">
					<h3 className="text-xl font-bold">0</h3>
					<p className="text-muted-foreground text-sm">Pending</p>
				</div>
				<div className="flex flex-col gap-1">
					<h3 className="text-xl font-bold">0</h3>
					<p className="text-muted-foreground text-sm">Confirmed</p>
				</div>
				<div className="flex flex-col gap-1">
					<h3 className="text-xl font-bold">0</h3>
					<p className="text-muted-foreground text-sm">Cancelled</p>
				</div>
			</CardContent>
		</Card>
	)
}

function BookingStatsSkeleton() {
	return (
		<Card className="mb-6">
			<CardHeader>
				<Skeleton className="h-6 w-[150px]" />
			</CardHeader>
			<CardContent className="grid gap-6 md:grid-cols-4">
				{Array(4)
					.fill(null)
					.map((_, i) => (
						<div key={i} className="flex flex-col gap-1">
							<Skeleton className="h-8 w-[60px]" />
							<Skeleton className="h-4 w-[120px]" />
						</div>
					))}
			</CardContent>
		</Card>
	)
}
