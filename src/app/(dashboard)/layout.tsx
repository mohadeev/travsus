'use client'

import type React from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Nav } from '@/components/dashboard/nav'
import { getCompanyData } from '@/lib/api-client'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const pathname = usePathname()
	const router = useRouter()

	useEffect(() => {
		async function checkCompanyExists() {
			try {
				setIsLoading(true)
				const companyData = await getCompanyData()

				// Check if company data exists and has essential fields
				if (
					!companyData ||
					!companyData.id ||
					!companyData.name ||
					Object.keys(companyData).length === 0
				) {
					// Redirect to list-my-business page if no company exists
					router.push('/list-my-business')
				}
			} catch (error) {
				console.error('Error checking company:', error)
				// Redirect on error (likely no company found)
				router.push('/list-my-business')
			} finally {
				setIsLoading(false)
			}
		}

		checkCompanyExists()
	}, [router])

	// Show loading state while checking for company
	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex flex-col items-center">
					<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
					<p className="mt-4 text-sm text-gray-500">
						Loading your dashboard...
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="flex min-h-screen flex-col">
			<header className="sticky top-0 z-40 border-b bg-white">
				<div className="flex h-16 items-center justify-between px-4 py-4 md:px-6">
					{/* Mobile: Logo on left */}
					<div className="md:hidden">
						<Image
							src="https://www.travsus.com/_next/static/media/logo.d4fff429.png"
							alt="TRAVSUS Logo"
							width={100}
							height={40}
						/>
					</div>

					{/* Desktop: Logo and collapse button */}
					<div className="hidden items-center gap-2 md:flex">
						<Link href="/">
							<Image
								src="https://www.travsus.com/_next/static/media/logo.d4fff429.png"
								alt="TRAVSUS Logo"
								width={100}
								height={40}
							/>
						</Link>

						<button
							onClick={() => setIsCollapsed(!isCollapsed)}
							className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium transition-colors"
						>
							<span className="h-5 w-5 text-black">
								{isCollapsed ? (
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
										className="h-4 w-4"
									>
										<polyline points="9 18 15 12 9 6" />
									</svg>
								) : (
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
										className="h-4 w-4"
									>
										<polyline points="15 18 9 12 15 6" />
									</svg>
								)}
							</span>
						</button>
					</div>

					{/* Mobile: Menu button on right */}
					<Sheet>
						<SheetTrigger asChild>
							<div className="cursor-pointer md:hidden">
								<Menu className="h-6 w-6 text-black" />
							</div>
						</SheetTrigger>
						<SheetContent side="left" className="w-72 bg-white p-0">
							<div className="flex w-full items-start border-b bg-white px-6 py-4">
								<Image
									src="https://www.travsus.com/_next/static/media/logo.d4fff429.png"
									alt="TRAVSUS Logo"
									width={120}
									height={40}
								/>
							</div>
							<div className="h-full bg-white">
								<Nav isCollapsed={false} />
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</header>
			<div className="flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
				<aside
					className={cn(
						'fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r bg-white py-6 pr-2 md:sticky md:block',
						isCollapsed ? 'md:w-[70px]' : 'md:w-[220px] lg:w-[240px]',
					)}
				>
					{!isCollapsed && (
						<div className="mb-6 px-6 md:hidden">
							<Image
								src="https://www.travsus.com/_next/static/media/logo.d4fff429.png"
								alt="TRAVSUS Logo"
								width={120}
								height={40}
							/>
						</div>
					)}
					<Nav isCollapsed={isCollapsed} />
				</aside>
				<main className="flex w-full flex-col overflow-hidden px-4 pt-6 md:px-6">
					{children}
				</main>
			</div>
		</div>
	)
}
