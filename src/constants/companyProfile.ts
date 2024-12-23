

export function getCompanyProfile() {
	const profileString = process.env.NEXT_PUBLIC_COMPANY_PROFILE
	if (!profileString) {
		throw new Error(
			'NEXT_PUBLIC_COMPANY_PROFILE environment variable is not set',
		)
	}

	try {
		return JSON.parse(profileString)
	} catch (error) {
		console.error('Error parsing NEXT_PUBLIC_COMPANY_PROFILE:', error)
		throw new Error('Invalid NEXT_PUBLIC_COMPANY_PROFILE format')
	}
}

export const companyProfile = getCompanyProfile()
