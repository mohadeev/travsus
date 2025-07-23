'use client'

import React, { FC, useRef } from 'react'
import Heading from '@/shared/Heading'
import Pagination from '@/shared/Pagination'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Card3 from './Card3'
import { useRouter } from 'next/navigation'

export interface SectionLatestPostsProps {
	posts: any[]
	className?: string
	postCardName?: 'card3'
	currentPage: number
	totalPages: number
}

const SectionLatestPosts: FC<SectionLatestPostsProps> = ({
	posts,
	postCardName = 'card3',
	className = '',
	currentPage,
	totalPages,
}) => {
	const router = useRouter()
	const sectionRef = useRef<HTMLDivElement>(null)

	const renderCard = (post: any) => {
		switch (postCardName) {
			case 'card3':
				return <Card3 key={post.id} className="" post={post} />
			default:
				return null
		}
	}

	const handlePageChange = (page: number) => {
		router.push(`/blog?page=${page}`)
		sectionRef.current?.scrollIntoView({
			behavior: 'smooth', // Smooth scrolling effect
			block: 'start', // Align to the top of the div
		})
	}

	return (
		<div
			ref={sectionRef}
			className={`nc-SectionLatestPosts relative ${className} mx-auto max-w-screen-xl px-4`}
		>
			<div className="flex w-full flex-col items-center">
				<div className="w-full max-w-4xl">
					<Heading className="text-center">Latest Articles 🎈</Heading>
					<div className={`mx-auto grid grid-cols-1 gap-6 md:gap-8`}>
						{posts.map((post) => renderCard(post))}
					</div>
					<div className="mt-12 flex flex-col items-center space-y-5 sm:flex-row sm:justify-center sm:space-x-3 sm:space-y-0 md:mt-20">
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
						{/* <ButtonPrimary
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage >= totalPages}
						>
							Show me more
						</ButtonPrimary> */}
					</div>
				</div>
			</div>
		</div>
	)
}

export default SectionLatestPosts
