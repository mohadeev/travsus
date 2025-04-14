'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TourPricing from './TourPricing'
import TourAccommodations from './TourAccommodations'

interface TourTabsProps {
	tourData: any
	updateTourData: (data: any) => void
}

export default function TourTabs({ tourData, updateTourData }: TourTabsProps) {
	const [activeTab, setActiveTab] = useState('pricing')

	return (
		<Tabs
			defaultValue="pricing"
			className="w-full"
			onValueChange={setActiveTab}
		>
			<TabsList className="mb-6 grid w-full grid-cols-2">
				<TabsTrigger value="pricing">Transportation & Pricing</TabsTrigger>
				<TabsTrigger value="accommodations">Accommodations</TabsTrigger>
			</TabsList>

			<TabsContent value="pricing" className="mt-0">
				<TourPricing tourData={tourData} updateTourData={updateTourData} />
			</TabsContent>

			<TabsContent value="accommodations" className="mt-0">
				<TourAccommodations
					tourData={tourData}
					updateTourData={updateTourData}
				/>
			</TabsContent>
		</Tabs>
	)
}
