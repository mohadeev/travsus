'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	BarChart,
	Calendar,
	CreditCard,
	FileText,
	Home,
	Map,
	Settings,
	Users,
	Plus,
	Clock,
	Check,
	X,
	DollarSign,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	TooltipProvider,
} from '@/components/ui/tooltip'

interface NavProps {
	isCollapsed: boolean
}

export function Nav({ isCollapsed }: NavProps) {
	const pathname = usePathname()

	return (
		<TooltipProvider>
			<div
				data-collapsed={isCollapsed}
				className="group flex flex-col gap-4 bg-white py-2 data-[collapsed=true]:py-2"
			>
				<nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
					{navItems.map((item, index) => {
						const isActive = pathname === item.href
						return (
							<Tooltip key={index} delayDuration={0}>
								<TooltipTrigger asChild>
									<Link
										href={item.href}
										className={cn(
											'hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
											isActive
												? 'bg-accent text-accent-foreground'
												: 'transparent',
											isCollapsed ? 'justify-center' : '',
										)}
									>
										<item.icon
											className={cn(
												'h-5 w-5',
												isActive ? 'text-primary' : 'text-muted-foreground',
											)}
										/>
										{!isCollapsed && <span>{item.title}</span>}
									</Link>
								</TooltipTrigger>
								{isCollapsed && (
									<TooltipContent
										side="right"
										className="flex items-center gap-4 border-gray-200 bg-white"
									>
										{item.title}
									</TooltipContent>
								)}
							</Tooltip>
						)
					})}
				</nav>

				{!isCollapsed && (
					<>
						<div className="mt-2">
							<div className="px-3 py-2">
								<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
									Tours
								</h2>
								<div className="space-y-1">
									{tourItems.map((item, index) => (
										<Link
											key={index}
											href={item.href}
											className={cn(
												'hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
												pathname === item.href
													? 'bg-accent text-accent-foreground'
													: 'transparent',
											)}
										>
											<item.icon className="h-4 w-4" />
											{item.title}
										</Link>
									))}
								</div>
							</div>
						</div>

						<div className="mt-2">
							<div className="px-3 py-2">
								<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
									Bookings
								</h2>
								<div className="space-y-1">
									{bookingItems.map((item, index) => (
										<Link
											key={index}
											href={item.href}
											className={cn(
												'hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
												pathname === item.href
													? 'bg-accent text-accent-foreground'
													: 'transparent',
											)}
										>
											<item.icon className="h-4 w-4" />
											{item.title}
										</Link>
									))}
								</div>
							</div>
						</div>

						<div className="mt-2">
							<div className="px-3 py-2">
								<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
									Finance
								</h2>
								<div className="space-y-1">
									{financeItems.map((item, index) => (
										<Link
											key={index}
											href={item.href}
											className={cn(
												'hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
												pathname === item.href
													? 'bg-accent text-accent-foreground'
													: 'transparent',
											)}
										>
											<item.icon className="h-4 w-4" />
											{item.title}
										</Link>
									))}
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</TooltipProvider>
	)
}

const navItems = [
	{
		title: 'Dashboard',
		href: '/dashboard',
		icon: Home,
	},
	{
		title: 'Tours',
		href: '/dashboard/tours',
		icon: Map,
	},
	{
		title: 'Bookings',
		href: '/dashboard/bookings',
		icon: Calendar,
	},
	{
		title: 'Customers',
		href: '/dashboard/customers',
		icon: Users,
	},
	{
		title: 'Finance',
		href: '/dashboard/finance',
		icon: CreditCard,
	},
	{
		title: 'Analytics',
		href: '/dashboard/analytics',
		icon: BarChart,
	},
	{
		title: 'Settings',
		href: '/dashboard/settings',
		icon: Settings,
	},
]

const tourItems = [
	{
		title: 'All Tours',
		href: '/dashboard/tours',
		icon: Map,
	},
	{
		title: 'Create Tour',
		href: '/dashboard/tours/create',
		icon: Plus,
	},
	{
		title: 'Edit Tours',
		href: '/dashboard/tours/edit',
		icon: Settings,
	},
]

const bookingItems = [
	{
		title: 'All Bookings',
		href: '/dashboard/bookings',
		icon: Calendar,
	},
	{
		title: 'Pending',
		href: '/dashboard/bookings/pending',
		icon: Clock,
	},
	{
		title: 'Confirmed',
		href: '/dashboard/bookings/confirmed',
		icon: Check,
	},
	{
		title: 'Cancelled',
		href: '/dashboard/bookings/cancelled',
		icon: X,
	},
]

const financeItems = [
	{
		title: 'Overview',
		href: '/dashboard/finance',
		icon: DollarSign,
	},
	{
		title: 'Invoices',
		href: '/dashboard/finance/invoices',
		icon: FileText,
	},
	{
		title: 'Transactions',
		href: '/dashboard/finance/transactions',
		icon: CreditCard,
	},
]
