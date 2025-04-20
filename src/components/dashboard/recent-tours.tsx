'use client'

import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

type Tour = {
	id: string
	name: string
	price: string
	status: string
	createdAt: string
	bookings: number
}

type RecentToursProps = {
	tours: Tour[]
}

export function RecentTours({ tours }: RecentToursProps) {
	return (
		<div className="space-y-8">
			{tours.map((tour) => (
				<div key={tour.id} className="flex items-center">
					<div className="mr-4 rounded-full bg-slate-100 p-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-4 w-4 text-slate-500"
						>
							<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
							<circle cx="12" cy="10" r="3" />
						</svg>
					</div>
					<div className="space-y-1">
						<p className="text-sm font-medium leading-none">{tour.name}</p>
						<p className="text-muted-foreground text-sm">{tour.price}</p>
					</div>
					<div className="ml-auto flex flex-col items-end">
						<Badge variant={tour.status === 'active' ? 'default' : 'secondary'}>
							{tour.status}
						</Badge>
						<p className="text-muted-foreground mt-1 text-xs">
							{formatDistanceToNow(new Date(tour.createdAt), {
								addSuffix: true,
							})}
						</p>
					</div>
				</div>
			))}
		</div>
	)
}
