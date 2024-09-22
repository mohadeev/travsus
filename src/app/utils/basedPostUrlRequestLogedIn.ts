import Cookies from 'js-cookie'
import React from 'react'
import allHeadersReqJson from './allHeadersReqJson'

const basedPostUrlRequestLogedIn = async (url: string, body: any) => {
	console.log('body: ', JSON.stringify(body))

	const response = await fetch(url, {
		method: 'POST',
		// headers,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})
	const data = await response.json()
	return data
}

export default basedPostUrlRequestLogedIn
