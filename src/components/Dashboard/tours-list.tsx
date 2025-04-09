'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import type React from 'react'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
import { ArrowUpDown, MoreHorizontal, Pencil, Trash, Eye } from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuContent,
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

type Tour = {
	id: string
	name: string
	price: string
	status: 'active' | 'inactive' | 'draft'
	updated: boolean
	createdAt: string
	bookings: number
}

// Update the ToursList component to accept initialTours prop
export function ToursList({ initialTours = [] }: { initialTours?: Tour[] }) {
	const [tours, setTours] = useState<Tour[]>(initialTours)
	const [loading, setLoading] = useState(initialTours.length === 0)
	const [error, setError] = useState<string | null>(null)
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [searchQuery, setSearchQuery] = useState('')

	const fetchTours = async (query = '') => {
		if (initialTours.length > 0 && !query) {
			return
		}

		setLoading(true)
		setError(null)
		try {
			const url = query
				? `/api/dashboard/tours?search=${encodeURIComponent(query)}`
				: '/api/dashboard/tours'
			const response = await fetch(url)

			if (!response.ok) {
				throw new Error('Failed to fetch tours')
			}

			const data = await response.json()
			setTours(data.tours || [])
		} catch (err) {
			console.error('Error fetching tours:', err)
			setError('Failed to load tours. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (initialTours.length === 0) {
			fetchTours()
		}
	}, [initialTours.length])

	const columns: ColumnDef<Tour>[] = [
		{
			accessorKey: 'name',
			header: ({ column }) => {
				return (
					<div className="flex items-center">
						Tour Name
						<ArrowUpDown
							className="ml-2 h-4 w-4 cursor-pointer"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === 'asc')
							}
						/>
					</div>
				)
			},
			cell: ({ row }) => (
				<div className="font-medium">{row.getValue('name')}</div>
			),
		},
		{
			accessorKey: 'price',
			header: 'Price',
			cell: ({ row }) => <div>{row.getValue('price')}</div>,
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const status = row.getValue('status') as string

				// Add a special indicator for newly initialized tours
				if (status === 'draft' && row.original.updated === false) {
					return (
						<Badge
							variant="outline"
							className="border-yellow-300 bg-yellow-50 text-yellow-800"
						>
							<span className="flex items-center">
								<svg
									className="mr-1 h-3 w-3"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
								initialized
							</span>
						</Badge>
					)
				}

				return (
					<Badge
						variant={
							status === 'active'
								? 'default'
								: status === 'inactive'
									? 'secondary'
									: 'outline'
						}
					>
						{status}
					</Badge>
				)
			},
		},
		{
			accessorKey: 'bookings',
			header: ({ column }) => {
				return (
					<div className="flex items-center">
						Bookings
						<ArrowUpDown
							className="ml-2 h-4 w-4 cursor-pointer"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === 'asc')
							}
						/>
					</div>
				)
			},
			cell: ({ row }) => <div>{row.getValue('bookings')}</div>,
		},
		{
			accessorKey: 'createdAt',
			header: 'Created At',
			cell: ({ row }) => <div>{row.getValue('createdAt')}</div>,
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const tour = row.original

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="bg-white">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem>
								<Link
									href={`/dashboard/tours/${tour.id}/edit`}
									className="flex w-full items-center"
								>
									<Pencil className="mr-2 h-4 w-4" />
									Edit
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link
									href={`/dashboard/tours/${tour.id}`}
									className="flex w-full items-center"
								>
									<Eye className="mr-2 h-4 w-4" />
									View
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-red-600">
								<Trash className="mr-2 h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
		},
	]

	const table = useReactTable({
		data: tours,
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
			fetchTours(query)
		}
	}

	if (loading && tours.length === 0) {
		return <ToursListSkeleton />
	}

	return (
		<div className="w-full">
			<div className="flex items-center justify-between py-4">
				<Input
					placeholder="Search tours..."
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
									{loading ? 'Loading tours...' : 'No tours found.'}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-4 py-4">
				<div className="text-sm text-gray-600">
					Page {table.getState().pagination.pageIndex + 1} of{' '}
					{table.getPageCount()}
				</div>
				<div className="flex space-x-2">
					<button
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
					>
						<span className="sr-only">Previous</span>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M15 18l-6-6 6-6" />
						</svg>
					</button>
					<button
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
					>
						<span className="sr-only">Next</span>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M9 18l6-6-6-6" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	)
}

function ToursListSkeleton() {
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
