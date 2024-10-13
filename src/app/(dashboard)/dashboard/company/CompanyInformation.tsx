import React from 'react'
import { Form, Field, FieldRenderProps } from 'react-final-form'
import Input from '@/shared/Input' // Assuming your Input component is designed to work with final form
import ButtonPrimary from '@/shared/ButtonPrimary'
import updateCompanyInfo from '@/utils/api-utils/updateCompanyInfo'

interface FormValues {
	name: string
	address: string
	registrationNumber?: string // Optional
}

const CompanyInformation = ({ companyData }: any) => {
	const onSubmit = async (formValues: FormValues) => {
		await updateCompanyInfo(formValues).then((data) => {
			console.log('data:', data)
		})
	}
	const { name, address, registrationNumber } = companyData || {}

	return (
		<div className="p-7">
			<h3 className="font-medium text-black dark:text-white">
				Company Information
			</h3>
			<p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
				All elements on this page are necessary to issue your invoices. No data
				will appear on your profile.
			</p>
			<h4 className="mb-2 mt-6 font-medium text-black dark:text-white">
				Tax Information
			</h4>

			<Form
				onSubmit={onSubmit}
				initialValues={{
					name,
					address,
					registrationNumber,
				}}
				render={({ handleSubmit }) => (
					<form onSubmit={handleSubmit}>
						{/* Company Name Field */}
						<div className="mb-5.5">
							<label
								className="mb-3 block text-sm font-medium text-black dark:text-white"
								htmlFor="name"
							>
								Company Name
							</label>
							<Field name="name">
								{({ input, meta }: FieldRenderProps<string>) => (
									<>
										<Input
											{...input}
											type="text"
											id="name"
											placeholder="Acme Inc."
											className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
										/>
										{meta.touched && meta.error && (
											<span className="text-red-500">{meta.error}</span>
										)}
									</>
								)}
							</Field>
						</div>

						{/* Address Field */}
						<div className="mb-5.5">
							<label
								className="mb-3 block text-sm font-medium text-black dark:text-white"
								htmlFor="address"
							>
								Address
							</label>
							<Field name="address">
								{({ input, meta }: FieldRenderProps<string>) => (
									<>
										<Input
											{...input}
											type="text"
											id="address"
											placeholder="Elbarrena kalea 004, 03-iz plaza ondo entxea b., Lizartza, Morocco"
											className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
										/>
										{meta.touched && meta.error && (
											<span className="text-red-500">{meta.error}</span>
										)}
									</>
								)}
							</Field>
						</div>

						{/* Registration Number Field */}
						<div className="mb-5.5">
							<label
								className="mb-3 block text-sm font-medium text-black dark:text-white"
								htmlFor="registrationNumber"
							>
								Registration Number (Optional)
							</label>
							<Field name="registrationNumber">
								{({ input, meta }: FieldRenderProps<string>) => (
									<>
										<Input
											{...input}
											type="text"
											id="registrationNumber"
											placeholder="Your registration number"
											className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
										/>
										{meta.touched && meta.error && (
											<span className="text-red-500">{meta.error}</span>
										)}
									</>
								)}
							</Field>
						</div>

						{/* Submit Button */}
						<ButtonPrimary type="submit">Save</ButtonPrimary>
					</form>
				)}
			/>
		</div>
	)
}

export default CompanyInformation
