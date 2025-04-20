'use client'

import type React from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ChevronRight, Menu } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
				console.log('companyData: ', companyData)

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
					<div className="flex items-center gap-2">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="outline" size="icon" className="md:hidden">
									<Menu className="h-5 w-5" />
									<span className="sr-only">Toggle Menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-72">
								<div className="flex flex-col items-center py-4">
									<Image
										src="https://www.travsus.com/_next/static/media/logo.d4fff429.png"
										alt="TRAVSUS Logo"
										width={120}
										height={40}
									/>
									<span className="text-muted-foreground mt-1 text-xs font-medium">
										Business1
									</span>
								</div>
								<Nav isCollapsed={false} />
							</SheetContent>
						</Sheet>
						<Link href="/" className="hidden flex-col items-center md:flex">
							<Image
								src="https://www.travsus.com/_next/static/media/logo.d4fff429.png"
								alt="TRAVSUS Logo"
								width={100}
								height={40}
							/>
							<span className="text-muted-foreground mt-1 text-xs font-medium">
								Business
							</span>
						</Link>

						<p
							onClick={() => setIsCollapsed(!isCollapsed)}
							className={cn(
								'flex hidden cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-white transition-colors md:flex',
							)}
						>
							<span className={cn('h-5 w-5 text-black')}>
								<ChevronRight
									className={cn(
										'h-4 w-4 transition-all',
										isCollapsed ? '' : 'rotate-180',
									)}
								/>{' '}
							</span>
						</p>
					</div>
					<nav className="flex items-center">
						<p
							className={cn(
								'flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-white transition-colors',
							)}
						>
							<span className={cn('h-5 w-5 text-black')}>
								<ChevronRight
									className={cn('h-4 w-4 rotate-180 transition-all')}
								/>{' '}
							</span>
						</p>
					</nav>
				</div>
			</header>
			<div className="flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
				<aside
					className={cn(
						'fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 md:sticky md:block',
						isCollapsed ? 'md:w-[70px]' : 'md:w-[220px] lg:w-[240px]',
					)}
				>
					{!isCollapsed && (
						<div className="mb-6 flex flex-col items-center md:hidden">
							<Image
								src="https://www.travsus.com/_next/static/media/logo.d4fff429.png"
								alt="TRAVSUS Logo"
								width={120}
								height={40}
								className="mb-1"
							/>
							<span className="text-muted-foreground text-xs font-medium">
								Business
							</span>
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
