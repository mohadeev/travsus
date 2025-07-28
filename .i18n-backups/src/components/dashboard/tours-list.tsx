'use client'

import { useState, useEffect } from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Edit, ArrowUpDown, Search, MoreHorizontal, Trash } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface Tour {
	id: string
	name: string
	price: number
	status: 'active' | 'draft'
	bookings: number
	createdAt: string
}

interface ToursListProps {
	initialTours?: Tour[]
}

export function ToursList({ initialTours = [] }: ToursListProps) {
	const [tours, setTours] = useState<Tour[]>(initialTours)
	const [searchQuery, setSearchQuery] = useState('')
	const [sortField, setSortField] = useState<keyof Tour>('name')
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
	const [loading, setLoading] = useState(initialTours.length === 0)
	const [currentPage, setCurrentPage] = useState(1)
	const [openActionId, setOpenActionId] = useState<string | null>(null)
	const toursPerPage = 10

	useEffect(() => {
		if (initialTours.length > 0) {
			setTours(initialTours)
			setLoading(false)
		}
	}, [initialTours])

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				openActionId &&
				!(event.target as Element).closest('.action-dropdown')
			) {
				setOpenActionId(null)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [openActionId])

	// Filter tours based on search query
	const filteredTours = tours.filter((tour) =>
		tour.name.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	// Sort tours based on sort field and direction
	const sortedTours = [...filteredTours].sort((a, b) => {
		if (sortField === 'name' || sortField === 'status') {
			return sortDirection === 'asc'
				? a[sortField].localeCompare(b[sortField])
				: b[sortField].localeCompare(a[sortField])
		} else {
			return sortDirection === 'asc'
				? (a[sortField] as number) - (b[sortField] as number)
				: (b[sortField] as number) - (a[sortField] as number)
		}
	})

	// Pagination
	const indexOfLastTour = currentPage * toursPerPage
	const indexOfFirstTour = indexOfLastTour - toursPerPage
	const currentTours = sortedTours.slice(indexOfFirstTour, indexOfLastTour)
	const totalPages = Math.ceil(sortedTours.length / toursPerPage)

	const handleSort = (field: keyof Tour) => {
		if (field === sortField) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
		} else {
			setSortField(field)
			setSortDirection('asc')
		}
	}

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
	}

	const toggleActionMenu = (id: string) => {
		setOpenActionId(openActionId === id ? null : id)
	}

	if (loading) {
		return (
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<Skeleton className="h-10 w-full" />
				</div>
				<div className="rounded-md border">
					<div className="h-12 border-b px-4 py-3">
						<div className="flex items-center justify-between">
							<Skeleton className="h-5 w-40" />
							<Skeleton className="h-5 w-20" />
						</div>
					</div>
					{Array(5)
						.fill(null)
						.map((_, i) => (
							<div key={i} className="border-b px-4 py-4">
								<div className="flex items-center justify-between">
									<Skeleton className="h-5 w-1/3" />
									<Skeleton className="h-5 w-20" />
								</div>
							</div>
						))}
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<Search className="text-muted-foreground h-4 w-4" />
				<Input
					placeholder="Search tours..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="h-10"
				/>
			</div>

			{/* Desktop view - Table */}
			<div className="hidden rounded-md border sm:block">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[200px]">
								<div
									onClick={() => handleSort('name')}
									className="flex cursor-pointer items-center font-medium"
								>
									Tour Name
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</div>
							</TableHead>
							<TableHead>
								<div
									onClick={() => handleSort('price')}
									className="flex cursor-pointer items-center font-medium"
								>
									Price
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</div>
							</TableHead>
							<TableHead>
								<div
									onClick={() => handleSort('status')}
									className="flex cursor-pointer items-center font-medium"
								>
									Status
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</div>
							</TableHead>
							<TableHead>
								<div
									onClick={() => handleSort('bookings')}
									className="flex cursor-pointer items-center font-medium"
								>
									Bookings
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</div>
							</TableHead>
							<TableHead>
								<div
									onClick={() => handleSort('createdAt')}
									className="flex cursor-pointer items-center font-medium"
								>
									Created At
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</div>
							</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentTours.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="h-24 text-center">
									No tours found.
								</TableCell>
							</TableRow>
						) : (
							currentTours.map((tour) => (
								<TableRow key={tour.id}>
									<TableCell className="font-medium">{tour.name}</TableCell>
									<TableCell>{formatCurrency(tour.price)}</TableCell>
									<TableCell>
										<Badge
											variant={tour.status === 'active' ? 'default' : 'outline'}
										>
											{tour.status}
										</Badge>
									</TableCell>
									<TableCell>{tour.bookings}</TableCell>
									<TableCell>{formatDate(tour.createdAt)}</TableCell>
									<TableCell className="text-right">
										<div className="action-dropdown relative inline-block">
											<button
												onClick={() => toggleActionMenu(tour.id)}
												className="rounded-full p-1 text-slate-600 hover:bg-slate-100"
											>
												<MoreHorizontal className="h-5 w-5" />
											</button>

											{openActionId === tour.id && (
												<div
													className="absolute right-0 top-full z-50 mt-1 w-36 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
													style={{ minWidth: '150px' }}
												>
													<div
														className="py-1"
														role="menu"
														aria-orientation="vertical"
													>
														<Link
															href={`/dashboard/tours/${tour.id}/edit`}
															className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
														>
															<Edit className="mr-3 h-4 w-4" /> Edit
														</Link>
														<button
															className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
															role="menuitem"
														>
															<Trash className="mr-3 h-4 w-4" /> Delete
														</button>
													</div>
												</div>
											)}
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Mobile view - Cards */}
			<div className="space-y-4 sm:hidden">
				{currentTours.length === 0 ? (
					<div className="rounded-md border p-6 text-center">
						No tours found.
					</div>
				) : (
					currentTours.map((tour) => (
						<Card key={tour.id} className="overflow-hidden">
							<CardContent className="p-0">
								<div className="border-b p-4">
									<div className="flex items-center justify-between">
										<h3 className="text-lg font-medium">{tour.name}</h3>
										<Badge
											variant={tour.status === 'active' ? 'default' : 'outline'}
										>
											{tour.status}
										</Badge>
									</div>
								</div>
								<div className="space-y-2 p-4">
									<div className="flex justify-between">
										<span className="text-muted-foreground text-sm">
											Price:
										</span>
										<span className="font-medium">
											{formatCurrency(tour.price)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground text-sm">
											Bookings:
										</span>
										<span>{tour.bookings}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground text-sm">
											Created:
										</span>
										<span>{formatDate(tour.createdAt)}</span>
									</div>
								</div>
								<div className="bg-muted/30 flex justify-end gap-2 p-4">
									<Link
										href={`/dashboard/tours/${tour.id}/edit`}
										className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
									>
										<Edit className="mr-2 h-4 w-4" />
										Edit
									</Link>
									<button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50">
										<Trash className="mr-2 h-4 w-4" />
										Delete
									</button>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>

			{/* Pagination - works for both views */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between py-4">
					<div className="text-muted-foreground text-sm">
						Page {currentPage} of {totalPages}
					</div>
					<div className="flex gap-1">
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Previous
						</button>
						<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Next
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
