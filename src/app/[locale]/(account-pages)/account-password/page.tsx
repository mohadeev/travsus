'use client'
import React, { useState } from 'react'
import Label from '@/components/Label'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Input from '@/shared/Input'
import { useTranslations } from 'next-intl'

const AccountPass = () => {
	const t = useTranslations('accountpages_accountpassword_page')
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		setError('')
		setSuccess('')

		if (newPassword !== confirmPassword) {
			setError(
				t(
					'accountpages_accountpassword_page_New_Password_And_Confirm_Password_Do_Not_Match',
				),
			)
			return
		}

		try {
			const response = await fetch('/api/user/post/update-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
			})

			const data = await response.json()

			if (!response.ok) {
				setError(
					data.message ||
						t('accountpages_accountpassword_page_Failed_To_Update_Password'),
				)
			} else {
				setSuccess(
					t('accountpages_accountpassword_page_Password_Updated_Successfully'),
				)
			}
		} catch (error) {
			setError(
				t(
					'accountpages_accountpassword_page_An_Error_Occurred_While_Updating_The_Password',
				),
			)
		}
	}

	return (
		<div className="space-y-6 sm:space-y-8">
			{/* HEADING */}
			<h2 className="text-3xl font-semibold">
				{t('accountpages_accountpassword_page_Update_Your_Password')}
			</h2>
			<div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
			<form className="max-w-xl space-y-6" onSubmit={handleSubmit}>
				<div>
					<Label>
						{t('accountpages_accountpassword_page_Current_Password')}
					</Label>
					<Input
						type="password"
						className="mt-1.5"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
					/>
				</div>
				<div>
					<Label>{t('accountpages_accountpassword_page_New_Password')}</Label>
					<Input
						type="password"
						className="mt-1.5"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
					/>
				</div>
				<div>
					<Label>
						{t('accountpages_accountpassword_page_Confirm_Password')}
					</Label>
					<Input
						type="password"
						className="mt-1.5"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>
				{error && <p className="text-red-500">{error}</p>}
				{success && <p className="text-green-500">{success}</p>}
				<div className="pt-2">
					<ButtonPrimary type="submit">
						{t('accountpages_accountpassword_page_Update_Password')}
					</ButtonPrimary>
				</div>
			</form>
		</div>
	)
}

export default AccountPass
