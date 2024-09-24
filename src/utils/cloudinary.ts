// /utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
	// cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	// api_key: process.env.CLOUDINARY_API_KEY,
	// api_secret: process.env.CLOUDINARY_API_SECRET,
	cloud_name: 'mohadeev',
	api_key: '823672526525528',
	api_secret: 'FpKV7PxTxEMmBdq0Ig-P_gjw__s',
	cloudinary_url:
		'cloudinary://823672526525528:FpKV7PxTxEMmBdq0Ig-P_gjw__s@mohadeev',
	secure: true,
})

export default cloudinary
