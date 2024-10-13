import React from 'react'
import { Form, Field, FieldRenderProps } from 'react-final-form'
import Input from '@/shared/Input' // Assuming your Input component is designed to work with final form
import ButtonPrimary from '@/shared/ButtonPrimary'
import updateCompanyInfo from '@/utils/api-utils/updateCompanyInfo' // Assuming you have a utility to handle API call

interface FormValues {
	bankName: string
	accountNumber: string
}

const BankAccount = ({ companyData }: any) => {
	const onSubmit = async (formValues: FormValues) => {
		await updateCompanyInfo(formValues).then((data) => {
			console.log('Bank account updated:', data)
		})
	}

	const { bankName, accountNumber } = companyData || {}

	return (
		<div className="p-7">
			<h3 className="font-medium text-black dark:text-white">
				Bank Account Information
			</h3>
			<p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
				Please provide your bank account details below.
			</p>
			<Form
				onSubmit={onSubmit}
				initialValues={{ bankName, accountNumber }}
				render={({ handleSubmit }) => (
					<form onSubmit={handleSubmit}>
						{/* Bank Name Field */}
						<div className="mb-5.5">
							<label
								className="mb-3 block text-sm font-medium text-black dark:text-white"
								htmlFor="bankName"
							>
								Bank Name
							</label>
							<Field name="bankName">
								{({ input, meta }: FieldRenderProps<string>) => (
									<>
										<Input
											{...input}
											type="text"
											id="bankName"
											placeholder="Enter your bank name"
											className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
										/>
										{meta.touched && meta.error && (
											<span className="text-red-500">{meta.error}</span>
										)}
									</>
								)}
							</Field>
						</div>

						{/* Account Number Field */}
						<div className="mb-5.5">
							<label
								className="mb-3 block text-sm font-medium text-black dark:text-white"
								htmlFor="accountNumber"
							>
								Account Number
							</label>
							<Field name="accountNumber">
								{({ input, meta }: FieldRenderProps<string>) => (
									<>
										<Input
											{...input}
											type="text"
											id="accountNumber"
											placeholder="Enter your account number"
											className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
										/>
										{meta.touched && meta.error && (
											<span className="text-red-500">{meta.error}</span>
										)}
									</>
								)}
							</Field>
						</div>
						<ButtonPrimary type="submit">Save</ButtonPrimary>
					</form>
				)}
			/>
		</div>
	)
}

export default BankAccount
