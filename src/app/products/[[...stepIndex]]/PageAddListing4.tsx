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
				<h2 className="text-2xl font-semibold">Inclusions </h2>
				<FormItem label="">
					<span className="smallTextGray">
						List all the features that are included in the price so customers
						understand the value for money of your activity. Start a new line
						for each one.
					</span>
					<Textarea placeholder="..." rows={8} />
				</FormItem>
				<h2 className="text-2xl font-semibold">
					What is not included? (optional)
				</h2>
				<FormItem label="">
					<span className="smallTextGray">
						Name what customers need to pay extra for or what they may expect to
						see that isn’t included in the price. This allows customers to
						appropriately set their expectations.
					</span>
					<Textarea placeholder="..." rows={8} />
				</FormItem>
			</div>
		</>
	)
}

export default PageAddListing2

// import React, { FC } from "react";
// import Checkbox from "@/shared/Checkbox";

// export interface PageAddListing4Props {}

// const PageAddListing4: FC<PageAddListing4Props> = () => {
//   return (
//     <>
//       <div>
//         <h2 className="text-2xl font-semibold">Amenities </h2>
//         <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
//           Many customers have searched for accommodation based on amenities
//           criteria
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
//           <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//             <Checkbox label="Wifi" name="Wifi" defaultChecked />
//             <Checkbox label="Internet" name="Internet" />
//             <Checkbox label="TV" name="TV" defaultChecked />
//             <Checkbox label="Air conditioning" name="Air conditioning" />
//             <Checkbox label="Fan" name="Fan" />
//             <Checkbox label="Private entrance" name="Private entrance" />
//             <Checkbox label="Dryer" name="Dryer" defaultChecked />
//             <Checkbox label="Heater" name="Heater" />
//             <Checkbox label="Washing machine" name="Washing machine" />
//             <Checkbox label="Detergent" name="Detergent" defaultChecked />
//             <Checkbox label="Clothes dryer" name="Clothes dryer" />
//             <Checkbox label="Baby cot" name="Baby cot" />
//             <Checkbox label="Desk" name="Desk " defaultChecked />
//             <Checkbox label="Fridge" name="Fridge" />
//             <Checkbox label="Dryer" name="Dryer" defaultChecked />
//           </div>
//         </div>

//         {/* ITEM */}
//         <div>
//           <label className="text-lg font-semibold" htmlFor="">
//             Other amenities
//           </label>
//           <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//             <Checkbox label="Wardrobe" name="Wardrobe" defaultChecked />
//             <Checkbox label="Cloth hook" name="Cloth hook" />
//             <Checkbox
//               label="Extra cushion"
//               name="Extra cushion"
//               defaultChecked
//             />
//             <Checkbox label="Gas stove" name="Gas stove" />
//             <Checkbox label="Toilet paper" name="Toilet paper" />
//             <Checkbox
//               label="Free toiletries"
//               name="Free toiletries"
//               defaultChecked
//             />
//             <Checkbox label="Makeup table" name="Makeup table" />
//             <Checkbox label="Hot pot" name="Hot pot" />
//             <Checkbox label="Bathroom heaters" name="Bathroom heaters" />
//             <Checkbox label="Kettle" name="Kettle" defaultChecked />
//             <Checkbox label="Dishwasher" name="Dishwasher" />
//             <Checkbox label="BBQ grill" name="BBQ grill" defaultChecked />
//             <Checkbox label="Toaster" name="Toaster" defaultChecked />
//             <Checkbox label="Towel" name="Towel" />
//             <Checkbox label="Dining table" name="Dining table" />
//           </div>
//         </div>

//         {/* ITEM */}
//         <div>
//           <label className="text-lg font-semibold" htmlFor="">
//             Safe amenities
//           </label>
//           <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//             <Checkbox label="Fire siren" name="Fire siren" defaultChecked />
//             <Checkbox label="Fire extinguisher" name="Fire extinguisher" />
//             <Checkbox label="Anti-theft key" name="Anti-theft key" />
//             <Checkbox label="Safe vault" name="Safe vault" />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PageAddListing4;
