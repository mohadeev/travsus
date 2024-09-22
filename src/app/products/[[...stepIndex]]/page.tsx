'use client'
import React from 'react'
import PageAddListing1 from './PageAddListing1'
import PageAddListing2 from './PageAddListing2'
import PageAddListing3 from './PageAddListing3'
import PageAddListing4 from './PageAddListing4'
import PageAddListing5 from './PageAddListing5'
import PageAddListing6 from './PageAddListing6'
import PageAddListing7 from './PageAddListing7'
import PageAddListing8 from './PageAddListing8'
import PageAddListing9 from './PageAddListing9'
import PageAddListing10 from './PageAddListing10'
import { useSearchParams } from 'next/navigation'

const components = [
	PageAddListing1,
	PageAddListing1, // Default for stepIndex 0 or invalid
	PageAddListing2,
	PageAddListing3,
	PageAddListing4,
	PageAddListing5,
	PageAddListing6,
	PageAddListing7,
	PageAddListing8,
	PageAddListing9,
	PageAddListing10,
]

const Page = ({
	params,
	searchParams,
}: {
	params: { stepIndex: string }
	searchParams?: { [key: string]: string | string[] | undefined }
}) => {
	const newsearchParams = useSearchParams()
	const step = newsearchParams.get('step')
	const stepIndex = Number(step)
	const ContentComponent = components[stepIndex] || PageAddListing1

	return <ContentComponent />
}

export default Page
