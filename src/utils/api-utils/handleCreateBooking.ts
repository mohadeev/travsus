import basedPostUrlRequestLogedIn from '@/app/utils/basedPostUrlRequestLogedIn'

const handleCreateBooking = async (body: any) => {
	await basedPostUrlRequestLogedIn(
		'/api/booking/post/handle-create-booking',
		body,
	)
		.then((res: any) => {
			console.log('res', res)
		})
		.catch((err) => {
			console.log('err', err)
		})
}

export default handleCreateBooking
