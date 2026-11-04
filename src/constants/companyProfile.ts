

import { SUPPORT_EMAIL, SUPPORT_PHONE } from './contact'

// Template values that were never replaced ("Dummy Guarantor Name",
// "IE1234567A"...): dropped, so they never show to customers
const PLACEHOLDER = /dummy|1234567/i

export function getCompanyProfile() {
	const profileString = process.env.NEXT_PUBLIC_COMPANY_PROFILE
	if (!profileString) {
		console.log("profileString:", profileString)
		throw new Error(
			'NEXT_PUBLIC_COMPANY_PROFILE environment variable is not set',
		)
	}

	try {
		const profile = JSON.parse(profileString)
		for (const [key, value] of Object.entries(profile)) {
			if (typeof value === 'string' && PLACEHOLDER.test(value)) delete profile[key]
		}
		return { ...profile, contactPhone: SUPPORT_PHONE, contactEmail: profile.contactEmail || SUPPORT_EMAIL }
	} catch (error) {
		console.error('Error parsing NEXT_PUBLIC_COMPANY_PROFILE:', error)
		throw new Error('Invalid NEXT_PUBLIC_COMPANY_PROFILE format')
	}
}

export const companyProfile = getCompanyProfile()
