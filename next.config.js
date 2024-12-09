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

	// webpack: (config, { isServer }) => {
	// 	// Existing configurations (if any)

	// 	// Add babel-loader
	// 	config.module.rules.push({
	// 		test: /\.(js|jsx|ts|tsx)$/,
	// 		exclude: /node_modules/,
	// 		use: {
	// 			loader: 'babel-loader',
	// 			options: {
	// 				presets: ['next/babel'],
	// 			},
	// 		},
	// 	})

	// 	return config
	// },
	// Your existing configurations for typescript and eslint
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	webpack: (config, { isServer }) => {
		// This will ignore specific module errors
		config.ignoreWarnings = [
			{ module: /node_modules\/node-fetch\/lib\/index\.js/ },
			{ module: /node_modules\/jsonwebtoken/ },
			{ module: /node_modules\/jose\/dist\/node\/cjs/ },
		]

		// Ignore specific errors
		config.module.rules.push({
			test: /\.(js|jsx|ts|tsx)$/,
			use: [
				{
					loader: 'babel-loader',
					options: {
						presets: ['next/babel'],
						plugins: ['@babel/plugin-transform-react-jsx'],
					},
				},
			],
			exclude: /node_modules/,
		})

		return config
	},
}

module.exports = nextConfig
