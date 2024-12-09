import Cookies from 'js-cookie'
import React from 'react'
import allHeadersReqJson from './allHeadersReqJson'

const basedPostUrlRequestLogedIn = async (url: string, body: any) => {
	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
	const result = await response.json()
	return result
	if (!response.ok) {
		console.error(url, result.message)
	}
}

export default basedPostUrlRequestLogedIn
