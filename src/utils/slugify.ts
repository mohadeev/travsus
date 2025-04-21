export const slugify = (text: string) => {
	// Handle null or undefined input
	if (!text) return ''

	// Replace accented characters with their Latin equivalents
	const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

	// Replace emojis with hyphens
	// This regex attempts to match emoji characters
	const withoutEmojis = normalized.replace(
		/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
		'-',
	)

	// Convert to lowercase and replace non-alphanumeric characters with hyphens
	const slug = withoutEmojis
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens

	// Ensure no double hyphens
	return slug.replace(/-+/g, '-')
}

export default slugify
