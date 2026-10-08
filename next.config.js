// /**
//  * @type {import('next').NextConfig}
//  */

const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: false,
	output: "standalone",
	experimental: {
		typedRoutes: true,
		serverActions: {
			bodySizeLimit: '10mb',
		},
		missingSuspenseWithCSRBailout: false,
		// Load handlebars from node_modules instead of bundling it (avoids require.extensions warning)
		serverComponentsExternalPackages: ['handlebars'],
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
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
}

//change
// module.exports = nextConfig

module.exports = withNextIntl(nextConfig)
