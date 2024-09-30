export default function splitName(str: string): {
	firstname: string
	lastname: string
} {
	const parts: string[] = str.split(' ')
	return {
		firstname: parts[0],
		lastname: parts.slice(1).join(' ') || '', // If no lastname, it will be an empty string
	}
}
