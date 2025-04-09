// Client-side API functions

export async function getCompanyData() {
	try {
		const response = await fetch('/api/dashboard/company/company-data')
		if (!response.ok) {
			throw new Error('Failed to fetch company data')
		}
		return await response.json()
	} catch (error) {
		console.error('Error fetching company data:', error)
		throw error
	}
}

export async function updateCompanyData(data: any) {
	try {
		const response = await fetch('/api/dashboard/company/company-edit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			throw new Error('Failed to update company data')
		}

		return await response.json()
	} catch (error) {
		console.error('Error updating company data:', error)
		throw error
	}
}

export async function getUserData() {
	try {
		const response = await fetch('/api/user/profile')
		if (!response.ok) {
			throw new Error('Failed to fetch user data')
		}
		return await response.json()
	} catch (error) {
		console.error('Error fetching user data:', error)
		throw error
	}
}

export async function updateUserData(data: any) {
	try {
		const response = await fetch('/api/user/profile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			throw new Error('Failed to update user data')
		}

		return await response.json()
	} catch (error) {
		console.error('Error updating user data:', error)
		throw error
	}
}
