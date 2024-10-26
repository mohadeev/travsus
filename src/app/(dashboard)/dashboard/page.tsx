'use client'

import ECommerce from '@/components/Dashboard/E-commerce'
import { Metadata } from 'next'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { useEffect, useRef, useState } from 'react'
import allToursFetch from '@/utils/allToursFetch'

// export const metadata: Metadata = {
// 	title:
// 		'Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template',
// 	description: 'This is Next.js Home for TailAdmin Dashboard Template',
// }

export default function Home() {
	const [servicesData, setServicesData] = useState([])
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)

	// Create a ref for the container div
	const sectionRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const fetchTours = async () => {
			setLoading(true)
			const data = await allToursFetch(currentPage)
			if (data?.allToursData) {
				setServicesData(data.allToursData)
				setTotalPages(data.totalPages)
				setLoading(false)
			}
		}
		fetchTours()
	}, [currentPage])

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage)

		// Scroll to the specific div using the ref
		sectionRef.current?.scrollIntoView({
			behavior: 'smooth', // Smooth scrolling effect
			block: 'start', // Align to the top of the div
		})
	}
	return (
		<>
			<DefaultLayout>
				<ECommerce servicesData={servicesData} />
			</DefaultLayout>
		</>
	)
}
