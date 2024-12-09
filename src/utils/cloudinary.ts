// /utils/cloudinary.ts
import cloudinary from 'cloudinary'
if (
	!process.env.CLOUDINARY_CLOUD_NAME ||
	!process.env.CLOUDINARY_API_KEY ||
	!process.env.CLOUDINARY_API_SECRET
) {
	console.error('Missing Cloudinary environment variables')
	console.error('Missing Cloudinary environment variables')
} else {
	console.log('Cloudinary environment loaded')
}
cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary
