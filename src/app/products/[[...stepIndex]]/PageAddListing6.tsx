// Make sure this file has "use client" at the top if using Next.js 13 or newer
'use client'

import React, { FC } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import FormItem from '../FormItem'
import restrictedOrSpecialConsiderationGroups from '@/constants/restrictedOrSpecialConsiderationGroups'
import Select from '@/shared/Select'
import prohibitedItemsAndActivities from '@/constants/prohibitedItemsAndActivities'
import requiredAndRecommendedItems from '@/constants/requiredAndRecommendedItems'
import Textarea from '@/shared/Textarea'
import Input from '@/shared/Input'

interface Option {
	title: string
	data: any
	description: string | undefined | null
}

interface CheckboxesTagsProps {
	options: Option[]
}

const CheckboxesTags: FC<CheckboxesTagsProps> = ({ options }) => {
	const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
	const checkedIcon = <CheckBoxIcon fontSize="small" />

	return (
		<Autocomplete
			multiple
			id="checkboxes-tags-demo"
			options={options}
			disableCloseOnSelect
			getOptionLabel={(option) => option.title}
			renderOption={(props, option, { selected }) => {
				const { key, ...optionProps } = props
				return (
					<li key={key} {...optionProps}>
						<Checkbox
							icon={icon}
							checkedIcon={checkedIcon}
							style={{ marginRight: 8 }}
							checked={selected}
						/>
						{option.title}
					</li>
				)
			}}
			style={{ width: 500 }}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Search for items"
					placeholder="Searching"
				/>
			)}
		/>
	)
}

export interface PageAddListing3Props {}

const PageAddListing3: FC<PageAddListing3Props> = () => {
	// Make sure to populate this with actual data
	const CheckboxesTagsItemsData: Option[] = [
		{
			title: 'Who is this activity not suitable for? (optional)',
			description:
				'Add the types of travelers who should not join this activity, like under 18s or pregnant women. This information appears on the activity details page.',
			data: restrictedOrSpecialConsiderationGroups.map((item) => ({
				title: item,
			})),
		},
		{
			title: 'What’s not allowed? (optional)',
			description:
				'List any object, clothing, or action that’s not allowed on your activity, such as sleeveless shirts. This information appears on the activity details page & voucher.',
			data: prohibitedItemsAndActivities.map((item) => ({ title: item })),
		},
		{
			title:
				'What mandatory items must the customer bring with them? (optional)',
			description:
				'Such as a towel for a boat tour, or comfortable shoes for a hike. This information appears on the activity details page & voucher.',
			data: requiredAndRecommendedItems.map((item) => ({ title: item })),
		},
	]

	return (
		<>
			<h2 className="text-2xl font-semibold">Extra information </h2>
			{CheckboxesTagsItemsData.map(({ data, title, description }) => (
				<div key={title} className="space-y-8">
					<FormItem label={title}>
						<span className="smallTextGray">{description}</span>
						<CheckboxesTags options={data} />
					</FormItem>
				</div>
			))}
			<div className="space-y-8">
				<FormItem label="Add custom information before booking (optional)">
					<span className="smallTextGray">
						Add any remaining information that customers must know before they
						book. This information appears on the activity details page.
					</span>
					<Textarea placeholder="..." rows={5} />
				</FormItem>
			</div>
			<FormItem label="How can customers contact you in case of an emergency? (optional)">
				<span className="smallTextGray">
					This information appears on the voucher.
				</span>
				<Input
					className="mt-1.5"
					// value={formData.phone}
					name="phone"
					type="phone"
					onChange={(value: any) => {}}
				/>
			</FormItem>

			<div className="space-y-8">
				<FormItem label="What else do customers need to know before your activity? (optional)">
					<span className="smallTextGray">
						Provide any other logistical information that hasn&apos;t been
						covered elsewhere. This appears on the voucher.
					</span>
					<Textarea placeholder="..." rows={5} />
				</FormItem>
			</div>
		</>
	)
}

export default PageAddListing3
