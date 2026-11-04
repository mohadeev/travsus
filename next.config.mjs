// /**
//  * @type {import('next').NextConfig}
//  */

import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: false,
	// Cloudflare Workers build (npm run build:vinext) has its own output; standalone is for the Node server only
	output: process.env.CLOUDFLARE_BUILD ? undefined : "standalone",
	typedRoutes: true,
	// Load handlebars from node_modules instead of bundling it (avoids require.extensions warning)
	serverExternalPackages: ['@react-pdf/renderer'],
	experimental: {
		serverActions: {
			bodySizeLimit: '10mb',
		},
	},
	// reactStrictMode: true,
	// experimental: {
	// 	appDir: true,
	// },
	// webpack: (config) => {
	// 	config.externals = [...config.externals, 'cloudinary']
	// 	return config
	// },
	images: {
		// Cloudinary does the resizing (src/lib/imageLoader.ts), not Vercel's quota-limited optimiser
		loader: 'custom',
		loaderFile: './src/lib/imageLoader.ts',
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.pexels.com',
				port: '',
				pathname: '/**',
			},

			{
				protocol: 'https',
				hostname: 'media-cdn.tripadvisor.com',
				port: '',
				pathname: '/**',
			},

			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'a0.muscache.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'www.gstatic.com',
				port: '',
				pathname: '/**',
			},
			// Profile photos from Clerk (Google sign-in etc.)
			{
				protocol: 'https',
				hostname: 'img.clerk.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'http',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'www.travsus.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'media.licdn.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'dynamic-media-cdn.tripadvisor.com',
				port: '',
				pathname: '/**',
			},
		],
	},
	async headers() {
		return [
			{
				source: '/sitemap.xml',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, s-maxage=3600, stale-while-revalidate=86400',
					},
				],
			},
		]
	},
	typescript: {
		ignoreBuildErrors: true,
	},
}

//change
// module.exports = nextConfig

export default withNextIntl(nextConfig)
