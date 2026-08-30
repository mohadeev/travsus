'use client'
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, RefreshCw, Clock, Globe } from 'lucide-react'
import Image from 'next/image'

interface Visitor {
	id: string
	country: string
	countryCode: string
	lastActive: string
	browser: string
	os: string
	ip: string
	screenshots: Screenshot[]
	isActive: boolean
}

interface Screenshot {
	id: string
	timestamp: string
	imageUrl: string
}

export default function DashboardPage() {
	const [visitors, setVisitors] = useState<Visitor[]>([])
	const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// In a real app, this would connect to a WebSocket or use Server-Sent Events
		// to get real-time visitor data
		const fetchVisitors = async () => {
			setLoading(true)
			// This is mock data - in a real app, you would fetch from your API
			const mockVisitors: Visitor[] = [
				{
					id: 'v1',
					country: 'United States',
					countryCode: 'US',
					lastActive: new Date().toISOString(),
					browser: 'Chrome',
					os: 'Windows',
					ip: '192.168.1.1',
					isActive: true,
					screenshots: [
						{
							id: 's1',
							timestamp: new Date().toISOString(),
							imageUrl: '/placeholder.svg?height=720&width=1280',
						},
						{
							id: 's2',
							timestamp: new Date(Date.now() - 60000).toISOString(),
							imageUrl: '/placeholder.svg?height=720&width=1280',
						},
					],
				},
				{
					id: 'v2',
					country: 'Germany',
					countryCode: 'DE',
					lastActive: new Date().toISOString(),
					browser: 'Firefox',
					os: 'macOS',
					ip: '192.168.1.2',
					isActive: true,
					screenshots: [
						{
							id: 's3',
							timestamp: new Date().toISOString(),
							imageUrl: '/placeholder.svg?height=720&width=1280',
						},
					],
				},
				{
					id: 'v3',
					country: 'Japan',
					countryCode: 'JP',
					lastActive: new Date(Date.now() - 300000).toISOString(),
					browser: 'Safari',
					os: 'iOS',
					ip: '192.168.1.3',
					isActive: false,
					screenshots: [
						{
							id: 's4',
							timestamp: new Date(Date.now() - 300000).toISOString(),
							imageUrl: '/placeholder.svg?height=720&width=1280',
						},
					],
				},
			]

			setVisitors(mockVisitors)
			if (!selectedVisitor && mockVisitors.length > 0) {
				setSelectedVisitor(mockVisitors[0])
			}
			setLoading(false)
		}

		fetchVisitors()

		// Set up a polling interval to simulate real-time updates
		const interval = setInterval(fetchVisitors, 10000)

		return () => clearInterval(interval)
	}, [])

	const formatTime = (timestamp: string) => {
		return new Date(timestamp).toLocaleTimeString()
	}

	return (
		<div className="flex min-h-screen flex-col">
			<header className="bg-background sticky top-0 z-10 flex h-16 items-center gap-4 border-b px-6">
				<h1 className="text-lg font-semibold">Visitor Monitoring Dashboard</h1>
				<Button variant="outline" size="sm" className="ml-auto gap-1">
					<RefreshCw className="h-4 w-4" />
					Refresh
				</Button>
			</header>
			<div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
				<Tabs defaultValue="active" className="h-full space-y-6">
					<div className="flex items-center">
						<TabsList>
							<TabsTrigger value="active" className="relative">
								Active Visitors
								<Badge className="ml-2 bg-green-500 text-white">
									{visitors.filter((v) => v.isActive).length}
								</Badge>
							</TabsTrigger>
							<TabsTrigger value="all">All Visitors</TabsTrigger>
						</TabsList>
					</div>

					<div className="grid flex-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
						<TabsContent value="active" className="m-0">
							<div className="grid gap-4 md:col-span-1">
								{loading ? (
									<Card>
										<CardHeader>
											<CardTitle>Loading visitors...</CardTitle>
										</CardHeader>
									</Card>
								) : (
									visitors
										.filter((visitor) => visitor.isActive)
										.map((visitor) => (
											<Card
												key={visitor.id}
												className={`cursor-pointer ${selectedVisitor?.id === visitor.id ? 'border-primary' : ''}`}
												onClick={() => setSelectedVisitor(visitor)}
											>
												<CardHeader className="p-4">
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-2">
															<Avatar className="h-8 w-8">
																<AvatarFallback>
																	{visitor.countryCode}
																</AvatarFallback>
															</Avatar>
															<div>
																<CardTitle className="text-sm">
																	{visitor.ip}
																</CardTitle>
																<CardDescription className="flex items-center text-xs">
																	<Globe className="mr-1 h-3 w-3" />
																	{visitor.country}
																</CardDescription>
															</div>
														</div>
														{visitor.isActive && (
															<Badge
																variant="outline"
																className="border-green-200 bg-green-50 text-green-700"
															>
																<span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
																Live
															</Badge>
														)}
													</div>
												</CardHeader>
												<CardContent className="text-muted-foreground p-4 pt-0 text-xs">
													<div className="flex justify-between">
														<div className="flex items-center">
															<Clock className="mr-1 h-3 w-3" />
															{formatTime(visitor.lastActive)}
														</div>
														<div>
															{visitor.browser} / {visitor.os}
														</div>
													</div>
												</CardContent>
											</Card>
										))
								)}
							</div>
						</TabsContent>

						<TabsContent value="all" className="m-0">
							<div className="grid gap-4 md:col-span-1">
								{loading ? (
									<Card>
										<CardHeader>
											<CardTitle>Loading visitors...</CardTitle>
										</CardHeader>
									</Card>
								) : (
									visitors.map((visitor) => (
										<Card
											key={visitor.id}
											className={`cursor-pointer ${selectedVisitor?.id === visitor.id ? 'border-primary' : ''}`}
											onClick={() => setSelectedVisitor(visitor)}
										>
											<CardHeader className="p-4">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<Avatar className="h-8 w-8">
															<AvatarFallback>
																{visitor.countryCode}
															</AvatarFallback>
														</Avatar>
														<div>
															<CardTitle className="text-sm">
																{visitor.ip}
															</CardTitle>
															<CardDescription className="flex items-center text-xs">
																<Globe className="mr-1 h-3 w-3" />
																{visitor.country}
															</CardDescription>
														</div>
													</div>
													{visitor.isActive ? (
														<Badge
															variant="outline"
															className="border-green-200 bg-green-50 text-green-700"
														>
															<span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
															Live
														</Badge>
													) : (
														<Badge
															variant="outline"
															className="border-gray-200 bg-gray-50 text-gray-700"
														>
															Inactive
														</Badge>
													)}
												</div>
											</CardHeader>
											<CardContent className="text-muted-foreground p-4 pt-0 text-xs">
												<div className="flex justify-between">
													<div className="flex items-center">
														<Clock className="mr-1 h-3 w-3" />
														{formatTime(visitor.lastActive)}
													</div>
													<div>
														{visitor.browser} / {visitor.os}
													</div>
												</div>
											</CardContent>
										</Card>
									))
								)}
							</div>
						</TabsContent>

						<div className="md:col-span-2 lg:col-span-3">
							{selectedVisitor ? (
								<Card>
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle>
												Visitor Session: {selectedVisitor.ip}
											</CardTitle>
											<Badge className="flex items-center gap-1">
												<Eye className="h-3 w-3" />
												Live View
											</Badge>
										</div>
										<CardDescription>
											{selectedVisitor.country} • {selectedVisitor.browser} •{' '}
											{selectedVisitor.os}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{selectedVisitor.screenshots.length > 0 ? (
												selectedVisitor.screenshots.map((screenshot, index) => (
													<div key={screenshot.id} className="space-y-2">
														<div className="flex items-center justify-between text-sm">
															<div className="font-medium">
																Screenshot {index + 1} •{' '}
																{formatTime(screenshot.timestamp)}
															</div>
															{index === 0 && selectedVisitor.isActive && (
																<Badge
																	variant="outline"
																	className="border-green-200 bg-green-50 text-green-700"
																>
																	Latest
																</Badge>
															)}
														</div>
														<div className="aspect-video relative overflow-hidden rounded-lg border">
															<Image
																src={screenshot.imageUrl || '/placeholder.svg'}
																alt={`Screenshot ${index + 1}`}
																fill
																className="object-cover"
															/>
														</div>
													</div>
												))
											) : (
												<div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
													<p className="text-muted-foreground text-sm">
														No screenshots available
													</p>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							) : (
								<Card>
									<CardHeader>
										<CardTitle>
											Select a visitor to view their session
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
											<p className="text-muted-foreground text-sm">
												No visitor selected
											</p>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				</Tabs>
			</div>
		</div>
	)
}
