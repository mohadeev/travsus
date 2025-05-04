'use client'
import React, { FC, useState } from 'react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Input from '@/shared/Input'

export interface PageAddListing5Props {}

const PageAddListing5: FC<PageAddListing5Props> = () => {
	const renderRadio = (
		name: string,
		id: string,
		label: string,
		defaultChecked?: boolean,
	) => {
		return (
			<div className="flex items-center">
				<input
					defaultChecked={defaultChecked}
					id={id + name}
					name={name}
					type="radio"
					className="!checked:bg-primary-500 h-6 w-6 border-neutral-300 bg-transparent text-primary-500 focus:ring-primary-500"
				/>
				<label
					htmlFor={id + name}
					className="ml-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
				>
					{label}
				</label>
			</div>
		)
	}

	const renderNoInclude = (text: string) => {
		return (
			<div className="flex items-center justify-between py-3">
				<span className="text-neutral-6000 font-medium dark:text-neutral-400">
					{text}
				</span>
				<i className="las la-times-circle cursor-pointer text-2xl text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"></i>
			</div>
		)
	}
	const [selectedValue, setSelectedValue] = useState<string | null>(null)

	const handleChange = (value: string) => {
		setSelectedValue(value)
	}

	return (
		<>
			<div>
				<h2 className="text-2xl font-semibold">
					Activity Details & Interactions
				</h2>
				<span className="smallTextGray">
					Participants must confirm their understanding of any specific
					requirements or guidelines before finalizing their booking.
				</span>
			</div>
			<div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
			{/* FORM */}
			<div className="space-y-8">
				{/* ITEM */}
				<div>
					<label className="text-lg font-semibold" htmlFor="">
						Is food included in your activity? 🍽️
					</label>
					<div className="mt-4 grid grid-cols-1 gap-5">
						<div className="flex flex-col">
							{renderRadio('food-included-in-your-activity', 'No', 'No', true)}
						</div>
						<div className="flex flex-col">
							{renderRadio('food-included-in-your-activity', 'Yes', 'Yes')}
						</div>
					</div>
				</div>
				<div>
					<label className="text-lg font-semibold" htmlFor="">
						Who will customers interact with? 🤝
					</label>
					<div className="mt-4 grid grid-cols-1 gap-5">
						{rolesAndDescriptions.map(({ role }, i) => (
							<div key={role} className="flex flex-col">
								{renderRadio('interact-guide', 'Do', role, i <= 0 && true)}
							</div>
						))}
						{/* <div className="flex flex-col">
							{renderRadio('Smoking', 'Do', 'Do not allow')}
						</div>
						<div className="flex flex-col">
							{renderRadio('Smoking', 'Allow', 'Allow', true)}
						</div> */}
					</div>
				</div>
				<div>
					<label className="text-lg font-semibold" htmlFor="">
						Is transportation used during this activity? 🚗
					</label>
					<div className="mt-4 grid grid-cols-1 gap-5">
						<div className="flex flex-col">
							{renderRadio('transportation', 'No', 'No', true)}
						</div>
						<div className="flex flex-col">
							{renderRadio('transportation', 'Yes', 'Yes')}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default PageAddListing5
const rolesAndDescriptions = [
	{
		role: 'Nobody',
		description:
			'Customers will navigate the activity or attraction independently without direct interaction with a guide/host/driver etc.',
	},
	{
		role: 'Tour guide',
		description:
			'Leads a group of customers through a tour and explains things about the destination or attraction.',
	},
	{
		role: 'Host or greeter',
		description:
			"Provides an introduction, purchases a ticket, or waits in line with customers, but doesn't provide a full tour of the attraction.",
	},
	{
		role: 'Instructor',
		description:
			'Shows customers how to use equipment or teaches them how to do something.',
	},
	{
		role: 'Driver',
		description:
			'Drives the customer somewhere but doesn’t explain anything along the way.',
	},
]

// import React, { FC } from "react";
// import ButtonPrimary from "@/shared/ButtonPrimary";
// import Input from "@/shared/Input";

// export interface PageAddListing5Props {}

// const PageAddListing5: FC<PageAddListing5Props> = () => {
//   const renderRadio = (
//     name: string,
//     id: string,
//     label: string,
//     defaultChecked?: boolean
//   ) => {
//     return (
//       <div className="flex items-center">
//         <input
//           defaultChecked={defaultChecked}
//           id={id + name}
//           name={name}
//           type="radio"
//           className="focus:ring-primary-500 h-6 w-6 text-primary-500 border-neutral-300 !checked:bg-primary-500 bg-transparent"
//         />
//         <label
//           htmlFor={id + name}
//           className="ml-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
//         >
//           {label}
//         </label>
//       </div>
//     );
//   };

//   const renderNoInclude = (text: string) => {
//     return (
//       <div className="flex items-center justify-between py-3">
//         <span className="text-neutral-6000 dark:text-neutral-400 font-medium">
//           {text}
//         </span>
//         <i className="text-2xl text-neutral-400 las la-times-circle hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"></i>
//       </div>
//     );
//   };

//   return (
//     <>
//       <div>
//         <h2 className="text-2xl font-semibold">
//           Set house rules for your guests{" "}
//         </h2>
//         <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
//           Guests must agree to your house rules before they book.
//         </span>
//       </div>
//       <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
//       {/* FORM */}
//       <div className="space-y-8">
//         {/* ITEM */}
//         <div>
//           <label className="text-lg font-semibold" htmlFor="">
//             General amenities
//           </label>
//           <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//             {renderRadio("Smoking", "Do", "Do not allow")}
//             {renderRadio("Smoking", "Allow", "Allow", true)}
//             {renderRadio("Smoking", "Charge", "Charge")}
//           </div>
//         </div>

//         {/* ITEM */}
//         <div>
//           <label className="text-lg font-semibold" htmlFor="">
//             Pet
//           </label>
//           <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//             {renderRadio("Pet", "Do", "Do not allow")}
//             {renderRadio("Pet", "Allow", "Allow", true)}
//             {renderRadio("Pet", "Charge", "Charge")}
//           </div>
//         </div>

//         {/* ITEM */}
//         <div>
//           <label className="text-lg font-semibold" htmlFor="">
//             Party organizing
//           </label>
//           <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//             {renderRadio("Partyorganizing", "Do", "Do not allow")}
//             {renderRadio("Partyorganizing", "Allow", "Allow", true)}
//             {renderRadio("Partyorganizing", "Charge", "Charge")}
//           </div>
//         </div>

//         {/* ITEM */}
//         <div>
//           <label className="text-lg font-semibold" htmlFor="">
//             Cooking
//           </label>
//           <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//             {renderRadio("Cooking", "Do", "Do not allow")}
//             {renderRadio("Cooking", "Allow", "Allow", true)}
//             {renderRadio("Cooking", "Charge", "Charge")}
//           </div>
//         </div>

//         {/* ----------- */}
//         <div className=" border-b border-neutral-200 dark:border-neutral-700"></div>
//         <span className="block text-lg font-semibold">Additional rules</span>
//         <div className="flow-root">
//           <div className="-my-3 divide-y divide-neutral-100 dark:divide-neutral-800">
//             {renderNoInclude("No smoking in common areas")}
//             {renderNoInclude("Do not wear shoes/shoes in the house")}
//             {renderNoInclude("No cooking in the bedroom")}
//           </div>
//         </div>
//         <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 sm:space-x-5">
//           <Input className="!h-full" placeholder="No smoking..." />
//           <ButtonPrimary className="flex-shrink-0">
//             <i className="text-xl las la-plus"></i>
//             <span className="ml-3">Add tag</span>
//           </ButtonPrimary>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PageAddListing5;
