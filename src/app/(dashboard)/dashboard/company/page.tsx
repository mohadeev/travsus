'use client'
import React, { useEffect, useState } from 'react'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Image from 'next/image'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import LegalDocuments from './LegalDocuments'
import CollapsiblePanel from './CollapsiblePanel'
import PersonalInformation from './PersonalInformation'
import CompanyInformation from './CompanyInformation'
import BankAccount from './BankAccount'
import ProfilePhotoColumn from './ProfilePhotoColumn'
// import { Metadata } from 'next'

// export const metadata: Metadata = {
// 	title: 'Next.js Settings | TailAdmin - Next.js Dashboard Template',
// 	description:
// 		'This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
// }

const Settings = () => {
	// State to control which sections are open
	// const [showPersonalInfo, setShowPersonalInfo] = useState(true)
	// const [showCompanyInfo, setShowCompanyInfo] = useState(false)
	// const [showLegalDocs, setShowLegalDocs] = useState(false)
	// const [showBankAccount, setShowBankAccount] = useState(false)
	const [activeTap, setActiveTap] = useState('Personal Information')
	const [companyData, setCompanyData] = useState<any>(null) // To store the company data
	const [loading, setLoading] = useState<boolean>(true) // For loading state
	const [error, setError] = useState<string | null>(null) // To handle errors
	const hanleOpenCollapsiblePanel = (value: string) => {
		if (value === activeTap) {
			setActiveTap('')
		} else {
			setActiveTap(value)
		}
	}
	const components = [
		{
			ComponentName: <PersonalInformation companyData={companyData} />,
			displayName: 'Personal Information',
			labelName: 'Personal Information',
		},
		{
			ComponentName: <CompanyInformation companyData={companyData} />,
			displayName: 'My company information',
			labelName: 'Company Name',
		},
		{
			ComponentName: <LegalDocuments companyData={companyData} />,
			displayName: 'Legal Documents',
			labelName: 'Document Type',
		},
		{
			ComponentName: <BankAccount companyData={companyData} />,
			displayName: 'Bank Account',
			labelName: 'Account Number',
		},
	]

	const [expandedPanel, setExpandedPanel] = React.useState<string | false>(
		'panel0',
	)

	const handleChange =
		(panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpandedPanel(isExpanded ? panel : false)
		}

	// Fetch company data from the API
	const fetchCompanyData = async () => {
		try {
			const response = await fetch('/api/company/get/company-data', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			// Check if the request was successful
			if (!response.ok) {
				console.error(`Error: ${response.status}`)
			}

			const data = await response.json()
			console.log('data: ', data)
			setCompanyData(data) // Save the company data in state
		} catch (err: any) {
			setError(err.message) // Save the error message
		} finally {
			setLoading(false) // Stop loading when fetch completes
		}
	}

	useEffect(() => {
		fetchCompanyData()
	}, [])

	return (
		<DefaultLayout>
			<div className="mx-auto max-w-270">
				<h1 className="mb-6 text-3xl font-bold">Settings</h1>
				<p className="smallTextGray mb-8 text-sm">
					This space is where you centralize and update all your business and
					details. Make sure it is up to date before you start a project so you
					can be paid.
				</p>

				<div className="grid grid-cols-5 gap-8">
					<div className="col-span-5 xl:col-span-3">
						{components.map(({ ComponentName, labelName }, index) => (
							<CollapsiblePanel
								key={index}
								label={labelName}
								disabled={false}
								expanded={expandedPanel === `panel${index}`}
								onChange={handleChange(`panel${index}`)}
							>
								{ComponentName}
							</CollapsiblePanel>
						))}
					</div>
					<ProfilePhotoColumn companyData={companyData} />
				</div>
			</div>
		</DefaultLayout>
	)
}

export default Settings
