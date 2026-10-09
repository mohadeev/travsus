// Fields that must never be sent to the browser.
const SECRET_FIELDS = [
	'password',
	'passwordHistory',
	'passwordResetToken',
	'passwordResetTokens',
	'passwordResetTokenExpiry',
	'verificationLinkToken',
	'verificationCodeToken',
	'verificationCode',
	'verificationCodeExpiry',
	'verificationTokenExpiry',
] as const

/** Returns a copy of a user row without passwords or tokens. */
export function safeUser<U extends Record<string, any> | null>(user: U): U {
	if (!user) return user
	const copy: Record<string, any> = { ...user }
	for (const field of SECRET_FIELDS) delete copy[field]
	return copy as U
}

/** Strips secrets from the customer/provider users embedded in a booking. */
export function safeBooking<B extends Record<string, any> | null>(booking: B): B {
	if (!booking) return booking
	return {
		...booking,
		customer: safeUser(booking.customer ?? null),
		provider: safeUser(booking.provider ?? null),
	} as B
}
