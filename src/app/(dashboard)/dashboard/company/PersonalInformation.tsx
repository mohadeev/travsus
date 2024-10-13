import React from 'react'
import { Form, Field, FieldRenderProps } from 'react-final-form'
import Input from '@/shared/Input' // Assuming your Input component is designed to work with final form
import ButtonPrimary from '@/shared/ButtonPrimary'
import updateCompanyInfo from '@/utils/api-utils/updateCompanyInfo'

interface FormValues {
	fullName: string
	phoneNumber: string
}

const PersonalInformation = ({ companyData }: any) => {
	console.log('companyData: ', companyData)
	const onSubmit = async (formValues: FormValues) => {
		await updateCompanyInfo(formValues).then((data) => {
			console.log('data:', data)
		})
		// console.log('Form Submitted:', formValues)
	}
	const { adminName, id, phoneNumber } = companyData || {}

	return (
		<div className="p-0">
			<Form
				onSubmit={onSubmit}
				initialValues={{
					adminName,
					id,
					phoneNumber,
				}}
				render={({ handleSubmit }) => (
					<form onSubmit={handleSubmit}>
						{/* Form fields for personal information */}
						<div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
							<div className="w-full sm:w-1/2">
								<label
									className="mb-3 block text-sm font-medium text-black dark:text-white"
									htmlFor="adminName"
								>
									Full Name
								</label>
								<Field name="adminName">
									{({ input, meta }: FieldRenderProps<string>) => (
										<>
											<Input
												{...input}
												type="text"
												name="adminName"
												id="adminName"
												placeholder="Devid Jhon"
												// className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
											/>
											{meta.touched && meta.error && (
												<span className="text-red-500">{meta.error}</span>
											)}
										</>
									)}
								</Field>
							</div>
							<div className="w-full sm:w-1/2">
								<label
									className="mb-3 block text-sm font-medium text-black dark:text-white"
									htmlFor="phoneNumber"
								>
									Phone Number
								</label>
								<Field name="phoneNumber">
									{({ input, meta }: FieldRenderProps<string>) => (
										<>
											<Input
												{...input}
												type="phone"
												id="phoneNumber"
												placeholder="+990 3343 7865"
												className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
											/>
											{meta.touched && meta.error && (
												<span className="text-red-500">{meta.error}</span>
											)}
										</>
									)}
								</Field>
							</div>
						</div>
						<ButtonPrimary type="submit">Save</ButtonPrimary>
					</form>
				)}
			/>
		</div>
	)
}

export default PersonalInformation
