import cloudinary from '@/utils/cloudinary'

interface UploadResult {
	url: string
	public_id: string
}

export const imageUploader = async (
	fileBuffer: Buffer,
	folder: string,
	options: cloudinary.UploadApiOptions = {},
): Promise<any> => {
	// Ensure fileBuffer is a Buffer instance
	if (!(fileBuffer instanceof Buffer)) {
		console.error('Invalid file format. Expected a Buffer.')
	}

	const uploadOptions: cloudinary.UploadApiOptions = {
		resource_type: 'image', // Ensure it's treated as an image
		folder, // Specify the folder
		...options, // Additional options like public_id or transformations
	}
	try {
		const response = await new Promise((resolve, reject) => {
			cloudinary.v2.uploader
				.upload_stream(uploadOptions, (error, result) => {
					if (error) {
						return reject(error)
					}
					resolve({
						url: result?.secure_url, // Use the 'secure_url' as 'url'
						public_id: result?.public_id, // Return the public_id for future reference
					})
				})
				.end(fileBuffer)
		})
		console.log(response)
		return response
	} catch (error) {
		console.log('error: ', error)
	}

	// return new Promise((resolve, reject) => {
	// 	// Use Cloudinary's upload stream method
	// 	const uploadStream = cloudinary.v2.uploader.upload_stream(
	// 		uploadOptions,
	// 		(error, result: any) => {
	// 			if (error) {
	// 				console.error('Image upload error:', error) // Log the error
	// 				return reject(error) // Reject on error
	// 			}

	// 			// Resolve the promise with the upload result
	// 			resolve({
	// 				url: result.secure_url, // Use the 'secure_url' as 'url'
	// 				public_id: result.public_id, // Return the public_id for future reference
	// 			})
	// 		},
	// 	)

	// 	// Write the buffer to the stream
	// 	uploadStream.end(fileBuffer)
	// })
}
