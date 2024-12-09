/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
	reactStrictMode: false,
	experimental: {
		typedRoutes: true,
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
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
			}
		}

		// Ignore specific module errors
		config.module.rules.push({
			test: /\.(js|jsx|ts|tsx)$/,
			use: [
				{
					loader: 'babel-loader',
					options: {
						plugins: [
							['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
						],
					},
				},
			],
			exclude: /node_modules/,
		})

		return config
	},
}

module.exports = nextConfig
