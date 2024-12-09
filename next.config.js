/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	experimental: {
		typedRoutes: true,
		serverActions: {
			bodySizeLimit: '10mb',
		},
	},
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'images.pexels.com' },
			{ protocol: 'https', hostname: 'media-cdn.tripadvisor.com' },
			{ protocol: 'https', hostname: 'images.unsplash.com' },
			{ protocol: 'https', hostname: 'a0.muscache.com' },
			{ protocol: 'https', hostname: 'www.gstatic.com' },
			{ protocol: 'https', hostname: 'res.cloudinary.com' },
			{ protocol: 'http', hostname: 'res.cloudinary.com' },
			{ protocol: 'https', hostname: 'www.travsus.com' },
			{ protocol: 'https', hostname: 'media.licdn.com' },
			{ protocol: 'https', hostname: 'dynamic-media-cdn.tripadvisor.com' },
		],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	webpack: (config, { dev, isServer }) => {
		if (!dev && !isServer) {
			Object.assign(config.resolve.alias, {
				'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
				react: 'preact/compat',
				'react-dom/test-utils': 'preact/test-utils',
				'react-dom': 'preact/compat',
			})
		}

		// Prevent API route generation during build
		if (process.env.NEXT_PUBLIC_SKIP_API_ROUTES === '1' && !isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false,
				child_process: false,
			}
		}

		return config
	},
	// Prevent automatic static optimization
	unstable_runtimeJS: true,
}

// Ignore build errors if environment variable is set
if (process.env.NEXT_IGNORE_BUILD_ERRORS === '1') {
	console.log('Ignoring build errors')
	nextConfig.typescript.ignoreBuildErrors = true
	nextConfig.eslint.ignoreDuringBuilds = true
}

module.exports = nextConfig
