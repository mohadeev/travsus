'use client'

import type React from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Nav } from '@/components/dashboard/nav'
import { CompanySelector } from '@/components/dashboard/company-selector'
import { DashboardShell } from '@/components/dashboard/shell'
import {
	fetchCompanies,
	fetchActiveCompany,
	selectActiveCompany,
	selectCompanyStatus,
	setActiveCompany,
} from '@/app/[locale]/GlobalRedux/Features/companySlice/companySlice'
import type { AppDispatch } from '@/app/[locale]/GlobalRedux/store'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const pathname = usePathname()
	const router = useRouter()
	const dispatch = useDispatch<AppDispatch>()

	// Get company data from Redux
	const activeCompany = useSelector(selectActiveCompany)
	const companyStatus = useSelector(selectCompanyStatus)

	useEffect(() => {
		async function loadCompanyData() {
			try {
				// setIsLoading(true)
				// Fetch companies first
				const companiesResult = await dispatch(fetchCompanies()).unwrap()
				console.log('companiesResult', companiesResult)
				// If we have no companies, redirect to create company page
				if (!companiesResult || companiesResult.length === 0) {
					// router.push('/dashboard/company/create')
					return
				}

				// Try to fetch active company
				try {
					await dispatch(fetchActiveCompany()).unwrap()
				} catch (error) {
					console.error('Error fetching active company:', error)
					// If we have companies but no active company, set the first one as active
					if (companiesResult.length > 0) {
						await dispatch(setActiveCompany(companiesResult[0].id)).unwrap()
					} else {
						// router.push('/dashboard/company/create')
					}
				}
			} catch (error) {
				console.error('Error loading company data:', error)
				// If no companies exist, redirect to create company page
				// router.push('/dashboard/company/create')
			} finally {
				setIsLoading(false)
			}
		}

		loadCompanyData()
	}, [dispatch, router])

	// Show loading state while checking for active company
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

	// If no active company and not loading, redirect to create company
	if (!activeCompany && companyStatus === 'succeeded') {
		router.push('/dashboard/company/create')
		return null
	}

	return (
		<div className="flex min-h-screen flex-col">
			<header className="sticky top-0 z-40 border-b bg-white">
				<div className="flex h-16 items-center justify-between px-4 py-4 md:px-6">
					{/* Left side: Logo */}
					<div className="flex items-center">
						{/* Logo */}
						<Link href="/">
							<Image
								src="https://www.travsus.com/_next/static/media/logo.d4fff429.png"
								alt="TRAVSUS Logo"
								width={100}
								height={40}
							/>
						</Link>

						{/* Desktop: Collapse button */}
						<div className="ml-2 hidden md:block">
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
					</div>

					{/* Right side: Company Selector and Menu */}
					<div className="flex items-center gap-2">
						{/* Company Selector - visible on both mobile and desktop */}
						<CompanySelector />

						{/* Mobile: Menu button */}
						<Sheet>
							<SheetTrigger asChild>
								<div className="cursor-pointer md:hidden">
									<Menu className="h-6 w-6 text-black" />
								</div>
							</SheetTrigger>
							<SheetContent side="left" className="h-full w-72 bg-white p-0">
								<div className="flex w-full items-start border-b bg-white px-6 py-4">
									<Image
										src="https://www.travsus.com/_next/static/media/logo.d4fff429.png"
										alt="TRAVSUS Logo"
										width={120}
										height={40}
									/>
								</div>
								<div className="h-full overflow-y-auto bg-white">
									<Nav isCollapsed={false} />
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</header>
			<div className="flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
				<aside
					className={cn(
						'fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 border-r bg-white py-6 pr-2 md:sticky md:block',
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
				<main className="flex w-full flex-col px-4 pb-20 pt-6 md:px-6">
					<DashboardShell>{children}</DashboardShell>
				</main>
			</div>
		</div>
	)
}
