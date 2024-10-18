'use client'

import { MapPinIcon } from '@heroicons/react/24/solid'
import LocationMarker from '@/components/AnyReactComponent/LocationMarker'
import Label from '@/components/Label'
import { FC } from 'react'
import ButtonSecondary from '@/shared/ButtonSecondary'
import classNames from 'classnames'

import Input from '@/shared/Input'
import Select from '@/shared/Select'
import FormItem from '../FormItem'
import { Map, Marker } from '@vis.gl/react-google-maps'
import allCountries from '@/constants/allCountries'
import FieldInputFormItem from '@/app/add-listing/FieldInputFormItem'
import FieldSelectFormItem from '@/app/add-listing/FieldSelectFormItem'
import styles from './page.module.css'

export interface PageAddListing3Props {}

const PageAddListing3: FC<PageAddListing3Props> = () => {
	const address = {
		streetAddress: '123 Main St',
		buildingNumber: '12A',
		suiteNumber: 'Suite 300',
		postOfficeBox: 'P.O. Box 456',
		city: 'New York',
		state: 'NY',
		postalCode: '10001',
		country: 'Morocco',
		geoCoordinates: {
			latitude: 40.712776,
			longitude: -74.005974,
		},
		addressType: 'Residential',
		landmark: 'Near Central Park',
		subdivision: 'Manhattan',
		timeZone: 'America/New_York',
		isPrimary: true,
		notes: 'Leave package with the doorman.',
	}
	console.log(allCountries[2]?.cca3)
	return (
		<>
			<h2 className="text-2xl font-semibold">Your place location</h2>
			<div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
			{/* FORM */}
			<div
				className={classNames(
					'flex flex-row flex-wrap items-start justify-start gap-5', // Tailwind classes
					styles.container, // CSS module class
				)}
			>
				<FieldSelectFormItem
					name="address.country"
					label="Choose an option"
					placeholder="Select an option"
					options={allCountries.map((country: any) => ({
						label: country?.name?.common,
						value: country?.cca3,
					}))}
				/>

				{/* ITEM: Street Address */}
				<FieldInputFormItem
					name="address.streetAddress"
					label="Street Address"
					placeholder="Enter street address"
				/>

				{/* ITEM: Building Number */}
				<FieldInputFormItem
					name="address.buildingNumber"
					label="Building Number"
					placeholder="Enter building number"
				/>

				{/* ITEM: Suite Number */}
				<FieldInputFormItem
					name="address.suiteNumber"
					label="Suite Number"
					placeholder="Enter suite number"
				/>

				{/* ITEM: Post Office Box */}
				{/* <FieldInputFormItem
					name="address.postOfficeBox"
					label="Post Office Box"
					placeholder="Enter PO Box"
				/> */}

				{/* ITEM: City */}
				<FieldInputFormItem
					name="address.city"
					label="City"
					placeholder="Enter city"
				/>

				{/* ITEM: State */}
				<FieldInputFormItem
					name="address.state"
					label="State"
					placeholder="Enter state"
				/>

				{/* ITEM: Postal Code */}
				<FieldInputFormItem
					name="address.postalCode"
					label="Postal Code"
					placeholder="Enter postal code"
				/>

				{/* ITEM: Landmark */}
				{/* <FieldInputFormItem
					name="address.landmark"
					label="Landmark"
					placeholder="Enter landmark (optional)"
				/> */}

				{/* ITEM: Subdivision */}
				{/* <FieldInputFormItem
					name="address.subdivision"
					label="Subdivision"
					placeholder="Enter subdivision (optional)"
				/> */}

				{/* ITEM: Time Zone */}
				{/* <FieldInputFormItem
					name="address.timeZone"
					label="Time Zone"
					placeholder="Enter time zone"
				/> */}

				{/* ITEM: Address Type */}
				{/* <FieldInputFormItem
					name="address.addressType"
					label="Address Type"
					placeholder="Enter address type (e.g., Residential, Business)"
				/> */}

				{/* ITEM: Notes */}
				{/* <FieldInputFormItem
					name="address.notes"
					label="Additional Notes"
					placeholder="Any additional notes"
				/> */}

				{/* Additional fields as needed */}
				{/* Additional fields as needed */}
			</div>
			<div>
				<Label>Detailed address</Label>
				<span className="mt-1 block text-sm text-neutral-500 dark:text-neutral-400">
					1110 Pennsylvania Avenue NW, Washington, DC 20230
				</span>
				<div className="mt-4">
					<div className="aspect-h-5 aspect-w-5 sm:aspect-h-3">
						<div className="overflow-hidden rounded-xl">
							<Map
								style={{
									width: '100%',
									height: '100%',
								}}
								defaultZoom={15}
								defaultCenter={{
									lat: 55.9607277,
									lng: 36.2172614,
								}}
								gestureHandling={'greedy'}
							>
								<Marker
									position={{ lat: 55.9607277, lng: 36.2172614 }}
									draggable
									onDragEnd={(e) => console.log(e)}
								/>
							</Map>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default PageAddListing3
