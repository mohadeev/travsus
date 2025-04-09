import axios from 'axios'

// Comment: Utility function to search for countries
export async function searchCountries(name: any) {
	if (!name) {
		console.error('Country name is required')
	}

	try {
		const response = await axios.get(
			`${process.env.NEXT_PUBLIC_EXTERNAL_SERVER}/api/location/get/searchCountries`,
			{
				params: { q: name?.placeName },
			},
		)
		console.log('response.data', response.data)
		return response.data
	} catch (error) {
		console.log('Error fetching countries:', error)
	}
}
