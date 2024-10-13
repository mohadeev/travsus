import axios from 'axios'

export async function clientUploadImage(
	type: 'user' | 'business' | 'tour',
	id: string,
	file: File,
	imageType?: 'profile' | 'cover', // Optional parameter for business image type
) {
	if (!type || !id || !file) {
		throw new Error('Type, ID, and file are required')
	}

	const formData = new FormData()
	formData.append('file', file)

	// Build the request URL based on the type and imageType (for business)
	let url = `/api/image/post/upload-image?type=${type}&id=${id}`
	if (type === 'business' && imageType) {
		url += `&imageType=${imageType}` // Append imageType for business
	}

	try {
		const response = await axios.post(url, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})

		// Handle success (response.data contains the uploaded image URL)
		console.log('Image uploaded successfully:', response.data)
		return response.data // You can return the response data or URL as needed
	} catch (error) {
		console.error('Error uploading image:', error)
		throw new Error('Failed to upload image')
	}
}
