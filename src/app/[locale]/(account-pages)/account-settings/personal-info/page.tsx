'use client'
import Link from 'next/link'
import type React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '@/app/GlobalRedux/Features/userReducer/userReducer'
import {
	User,
	Mail,
	Phone,
	Shield,
	MapPin,
	AlertCircle,
	ChevronRight,
	Edit,
	Loader2,
} from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { Form, Field } from 'react-final-form'

type InfoItem = {
	id: string
	title: string
	value: string | React.ReactNode
	description?: string
	actionType: 'edit' | 'add' | 'start'
	icon: React.ElementType
}

export default function PersonalInfoPage() {
	const t = useTranslations('Jan03_PersonalInfo_d6k9')
	const dispatch = useDispatch()
	const { userData, loading, error } = useSelector(
		(state: any) => state.userReducer,
	)
	// State for tracking which field is being edited
	const [editingField, setEditingField] = useState<string | null>(null)

	// Get initial values for forms
	const getInitialValues = () => ({
		firstname: userData?.accountData?.firstname || '',
		lastname: userData?.accountData?.lastname || '',
		gender: userData?.accountData?.gender || 'Male',
		username: userData?.username || '',
		email: userData?.email || '',
		dateOfBirth: userData?.accountData?.dateOfBirth || '',
		address: userData?.accountData?.address || '',
		phone: userData?.phone || '',
		about: userData?.accountData?.about || '',
	})

	// Handle form submission
	const handleSubmit = async (values: any, fieldId: string) => {
		let updatedData = {}

		switch (fieldId) {
			case 'legalName':
				if (values.firstname?.trim() && values.lastname?.trim()) {
					updatedData = {
						firstname: values.firstname.trim(),
						lastname: values.lastname.trim(),
					}
				} else {
					return {
						firstname: 'First name is required',
						lastname: 'Last name is required',
					}
				}
				break
			case 'gender':
				updatedData = { gender: values.gender }
				break
			case 'username':
				if (values.username?.trim()) {
					updatedData = { username: values.username.trim() }
				} else {
					return { username: 'Username is required' }
				}
				break
			case 'email':
				if (values.email?.trim()) {
					updatedData = { email: values.email.trim() }
				} else {
					return { email: 'Email is required' }
				}
				break
			case 'dateOfBirth':
				updatedData = { dateOfBirth: values.dateOfBirth }
				break
			case 'address':
				updatedData = { address: values.address?.trim() || '' }
				break
			case 'phone':
				updatedData = { phone: values.phone?.trim() || '' }
				break
			case 'about':
				updatedData = { about: values.about?.trim() || '' }
				break
			default:
				break
		}

		try {
			await dispatch(updateUser(updatedData) as any)
			setEditingField(null)
		} catch (err) {
			console.error('Update failed:', err)
		}
	}

	// Cancel editing
	const handleCancel = () => {
		setEditingField(null)
	}

	// Format user data for display
	const formatUserData = () => {
		return {
			legalName:
				userData?.accountData?.firstname && userData?.accountData?.lastname
					? `${userData.accountData.firstname} ${userData.accountData.lastname}`
					: t('Not_Provided'),
			gender: userData?.accountData?.gender || t('Not_Provided'),
			username: userData?.username || t('Not_Provided'),
			email: userData?.email || t('Not_Provided'),
			dateOfBirth: userData?.accountData?.dateOfBirth
				? new Date(userData.accountData.dateOfBirth).toLocaleDateString()
				: t('Not_Provided'),
			phone: userData?.phone || t('Not_Provided'),
			address: userData?.accountData?.address || t('Not_Provided'),
			about: userData?.accountData?.about || t('Not_Provided'),
		}
	}

	const userDisplayData = formatUserData()

	// Array of personal info items
	const personalInfoItems: InfoItem[] = [
		{
			id: 'legalName',
			title: t('Legal_Name'),
			value: userDisplayData.legalName,
			actionType: 'edit',
			icon: User,
		},
		{
			id: 'gender',
			title: t('Gender'),
			value: userDisplayData.gender,
			actionType: 'edit',
			icon: User,
		},
		{
			id: 'username',
			title: t('Username'),
			value: userDisplayData.username,
			actionType: 'edit',
			icon: User,
		},
		{
			id: 'email',
			title: t('Email_Address'),
			value: userDisplayData.email,
			actionType: 'edit',
			icon: Mail,
		},
		{
			id: 'dateOfBirth',
			title: t('Date_Of_Birth'),
			value: userDisplayData.dateOfBirth,
			actionType: 'edit',
			icon: User,
		},
		{
			id: 'address',
			title: t('Address'),
			value: userDisplayData.address,
			actionType: 'edit',
			icon: MapPin,
		},
		{
			id: 'phone',
			title: t('Phone_Number'),
			value: userDisplayData.phone,
			actionType: 'edit',
			icon: Phone,
		},
		{
			id: 'about',
			title: t('About_You'),
			value: userDisplayData.about,
			actionType: 'edit',
			icon: User,
		},
	]

	// Render edit form for legal name
	const renderLegalNameEditForm = () => (
		<Form
			onSubmit={(values) => handleSubmit(values, 'legalName')}
			initialValues={getInitialValues()}
			render={({ handleSubmit, submitting, hasValidationErrors }) => (
				<form onSubmit={handleSubmit} className="mt-2 space-y-4">
					<p className="text-gray-600">{t('Legal_Name_Description')}</p>
					<div className="flex flex-col gap-4 md:flex-row">
						<div className="flex-1">
							<Field name="firstname">
								{({ input, meta }) => (
									<div className="relative rounded-lg border border-gray-300">
										<label
											htmlFor="firstname"
											className="absolute left-3 top-2 text-xs text-gray-500"
										>
											{t('First_Name')}
										</label>
										<input
											{...input}
											type="text"
											id="firstname"
											className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
										/>
										{meta.error && meta.touched && (
											<p className="mt-1 text-xs text-red-500">{meta.error}</p>
										)}
									</div>
								)}
							</Field>
						</div>
						<div className="flex-1">
							<Field name="lastname">
								{({ input, meta }) => (
									<div className="relative rounded-lg border border-gray-300">
										<label
											htmlFor="lastname"
											className="absolute left-3 top-2 text-xs text-gray-500"
										>
											{t('Last_Name')}
										</label>
										<input
											{...input}
											type="text"
											id="lastname"
											className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
										/>
										{meta.error && meta.touched && (
											<p className="mt-1 text-xs text-red-500">{meta.error}</p>
										)}
									</div>
								)}
							</Field>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<button
							type="submit"
							disabled={submitting || loading || hasValidationErrors}
							className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
						>
							{submitting || loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t('Saving')}
								</>
							) : (
								t('Save')
							)}
						</button>
						<button
							type="button"
							onClick={handleCancel}
							className="font-medium text-gray-700 hover:underline"
							disabled={submitting || loading}
						>
							{t('Cancel')}
						</button>
					</div>
					{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
				</form>
			)}
		/>
	)

	// Render edit form for gender
	const renderGenderEditForm = () => (
		<Form
			onSubmit={(values) => handleSubmit(values, 'gender')}
			initialValues={getInitialValues()}
			render={({ handleSubmit, submitting }) => (
				<form onSubmit={handleSubmit} className="mt-2 space-y-4">
					<Field name="gender">
						{({ input }) => (
							<div className="relative rounded-lg border border-gray-300">
								<label
									htmlFor="gender"
									className="absolute left-3 top-2 text-xs text-gray-500"
								>
									{t('Gender')}
								</label>
								<select
									{...input}
									id="gender"
									className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
								>
									<option value="Male">{t('Male')}</option>
									<option value="Female">{t('Female')}</option>
									<option value="Other">{t('Other')}</option>
								</select>
							</div>
						)}
					</Field>
					<div className="flex items-center justify-between">
						<button
							type="submit"
							disabled={submitting || loading}
							className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
						>
							{submitting || loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t('Saving')}
								</>
							) : (
								t('Save')
							)}
						</button>
						<button
							type="button"
							onClick={handleCancel}
							className="font-medium text-gray-700 hover:underline"
							disabled={submitting || loading}
						>
							{t('Cancel')}
						</button>
					</div>
					{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
				</form>
			)}
		/>
	)

	// Render edit form for username
	const renderUsernameEditForm = () => (
		<Form
			onSubmit={(values) => handleSubmit(values, 'username')}
			initialValues={getInitialValues()}
			render={({ handleSubmit, submitting, hasValidationErrors }) => (
				<form onSubmit={handleSubmit} className="mt-2 space-y-4">
					<Field name="username">
						{({ input, meta }) => (
							<div className="relative rounded-lg border border-gray-300">
								<label
									htmlFor="username"
									className="absolute left-3 top-2 text-xs text-gray-500"
								>
									{t('Username')}
								</label>
								<input
									{...input}
									type="text"
									id="username"
									className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
								/>
								{meta.error && meta.touched && (
									<p className="mt-1 text-xs text-red-500">{meta.error}</p>
								)}
							</div>
						)}
					</Field>
					<div className="flex items-center justify-between">
						<button
							type="submit"
							disabled={submitting || loading || hasValidationErrors}
							className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
						>
							{submitting || loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t('Saving')}
								</>
							) : (
								t('Save')
							)}
						</button>
						<button
							type="button"
							onClick={handleCancel}
							className="font-medium text-gray-700 hover:underline"
							disabled={submitting || loading}
						>
							{t('Cancel')}
						</button>
					</div>
					{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
				</form>
			)}
		/>
	)

	// Render edit form for email
	const renderEmailEditForm = () => (
		<Form
			onSubmit={(values) => handleSubmit(values, 'email')}
			initialValues={getInitialValues()}
			render={({ handleSubmit, submitting, hasValidationErrors }) => (
				<form onSubmit={handleSubmit} className="mt-2 space-y-4">
					<Field name="email">
						{({ input, meta }) => (
							<div className="relative rounded-lg border border-gray-300">
								<label
									htmlFor="email"
									className="absolute left-3 top-2 text-xs text-gray-500"
								>
									{t('Email_Address')}
								</label>
								<input
									{...input}
									type="email"
									id="email"
									className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
								/>
								{meta.error && meta.touched && (
									<p className="mt-1 text-xs text-red-500">{meta.error}</p>
								)}
							</div>
						)}
					</Field>
					<div className="flex items-center justify-between">
						<button
							type="submit"
							disabled={submitting || loading || hasValidationErrors}
							className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
						>
							{submitting || loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t('Saving')}
								</>
							) : (
								t('Save')
							)}
						</button>
						<button
							type="button"
							onClick={handleCancel}
							className="font-medium text-gray-700 hover:underline"
							disabled={submitting || loading}
						>
							{t('Cancel')}
						</button>
					</div>
					{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
				</form>
			)}
		/>
	)

	// Render edit form for date of birth
	const renderDateOfBirthEditForm = () => (
		<Form
			onSubmit={(values) => handleSubmit(values, 'dateOfBirth')}
			initialValues={getInitialValues()}
			render={({ handleSubmit, submitting }) => (
				<form onSubmit={handleSubmit} className="mt-2 space-y-4">
					<Field name="dateOfBirth">
						{({ input }) => (
							<div className="relative rounded-lg border border-gray-300">
								<label
									htmlFor="dateOfBirth"
									className="absolute left-3 top-2 text-xs text-gray-500"
								>
									{t('Date_Of_Birth')}
								</label>
								<input
									{...input}
									type="date"
									id="dateOfBirth"
									className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
								/>
							</div>
						)}
					</Field>
					<div className="flex items-center justify-between">
						<button
							type="submit"
							disabled={submitting || loading}
							className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
						>
							{submitting || loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t('Saving')}
								</>
							) : (
								t('Save')
							)}
						</button>
						<button
							type="button"
							onClick={handleCancel}
							className="font-medium text-gray-700 hover:underline"
							disabled={submitting || loading}
						>
							{t('Cancel')}
						</button>
					</div>
					{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
				</form>
			)}
		/>
	)

	// Render edit form for address
	const renderAddressEditForm = () => (
		<Form
			onSubmit={(values) => handleSubmit(values, 'address')}
			initialValues={getInitialValues()}
			render={({ handleSubmit, submitting }) => (
				<form onSubmit={handleSubmit} className="mt-2 space-y-4">
					<Field name="address">
						{({ input }) => (
							<div className="relative rounded-lg border border-gray-300">
								<label
									htmlFor="address"
									className="absolute left-3 top-2 text-xs text-gray-500"
								>
									{t('Address')}
								</label>
								<input
									{...input}
									type="text"
									id="address"
									className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
								/>
							</div>
						)}
					</Field>
					<div className="flex items-center justify-between">
						<button
							type="submit"
							disabled={submitting || loading}
							className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
						>
							{submitting || loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t('Saving')}
								</>
							) : (
								t('Save')
							)}
						</button>
						<button
							type="button"
							onClick={handleCancel}
							className="font-medium text-gray-700 hover:underline"
							disabled={submitting || loading}
						>
							{t('Cancel')}
						</button>
					</div>
					{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
				</form>
			)}
		/>
	)

	// Render edit form for phone
	const renderPhoneEditForm = () => (
		<Form
			onSubmit={(values) => handleSubmit(values, 'phone')}
			initialValues={getInitialValues()}
			render={({ handleSubmit, submitting }) => (
				<form onSubmit={handleSubmit} className="mt-2 space-y-4">
					<Field name="phone">
						{({ input }) => (
							<div className="relative rounded-lg border border-gray-300">
								<label
									htmlFor="phone"
									className="absolute left-3 top-2 text-xs text-gray-500"
								>
									{t('Phone_Number')}
								</label>
								<input
									{...input}
									type="tel"
									id="phone"
									className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
								/>
							</div>
						)}
					</Field>
					<div className="flex items-center justify-between">
						<button
							type="submit"
							disabled={submitting || loading}
							className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
						>
							{submitting || loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t('Saving')}
								</>
							) : (
								t('Save')
							)}
						</button>
						<button
							type="button"
							onClick={handleCancel}
							className="font-medium text-gray-700 hover:underline"
							disabled={submitting || loading}
						>
							{t('Cancel')}
						</button>
					</div>
					{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
				</form>
			)}
		/>
	)

	// Render edit form for about
	const renderAboutEditForm = () => (
		<Form
			onSubmit={(values) => handleSubmit(values, 'about')}
			initialValues={getInitialValues()}
			render={({ handleSubmit, submitting }) => (
				<form onSubmit={handleSubmit} className="mt-2 space-y-4">
					<Field name="about">
						{({ input }) => (
							<div className="relative rounded-lg border border-gray-300">
								<label
									htmlFor="about"
									className="absolute left-3 top-2 text-xs text-gray-500"
								>
									{t('About_You')}
								</label>
								<textarea
									{...input}
									id="about"
									rows={4}
									className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
								/>
							</div>
						)}
					</Field>
					<div className="flex items-center justify-between">
						<button
							type="submit"
							disabled={submitting || loading}
							className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
						>
							{submitting || loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t('Saving')}
								</>
							) : (
								t('Save')
							)}
						</button>
						<button
							type="button"
							onClick={handleCancel}
							className="font-medium text-gray-700 hover:underline"
							disabled={submitting || loading}
						>
							{t('Cancel')}
						</button>
					</div>
					{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
				</form>
			)}
		/>
	)

	// Get the appropriate edit form based on the field being edited
	const getEditForm = (fieldId: string) => {
		switch (fieldId) {
			case 'legalName':
				return renderLegalNameEditForm()
			case 'gender':
				return renderGenderEditForm()
			case 'username':
				return renderUsernameEditForm()
			case 'email':
				return renderEmailEditForm()
			case 'dateOfBirth':
				return renderDateOfBirthEditForm()
			case 'address':
				return renderAddressEditForm()
			case 'phone':
				return renderPhoneEditForm()
			case 'about':
				return renderAboutEditForm()
			default:
				return null
		}
	}

	return (
		<div className="mx-auto max-w-4xl px-6 py-8">
			{/* Breadcrumb */}
			<div className="mb-6 flex items-center text-sm">
				<Link
					href="/account-settings"
					className="text-gray-600 hover:underline"
				>
					{t('Account')}
				</Link>
				<ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
				<span className="text-gray-800">{t('Personal_Info')}</span>
			</div>
			{/* Page Title */}
			<h1 className="mb-8 text-3xl font-semibold">{t('Personal_Info')}</h1>
			{/* Personal Info Items */}
			<div className="space-y-6">
				{personalInfoItems.map((item) => (
					<div key={item.id} className="border-b border-gray-200 pb-6">
						<div className="flex items-start justify-between">
							<div className="flex items-start">
								<div className="mr-4 mt-1">
									<item.icon className="h-5 w-5 text-gray-500" />
								</div>
								<div className="flex-1">
									<h2 className="text-base font-medium">{item.title}</h2>
									{editingField !== item.id && (
										<>
											<p className="mt-1 text-gray-700">{item.value}</p>
											{item.description && (
												<p className="mt-1 text-sm text-gray-500">
													{item.description}
												</p>
											)}
										</>
									)}
									{editingField === item.id && getEditForm(item.id)}
								</div>
							</div>
							{editingField !== item.id && (
								<button
									onClick={() => setEditingField(item.id)}
									className="font-medium text-gray-700 hover:underline"
								>
									{item.actionType === 'edit'
										? t('Edit')
										: item.actionType === 'add'
											? t('Add')
											: t('Start')}
								</button>
							)}
						</div>
					</div>
				))}
			</div>
			{/* Info Cards */}
			<div className="mt-12 space-y-6">
				<div className="rounded-xl border border-gray-200 p-6">
					<div className="flex items-start">
						<div className="mr-4 rounded-full bg-pink-100 p-3">
							<Shield className="h-6 w-6 text-pink-500" />
						</div>
						<div>
							<h2 className="mb-2 text-lg font-semibold">
								{t('Why_Info_Not_Shown_Title')}
							</h2>
							<p className="text-gray-600">
								{t('Why_Info_Not_Shown_Description')}
							</p>
						</div>
					</div>
				</div>
				<div className="rounded-xl border border-gray-200 p-6">
					<div className="flex items-start">
						<div className="mr-4 rounded-full bg-pink-100 p-3">
							<Edit className="h-6 w-6 text-pink-500" />
						</div>
						<div>
							<h2 className="mb-2 text-lg font-semibold">
								{t('Which_Details_Editable_Title')}
							</h2>
							<p className="text-gray-600">
								{t('Which_Details_Editable_Description')}
							</p>
						</div>
					</div>
				</div>
				<div className="rounded-xl border border-gray-200 p-6">
					<div className="flex items-start">
						<div className="mr-4 rounded-full bg-pink-100 p-3">
							<AlertCircle className="h-6 w-6 text-pink-500" />
						</div>
						<div>
							<h2 className="mb-2 text-lg font-semibold">
								{t('What_Info_Shared_Title')}
							</h2>
							<p className="text-gray-600">
								{t('What_Info_Shared_Description')}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
