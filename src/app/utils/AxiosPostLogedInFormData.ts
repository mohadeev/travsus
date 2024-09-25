import axios from 'axios'
import Cookies from 'js-cookie'

interface EnumServiceGetOrderBy {
	email: string
	password: string
}

const AxiosPostLogedInFormData = async (url: string, dataBody: any) => {
	const UserCookie = Cookies.get('user')
	const response = await axios.post(
		process.env.NEXT_PUBLIC_BACK_END_URL_SERVER_UPLOALD + url + UserCookie,
		dataBody,
		{
			headers: {
				'Content-Type': 'enctype=multipart/form-data',
			},
		},
	)

	const data = await response
	return data.data
}

export default AxiosPostLogedInFormData
