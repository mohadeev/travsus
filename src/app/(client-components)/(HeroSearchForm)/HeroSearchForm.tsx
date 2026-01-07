'use client'

import React, { FC, useState } from 'react'
import ExperiencesSearchForm from './(experiences-search-form)/ExperiencesSearchForm'

export type SearchTab = 'Experiences' | 'Stays' | 'Cars' | 'Flights'

export interface HeroSearchFormProps {
	className?: string
	currentTab?: SearchTab
	currentPage?: 'Experiences' | 'Stays' | 'Cars' | 'Flights'
}

const HeroSearchForm: FC<HeroSearchFormProps> = ({
	className = '',
	currentTab = 'Experiences',
	currentPage,
}) => {
	const tabs: SearchTab[] = ['Experiences', 'Stays', 'Cars', 'Flights']
	const [tabActive, setTabActive] = useState<SearchTab>(currentTab)

	const renderTab = () => {
		return (
			<ul className="hiddenScrollbar ml-2 flex space-x-5 overflow-x-auto sm:ml-6 sm:space-x-8 md:ml-12 lg:space-x-11">
				{tabs.map((tab) => {
					const active = tab !== tabActive
					return (
						<li
							onClick={() => {
								alert('here')
								setTabActive(tab)
							}}
							className={`flex flex-shrink-0 cursor-pointer items-center text-sm font-medium lg:text-base ${
								active
									? ''
									: 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-400'
							} `}
							key={tab}
						>
							{active && (
								<span className="mr-2 block h-2.5 w-2.5 rounded-full bg-neutral-800 dark:bg-neutral-100" />
							)}
							<span>{tab} 1</span>
						</li>
					)
				})}
			</ul>
		)
	}

	const renderForm = () => {
		return <ExperiencesSearchForm />

		// switch (tabActive) {
		// 	case 'Stays':
		// 		return <ExperiencesSearchForm />
		// 	case 'Experiences':
		// 		return <ExperiencesSearchForm />
		// 	case 'Cars':
		// 		return <RentalCarSearchForm />
		// 	case 'Flights':
		// 		return <FlightSearchForm />

		// 	default:
		// 		return null
		// }
	}
	return (
		<div
			className={`nc-HeroSearchForm w-full max-w-6xl py-5 lg:py-0 ${className}`}
		>
			{renderTab()}
			{renderForm()}
		</div>
	)
}

export default HeroSearchForm
