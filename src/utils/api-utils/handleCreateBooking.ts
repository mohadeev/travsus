import basedPostUrlRequestLogedIn from '@/app/utils/basedPostUrlRequestLogedIn'

const handleCreateBooking = async (body: any) => {
return 	await basedPostUrlRequestLogedIn(
		'/api/booking/post/create-booking',
		body,
	)
}

export default handleCreateBooking
