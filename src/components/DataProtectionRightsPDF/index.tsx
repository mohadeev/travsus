'use client'

import React, { useState } from 'react'
import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	PDFDownloadLink,
	Image,
	Font,
} from '@react-pdf/renderer'
import { formatDate } from '@/utils/formatDate'
import { companyProfile } from '@/constants/companyProfile'

// Register fonts for PDF
Font.register({
	family: 'Roboto',
	fonts: [
		{
			src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
			fontWeight: 300,
		},
		{
			src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
			fontWeight: 400,
		},
		{
			src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
			fontWeight: 500,
		},
		{
			src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
			fontWeight: 700,
		},
	],
})

// Define styles for PDF
const styles = StyleSheet.create({
	page: {
		fontFamily: 'Roboto',
		fontSize: 10,
		padding: 30,
	},
	section: {
		margin: 10,
		padding: 10,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	logo: {
		width: 100,
		height: 'auto',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1f2937',
	},
	subtitle: {
		fontSize: 14,
		color: '#6b7280',
	},
	detailsSection: {
		borderTop: 1,
		borderBottom: 1,
		borderColor: '#e5e7eb',
		paddingVertical: 10,
		marginBottom: 20,
	},
	detailRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 5,
	},
	detailLabel: {
		fontSize: 10,
		color: '#6b7280',
	},
	detailValue: {
		fontSize: 10,
		fontWeight: 'medium',
		color: '#1f2937',
	},
	sectionTitle: {
		fontSize: 12,
		fontWeight: 'bold',
		marginBottom: 10,
		color: '#1f2937',
	},
	text: {
		fontSize: 10,
		marginBottom: 5,
	},
	listItem: {
		flexDirection: 'row',
		marginBottom: 5,
	},
	bullet: {
		width: 10,
	},
	footer: {
		textAlign: 'center',
		fontSize: 8,
		color: '#6b7280',
		marginTop: 30,
	},
	instructions: {
		marginTop: 20,
		fontSize: 9,
		color: '#4b5563',
	},
})

// PDF Document component
const PDFDocument = ({ data }: { data: any }) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<View style={styles.header}>
				<Image
					style={styles.logo}
					src="https://www.travsus.com/_next/static/media/logo.d4fff429.png"
				/>
				<View>
					<Text style={styles.title}>GDPR - Data Subject Rights Form</Text>
					<Text style={styles.subtitle}>Right of Access Request</Text>
				</View>
			</View>

			<View style={styles.detailsSection}>
				<Text style={styles.sectionTitle}>1. Data Controller Details</Text>
				<Text style={styles.text}>Name: {companyProfile.fullLegalName}</Text>
				<Text style={styles.text}>Address: {companyProfile.legalAddress}</Text>
				<Text style={styles.text}>VAT: {companyProfile.vatNumber}</Text>
				<Text style={styles.text}>
					Registration Number: {companyProfile.registrationNumber}
				</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>2. Data Subject Details</Text>
				<Text style={styles.text}>
					Full Name: {data.firstName} {data.surname}
				</Text>
				<Text style={styles.text}>
					Date of Birth: {formatDate(data.dateOfBirth)}
				</Text>
				<Text style={styles.text}>Address: {data.address}</Text>
				<Text style={styles.text}>Phone Number: {data.mobileNo}</Text>
				<Text style={styles.text}>Email: {data.email}</Text>
				<Text style={styles.text}>Customer Type: {data.customerType}</Text>
				{data.customerType === 'Other' && (
					<Text style={styles.text}>Other Type: {data.otherCustomerType}</Text>
				)}
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>3. Request Details</Text>
				<Text style={styles.text}>
					In accordance with Article 15 of the General Data Protection
					Regulation (GDPR), I hereby request access to my personal data. Please
					provide me with the following information within one month of
					receiving this request:
				</Text>
				<View style={styles.listItem}>
					<Text style={styles.bullet}>•</Text>
					<Text style={styles.text}>
						A copy of my personal data that is being processed
					</Text>
				</View>
				<View style={styles.listItem}>
					<Text style={styles.bullet}>•</Text>
					<Text style={styles.text}>The purposes of the processing</Text>
				</View>
				<View style={styles.listItem}>
					<Text style={styles.bullet}>•</Text>
					<Text style={styles.text}>
						The categories of personal data concerned
					</Text>
				</View>
				<View style={styles.listItem}>
					<Text style={styles.bullet}>•</Text>
					<Text style={styles.text}>
						The recipients or categories of recipients to whom the personal data
						have been or will be disclosed
					</Text>
				</View>
				<View style={styles.listItem}>
					<Text style={styles.bullet}>•</Text>
					<Text style={styles.text}>
						The envisaged period for which the personal data will be stored
					</Text>
				</View>
				<View style={styles.listItem}>
					<Text style={styles.bullet}>•</Text>
					<Text style={styles.text}>
						Information about the source of the data, if not collected directly
						from me
					</Text>
				</View>
				<View style={styles.listItem}>
					<Text style={styles.bullet}>•</Text>
					<Text style={styles.text}>
						The existence of automated decision-making, including profiling, and
						meaningful information about the logic involved
					</Text>
				</View>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>
					4. Specific Information Requested
				</Text>
				<Text style={styles.text}>{data.updateInfo}</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>5. Declaration</Text>
				<Text style={styles.text}>
					I, {data.firstName} {data.surname}, confirm that the information
					provided on this form is correct and that I am the data subject whose
					name appears on this form. I understand that{' '}
					{companyProfile.fullLegalName} may need to obtain more information to
					confirm my identity and to locate the personal data I have requested.
				</Text>
			</View>

			<View style={styles.instructions}>
				<Text style={styles.sectionTitle}>Instructions</Text>
				<Text style={styles.text}>
					1. Please complete this form and submit it to{' '}
					{companyProfile.fullLegalName}.
				</Text>
				<Text style={styles.text}>
					2. We will respond to your request within one month of receipt of a
					fully completed form and proof of identity.
				</Text>
				<Text style={styles.text}>
					3. If you are making the request on behalf of another person, please
					provide proof of your authority to do so.
				</Text>
				<Text style={styles.text}>
					4. For more information on your rights under GDPR, please visit the
					website of the Data Protection Commission at www.dataprotection.ie.
				</Text>
				<Text style={styles.text}>
					5. If you are not satisfied with the response you receive, you have
					the right to lodge a complaint with the Data Protection Commission.
				</Text>
			</View>

			<View style={styles.footer}>
				<Text>
					{companyProfile.fullLegalName} | {companyProfile.legalAddress}
				</Text>
				<Text>
					VAT: {companyProfile.vatNumber} | Reg. No:{' '}
					{companyProfile.registrationNumber}
				</Text>
				<Text>
					This form is a formal request to exercise your right of access under
					the General Data Protection Regulation (GDPR).
				</Text>
			</View>
		</Page>
	</Document>
)

export const GDPRDataSubjectRightsForm: React.FC = () => {
	const [formData, setFormData] = useState({
		customerType: '',
		otherCustomerType: '',
		firstName: '',
		surname: '',
		dateOfBirth: '',
		mobileNo: '',
		address: '',
		email: '',
		accountNumbers: '',
		updateInfo: '',
	})
	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log('Form submitted:', formData)
		setIsSubmitted(true)
	}

	return (
		<div className="flex min-h-screen flex-col justify-center bg-gray-100 py-6 sm:py-12">
			<div className="relative py-3 sm:mx-auto sm:max-w-xl">
				<div className="absolute inset-0 -skew-y-6 transform bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl"></div>
				<div className="relative bg-white px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20">
					<div className="mx-auto max-w-md">
						<div className="mb-8 flex items-center justify-between">
							<img
								src="https://www.travsus.com/_next/static/media/logo.d4fff429.png"
								alt="Travsus Logo"
								className="w-24"
							/>
							<div className="text-right">
								<h1 className="text-2xl font-semibold text-gray-800">
									GDPR - Data Subject Rights Form
								</h1>
								<p className="text-sm text-gray-600">Update My Data</p>
							</div>
						</div>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Customer Type
								</label>
								<div className="mt-2 space-x-4">
									{['Personal Customer', 'Business Customer', 'Other'].map(
										(type) => (
											<label key={type} className="inline-flex items-center">
												<input
													type="radio"
													name="customerType"
													value={type}
													onChange={handleInputChange}
													className="form-radio h-4 w-4 text-blue-600"
												/>
												<span className="ml-2 text-sm text-gray-700">
													{type}
												</span>
											</label>
										),
									)}
								</div>
							</div>
							{formData.customerType === 'Other' && (
								<div>
									<label
										htmlFor="otherCustomerType"
										className="block text-sm font-medium text-gray-700"
									>
										If other, please specify
									</label>
									<input
										type="text"
										name="otherCustomerType"
										id="otherCustomerType"
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									/>
								</div>
							)}
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<div>
									<label
										htmlFor="firstName"
										className="block text-sm font-medium text-gray-700"
									>
										First Name*
									</label>
									<input
										type="text"
										name="firstName"
										id="firstName"
										required
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									/>
								</div>
								<div>
									<label
										htmlFor="surname"
										className="block text-sm font-medium text-gray-700"
									>
										Surname*
									</label>
									<input
										type="text"
										name="surname"
										id="surname"
										required
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									/>
								</div>
								<div>
									<label
										htmlFor="dateOfBirth"
										className="block text-sm font-medium text-gray-700"
									>
										Date of Birth*
									</label>
									<input
										type="date"
										name="dateOfBirth"
										id="dateOfBirth"
										required
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									/>
								</div>
								<div>
									<label
										htmlFor="mobileNo"
										className="block text-sm font-medium text-gray-700"
									>
										Mobile No*
									</label>
									<input
										type="tel"
										name="mobileNo"
										id="mobileNo"
										required
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									/>
								</div>
							</div>
							<div>
								<label
									htmlFor="address"
									className="block text-sm font-medium text-gray-700"
								>
									Address*
								</label>
								<input
									type="text"
									name="address"
									id="address"
									required
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
								/>
							</div>
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700"
								>
									Email*
								</label>
								<input
									type="email"
									name="email"
									id="email"
									required
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
								/>
							</div>
							<div>
								<label
									htmlFor="accountNumbers"
									className="block text-sm font-medium text-gray-700"
								>
									Account and Policy Numbers
								</label>
								<textarea
									name="accountNumbers"
									id="accountNumbers"
									rows={3}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									placeholder="Please list all your account and policy numbers that are relevant to your request"
								></textarea>
							</div>
							<div>
								<label
									htmlFor="updateInfo"
									className="block text-sm font-medium text-gray-700"
								>
									Information to be updated*
								</label>
								<textarea
									name="updateInfo"
									id="updateInfo"
									rows={4}
									required
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
									placeholder="Please provide the information you want to have corrected or updated"
								></textarea>
							</div>
							<div>
								<button
									type="submit"
									className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
								>
									Submit Request
								</button>
							</div>
						</form>
						{isSubmitted && (
							<div className="mt-6">
								<PDFDownloadLink
									document={<PDFDocument data={formData} />}
									fileName="gdpr_data_subject_rights_form.pdf"
									className="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
								>
									{({ blob, url, loading, error }) =>
										loading ? 'Generating PDF...' : 'Download PDF'
									}
								</PDFDownloadLink>
							</div>
						)}
						<div className="mt-6 text-center text-xs text-gray-500">
							<p>
								{companyProfile.fullLegalName} | {companyProfile.legalAddress}
							</p>
							<p>
								VAT: {companyProfile.vatNumber} | Reg. No:{' '}
								{companyProfile.registrationNumber}
							</p>
							<p className="mt-1">
								This form is your formal request to update your personal data
								under GDPR.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default GDPRDataSubjectRightsForm
