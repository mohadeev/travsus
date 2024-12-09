import basedPostUrlRequestLogedIn from '@/app/utils/basedPostUrlRequestLogedIn'

export async function checkBooking() {
	try {
		// return true
		const response = await fetch('/api/checking-booking', {
			method: 'POST',
			body: JSON.stringify({}),
		})
		return response
	} catch (error) {
		console.error('Error checking booking:', error)
		return false
	}
}
