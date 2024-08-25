import axios from 'axios'

// Comment: Utility function to search for countries
export async function getFamoustCitiesArround() {
	try {
		const response = await axios.get('/api/location/get/exploreNearby', {
			// params: { name: name?.placeName },
		})
		return response.data
	} catch (error) {
		console.log('Error fetching countries:', error)
	}
}
