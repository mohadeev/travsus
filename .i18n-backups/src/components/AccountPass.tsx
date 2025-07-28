'use client'

import type React from 'react'
import { useState } from 'react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Loader2 } from 'lucide-react'

const AccountPass = () => {
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
			setError('New password and confirm password do not match.')
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
				setError(data.message || 'Failed to update password.')
			} else {
				setSuccess('Password updated successfully!')
				setCurrentPassword('')
				setNewPassword('')
				setConfirmPassword('')
			}
		} catch (error) {
			setError('An error occurred while updating the password.')
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
						Current password
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
						New password
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
						Confirm password
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
								Updating...
							</>
						) : (
							'Update password'
						)}
					</ButtonPrimary>
				</div>
			</form>
		</div>
	)
}

export default AccountPass
