import axios from 'axios'

// Comment: Utility function to search for countries
export async function searchCountries(name: any) {
	if (!name) {
		throw new Error('Country name is required')
	}

	try {
		const response = await axios.get('/api/location/get/searchCountries', {
			params: { name: name?.placeName },
		})
		return response.data
	} catch (error) {
		console.log('Error fetching countries:', error)
	}
}
