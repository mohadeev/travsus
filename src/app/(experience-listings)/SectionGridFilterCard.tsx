'use client'
import { type FC, useEffect, useState, useRef } from 'react'
import { DEMO_EXPERIENCES_LISTINGS } from '@/data/listings'
import type { ExperiencesDataType, StayDataType } from '@/data/types'
import Pagination from '@/shared/Pagination'
import Heading2 from '@/shared/Heading2'
import ExperiencesCard from '@/components/ExperiencesCard'
import allToursFetch from '@/utils/allToursFetch'
import ContainerExperiencesCardSkeleton from '@/components/ContainerExperiencesCardSkeleton'
import { HeadingSkeleton } from '@/shared/Heading'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface SectionGridFilterCardProps {
	className?: string
	data?: StayDataType[]
	layout?: 'row' | 'column'
}

const DEMO_DATA: ExperiencesDataType[] = DEMO_EXPERIENCES_LISTINGS.filter(
	(_, i) => i < 8,
)

const SectionGridFilterCard: FC<SectionGridFilterCardProps> = ({
	className = '',
	data = DEMO_DATA,
	layout = 'column',
}) => {
	const [servicesData, setServicesData] = useState([])
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)

	// Create a ref for the container div
	const sectionRef = useRef<HTMLDivElement>(null)
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
		}
	}

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
		}
	}

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
		// Attach the ref to the div you want to scroll to
		<div
			ref={sectionRef}
			id="experiences_container"
			className={`nc-SectionGridFilterCard ${className}`}
		>
			{/* Custom CSS for hiding scrollbars */}
			<style jsx global>{`
				.hide-scrollbar::-webkit-scrollbar {
					display: none;
				}
				.hide-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
			`}</style>

			{loading ? (
				<HeadingSkeleton isCenter={false} />
			) : (
				<Heading2
					heading="Discover New Experiences"
					subHeading="Explore the best tours and experiences"
				/>
			)}

			{layout === 'column' ? (
				// Column layout - grid view with pagination
				<>
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
						{!loading &&
							servicesData.map((stay: any) => (
								<ExperiencesCard key={stay?.id} data={stay} />
							))}
						{loading && <ContainerExperiencesCardSkeleton />}
					</div>

					{!loading && (
						<div className="mt-16 flex items-center justify-center">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						</div>
					)}
				</>
			) : (
				// Row layout - horizontal scrolling with navigation arrows
				<div className="relative">
					{/* Left navigation arrow - only show when not loading */}
					{!loading && (
						<button
							onClick={scrollLeft}
							className="absolute left-0 top-1/2 z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-black bg-white transition-colors duration-200 hover:bg-black hover:text-white focus:outline-none sm:h-8 sm:w-8 md:h-10 md:w-10"
							aria-label="Scroll left"
						>
							<ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
						</button>
					)}

					{/* Scrollable container */}
					<div
						ref={scrollContainerRef}
						className="hide-scrollbar flex gap-5 overflow-x-auto py-0"
					>
						{!loading &&
							servicesData.map((stay: any) => (
								<div key={stay?.id} className="flex-none">
									<ExperiencesCard data={stay} size="small" />
								</div>
							))}
						{loading && <ContainerExperiencesCardSkeleton />}
					</div>

					{/* Right navigation arrow - only show when not loading */}
					{!loading && (
						<button
							onClick={scrollRight}
							className="absolute right-0 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full border border-black bg-white transition-colors duration-200 hover:bg-black hover:text-white focus:outline-none sm:h-8 sm:w-8 md:h-10 md:w-10"
							aria-label="Scroll right"
						>
							<ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
						</button>
					)}
				</div>
			)}
		</div>
	)
}

export default SectionGridFilterCard
