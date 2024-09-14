import React, { FC } from 'react'
import Textarea from '@/shared/Textarea'
import FormItem from '../FormItem'
import Input from '@/shared/Input'

export interface PageAddListing2Props {}

const PageAddListing2: FC<PageAddListing2Props> = () => {
	const inputs = Array.from({ length: 5 }, (_, i) => `Input ${i + 1}`)
	const phrases = [
		"Discover the city's most iconic landmarks and hidden gems",
		"Learn about the city's history, culture, and architecture",
		"Explore the city's most famous neighborhoods and districts",
		"Visit the city's most famous landmarks and attractions",
		'Enjoy a guided tour of the city with a local guide',
	]

	return (
		<>
			<div className="space-y-8">
				<h2 className="text-2xl font-semibold">
					Your place description for client
				</h2>
				<br />
				<FormItem label="What is the customer-facing title of your product?">
					<Input />
				</FormItem>
				<FormItem label="Add a full description">
					<span className="mt-2 block text-neutral-500 dark:text-neutral-400">
						Provide all the details about what the customer will see and
						experience during the activity, in the correct order. Bring the
						activity to life and write at least 500 characters.
					</span>
					<Textarea placeholder="..." rows={14} />
				</FormItem>
				<div>
					<h6 className="text-1sl font-semibold">Summarize the highlights</h6>
					<span className="mt-2 block text-neutral-500 dark:text-neutral-400">
						Provide all the details about what the customer will see and
						experience during the activity, in the correct order. Bring the
						activity to life and write at least 500 characters.
					</span>
					<div className="space-y-2">
						{phrases.map((placeholder, index) => (
							<FormItem
								key={index}

								// label="What is the customer-facing title of your product?"
							>
								<Input placeholder={placeholder} />
							</FormItem>
						))}
					</div>
				</div>
			</div>
		</>
	)
}

export default PageAddListing2
