import Heading from '@/shared/Heading'
import Image from 'next/image'
import React from 'react'

export interface People {
	id: string
	name: string
	job: string
	avatar: string
}

const FOUNDER_DEMO: People[] = [
	{
		id: '1',
		name: `Skendoul Mouha`,
		job: 'founder and Chief Executive',
		avatar:
			'https://media.licdn.com/dms/image/v2/D4D03AQETvP90A5Anlg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1714695083171?e=1738800000&v=beta&t=uqOlKoNUdi99P-vPDLFcYf_jl0VHXwt2lcYZws-A2Hg',
	},
	// {
	// 	id: '4',
	// 	name: `Danien Jame`,
	// 	job: 'Co-founder and Chief Executive',
	// 	avatar:
	// 		'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
	// },
	// {
	// 	id: '3',
	// 	name: `Orla Dwyer`,
	// 	job: 'Co-founder, Chairman',
	// 	avatar:
	// 		'https://images.unsplash.com/photo-1560365163-3e8d64e762ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
	// },
	// {
	// 	id: '2',
	// 	name: `Dara Frazier`,
	// 	job: 'Co-Founder, Chief Strategy Officer',
	// 	avatar:
	// 		'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
	// },
]

const SectionFounder = () => {
	return (
		<div className="nc-SectionFounder relative">
			<Heading
				desc="We’re impartial and independent, and every day we create distinctive,
          world-class programmes and content"
			>
				⛱ Founder
			</Heading>
			<div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
				{FOUNDER_DEMO.map((item) => (
					<div key={item.id} className="max-w-sm">
						<div className="aspect-h-1 aspect-w-1 relative h-0 overflow-hidden rounded-xl">
							<Image
								fill
								className="object-cover"
								src={item.avatar}
								alt=""
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 30vw"
							/>
						</div>

						<h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-200 md:text-xl">
							{item.name}
						</h3>
						<span className="block text-sm text-neutral-500 dark:text-neutral-400 sm:text-base">
							{item.job}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

export default SectionFounder
