'use client'

import React, { FC } from 'react'
import Textarea from '@/shared/Textarea'
import FormItem from '../FormItem'
import Input from '@/shared/Input'
import { useSelector } from 'react-redux'
import handleChangeCreateTour from './handleChangeCreateTour'
import { Field } from 'react-final-form'
import FieldInputFormItem from '@/app/add-listing/FieldInputFormItem'

export interface PageAddListing2Props {}

const PageAddListing2: FC<PageAddListing2Props> = () => {
	const phrases = [
		"Discover the city's most iconic landmarks and hidden gems",
		"Learn about the city's history, culture, and architecture",
		"Explore the city's most famous neighborhoods and districts",
		"Visit the city's most famous landmarks and attractions",
		'Enjoy a guided tour of the city with a local guide',
	]
	const service = useSelector(
		(state: any) => state.creatingServiceSlice.service,
	)
	console.log('service: ', service)
	return (
		<>
			<div className="space-y-8">
				<h2 className="text-2xl font-semibold">
					Your place description for client
				</h2>
				<br />
				<FieldInputFormItem
					name={'name'}
					label="What is the customer-facing title of your product?"
					placeholder="What is the customer-facing title of your product?"
				/>
				<FormItem label="Add a full description">
					<span className="smallTextGray">
						Provide all the details about what the customer will see and
						experience during the activity, in the correct order. Bring the
						activity to life and write at least 500 characters.
					</span>
					<Textarea
						placeholder="..."
						onChange={(e) => {
							handleChangeCreateTour({
								path: 'overview',
								value: e.target.value,
							})
						}}
						defaultValue={service.overview}
						rows={4}
					/>
				</FormItem>
				<div>
					<h6 className="text-1sl font-semibold">Summarize the highlights</h6>
					<span className="smallTextGray">
						Provide all the details about what the customer will see and
						experience during the activity, in the correct order. Bring the
						activity to life and write at least 500 characters.
					</span>
					<div className="space-y-2">
						{service?.highlights?.length <= 0
							? phrases.map((placeholder, index) => (
									<FormItem
										key={index}

										// label="What is the customer-facing title of your product?"
									>
										<Input placeholder={placeholder} />
									</FormItem>
								))
							: service?.highlights?.map((placeholder: any, index: any) => (
									<FormItem
										key={index}

										// label="What is the customer-facing title of your product?"
									>
										<Input defaultValue={placeholder.name} />
									</FormItem>
								))}
					</div>
				</div>
			</div>
		</>
	)
}

export default PageAddListing2
