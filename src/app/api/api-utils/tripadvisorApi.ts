export const tripadvisorApi = async ({ params, method, locationId }: any) => {
	const methods = [
		{
			name: 'search',
			url: 'https://api.content.tripadvisor.com/api/v1/location/search?',
		},
		{
			name: 'details',
			url: `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?`,
		},
		{
			name: 'photos',
			url: `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos?`,
		},
	]
	const { url }: any = methods.find((meth) => meth.name === method)
	const options = { method: 'GET', headers: { accept: 'application/json' } }
	const language = params.language ? params.language : 'en'
	params.language = language
	const radius = params.radius ? params.radius : 1
	params.radius = radius
	// Create a URLSearchParams paramsect from the paramsect
	const queryString = new URLSearchParams(params).toString()
	try {
		const finalString = `&${queryString}`
		const linkFetch = `${url}key=${process.env.TRIPADVISOR_ACCESS_TOKEN}&${queryString}`
		console.log(linkFetch)
		const response = await fetch(linkFetch, options)
		const data = await response.json()
		return { data: data, error: false }
	} catch (error) {
		return { message: error, error: true }
	}
}
