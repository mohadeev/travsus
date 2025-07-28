'use client'

import Link from 'next/link'
import type React from 'react'
import { useState, useEffect } from 'react'
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

type InfoItem = {
	id: string
	title: string
	value: string | React.ReactNode
	description?: string
	actionType: 'edit' | 'add' | 'start'
	icon: React.ElementType
}

export default function PersonalInfoPage() {
	const t = useTranslations('PersonalInfoPage')
	const dispatch = useDispatch()
	const { userData, loading, error } = useSelector(
		(state: any) => state.userReducer,
	)

	// State for tracking which field is being edited
	const [editingField, setEditingField] = useState<string | null>(null)

	// Form data for inline editing
	const [formData, setFormData] = useState({
		firstname: userData?.accountData?.firstname || '',
		lastname: userData?.accountData?.lastname || '',
		gender: userData?.accountData?.gender || t('default_gender'),
		username: userData?.username || '',
		email: userData?.email || '',
		dateOfBirth: userData?.accountData?.dateOfBirth || '',
		address: userData?.accountData?.address || '',
		phone: userData?.phone || '',
		about: userData?.accountData?.about || '',
	})

	// Update form data when user data changes
	useEffect(() => {
		setFormData({
			firstname: userData?.accountData?.firstname || '',
			lastname: userData?.accountData?.lastname || '',
			gender: userData?.accountData?.gender || t('default_gender'),
			username: userData?.username || '',
			email: userData?.email || '',
			dateOfBirth: userData?.accountData?.dateOfBirth || '',
			address: userData?.accountData?.address || '',
			phone: userData?.phone || '',
			about: userData?.accountData?.about || '',
		})
	}, [userData, t])

	// Handle form input changes
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value,
		})
	}

	// Save changes for the current editing field
	const handleSave = (fieldId: string) => {
		let updatedData = {}

		switch (fieldId) {
			case 'legalName':
				updatedData = {
					firstname: formData.firstname,
					lastname: formData.lastname,
				}
				break
			case 'gender':
				updatedData = {
					gender: formData.gender,
				}
				break
			case 'username':
				updatedData = {
					username: formData.username,
				}
				break
			case 'email':
				updatedData = {
					email: formData.email,
				}
				break
			case 'dateOfBirth':
				updatedData = {
					dateOfBirth: formData.dateOfBirth,
				}
				break
			case 'address':
				updatedData = {
					address: formData.address,
				}
				break
			case 'phone':
				updatedData = {
					phone: formData.phone,
				}
				break
			case 'about':
				updatedData = {
					about: formData.about,
				}
				break
			default:
				break
		}

		dispatch(updateUser(updatedData) as any)
		setEditingField(null)
	}

	// Cancel editing
	const handleCancel = () => {
		setEditingField(null)
		setFormData({
			firstname: userData?.accountData?.firstname || '',
			lastname: userData?.accountData?.lastname || '',
			gender: userData?.accountData?.gender || t('default_gender'),
			username: userData?.username || '',
			email: userData?.email || '',
			dateOfBirth: userData?.accountData?.dateOfBirth || '',
			address: userData?.accountData?.address || '',
			phone: userData?.phone || '',
			about: userData?.accountData?.about || '',
		})
	}

	// Format user data for display
	const formatUserData = () => {
		return {
			legalName:
				userData?.accountData?.firstname && userData?.accountData?.lastname
					? `${userData.accountData.firstname} ${userData.accountData.lastname}`
					: t('not_provided'),
			gender: userData?.accountData?.gender || t('not_provided'),
			username: userData?.username || t('not_provided'),
			email: userData?.email || t('not_provided'),
			dateOfBirth: userData?.accountData?.dateOfBirth
				? new Date(userData.accountData.dateOfBirth).toLocaleDateString()
				: t('not_provided'),
			phone: userData?.phone || t('not_provided'),
			address: userData?.accountData?.address || t('not_provided'),
			about: userData?.accountData?.about || t('not_provided'),
		}
	}

	const userDisplayData = formatUserData()

	// Array of personal info items
	const personalInfoItems: InfoItem[] = [
		{
			id: 'legalName',
			title: t('legal_name_title'),
			value: userDisplayData.legalName,
			description: t('legal_name_description'),
			actionType: 'edit',
			icon: User,
		},
		{
			id: 'gender',
			title: t('gender_title'),
			value: userDisplayData.gender,
			actionType: 'edit',
			icon: User,
		},
		{
			id: 'username',
			title: t('username_title'),
			value: userDisplayData.username,
			actionType: 'edit',
			icon: User,
		},
		{
			id: 'email',
			title: t('email_title'),
			value: userDisplayData.email,
			actionType: 'edit',
			icon: Mail,
		},
		{
			id: 'dateOfBirth',
			title: t('dob_title'),
			value: userDisplayData.dateOfBirth,
			actionType: 'edit',
			icon: User,
		},
		{
			id: 'address',
			title: t('address_title'),
			value: userDisplayData.address,
			actionType: 'edit',
			icon: MapPin,
		},
		{
			id: 'phone',
			title: t('phone_title'),
			value: userDisplayData.phone,
			actionType: 'edit',
			icon: Phone,
		},
		{
			id: 'about',
			title: t('about_title'),
			value: userDisplayData.about,
			actionType: 'edit',
			icon: User,
		},
	]

	// Render edit form for legal name
	const renderLegalNameEditForm = () => (
		<div className="mt-2 space-y-4">
			<p className="text-gray-600">{t('legal_name_edit_description')}</p>
			<div className="flex flex-col gap-4 md:flex-row">
				<div className="flex-1">
					<div className="relative rounded-lg border border-gray-300">
						<label
							htmlFor="firstname"
							className="absolute left-3 top-2 text-xs text-gray-500"
						>
							{t('first_name_label')}
						</label>
						<input
							type="text"
							id="firstname"
							name="firstname"
							value={formData.firstname}
							onChange={handleChange}
							className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
						/>
					</div>
				</div>
				<div className="flex-1">
					<div className="relative rounded-lg border border-gray-300">
						<label
							htmlFor="lastname"
							className="absolute left-3 top-2 text-xs text-gray-500"
						>
							{t('last_name_label')}
						</label>
						<input
							type="text"
							id="lastname"
							name="lastname"
							value={formData.lastname}
							onChange={handleChange}
							className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
						/>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('legalName')}
					disabled={loading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{loading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{t('saving')}
						</>
					) : (
						t('save')
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={loading}
				>
					{t('cancel')}
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
	)

	// Render edit form for gender
	const renderGenderEditForm = () => (
		<div className="mt-2 space-y-4">
			<div className="relative rounded-lg border border-gray-300">
				<label
					htmlFor="gender"
					className="absolute left-3 top-2 text-xs text-gray-500"
				>
					{t('gender_label')}
				</label>
				<select
					id="gender"
					name="gender"
					value={formData.gender}
					onChange={handleChange}
					className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
				>
					<option value="Male">{t('gender_male')}</option>
					<option value="Female">{t('gender_female')}</option>
					<option value="Other">{t('gender_other')}</option>
				</select>
			</div>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('gender')}
					disabled={loading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{loading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{t('saving')}
						</>
					) : (
						t('save')
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={loading}
				>
					{t('cancel')}
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
	)

	// Render edit form for username
	const renderUsernameEditForm = () => (
		<div className="mt-2 space-y-4">
			<div className="relative rounded-lg border border-gray-300">
				<label
					htmlFor="username"
					className="absolute left-3 top-2 text-xs text-gray-500"
				>
					{t('username_label')}
				</label>
				<input
					type="text"
					id="username"
					name="username"
					value={formData.username}
					onChange={handleChange}
					className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('username')}
					disabled={loading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{loading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{t('saving')}
						</>
					) : (
						t('save')
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={loading}
				>
					{t('cancel')}
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
	)

	// Render edit form for email
	const renderEmailEditForm = () => (
		<div className="mt-2 space-y-4">
			<div className="relative rounded-lg border border-gray-300">
				<label
					htmlFor="email"
					className="absolute left-3 top-2 text-xs text-gray-500"
				>
					{t('email_label')}
				</label>
				<input
					type="email"
					id="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('email')}
					disabled={loading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{loading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{t('saving')}
						</>
					) : (
						t('save')
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={loading}
				>
					{t('cancel')}
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
	)

	// Render edit form for date of birth
	const renderDateOfBirthEditForm = () => (
		<div className="mt-2 space-y-4">
			<div className="relative rounded-lg border border-gray-300">
				<label
					htmlFor="dateOfBirth"
					className="absolute left-3 top-2 text-xs text-gray-500"
				>
					{t('dob_label')}
				</label>
				<input
					type="date"
					id="dateOfBirth"
					name="dateOfBirth"
					value={formData.dateOfBirth}
					onChange={handleChange}
					className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('dateOfBirth')}
					disabled={loading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{loading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{t('saving')}
						</>
					) : (
						t('save')
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={loading}
				>
					{t('cancel')}
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
	)

	// Render edit form for address
	const renderAddressEditForm = () => (
		<div className="mt-2 space-y-4">
			<div className="relative rounded-lg border border-gray-300">
				<label
					htmlFor="address"
					className="absolute left-3 top-2 text-xs text-gray-500"
				>
					{t('address_label')}
				</label>
				<input
					type="text"
					id="address"
					name="address"
					value={formData.address}
					onChange={handleChange}
					className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('address')}
					disabled={loading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{loading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{t('saving')}
						</>
					) : (
						t('save')
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={loading}
				>
					{t('cancel')}
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
	)

	// Render edit form for phone
	const renderPhoneEditForm = () => (
		<div className="mt-2 space-y-4">
			<div className="relative rounded-lg border border-gray-300">
				<label
					htmlFor="phone"
					className="absolute left-3 top-2 text-xs text-gray-500"
				>
					{t('phone_label')}
				</label>
				<input
					type="tel"
					id="phone"
					name="phone"
					value={formData.phone}
					onChange={handleChange}
					className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('phone')}
					disabled={loading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{loading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{t('saving')}
						</>
					) : (
						t('save')
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={loading}
				>
					{t('cancel')}
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
	)

	// Render edit form for about
	const renderAboutEditForm = () => (
		<div className="mt-2 space-y-4">
			<div className="relative rounded-lg border border-gray-300">
				<label
					htmlFor="about"
					className="absolute left-3 top-2 text-xs text-gray-500"
				>
					{t('about_label')}
				</label>
				<textarea
					id="about"
					name="about"
					value={formData.about}
					onChange={handleChange}
					rows={4}
					className="w-full rounded-lg px-3 pb-3 pt-7 focus:outline-none focus:ring-2 focus:ring-black"
				/>
			</div>
			<div className="flex items-center justify-between">
				<button
					onClick={() => handleSave('about')}
					disabled={loading}
					className="flex items-center rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
				>
					{loading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{t('saving')}
						</>
					) : (
						t('save')
					)}
				</button>
				<button
					onClick={handleCancel}
					className="font-medium text-gray-700 hover:underline"
					disabled={loading}
				>
					{t('cancel')}
				</button>
			</div>
			{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
		</div>
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
					{t('account')}
				</Link>
				<ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
				<span className="text-gray-800">{t('personal_info')}</span>
			</div>

			{/* Page Title */}
			<h1 className="mb-8 text-3xl font-semibold">{t('page_title')}</h1>

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
										? t('edit')
										: item.actionType === 'add'
											? t('add')
											: t('start')}
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
								{t('info_hidden_title')}
							</h2>
							<p className="text-gray-600">{t('info_hidden_description')}</p>
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
								{t('editable_info_title')}
							</h2>
							<p className="text-gray-600">{t('editable_info_description')}</p>
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
								{t('shared_info_title')}
							</h2>
							<p className="text-gray-600">{t('shared_info_description')}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
