export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import React from 'react'
// import SectionLatestPosts from '@/components/SectionLatestPosts'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { getBlogPosts } from '@/app/actions/getBlogPosts'
import SectionLatestPosts from './SectionLatestPosts'

export const dynamic = 'force-dynamic'

const POSTS_PER_PAGE = 10

export default async function BlogPage({
	searchParams,
}: {
	searchParams: { page?: string }
}) {
	const currentPage = Number(searchParams.page) || 1
	const allPosts = await getBlogPosts()

	const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE)
	const startIndex = (currentPage - 1) * POSTS_PER_PAGE
	const endIndex = startIndex + POSTS_PER_PAGE
	const currentPosts = allPosts.slice(startIndex, endIndex)

	return (
		<div className="nc-BlogPage relative overflow-hidden">
			{/* ======== BG GLASS ======== */}
			<BgGlassmorphism />
			{/* ======== ALL SECTIONS ======== */}
			{/* ======= START CONTAINER ============= */}
			<div className="container relative">
				{/* === SECTION 8 === */}
				<SectionLatestPosts
					className="py-16 lg:py-28"
					posts={currentPosts}
					currentPage={currentPage}
					totalPages={totalPages}
				/>

				{/* === SECTION 1 === */}
				<SectionSubscribe2 className="pb-16 lg:pb-28" />
			</div>
		</div>
	)
}
