function readProfile() {
	const profileString = process.env.NEXT_PUBLIC_COMPANY_PROFILE
	if (!profileString) {
		console.error('NEXT_PUBLIC_COMPANY_PROFILE is not set; legal pages will omit company details')
		return {}
	}

	try {
		return JSON.parse(profileString)
	} catch (error) {
		console.error('Error parsing NEXT_PUBLIC_COMPANY_PROFILE:', error)
		throw new Error('Invalid NEXT_PUBLIC_COMPANY_PROFILE format')
	}
}

let cached: ReturnType<typeof readProfile> | undefined

export function getCompanyProfile() {
	if (cached) return cached
	cached = readProfile()
	return cached
}

// Property access parses the profile. Importing this module must not throw:
// Next evaluates it while collecting routes, before env may be present.
export const companyProfile: Record<string, any> = new Proxy(
	{},
	{
		get(_target, prop) {
			if (typeof prop !== 'string') return undefined
			const profile = getCompanyProfile()
			const value = profile[prop]
			return typeof value === 'function' ? value.bind(profile) : value
		},
	},
)
