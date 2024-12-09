import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

async function getFetchDataFromApi<T>(
	apiUrl: string,
	queryParams?: Record<string, any>,
): Promise<T> {
	try {
		const axiosConfig: AxiosRequestConfig = {
			params: queryParams, // Adds query parameters to the request
		}

		const apiResponse: AxiosResponse<T> = await axios.get(apiUrl, axiosConfig) 
		
		return apiResponse.data
	} catch (error) {
		console.error('Error fetching data from API:', error)
		throw error // Rethrow the error after logging it
	}
}

export default getFetchDataFromApi
