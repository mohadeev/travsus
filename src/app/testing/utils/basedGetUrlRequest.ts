import React from 'react'
import Cookies from 'js-cookie'
import allHeadersReq from './allHeadersReqJson'
const basedGetUrlRequest = async (url: string) => {
	const headers = allHeadersReq()?.headers
	try {
		const response = await fetch(url, {
			method: 'GET',
			credentials: 'include',
			headers: headers,
		})
		const data = await response.json()
		return data
	} catch (error) {
		return null
	}
}

export default basedGetUrlRequest
