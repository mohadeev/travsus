// import axios from 'axios'

// export async function clientUploadImage(
// 	type: 'user' | 'business' | 'tour',
// 	id: string,
// 	file: File,
// 	imageType?: 'profile' | 'cover', // Optional parameter for business image type
// ) {
// 	if (!type || !id || !file) {
// 		console.error('Type, ID, and file are required')
// 	}

// 	const formData = new FormData()
// 	formData.append('file', file)

// 	// Build the request URL based on the type and imageType (for business)
// 	let url = `/api/image/post/upload-image?type=${type}&id=${id}`
// 	if (type === 'business' && imageType) {
// 		url += `&imageType=${imageType}` // Append imageType for business
// 	}

// 	try {
// 		const response = await axios.post(url, formData, {
// 			headers: {
// 				'Content-Type': 'multipart/form-data',
// 			},
// 		})

// 		// Handle success (response.data contains the uploaded image URL)
// 		console.log('Image uploaded successfully:', response.data)
// 		return response.data // You can return the response data or URL as needed
// 	} catch (error) {
// 		console.error('Error uploading image:', error)
// 		console.error('Failed to upload image')
// 	}
// }

import axios from 'axios'

// Function to upload an image file to the external server
export async function clientUploadImage(file: File): Promise<any> {
	if (!file) {
		console.error('File is required')
	}

	const formData = new FormData()
	formData.append('file', file)

	// Get the external server origin or domain from environment variables
	const externalServerOrigin = process.env.NEXT_PUBLIC_EXTERNAL_SERVER
	console.log('externalServerOrigin:', externalServerOrigin)

	if (!externalServerOrigin) {
		console.error(
			'External server origin is not defined in environment variables',
		)
	}

	// Build the full upload URL by combining the origin with the upload path
	const uploadUrl = `${externalServerOrigin}/api/image/post/upload`
	console.log('Upload URL:', uploadUrl)

	try {
		// Use fetch to send a POST request to the external server to upload the file
		const response = await fetch(uploadUrl, {
			method: 'POST',
			body: formData, // Automatically sets Content-Type with boundary
		})

		if (!response.ok) {
			const errorText = await response.text()
			console.error('Error response from server:', errorText)
			console.error(`Failed to upload image: ${response.statusText}`)
		}

		// Parse the response as JSON
		const data = await response.json()
		console.log('Image uploaded successfully:', data)

		// Return the uploaded image URL or other data from the external server
		return data
	} catch (error) {
		console.error('Error uploading image to external server:', error)
		console.error('Failed to upload image')
	}
}

// Function to save the uploaded image data to the database
export async function clientSaveImage(
	type: 'user' | 'business' | 'tour',
	id: string,
	uploadedData: any,
	imageType?: 'profile' | 'cover', // Optional for business images
) {
	if (!type || !id || !uploadedData) {
		console.error('Type, ID, and imageUrl are required')
	}

	// Build the save request URL with query parameters for type and id
	let saveUrl = `/api/image/post/save-image?type=${type}&id=${id}`
	if (type === 'business' && imageType) {
		saveUrl += `&imageType=${imageType}` // Append imageType for business
	}

	try {
		// Send a POST request to save the image data in the database
		const saveResponse = await axios.post(
			saveUrl,
			{ uploadedData },
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)

		console.log('Image saved successfully:', saveResponse.data)

		// Return saved image data or confirmation
		return saveResponse.data
	} catch (error) {
		console.error('Error saving image:', error)
		console.error('Failed to save image')
	}
}

export default async function uploadAndSaveImage(
	type: 'user' | 'business' | 'tour',
	id: string,
	file: File,
	imageType?: 'profile' | 'cover', // Optional for business images
) {
	try {
		// Step 1: Upload the image to the external server
		const uploadedData = await clientUploadImage(file)
		console.log('uploadedData:', uploadedData)

		// Step 2: Use the uploadedData (e.g., uploadedData.imageUrl) to save the image data
		const saveResponse = await clientSaveImage(
			type,
			id,
			uploadedData,
			imageType,
		)

		console.log('Image uploaded and saved successfully:', saveResponse)
		return saveResponse
	} catch (error) {
		console.error('Error in upload and save process:', error)
		throw error
	}
}
