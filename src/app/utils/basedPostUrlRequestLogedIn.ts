import Cookies from 'js-cookie'
import React from 'react'
import allHeadersReqJson from './allHeadersReqJson'
interface EnumServiceGetOrderBy {
	email: string
	password: string
}

const basedPostUrlRequestLogedIn = async (
	url: string,
	dataBody: EnumServiceGetOrderBy,
) => {
	const UserCookie = Cookies.get('user')
	const headers = allHeadersReqJson()?.headers

	const response = await fetch(url + UserCookie, {
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

export default basedPostUrlRequestLogedIn
