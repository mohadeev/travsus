import basedPostUrlRequestLogedIn from '@/app/utils/basedPostUrlRequestLogedIn'

const handleCreateBooking = async (body: any) => {
	// await basedPostUrlRequestLogedIn('/api/listing/post/change-ownership', body)
	return await basedPostUrlRequestLogedIn(
		'/api/booking/post/create-booking',
		body,
	)
}

export default handleCreateBooking
