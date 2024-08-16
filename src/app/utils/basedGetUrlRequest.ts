import React from 'react'
import Cookies from 'js-cookie'
import allHeadersReq from './allHeadersReqJson'
const basedGetUrlRequest = async (url: string, credentials: boolean) => {
	const UserCookie = Cookies.get('user')
	const headers = allHeadersReq()?.headers
	if (url !== '') {
		if (credentials) {
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
		} else {
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
		}
	} else {
		const response = await fetch(process.env.NEXT_PUBLIC_BACK_END_URL!, {
			method: 'GET',
			headers: headers,
		})
		const data = await response.json()
		return data
	}
}

export default basedGetUrlRequest
