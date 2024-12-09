export async function uploadImage(file: File): Promise<any> {
	if (!file) {
		throw new Error('File is required')
	}

	const formData = new FormData()
	formData.append('file', file)

	const externalServerOrigin = process.env.NEXT_PUBLIC_EXTERNAL_IMAGE_UPLOAD_URL
	console.log('externalServerOrigin:', externalServerOrigin)

	if (!externalServerOrigin) {
		throw new Error(
			'External server origin is not defined in environment variables',
		)
	}

	const uploadUrl = `${externalServerOrigin}/api/image/post/upload`
	console.log('Upload URL:', uploadUrl)

	try {
		const response = await fetch(uploadUrl, {
			method: 'POST',
			body: formData,
		})

		if (!response.ok) {
			const errorText = await response.text()
			console.error('Error response from server:', errorText)
			throw new Error(`Failed to upload image: ${response.statusText}`)
		}

		const data = await response.json()
		console.log('Image uploaded successfully:', data)

		return data
	} catch (error) {
		console.error('Error uploading image to external server:', error)
		throw new Error('Failed to upload image')
	}
}

// export { uploadImage }
