'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Heading2 from '@/shared/Heading2'

interface Collection {
	id: string
	title: string
	description: string
	imageUrl: string
}

interface CollectionsGridProps {
	layout?: 'row' | 'column'
}

export default function CollectionsGrid({
	layout = 'column',
}: CollectionsGridProps) {
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

	const [collections, setCollections] = useState<Collection[]>([
		{
			id: 'beach-resorts',
			title: 'Beach resorts',
			description: 'Relax and play where the waves whisper',
			imageUrl:
				'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/a5/ec/69/taghazout-beach.jpg?w=2000&h=-1&s=1',
		},
		{
			id: 'historical-landmarks',
			title: 'Historical landmarks',
			description: 'Explore landmarks with storied pasts',
			imageUrl:
				'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/94/e4/e7/20190519-104409-largejpg.jpg?w=1000&h=-1&s=1',
		},
		{
			id: 'architectural-landmarks',
			title: 'Architectural landmarks',
			description: 'Discover design from Deco to modern',
			imageUrl:
				'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/e6/10/a2/patio.jpg?w=2000&h=-1&s=1',
		},
		{
			id: 'historical-landmarks-2',
			title: 'Historical landmarks',
			description: 'Architectural splendors from another era',
			imageUrl:
				'https://images.pexels.com/photos/3889986/pexels-photo-3889986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		},
		{
			id: 'traditional-food',
			title: 'Traditional Food',
			description: 'Taste authentic flavors from around the world',
			imageUrl:
				'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/dc/b8/3b/attarin-medersa.jpg?w=1100&h=-1&s=1',
		},
		{
			id: 'hidden-gems',
			title: 'Hidden Gems',
			description: 'Discover secret spots off the beaten path',
			imageUrl:
				'https://images.pexels.com/photos/3889986/pexels-photo-3889986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
		},
	])

	// Collection card component to avoid duplication
	const CollectionCard = ({ collection }: { collection: Collection }) => (
		<Link
			href={`/collections/${collection.id}`}
			className="group relative overflow-hidden transition-all duration-300"
		>
			<div
				className={`relative overflow-hidden rounded-md ${
					layout === 'row' ? 'w-[220px] sm:w-[250px] md:w-[280px]' : 'w-full'
				} ${layout === 'column' ? 'aspect-[1/1.1]' : 'aspect-[1/1.3]'}`}
			>
				<Image
					src={collection.imageUrl || '/placeholder.svg'}
					alt={collection.title}
					fill
					className="object-cover transition-transform duration-300 group-hover:scale-105"
					sizes={
						layout === 'row'
							? '(max-width: 640px) 220px, (max-width: 768px) 250px, 280px'
							: '(max-width: 640px) 100%, (max-width: 1024px) 50vw, 33vw'
					}
				/>

				{/* Black gradient from bottom for text visibility */}
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div>

				{/* White top hover effect */}
				<div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

				<h2 className="absolute bottom-0 left-0 z-10 pb-[12px] pl-[12px] text-[18px] font-bold text-white sm:text-[20px]">
					{collection.title}
				</h2>
			</div>
			<div
				className={`pt-3 ${layout === 'row' ? 'w-[220px] sm:w-[250px] md:w-[280px]' : 'w-full'}`}
			>
				<p className="line-clamp-2 text-sm text-gray-700">
					{collection.description}
				</p>
			</div>
		</Link>
	)

	return (
		<>
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

			<div className="container mx-auto px-4 py-8">
				<Heading2
					heading="Browse collections"
					subHeading="Get ideas on what to do, see, and eat"
				/>

				{layout === 'column' ? (
					// Column layout - stacked vertically with smaller cards
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
						{collections.map((collection) => (
							<CollectionCard key={collection.id} collection={collection} />
						))}
					</div>
				) : (
					// Row layout - horizontal scrolling with navigation arrows
					<div className="relative">
						{/* Left navigation arrow */}
						<button
							onClick={scrollLeft}
							className="absolute left-0 top-1/2 z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-black bg-white transition-colors duration-200 hover:bg-black hover:text-white focus:outline-none sm:h-8 sm:w-8 md:h-10 md:w-10"
							aria-label="Scroll left"
						>
							<ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
						</button>

						{/* Scrollable container */}
						<div
							ref={scrollContainerRef}
							className="hide-scrollbar flex gap-5 overflow-x-auto py-0"
						>
							{collections.map((collection) => (
								<div key={collection.id} className="flex-none">
									<CollectionCard collection={collection} />
								</div>
							))}
						</div>

						{/* Right navigation arrow */}
						<button
							onClick={scrollRight}
							className="absolute right-0 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full border border-black bg-white transition-colors duration-200 hover:bg-black hover:text-white focus:outline-none sm:h-8 sm:w-8 md:h-10 md:w-10"
							aria-label="Scroll right"
						>
							<ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
						</button>
					</div>
				)}
			</div>
		</>
	)
}
