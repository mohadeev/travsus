'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import {
	ArrowUpDown,
	CheckCircle,
	MoreHorizontal,
	Pencil,
	XCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'

type Booking = {
	id: string
	customer: string
	customerEmail: string
	tour: string
	tourId: string
	date: string
	status: string
	amount: string
	guests: number
	orderNumber: string
	createdAt: string
}

interface BookingsListProps {
	statusFilter?: string
}

export function BookingsList({ statusFilter }: BookingsListProps) {
	const [bookings, setBookings] = useState<Booking[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [searchQuery, setSearchQuery] = useState('')

	const fetchBookings = async (query = '') => {
		setLoading(true)
		setError(null)
		try {
			let url = '/api/dashboard/bookings'
			const params = new URLSearchParams()

			if (query) {
				params.append('search', query)
			}

			if (statusFilter) {
				params.append('status', statusFilter)
			}

			if (params.toString()) {
				url += `?${params.toString()}`
			}

			const response = await fetch(url)

			if (!response.ok) {
				throw new Error('Failed to fetch bookings')
			}

			const data = await response.json()
			setBookings(data.bookings || [])
		} catch (err) {
			console.error('Error fetching bookings:', err)
			setError('Failed to load bookings. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchBookings()
	}, [statusFilter])

	const handleStatusChange = async (bookingId: string, newStatus: string) => {
		try {
			const response = await fetch('/api/dashboard/bookings/update-status', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ bookingId, newStatus }),
			})

			const data = await response.json()

			if (response.ok && data.success) {
				// Update the local state
				setBookings((prevBookings) =>
					prevBookings.map((b) =>
						b.id === bookingId ? { ...b, status: newStatus } : b,
					),
				)

				toast({
					title: 'Success',
					description: data.message || `Booking status updated to ${newStatus}`,
				})

				// Refresh the bookings list
				fetchBookings(searchQuery)
			} else {
				toast({
					title: 'Error',
					description: data.message || 'Failed to update booking status',
					variant: 'destructive',
				})
			}
		} catch (error) {
			console.error('Error updating booking status:', error)
			toast({
				title: 'Error',
				description: 'An unexpected error occurred',
				variant: 'destructive',
			})
		}
	}

	const columns: ColumnDef<Booking>[] = [
		{
			accessorKey: 'customer',
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Customer
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => (
				<div className="font-medium">{row.getValue('customer')}</div>
			),
		},
		{
			accessorKey: 'tour',
			header: 'Tour',
			cell: ({ row }) => <div>{row.getValue('tour')}</div>,
		},
		{
			accessorKey: 'date',
			header: 'Date',
			cell: ({ row }) => <div>{row.getValue('date')}</div>,
		},
		{
			accessorKey: 'guests',
			header: 'Guests',
			cell: ({ row }) => <div>{row.getValue('guests')}</div>,
		},
		{
			accessorKey: 'amount',
			header: 'Amount',
			cell: ({ row }) => (
				<div className="font-medium">{row.getValue('amount')}</div>
			),
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const status = row.getValue('status') as string
				return (
					<Badge
						variant={
							status === 'confirmed'
								? 'default'
								: status === 'pending'
									? 'secondary'
									: 'destructive'
						}
					>
						{status}
					</Badge>
				)
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const booking = row.original

				return (
					<div className="flex items-center gap-2">
						{booking.status === 'pending' && (
							<Button
								variant="outline"
								size="sm"
								className="h-8 text-green-600"
								onClick={() => handleStatusChange(booking.id, 'confirmed')}
							>
								<CheckCircle className="mr-2 h-4 w-4" />
								Confirm
							</Button>
						)}
						{booking.status !== 'cancelled' && (
							<Button
								variant="outline"
								size="sm"
								className="h-8 text-red-600"
								onClick={() => handleStatusChange(booking.id, 'cancelled')}
							>
								<XCircle className="mr-2 h-4 w-4" />
								Cancel
							</Button>
						)}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuItem>
									<Pencil className="mr-2 h-4 w-4" />
									View Details
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Contact Customer</DropdownMenuItem>
								<DropdownMenuItem>Generate Invoice</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				)
			},
		},
	]

	const table = useReactTable({
		data: bookings,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	})

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value
		setSearchQuery(query)

		if (query.length === 0 || query.length > 2) {
			fetchBookings(query)
		}
	}

	if (loading && bookings.length === 0) {
		return <BookingsListSkeleton />
	}

	return (
		<div className="w-full">
			<div className="flex items-center justify-between py-4">
				<Input
					placeholder="Search bookings..."
					value={searchQuery}
					onChange={handleSearch}
					className="max-w-sm"
				/>
				{error && <div className="text-sm text-red-500">{error}</div>}
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									{loading ? 'Loading bookings...' : 'No bookings found.'}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="text-muted-foreground text-sm">
					Page {table.getState().pagination.pageIndex + 1} of{' '}
					{table.getPageCount()}
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	)
}

function BookingsListSkeleton() {
	return (
		<div className="w-full">
			<div className="flex items-center py-4">
				<Skeleton className="h-10 w-[250px]" />
			</div>
			<div className="rounded-md border">
				<div className="flex h-12 items-center border-b px-4">
					<Skeleton className="h-5 w-[150px]" />
					<Skeleton className="ml-auto h-5 w-[100px]" />
				</div>
				{Array(5)
					.fill(null)
					.map((_, index) => (
						<div key={index} className="flex h-16 items-center border-b px-4">
							<Skeleton className="h-5 w-[200px]" />
							<Skeleton className="ml-auto h-5 w-[100px]" />
						</div>
					))}
			</div>
		</div>
	)
}
