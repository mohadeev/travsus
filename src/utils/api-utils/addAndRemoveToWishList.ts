import basedPostUrlRequestLogedIn from '@/app/utils/basedPostUrlRequestLogedIn'

const addAndRemoveToWishList = async (body: any) => {
	console.log(body)
	return await basedPostUrlRequestLogedIn(
		'/api/user/post/add-and-remove-to-wishList',
		body,
	)
}

export default addAndRemoveToWishList
