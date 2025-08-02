'use client'

import type React from 'react'
import { useState } from 'react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Loader2 } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const AccountPass = () => {
	const t = useTranslations('components_AccountPass')
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setSuccess('')
		setLoading(true)

		if (newPassword !== confirmPassword) {
			setError(t('components_AccountPass_New_And_Confirm_Password_Not_Match'))
			setLoading(false)
			return
		}

		try {
			const response = await fetch('/api/user/post/update-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ currentPassword, newPassword }),
			})

			const data = await response.json()

			if (!response.ok) {
				setError(
					data.message || t('components_AccountPass_Failed_To_Update_Password'),
				)
			} else {
				setSuccess(t('components_AccountPass_Password_Updated_Successfully'))
				setCurrentPassword('')
				setNewPassword('')
				setConfirmPassword('')
			}
		} catch (error) {
			setError(t('components_AccountPass_Error_Updating_Password'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="space-y-6">
			<form className="space-y-6" onSubmit={handleSubmit}>
				<div>
					<label
						htmlFor="current-password"
						className="mb-1 block text-sm font-medium text-gray-700"
					>
						{t('components_AccountPass_Current_Password')}
					</label>
					<div className="relative rounded-lg border border-gray-300">
						<input
							type="password"
							id="current-password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
							required
						/>
					</div>
				</div>

				<div>
					<label
						htmlFor="new-password"
						className="mb-1 block text-sm font-medium text-gray-700"
					>
						{t('components_AccountPass_New_Password')}
					</label>
					<div className="relative rounded-lg border border-gray-300">
						<input
							type="password"
							id="new-password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
							required
						/>
					</div>
				</div>

				<div>
					<label
						htmlFor="confirm-password"
						className="mb-1 block text-sm font-medium text-gray-700"
					>
						{t('components_AccountPass_Confirm_Password')}
					</label>
					<div className="relative rounded-lg border border-gray-300">
						<input
							type="password"
							id="confirm-password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
							required
						/>
					</div>
				</div>

				{error && <p className="text-sm text-red-500">{error}</p>}
				{success && <p className="text-sm text-green-500">{success}</p>}

				<div className="pt-2">
					<ButtonPrimary
						type="submit"
						disabled={loading}
						className="flex items-center justify-center"
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{t('components_AccountPass_Updating')}
							</>
						) : (
							t('components_AccountPass_Update_Password')
						)}
					</ButtonPrimary>
				</div>
			</form>
		</div>
	)
}

export default AccountPass