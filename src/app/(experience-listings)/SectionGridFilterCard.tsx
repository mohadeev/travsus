// 'use client'
// import React, { FC, useEffect, useState } from 'react'
// import { DEMO_EXPERIENCES_LISTINGS } from '@/data/listings'
// import { ExperiencesDataType, StayDataType } from '@/data/types'
// import Pagination from '@/shared/Pagination'
// import TabFilters from './TabFilters'
// import Heading2 from '@/shared/Heading2'
// import ExperiencesCard from '@/components/ExperiencesCard'
// import { useSelector } from 'react-redux'
// import allToursFetch from '@/utils/allToursFetch'
// import ContainerExperiencesCardSkeleton from '@/components/ContainerExperiencesCardSkeleton'
// import { HeadingSkeleton } from '@/shared/Heading'

// export interface SectionGridFilterCardProps {
// 	className?: string
// 	data?: StayDataType[]
// }

// const DEMO_DATA: ExperiencesDataType[] = DEMO_EXPERIENCES_LISTINGS.filter(
// 	(_, i) => i < 8,
// )

// const SectionGridFilterCard: FC<SectionGridFilterCardProps> = ({
// 	className = '',
// 	data = DEMO_DATA,
// }) => {
// 	const user = useSelector((state: any) => state.userReducer.userData)
// 	const [servicesData, setServicesData] = useState([])
// 	const [loading, setLoading] = useState(true);

	
// 	useEffect(() => {
// 		allToursFetch().then((data) => {
// 			if (data?.allToursData) {
// 				setServicesData(data.allToursData)
// 				setLoading(false)
// 			}
// 		})

// 		return () => {}
// 	}, [])

// 	return (
// 		<div className={`nc-SectionGridFilterCard ${className}`}>
			
// 			{loading ? (
//   <HeadingSkeleton isCenter={false} />
// ) : (
//   <Heading2
//     heading={`Experiences in ${user?.currentGeo?.country}`}
//     subHeading={
//       <span className="mt-3 block text-neutral-500 dark:text-neutral-400">
//         233 experiences
//         <span className="mx-2">·</span>
//         Aug 12 - 18
//         <span className="mx-2">·</span>
//         2 Guests
//       </span>
//     }
//   />
// )}
// 			<div className="mb-8 lg:mb-11">
// 				<TabFilters loading={loading}/>
// 			</div>
// 			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 2xl:grid-cols-4">
// 				{servicesData.map((stay: any) => (
// 					<ExperiencesCard key={stay?.id} data={stay} />
// 				))}
// 				{loading && 	<ContainerExperiencesCardSkeleton />}

// 			</div>
// 			<div className="mt-16 flex items-center justify-center">
// 				<Pagination />
// 			</div>
// 		</div>
// 	)
// }

// export default SectionGridFilterCard
'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import Pagination from '@/shared/Pagination'
import Heading2 from '@/shared/Heading2'
import ExperiencesCard from '@/components/ExperiencesCard'
import allToursFetch from '@/utils/allToursFetch'
import ContainerExperiencesCardSkeleton from '@/components/ContainerExperiencesCardSkeleton'
import { HeadingSkeleton } from '@/shared/Heading'
import TabFilters from './TabFilters'

const SectionGridFilterCard: FC = ({ className = '' }: any) => {
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
    // Attach the ref to the div you want to scroll to
    <div ref={sectionRef} className={`nc-SectionGridFilterCard ${className}`}>
      {loading ? (
        <HeadingSkeleton isCenter={false} />
      ) : (
        <Heading2
          heading="Discover New Experiences"
          subHeading="Explore the best tours and experiences"
        />
      )} 
	  			<div className="mb-8 lg:mb-11">
 				<TabFilters loading={loading}/>
 			</div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 2xl:grid-cols-4">
        {servicesData.map((stay: any) => (
          <ExperiencesCard key={stay?.id} data={stay} />
        ))}
        {loading && <ContainerExperiencesCardSkeleton />}
      </div>

      <div className="mt-16 flex items-center justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

export default SectionGridFilterCard
