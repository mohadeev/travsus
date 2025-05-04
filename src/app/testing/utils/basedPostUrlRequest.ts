import Cookies from 'js-cookie'
import React from 'react'
import allHeadersReqJson from './allHeadersReqJson'
interface EnumServiceGetOrderBy {
	email: string
	password: string
	Cookies: any
}

const basedPostUrlRequest = async (
	url: string,
	dataBody: EnumServiceGetOrderBy,
) => {
	const headers = allHeadersReqJson()?.headers

	const response = await fetch(url, {
		method: 'POST',
		headers,
		// headers: {
		//   "Content-Type": "application/json",
		// },

		body: JSON.stringify(dataBody),
	})
	const data = await response.json()
	return data
}

export default basedPostUrlRequest
