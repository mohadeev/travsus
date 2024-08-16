import Cookies from 'js-cookie'
import React from 'react'
import allHeadersReqJson from './allHeadersReqJson'

const basedGetUrlRequestLogedIn = async (url: string) => {
	const headers = allHeadersReqJson()?.headers
	if (url !== '') {
		try {
			const response = await fetch(url, {
				method: 'GET',
				headers,
			})
			const data = await response.json()
			return data
		} catch (error) {
			return null
		}
	} else {
		const response = await fetch(process.env.NEXT_PUBLIC_BACK_END_URL!, {
			method: 'GET',
		})
		const data = await response.json()
		return data
	}
}

export default basedGetUrlRequestLogedIn

//
