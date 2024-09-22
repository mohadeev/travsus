import React, { FC } from 'react'
import Input from '@/shared/Input'
import Select from '@/shared/Select'
import FormItem from '../FormItem'
import { useSelector } from 'react-redux'
import handleChangeCreateTour from './handleChangeCreateTour'

export interface PageAddListing1Props {}

const PageAddListing1: FC<PageAddListing1Props> = () => {
	const productCategoryList = [
		{ title: 'Tour', value: 'tour' },
		{ title: 'Attraction ticket', value: 'attraction-ticket' },
	]
	const service = useSelector(
		(state: any) => state.creatingServiceSlice.service,
	)
	const productCategory = service?.productCategory
	return (
		<>
			<h2 className="text-2xl font-semibold">Create a new product </h2>
			<div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
			{/* FORM */}
			<div className="space-y-8">
				productCategory: {productCategory}
				{/* ITEM */}
				<FormItem
					label="Choose a product category"
					desc="Hotel: Professional hospitality businesses that usually have a unique style or theme defining their brand and decor"
				>
					<Select
						value={productCategory}
						onChange={(event) =>
							handleChangeCreateTour({
								path: 'productCategory',
								value: event.target.value,
							})
						}
					>
						{productCategoryList.map(({ value, title }, index) => (
							<option key={index} value={value}>
								{title}
							</option>
						))}
						{/* <option value="Hotel">Tour</option>
						<option value="Hotel">Attraction ticket</option> */}
						Other
						{/* <option value="Hotel">Hotel</option>
						<option value="Cottage">Cottage</option>
						<option value="Villa">Villa</option>
						<option value="Cabin">Cabin</option>
						<option value="Farm stay">Farm stay</option>
						<option value="Houseboat">Houseboat</option>
						<option value="Lighthouse">Lighthouse</option> */}
					</Select>
				</FormItem>
				{/* <FormItem
					label="Place name"
					desc="A catchy name usually includes: House name + Room name + Featured property + Tourist destination"
				>
					<Input placeholder="Places name" />
				</FormItem> */}
				{/* <FormItem
					label="Rental form"
					desc="Entire place: Guests have the whole place to themselves—there's a private entrance and no shared spaces. A bedroom, bathroom, and kitchen are usually included."
				>
					<Select>
						<option value="Hotel">Entire place</option>
						<option value="Private room">Private room</option>
						<option value="Share room">Share room</option>
					</Select>
				</FormItem> */}
			</div>
		</>
	)
}

export default PageAddListing1
