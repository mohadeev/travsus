'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	fetchCompanies,
	setActiveCompany,
	selectAllCompanies,
	selectActiveCompany,
	selectCompanyStatus,
} from '@/app/GlobalRedux/Features/companySlice/companySlice'
import type { AppDispatch } from '@/app/GlobalRedux/store'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Pencil, Trash2, Building, Hotel } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function CompanySettings() {
	const router = useRouter()
	const dispatch = useDispatch<AppDispatch>()

	const companies = useSelector(selectAllCompanies)
	const activeCompany = useSelector(selectActiveCompany)
	const status = useSelector(selectCompanyStatus)

	useEffect(() => {
		dispatch(fetchCompanies())
	}, [dispatch])

	const handleSetActive = async (companyId: string) => {
		await dispatch(setActiveCompany(companyId))
	}

	const handleEditCompany = (companyId: string) => {
		// Navigate to edit company page
		router.push(`/dashboard/company/${companyId}/edit`)
	}

	const handleDeleteCompany = async (companyId: string) => {
		// Delete company logic (to be implemented)
		console.log('Delete company:', companyId)
	}

	const createNewCompany = () => {
		router.push('/dashboard/company/create')
	}

	if (status === 'loading' && !companies.length) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						<Skeleton className="h-8 w-[200px]" />
					</CardTitle>
					<CardDescription>
						<Skeleton className="h-4 w-[300px]" />
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Skeleton className="h-[200px] w-full" />
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Company Settings</CardTitle>
				<CardDescription>
					Manage your companies and set which one is active.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{companies.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-8">
						<p className="text-muted-foreground mb-4">
							You haven't created any companies yet.
						</p>
						<Button onClick={createNewCompany}>Create Company</Button>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{companies.map((company) => (
								<TableRow key={company.id}>
									<TableCell className="font-medium">{company.name}</TableCell>
									<TableCell>
										{company.type === 'travel_agency' ? (
											<div className="flex items-center gap-1">
												<Building className="h-4 w-4" />
												<span>Travel Agency</span>
											</div>
										) : (
											<div className="flex items-center gap-1">
												<Hotel className="h-4 w-4" />
												<span>Hotel/Stay</span>
											</div>
										)}
									</TableCell>
									<TableCell>
										{company.id === activeCompany?.id ? (
											<Badge variant="default">Active</Badge>
										) : (
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleSetActive(company.id)}
											>
												Set Active
											</Button>
										)}
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button
												variant="outline"
												size="icon"
												onClick={() => handleEditCompany(company.id)}
											>
												<Pencil className="h-4 w-4" />
												<span className="sr-only">Edit</span>
											</Button>
											<Button
												variant="outline"
												size="icon"
												onClick={() => handleDeleteCompany(company.id)}
												disabled={company.id === activeCompany?.id}
											>
												<Trash2 className="h-4 w-4" />
												<span className="sr-only">Delete</span>
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline" onClick={() => router.push('/dashboard')}>
					Back to Dashboard
				</Button>
				<Button onClick={createNewCompany}>Create Company</Button>
			</CardFooter>
		</Card>
	)
}
