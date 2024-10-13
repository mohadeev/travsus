import basedPostUrlRequestLogedIn from '@/app/utils/basedPostUrlRequestLogedIn'

const updateCompanyInfo = async (body: any) => {
	return await basedPostUrlRequestLogedIn(
		'/api/company/post/edit-company',
		body,
	)
}

export default updateCompanyInfo
