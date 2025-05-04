import Cookies from 'js-cookie'
import React from 'react'
interface EnumServiceGetOrderBy {
	email: string
	password: string
}

const basedDeleteUrlRequestLogedIn = async (
	url: string,
	dataBody: EnumServiceGetOrderBy,
) => {
	const UserCookie = Cookies.get('user')
	const response = await fetch(url + UserCookie, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},

		body: JSON.stringify(dataBody),
	})
	const data = await response.json()
	return data
}

export default basedDeleteUrlRequestLogedIn
