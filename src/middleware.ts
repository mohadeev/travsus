import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'cookie'
import { serialize } from 'cookie'

export async function middleware(request: NextRequest) {
	try {
		// Extract the IP address from the request headers
		let ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
		// Use a fallback IP address if 'x-forwarded-for' is "::1" (localhost)
		if (ip === '::1') {
			ip = '79.116.108.40' // Replace with your desired fallback IP address
		}
		const cookies = request.headers.get('cookie')
		const parsedCookies = cookies ? parse(cookies) : {}
		const geoCookie = parsedCookies.customGeo
		if (!geoCookie) {
			// Fetch geolocation data from GeoJS API
			const geoResponse = await fetch(
				`https://get.geojs.io/v1/ip/geo/${ip}.json`,
			)
			const geoData = await geoResponse.json()
			// If geolocation data is found, set it in a cookie
			if (geoData) {
				const { city, country, latitude, longitude, timezone } = geoData
				// Create a cookie with the geolocation data
				const geoDataString = JSON.stringify({
					city,
					country,
					latitude,
					longitude,
					timezone,
					message: 'Geo location fetched successfully',
				})
				const geoCookieHeader = serialize('customGeo', geoDataString, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production', // Use 'secure' flag in production
					maxAge: 86400, // 1 day in seconds
					path: '/',
				})
				const response = NextResponse.next()
				response.headers.set('Set-Cookie', geoCookieHeader)
				return response
			} else {
				// Set a default value if no location is found
				const geoCookieHeader = serialize(
					'customGeo',
					JSON.stringify({
						message: 'Location not found',
					}),
					{
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production', // Use 'secure' flag in production
						maxAge: 86400, // 1 day in seconds
						path: '/',
					},
				)
				const response = NextResponse.next()
				response.headers.set('Set-Cookie', geoCookieHeader)
				return response
			}
		} else {
			// request.customGeo = JSON.parse(geoCookie)
		}
	} catch (error) {
		console.error('Error fetching geolocation data in middleware:', error)
		// Attach an error message if something goes wrong
		// request.customGeo = {
		// 	message: 'Failed to fetch geolocation data',
		// }
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/api/:path*'], // Apply to all API routes
}
