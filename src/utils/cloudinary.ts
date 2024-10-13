// /utils/cloudinary.ts
import cloudinary  from 'cloudinary'

cloudinary.v2.config({
	// cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	// api_key: process.env.CLOUDINARY_API_KEY,
	// api_secret: process.env.CLOUDINARY_API_SECRET,
	// cloud_name: 'mohadeev',
	// api_key: '823672526525528',
	// api_secret: 'FpKV7PxTxEMmBdq0Ig-P_gjw__s',
	// cloudinary_url:
	// 	'cloudinary://823672526525528:FpKV7PxTxEMmBdq0Ig-P_gjw__s@mohadeev',
	// secure: true,
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary
