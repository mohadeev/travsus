'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Plus, Search, X, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { useDispatch, useSelector } from 'react-redux'
import {
	setActiveCompany,
	selectAllCompanies,
	selectActiveCompany,
	selectCompanyStatus,
	selectIsChangingActive,
	type Company,
} from '@/app/[locale]/GlobalRedux/Features/companySlice/companySlice'
import type { AppDispatch } from '@/app/[locale]/GlobalRedux/store'

export function CompanySelector() {
	const [searchQuery, setSearchQuery] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const dispatch = useDispatch<AppDispatch>()

	// Get company data from Redux
	const companies = useSelector(selectAllCompanies)
	const activeCompany = useSelector(selectActiveCompany)
	const status = useSelector(selectCompanyStatus)
	const isChangingActive = useSelector(selectIsChangingActive)

	// Only show loading for initial fetch, not when changing active company
	const isLoading = status === 'loading' && companies.length === 0

	const isMobile =
		typeof window !== 'undefined' ? window.innerWidth < 768 : false

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	// Prevent body scrolling when mobile dropdown is open
	useEffect(() => {
		if (isMobile && isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [isMobile, isOpen])

	// Handle company selection
	const handleSelectCompany = async (company: Company) => {
		try {
			await dispatch(setActiveCompany(company.id)).unwrap()
			setIsOpen(false)
			toast({
				title: 'Company Changed',
				description: `Active company changed to ${company.name}`,
			})
		} catch (error) {
			console.error('Error setting active company:', error)
			toast({
				title: 'Error',
				description: 'Failed to set active company. Please try again.',
				variant: 'destructive',
			})
		}
	}

	// Handle adding a new company
	const handleAddNewCompany = () => {
		setIsOpen(false)
		router.push('/dashboard/company/create')
	}

	// Filter companies based on search query
	const filteredCompanies = companies?.filter((company) =>
		company.name.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	return (
		<div className="relative" ref={dropdownRef}>
			{/* Dropdown Trigger Button - Smaller on mobile */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex h-8 w-[120px] touch-manipulation items-center justify-between gap-1 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm hover:bg-gray-50 md:h-10 md:w-[180px] md:gap-2 md:px-3 md:py-2"
				aria-expanded={isOpen}
				aria-haspopup="true"
			>
				{activeCompany && activeCompany.company ? (
					<>
						{activeCompany.company.logo ? (
							<Image
								src={activeCompany.company.logo || '/placeholder.svg'}
								alt={activeCompany.company.name}
								width={16}
								height={16}
								className="rounded-sm md:h-5 md:w-5"
							/>
						) : (
							<div className="flex h-4 w-4 items-center justify-center rounded-sm bg-gray-200 md:h-5 md:w-5">
								<span className="text-xs font-medium text-gray-600">
									{activeCompany.company.name.charAt(0)}
								</span>
							</div>
						)}
						<span className="flex-1 truncate text-left text-xs font-medium md:text-sm">
							{activeCompany.company.name}
						</span>
					</>
				) : (
					<span className="text-xs text-gray-500 md:text-sm">
						Select company
					</span>
				)}
				<ChevronDown className="h-3 w-3 text-gray-500 md:h-4 md:w-4" />
			</button>

			{/* Mobile Dropdown */}
			{isOpen && (
				<div
					className={cn(
						'fixed inset-0 z-50 flex flex-col bg-black bg-opacity-50 md:hidden',
						isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
					)}
				>
					<div className="mt-auto flex max-h-[80vh] flex-col rounded-t-xl bg-white">
						{/* Header */}
						<div className="flex items-center justify-between border-b p-4">
							<h3 className="font-semibold">Select Company</h3>
							<button
								onClick={() => setIsOpen(false)}
								className="rounded-full p-1 hover:bg-gray-100"
								aria-label="Close"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						{/* Search */}
						<div className="border-b p-3">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
								<Input
									placeholder="Find a company"
									className="h-10 pl-9"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>

						{/* Companies List */}
						<div className="flex-1 overflow-y-auto">
							{isLoading ? (
								<div className="p-6 text-center text-sm text-gray-500">
									<div className="mr-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
									Loading companies...
								</div>
							) : filteredCompanies.length > 0 ? (
								<div className="py-2">
									{filteredCompanies.map((company) => (
										<div
											key={company.id}
											className={`flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50 ${
												activeCompany?.company?.id === company.id
													? 'bg-gray-50'
													: ''
											}`}
											onClick={() => handleSelectCompany(company)}
										>
											{company.logo ? (
												<Image
													src={company.logo || '/placeholder.svg'}
													alt={company.name}
													width={32}
													height={32}
													className="rounded-sm"
												/>
											) : (
												<div className="flex h-8 w-8 items-center justify-center rounded-sm bg-gray-200">
													<span className="text-sm font-medium text-gray-600">
														{company.name.charAt(0)}
													</span>
												</div>
											)}
											<span className="flex-1 text-sm font-medium">
												{company.name}
											</span>
											{company.isActive && (
												<Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
											)}
										</div>
									))}
								</div>
							) : (
								<div className="p-6 text-center text-sm text-gray-500">
									{searchQuery
										? 'No matching companies found'
										: 'No companies found'}
								</div>
							)}
						</div>

						{/* Add New Company Button */}
						<div className="border-t p-4">
							<button
								className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-3 font-medium text-white"
								onClick={handleAddNewCompany}
							>
								<Plus className="h-5 w-5" />
								<span>Add new company</span>
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Desktop Dropdown */}
			{isOpen && (
				<div className="absolute right-0 top-full z-50 mt-1 hidden w-[300px] rounded-md border border-gray-200 bg-white shadow-lg md:block">
					{/* Search Box */}
					<div className="border-b p-2">
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
							<Input
								placeholder="Find a company"
								className="h-9 pl-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>

					{/* Companies List */}
					<div className="max-h-[300px] overflow-y-auto py-1">
						{isLoading ? (
							<div className="p-4 text-center text-sm text-gray-500">
								Loading companies...
							</div>
						) : filteredCompanies.length > 0 ? (
							filteredCompanies.map((company) => (
								<div
									key={company.id}
									className={`flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-100 ${
										activeCompany?.company?.id === company.id
											? 'bg-gray-100'
											: ''
									}`}
									onClick={() => handleSelectCompany(company)}
								>
									{company.logo ? (
										<Image
											src={company.logo || '/placeholder.svg'}
											alt={company.name}
											width={24}
											height={24}
											className="rounded-sm"
										/>
									) : (
										<div className="flex h-6 w-6 items-center justify-center rounded-sm bg-gray-200">
											<span className="text-xs font-medium text-gray-600">
												{company.name.charAt(0)}
											</span>
										</div>
									)}
									<span className="flex-1 text-sm">{company.name}</span>
									{company.isActive && (
										<Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
									)}
								</div>
							))
						) : (
							<div className="p-4 text-center text-sm text-gray-500">
								{searchQuery
									? 'No matching companies found'
									: 'No companies found'}
							</div>
						)}
					</div>

					{/* Add New Company Button */}
					<div className="border-t p-2">
						<button
							className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
							onClick={handleAddNewCompany}
						>
							<Plus className="h-4 w-4" />
							<span className="font-medium">Add new company</span>
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
