import basedGetUrlRequest from '@/app/utils/basedGetUrlRequest'

const allToursFetch = async () => {
	return await basedGetUrlRequest('/api/location/get/all-tours')
}

export default allToursFetch
