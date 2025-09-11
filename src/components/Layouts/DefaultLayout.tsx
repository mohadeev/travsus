'use client'
import React, { useState, ReactNode, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { businessSliceState } from '@/app/[locale]/GlobalRedux/Features/businessSlice/businessSlice'
import { useDispatch, useSelector } from 'react-redux'

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const dispatch = useDispatch()

	// Fetch company data from the API
	const fetchCompanyData = async () => {
		try {
			const response = await fetch('/api/company/get/company-data', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			// Check if the request was successful
			if (!response.ok) {
				console.error(`Error: ${response.status}`)
			}

			const data = await response.json()
			dispatch(businessSliceState({ path: 'company', value: data }))

			// setCompanyData(data) // Save the company data in state
		} catch (err: any) {
			console.log('err', err)
			// setError(err.message) // Save the error message
		} finally {
			// setLoading(false) // Stop loading when fetch completes
		}
	}

	useEffect(() => {
		fetchCompanyData()
	}, [])
	// const service = useSelector(
	// 	(state: any) => state.creatingServiceSlice.service,
	// )

	const company = useSelector((state: any) => state?.businessSlice?.company)
	return (
		<>
			{/* <!-- ===== Page Wrapper Start ===== --> */}
			<div className="flex">
				{/* <!-- ===== Sidebar Start ===== --> */}
				<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
				{/* <!-- ===== Sidebar End ===== --> */}

				{/* <!-- ===== Content Area Start ===== --> */}
				<div className="relative flex flex-1 flex-col lg:ml-72.5">
					{/* <!-- ===== Header Start ===== --> */}
					<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
					{/* <!-- ===== Header End ===== --> */}

					{/* <!-- ===== Main Content Start ===== --> */}
					<main>
						<div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
							{children}
						</div>
					</main>
					{/* <!-- ===== Main Content End ===== --> */}
				</div>
				{/* <!-- ===== Content Area End ===== --> */}
			</div>
			{/* <!-- ===== Page Wrapper End ===== --> */}
		</>
	)
}
