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
import { ArrowUpDown, Download, MoreHorizontal, Printer } from 'lucide-react'

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

type Invoice = {
	id: string
	customer: string
	amount: string
	status: 'paid' | 'pending' | 'overdue'
	date: string
}

export function InvoicesList() {
	const [invoices, setInvoices] = useState<Invoice[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [searchQuery, setSearchQuery] = useState('')

	const fetchInvoices = async (query = '') => {
		setLoading(true)
		setError(null)
		try {
			const url = query
				? `/api/dashboard/finance/invoices?search=${encodeURIComponent(query)}`
				: '/api/dashboard/finance/invoices'
			const response = await fetch(url)

			if (!response.ok) {
				throw new Error('Failed to fetch invoices')
			}

			const data = await response.json()
			setInvoices(data.invoices || [])
		} catch (err) {
			console.error('Error fetching invoices:', err)
			setError('Failed to load invoices. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchInvoices()
	}, [])

	const columns: ColumnDef<Invoice>[] = [
		{
			accessorKey: 'id',
			header: 'Invoice ID',
			cell: ({ row }) => (
				<div className="font-medium">{row.getValue('id')}</div>
			),
		},
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
			cell: ({ row }) => <div>{row.getValue('customer')}</div>,
		},
		{
			accessorKey: 'date',
			header: 'Date',
			cell: ({ row }) => <div>{row.getValue('date')}</div>,
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
							status === 'paid'
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
				const invoice = row.original

				return (
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
								<Download className="mr-2 h-4 w-4" />
								Download
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Printer className="mr-2 h-4 w-4" />
								Print
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Send to Email</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
		},
	]

	const table = useReactTable({
		data: invoices,
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
			fetchInvoices(query)
		}
	}

	if (loading && invoices.length === 0) {
		return <InvoicesListSkeleton />
	}

	return (
		<div className="w-full">
			<div className="flex items-center justify-between py-4">
				<Input
					placeholder="Search invoices..."
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
									{loading ? 'Loading invoices...' : 'No invoices found.'}
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

function InvoicesListSkeleton() {
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
