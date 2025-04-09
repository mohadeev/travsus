'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Dashboard Overview
export async function getDashboardStats() {
	try {
		const [totalRevenue, activeTours, pendingBookings, customerSatisfaction] =
			await Promise.all([
				calculateTotalRevenue(),
				getActiveTourCount(),
				getPendingBookingCount(),
				getAverageCustomerRating(),
			])

		return {
			totalRevenue,
			activeTours,
			pendingBookings,
			customerSatisfaction,
		}
	} catch (error) {
		console.error('Error fetching dashboard stats:', error)
		throw new Error('Failed to fetch dashboard statistics')
	}
}

async function calculateTotalRevenue() {
	// Calculate total revenue from all confirmed bookings
	const bookings = await prisma.booking.findMany({
		where: {
			bookingState: 'confirmed',
		},
		select: {
			totalPrice: true,
		},
	})

	const total = bookings.reduce((sum, booking) => {
		return sum + (booking.totalPrice || 0)
	}, 0)

	return {
		value: total.toFixed(2),
		percentageChange: 20.1, // This would be calculated based on previous period
	}
}

async function getActiveTourCount() {
	const count = await prisma.tour.count()
	return {
		value: count,
		percentageChange: 18.1, // This would be calculated based on previous period
	}
}

async function getPendingBookingCount() {
	const count = await prisma.booking.count({
		where: {
			bookingState: 'pending',
		},
	})

	return {
		value: count,
		percentageChange: 19.0, // This would be calculated based on previous period
	}
}

async function getAverageCustomerRating() {
	// This would need to be calculated from your review data
	// For now, returning a placeholder
	return {
		value: 4.8,
		percentageChange: 4.0,
	}
}

// Tours
export async function getTours(searchQuery = '') {
	try {
		const tours = await prisma.tour.findMany({
			where: {
				name: {
					contains: searchQuery,
					mode: 'insensitive',
				},
			},
			select: {
				id: true,
				name: true,
				price: true,
				updated: true,
				createdAt: true,
				bookings: {
					select: {
						id: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return tours.map((tour) => ({
			id: tour.id,
			name: tour.name || 'Untitled Tour',
			price: tour.price || '$0',
			status: tour.updated ? 'active' : 'draft',
			createdAt: tour.createdAt.toISOString().split('T')[0],
			bookings: tour.bookings.length,
		}))
	} catch (error) {
		console.error('Error fetching tours:', error)
		throw new Error('Failed to fetch tours')
	}
}

export async function createTour(formData: FormData) {
	try {
		const name = formData.get('name') as string
		const price = formData.get('price') as string
		const overview = formData.get('description') as string

		const tour = await prisma.tour.create({
			data: {
				name,
				price,
				overview,
				creatorId: '65f1e5b3e66c1e8d78a9b123', // Replace with actual user ID from auth
				updated: false,
			},
		})

		revalidatePath('/dashboard/tours')
		return { success: true, tourId: tour.id }
	} catch (error) {
		console.error('Error creating tour:', error)
		return { success: false, error: 'Failed to create tour' }
	}
}

// Bookings
export async function getBookings(status?: string, searchQuery = '') {
	try {
		const bookings = await prisma.booking.findMany({
			where: {
				...(status ? { bookingState: status } : {}),
				customer: {
					name: {
						contains: searchQuery,
						mode: 'insensitive',
					},
				},
			},
			select: {
				id: true,
				bookingState: true,
				totalPrice: true,
				orderNumber: true,
				createdAt: true,
				guests: true,
				customer: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				tour: {
					select: {
						id: true,
						name: true,
					},
				},
				selectedDate: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return bookings.map((booking) => ({
			id: booking.id,
			customer: booking.customer.name || 'Unknown Customer',
			tour: booking.tour.name || 'Unknown Tour',
			date: booking.selectedDate
				? new Date(booking.selectedDate.startDate).toISOString().split('T')[0]
				: 'N/A',
			status: booking.bookingState,
			amount: booking.totalPrice ? `$${booking.totalPrice.toFixed(2)}` : 'N/A',
			guests:
				booking.guests?.guestAdults || 0 + (booking.guests?.guestChildren || 0),
			orderNumber: booking.orderNumber,
		}))
	} catch (error) {
		console.error('Error fetching bookings:', error)
		throw new Error('Failed to fetch bookings')
	}
}

export async function updateBookingStatus(
	bookingId: string,
	newStatus: string,
) {
	try {
		await prisma.booking.update({
			where: { id: bookingId },
			data: {
				bookingState: newStatus,
				bookingStates: {
					push: {
						state: newStatus,
						by: 'admin', // Replace with actual user ID or role
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				},
			},
		})

		revalidatePath('/dashboard/bookings')
		return { success: true }
	} catch (error) {
		console.error('Error updating booking status:', error)
		return { success: false, error: 'Failed to update booking status' }
	}
}

// Customers
export async function getCustomers(searchQuery = '') {
	try {
		const users = await prisma.user.findMany({
			where: {
				name: {
					contains: searchQuery,
					mode: 'insensitive',
				},
			},
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
				customerBookings: {
					select: {
						id: true,
						totalPrice: true,
					},
				},
				createdAt: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return users.map((user) => {
			const totalSpent = user.customerBookings.reduce((sum, booking) => {
				return sum + (booking.totalPrice || 0)
			}, 0)

			return {
				id: user.id,
				name: user.name || 'Unknown User',
				email: user.email,
				phone: user.phone || 'N/A',
				totalSpent: `$${totalSpent.toFixed(2)}`,
				bookings: user.customerBookings.length,
				status: user.customerBookings.length > 0 ? 'active' : 'inactive',
			}
		})
	} catch (error) {
		console.error('Error fetching customers:', error)
		throw new Error('Failed to fetch customers')
	}
}

// Finance
export async function getFinanceStats() {
	try {
		const [totalRevenue, pendingPayments, invoicesSent, paidInvoices] =
			await Promise.all([
				calculateTotalRevenue(),
				calculatePendingPayments(),
				getInvoiceCount(),
				getPaidInvoiceCount(),
			])

		return {
			totalRevenue,
			pendingPayments,
			invoicesSent,
			paidInvoices,
		}
	} catch (error) {
		console.error('Error fetching finance stats:', error)
		throw new Error('Failed to fetch finance statistics')
	}
}

async function calculatePendingPayments() {
	// Calculate total from pending bookings
	const bookings = await prisma.booking.findMany({
		where: {
			bookingState: 'pending',
		},
		select: {
			totalPrice: true,
		},
	})

	const total = bookings.reduce((sum, booking) => {
		return sum + (booking.totalPrice || 0)
	}, 0)

	return {
		value: total.toFixed(2),
		percentageChange: 4.3, // This would be calculated based on previous period
	}
}

async function getInvoiceCount() {
	// Count bookings with invoices
	const count = await prisma.booking.count({
		where: {
			invoiceNumber: {
				not: null,
			},
		},
	})

	return {
		value: count,
		percentageChange: 12.0, // This would be calculated based on previous period
	}
}

async function getPaidInvoiceCount() {
	// Count confirmed bookings with invoices
	const count = await prisma.booking.count({
		where: {
			invoiceNumber: {
				not: null,
			},
			bookingState: 'confirmed',
		},
	})

	return {
		value: count,
		percentageChange: 8.0, // This would be calculated based on previous period
	}
}

export async function getInvoices(searchQuery = '') {
	try {
		const bookings = await prisma.booking.findMany({
			where: {
				invoiceNumber: {
					not: null,
				},
				customer: {
					name: {
						contains: searchQuery,
						mode: 'insensitive',
					},
				},
			},
			select: {
				id: true,
				invoiceNumber: true,
				bookingState: true,
				totalPrice: true,
				createdAt: true,
				customer: {
					select: {
						id: true,
						name: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return bookings.map((booking) => ({
			id: booking.invoiceNumber || booking.id,
			customer: booking.customer.name || 'Unknown Customer',
			amount: booking.totalPrice ? `$${booking.totalPrice.toFixed(2)}` : 'N/A',
			status:
				booking.bookingState === 'confirmed'
					? 'paid'
					: booking.bookingState === 'pending'
						? 'pending'
						: 'overdue',
			date: booking.createdAt.toISOString().split('T')[0],
		}))
	} catch (error) {
		console.error('Error fetching invoices:', error)
		throw new Error('Failed to fetch invoices')
	}
}

export async function getTransactions(searchQuery = '') {
	try {
		const bookings = await prisma.booking.findMany({
			where: {
				paymentIntentId: {
					not: null,
				},
				OR: [
					{
						customer: {
							name: {
								contains: searchQuery,
								mode: 'insensitive',
							},
						},
					},
					{
						tour: {
							name: {
								contains: searchQuery,
								mode: 'insensitive',
							},
						},
					},
				],
			},
			select: {
				id: true,
				paymentIntentId: true,
				bookingState: true,
				totalPrice: true,
				createdAt: true,
				tour: {
					select: {
						name: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return bookings.map((booking) => ({
			id: booking.paymentIntentId || booking.id,
			description: `Booking Payment - ${booking.tour.name || 'Unknown Tour'}`,
			amount: booking.totalPrice ? `$${booking.totalPrice.toFixed(2)}` : 'N/A',
			type: 'credit',
			date: booking.createdAt.toISOString().split('T')[0],
		}))
	} catch (error) {
		console.error('Error fetching transactions:', error)
		throw new Error('Failed to fetch transactions')
	}
}

// Recent Bookings for Dashboard
export async function getRecentBookings() {
	try {
		const bookings = await prisma.booking.findMany({
			take: 5,
			select: {
				id: true,
				bookingState: true,
				tour: {
					select: {
						name: true,
					},
				},
				customer: {
					select: {
						id: true,
						name: true,
						profileImage: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return bookings.map((booking) => ({
			id: booking.id,
			name: booking.customer.name || 'Unknown Customer',
			tour: booking.tour.name || 'Unknown Tour',
			avatar: booking.customer.profileImage
				? (booking.customer.profileImage as any).url ||
					'/placeholder.svg?height=32&width=32'
				: '/placeholder.svg?height=32&width=32',
			status: booking.bookingState,
		}))
	} catch (error) {
		console.error('Error fetching recent bookings:', error)
		throw new Error('Failed to fetch recent bookings')
	}
}

// Monthly revenue data for charts
export async function getMonthlyRevenueData() {
	try {
		// This would typically involve aggregating booking data by month
		// For now, returning sample data
		return [
			{ name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
			{ name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
			{ name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
			{ name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
			{ name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
			{ name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
			{ name: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
			{ name: 'Aug', total: Math.floor(Math.random() * 5000) + 1000 },
			{ name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 },
			{ name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 },
			{ name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
			{ name: 'Dec', total: Math.floor(Math.random() * 5000) + 1000 },
		]
	} catch (error) {
		console.error('Error fetching monthly revenue data:', error)
		throw new Error('Failed to fetch monthly revenue data')
	}
}
