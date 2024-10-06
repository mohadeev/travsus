import basedPostUrlRequestLogedIn from '@/app/utils/basedPostUrlRequestLogedIn'

const handleCreateBooking = async (body: any) => {
return 	await basedPostUrlRequestLogedIn(
		'/api/booking/post/handle-create-booking',
		body,
	)
}

export default handleCreateBooking
