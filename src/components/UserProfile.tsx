'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { login } from '@/app/actions/auth'
// import { login } from '../actions/auth'

interface UserData {
	id: string
	name: string | null
	email: string | null
}

interface UserProfileProps {
	initialUserData: UserData | null
}

export default function UserProfile({ initialUserData }: UserProfileProps) {
	const { data: session, status } = useSession()
	const [error, setError] = useState<string | null>(null)
	const [userData, setUserData] = useState<UserData | null>(initialUserData)

	async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setError(null)
		const formData = new FormData(event.currentTarget)
		const result = await login(formData)
		if (result?.error) {
			setError(result.error)
		}
	}

	async function handleLogout() {
		await signOut({ redirect: false })
		setUserData(null)
	}

	if (status === 'loading') {
		return <div>Loading...</div>
	}

	if (session && userData) {
		return (
			<div>
				<h2>Welcome, {userData.name || userData.email}!</h2>
				<div>
					<h3>User Data from Database:</h3>
					<pre>{JSON.stringify(userData, null, 2)}</pre>
				</div>
				<button onClick={handleLogout}>Logout</button>
			</div>
		)
	}

	return (
		<form onSubmit={handleLogin}>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<input name="email" type="email" placeholder="Email" required />
			<input name="password" type="password" placeholder="Password" required />
			<button type="submit">Login</button>
		</form>
	)
}
