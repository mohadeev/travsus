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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit, ArrowUpDown, Search, MoreHorizontal, Trash } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
	const toursPerPage = 10

	useEffect(() => {
		if (initialTours.length > 0) {
			setTours(initialTours)
			setLoading(false)
		}
	}, [initialTours])

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
								<Button
									variant="ghost"
									onClick={() => handleSort('name')}
									className="p-0 font-medium"
								>
									Tour Name
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant="ghost"
									onClick={() => handleSort('price')}
									className="p-0 font-medium"
								>
									Price
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant="ghost"
									onClick={() => handleSort('status')}
									className="p-0 font-medium"
								>
									Status
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant="ghost"
									onClick={() => handleSort('bookings')}
									className="p-0 font-medium"
								>
									Bookings
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant="ghost"
									onClick={() => handleSort('createdAt')}
									className="p-0 font-medium"
								>
									Created At
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</Button>
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
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" className="h-8 w-8 p-0">
													<span className="sr-only">Open menu</span>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem asChild>
													<Link href={`/dashboard/tours/${tour.id}/edit`}>
														<Edit className="mr-2 h-4 w-4" />
														Edit
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem className="text-red-600">
													<Trash className="mr-2 h-4 w-4" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
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
									<Link href={`/dashboard/tours/${tour.id}/edit`}>
										<Button size="sm" variant="outline">
											<Edit className="mr-2 h-4 w-4" />
											Edit
										</Button>
									</Link>
									<Button size="sm" variant="outline" className="text-red-600">
										<Trash className="mr-2 h-4 w-4" />
										Delete
									</Button>
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
						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
