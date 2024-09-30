import basedPostUrlRequestLogedIn from '@/app/utils/basedPostUrlRequestLogedIn'

const addAndRemoveToWishList = async (body: any) => {
	console.log(body)
	await basedPostUrlRequestLogedIn(
		'/api/user/post/add-and-remove-to-wishList',
		body,
	)
		.then((res: any) => {
			console.log('res', res)
		})
		.catch((err) => {
			console.log('err', err)
		})
}

export default addAndRemoveToWishList
