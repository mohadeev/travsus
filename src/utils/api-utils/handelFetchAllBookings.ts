import basedGetUrlRequestLogedIn from '@/app/utils/basedGetUrlRequestLogedIn'

const handelFetchAllBookings = async () => { 
	return await basedGetUrlRequestLogedIn(
		'/api/booking/get/all-bookings')	
}

export default handelFetchAllBookings
