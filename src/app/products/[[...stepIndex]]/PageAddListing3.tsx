'use client'

import { MapPinIcon } from '@heroicons/react/24/solid'
import LocationMarker from '@/components/AnyReactComponent/LocationMarker'
import Label from '@/components/Label'
import { FC } from 'react'
import ButtonSecondary from '@/shared/ButtonSecondary'
import Input from '@/shared/Input'
import Select from '@/shared/Select'
import FormItem from '../FormItem'
import { Map, Marker } from '@vis.gl/react-google-maps'
import allCountries from '@/constants/allCountries'

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
	console.log(allCountries[2]?.name?.common)
	return (
		<>
			<h2 className="text-2xl font-semibold">Your place location</h2>
			<div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
			{/* FORM */}
			<div className="space-y-8">
				{/* ITEM */}
				<FormItem label="Country/Region">
					<Select value={address?.country}>
						{allCountries.map((country: any) => (
							<option key={country?.name?.common} value={country?.name?.common}>
								{country?.name?.common}
							</option>
						))}
					</Select>
				</FormItem>
				<FormItem label="Street">
					<Input placeholder="..." />
				</FormItem>
				<FormItem label="Room number (optional)">
					<Input />
				</FormItem>
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-5">
					<FormItem label="City">
						<Input />
					</FormItem>
					<FormItem label="State">
						<Input />
					</FormItem>
					<FormItem label="Postal code">
						<Input />
					</FormItem>
				</div>
				{/* <div>
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
				</div> */}
			</div>
		</>
	)
}

export default PageAddListing3
