import React, { FC } from 'react'
import { DEMO_CAR_LISTINGS } from '@/data/listings'
import { CarDataType } from '@/data/types'
import Pagination from '@/shared/Pagination'
import TabFilters from './TabFilters'
import Heading2 from '@/shared/Heading2'
import CarCard from '@/components/CarCard'
import VarticalExperiencesCard from '@/components/cards/VarticalExperiencesCard'

export interface SectionGridVerticalCardProps {
	className?: string
	data?: CarDataType[]
}

const DEMO_DATA: CarDataType[] = DEMO_CAR_LISTINGS.filter((_, i) => i < 12)
const activities = [
	{
		name: ' Architecture',
		images: [
			{
				url: 'https://images.pexels.com/photos/3889986/pexels-photo-3889986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
			},
		],
	},
	{
		name: ' Desert safaris',
		images: [
			{
				url: 'https://images.pexels.com/photos/20450505/pexels-photo-20450505/free-photo-of-riding-a-quad-through-the-desert.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
			},
		],
	},
	{
		name: ' Photography tours',
		images: [
			{
				url: 'https://images.pexels.com/photos/21336291/pexels-photo-21336291/free-photo-of-woman-in-a-rocky-cave.jpeg?auto=compress&cs=tinysrgb&w=600',
			},
		],
	},
	{
		name: ' Jeep & 4WD tours',
		images: [
			{
				url: 'https://images.pexels.com/photos/15464846/pexels-photo-15464846/free-photo-of-jeep-on-desert-on-shore.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
			},
		],
	},
	{
		name: 'Hiking',
		images: [
			{
				url: '    https://images.pexels.com/photos/20819246/pexels-photo-20819246/free-photo-of-people-hiking-with-backpacks-in-forest.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
			},
		],
	},
	{
		name: 'Beach Tours',
		images: [
			{
				url: 'https://img.freepik.com/free-photo/beautiful-couple-showing-affection-beach-near-ocean_23-2150367611.jpg?t=st=1727608889~exp=1727612489~hmac=1aa164a268e8c77ea2c4cacfec1c3274521f10725c86c3ef4d3a8230363b8b77&w=360',
			},
		],
	},
	// Camel riding tours
	// { name: " Architecture Desert safaris Photography tours" },
]
const SectionGridVerticalCard: FC<SectionGridVerticalCardProps> = ({
	className = '',
	data = DEMO_DATA,
}) => {
	return (
		<div className={`nc-SectionGridVerticalCard ${className}`}>
			<Heading2
				heading="Cars in Tokyo"
				subHeading={
					<span className="mt-3 block text-neutral-500 dark:text-neutral-400">
						233 cars
						<span className="mx-2">·</span>
						Aug 12 - 18
					</span>
				}
			/>

			<div className="mb-8 lg:mb-11">
				<TabFilters />
			</div>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
				{activities.map((car: any, i: number) => (
					<VarticalExperiencesCard key={i} data={car} />
				))}
			</div>
			<div className="mt-16 flex items-center justify-center">
				<Pagination   currentPage={1}
          totalPages={8}
          onPageChange={()=>{}}/>
			</div>
		</div>
	)
}

export default SectionGridVerticalCard
