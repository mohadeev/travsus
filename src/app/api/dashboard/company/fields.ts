// The company fields a user may set, checked and trimmed (create and edit).
export function companyFields(body: any): { fields?: Record<string, any>; error?: string } {
	const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
	const name = text(body?.name, 120)
	const email = text(body?.email, 160).toLowerCase()
	if (name.length < 2) return { error: 'Please enter the company name.' }
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid business email.' }
	if (!['TRAVEL_AGENCY', 'STAY'].includes(body?.type)) return { error: 'Please choose what kind of business it is.' }
	return {
		fields: {
			name,
			email,
			type: body.type,
			adminName: text(body.adminName, 120) || null,
			phoneNumber: text(body.phoneNumber, 40),
			address: text(body.address, 300) || null,
			country: text(body.country, 80) || null,
			registrationNumber: text(body.registrationNumber, 60) || null,
		},
	}
}
