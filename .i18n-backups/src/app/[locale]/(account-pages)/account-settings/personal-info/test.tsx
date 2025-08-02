'use client'
import React, { useState, FC, useEffect } from 'react'
import Label from '@/components/Label'
import Avatar from '@/shared/Avatar'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Input from '@/shared/Input'
import Select from '@/shared/Select'
import Textarea from '@/shared/Textarea'
import { useDispatch, useSelector } from 'react-redux'
import { ChangeEvent } from 'react'
import { updateUser } from '@/app/GlobalRedux/Features/userReducer/userReducer'
import PhoneInput from 'react-phone-number-input'
// import AccountImage from './account-settingsImage'
import { LogOut } from 'lucide-react'

import { signOut } from 'next-auth/react'
import AccountImage from '../account-settingsImage'

export interface AccountPageProps {}

const AccountPage = () => {
	const dispatch = useDispatch()

	// Assuming RootState is the type of your Redux state
	const user = useSelector((state: any) => state.userReducer.userData)

	// Defining the type of formData state
	interface FormData {
		lastname: string
		firstname: string
		gender: string
		username: string
		email: string
		dateOfBirth: string
		address: string
		phone: string
		about: string
	}

	const [formData, setFormData] = useState<FormData>({
		lastname: user?.accountData?.lastname || '',
		firstname: user?.accountData?.firstname || '',
		gender: user?.accountData?.gender || 'Male',
		username: user?.username || '',
		email: user?.email || '',
		dateOfBirth: user?.accountData?.dateOfBirth || '',
		address: user?.accountData?.address || '',
		phone: user?.phone || '',
		about: user?.accountData?.about || '',
	})
	useEffect(() => {
		setFormData({
			lastname: user?.accountData?.lastname || '',
			firstname: user?.accountData?.firstname || '',
			gender: user?.accountData?.gender || 'Male',
			username: user?.username || '',
			email: user?.email || '',
			dateOfBirth: user?.accountData?.dateOfBirth || '',
			address: user?.accountData?.address || '',
			phone: user?.phone || '',
			about: user?.accountData?.about || '',
		})

		return () => {}
	}, [user])

	// Type for ChangeEvent
	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		if (e?.target?.name) {
			setFormData({
				...formData,
				[e.target.name]: e.target.value,
			})
		}
	}

	const handleChangePhone = (value: string) => {
		if (value) {
			setFormData({
				...formData,
				phone: value,
			})
		}
	}
	// Type for FormEvent
	const handleSubmit = async (e: any) => {
		e.preventDefault()
		dispatch(updateUser(formData))
	}

	// Handle sign out
	const handleSignOut = () => {
		// Implement your sign out logic here
		// For example:
		// dispatch(signOut())
		// router.push('/login')
		console.log('User signed out')
	}
	return (
		<div className="w-full space-y-6 sm:space-y-8">
			{/* HEADING */}
			<h2 className="text-3xl font-semibold">Account infomation</h2>
			{/* <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div> */}
			<div className="flex w-full flex-col items-start justify-between gap-5 lg:flex-row">
				<AccountImage />
				<form
					onSubmit={handleSubmit}
					className="mt-10 w-full max-w-3xl flex-grow space-y-6 lg:mt-0 lg:pl-0"
				>
					<div>
						<Label>Name</Label>
						<Input
							className="mt-1.5"
							defaultValue={formData.firstname}
							name="firstname"
							onChange={handleChange}
						/>
						<Label>Last name</Label>
						<Input
							className="mt-1.5"
							defaultValue={formData.lastname}
							name="lastname"
							onChange={handleChange}
						/>
					</div>
					{/* ---- */}
					<div>
						<Label>Gender</Label>
						<Select className="mt-1.5">
							<option value="Male">Male</option>
							<option value="Female">Female</option>
							<option value="Other">Other</option>
						</Select>
					</div>
					{/* ---- */}
					<div>
						<Label>Username</Label>
						<Input
							className="mt-1.5"
							name="username"
							defaultValue={formData.username}
							onChange={handleChange}
						/>
					</div>
					{/* ---- */}
					<div>
						<Label>Email</Label>
						<Input
							className="mt-1.5"
							defaultValue={formData.email}
							name="email"
							onChange={handleChange}
						/>
					</div>
					{/* ---- */}
					<div className="max-w-lg">
						<Label>Date of birth</Label>
						<Input
							className="mt-1.5"
							type="date"
							name="dateOfBirth"
							defaultValue={formData.dateOfBirth}
							onChange={handleChange}
						/>
					</div>
					{/* ---- */}
					<div>
						<Label>Addess</Label>
						<Input className="mt-1.5" defaultValue="New york, USA" />
					</div>
					{/* ---- */}
					<div>
						<Label>Phone number</Label>
						<Input
							className="mt-1.5"
							value={formData.phone}
							name="phone"
							type="phone"
							onChange={(value: any) => handleChangePhone(value)}
						/>
					</div>
					{/* ---- */}
					<div>
						<Label>About you</Label>
						<Textarea
							className="mt-1.5"
							name="about"
							onChange={handleChange}
							defaultValue={formData.about}
						/>
					</div>
					<div className="pt-2">
						<ButtonPrimary type="submit">Update info</ButtonPrimary>
					</div>
				</form>
			</div>
			{/* Sign Out Button - Only visible on mobile (768px and below) */}
			<div className="mt-6 block md:hidden">
				<ButtonPrimary
					onClick={handleSignOut}
					className="flex w-full items-center justify-center gap-2"
				>
					<LogOut size={18} />
					<span>Sign Out</span>
				</ButtonPrimary>
			</div>
		</div>
	)
}

export default AccountPage
