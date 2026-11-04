// /**
//  * @type {import('next').NextConfig}
//  */

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: false,
	output: "standalone",
	// Load these from node_modules instead of bundling them (avoids webpack warnings).
	// OpenNext still traces and bundles them into the Worker.
	serverExternalPackages: ['@react-pdf/renderer'],
	typedRoutes: true,
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
	eslint: {
		ignoreDuringBuilds: true,
	},
}

//change
// module.exports = nextConfig

module.exports = async (phase) => {
	// Local `next dev` only. No-ops on `next build`, so Vercel is unaffected.
	// The package is ESM-only, so it cannot be require()'d from this file.
	if (phase === PHASE_DEVELOPMENT_SERVER) {
		const { initOpenNextCloudflareForDev } = await import('@opennextjs/cloudflare')
		await initOpenNextCloudflareForDev()
	}
	return withNextIntl(nextConfig)
}
