// Cloudflare build only (see vite.config.ts): stands in for the `cloudinary`
// Node SDK, which is large and built on Node's http streams. Covers what the
// site uses, with the same names and results, over Cloudinary's REST API:
//   cloudinary.v2.config({ cloud_name, api_key, api_secret })
//   cloudinary.v2.uploader.upload(fileOrDataUri, { folder, resource_type, ... })
//   cloudinary.v2.uploader.destroy(public_id, { resource_type, type, invalidate })
// Like the SDK, a failed call rejects with Cloudinary's error ({ message, http_code }).
type Options = Record<string, string | number | boolean | undefined>
type Config = { cloud_name?: string; api_key?: string; api_secret?: string }

const settings: Config = {}

function config(options?: Config) {
	if (options) Object.assign(settings, Object.fromEntries(Object.entries(options).filter(([, v]) => v !== undefined)))
	return current()
}

function current(): Required<Config> {
	// The SDK also reads CLOUDINARY_URL (cloudinary://key:secret@cloud) and CLOUDINARY_*
	const url = process.env.CLOUDINARY_URL?.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/)
	return {
		cloud_name: settings.cloud_name ?? process.env.CLOUDINARY_CLOUD_NAME ?? url?.[3] ?? '',
		api_key: settings.api_key ?? process.env.CLOUDINARY_API_KEY ?? url?.[1] ?? '',
		api_secret: settings.api_secret ?? process.env.CLOUDINARY_API_SECRET ?? url?.[2] ?? '',
	}
}

// Cloudinary signature: the signed parameters in A–Z order as k=v&k=v, then the secret, SHA-1 hex
async function sign(params: Record<string, string>, secret: string) {
	const text = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join('&') + secret
	const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text))
	return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

async function call(action: 'upload' | 'destroy', options: Options, file?: string | Blob) {
	const { cloud_name, api_key, api_secret } = current()
	const { resource_type = 'image', ...rest } = options
	const params: Record<string, string> = { timestamp: String(Math.floor(Date.now() / 1000)) }
	for (const [k, v] of Object.entries(rest)) if (v !== undefined && v !== null) params[k] = String(v)

	const body = new FormData()
	for (const [k, v] of Object.entries(params)) body.append(k, v)
	body.append('api_key', api_key)
	body.append('signature', await sign(params, api_secret))
	if (file !== undefined) body.append('file', file)

	const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/${resource_type}/${action}`, { method: 'POST', body })
	const result: any = await res.json().catch(() => ({ error: { message: `Cloudinary ${action} failed (${res.status})` } }))
	if (!res.ok || result?.error) throw { ...(result?.error ?? { message: `Cloudinary ${action} failed` }), http_code: res.status }
	return result
}

const uploader = {
	upload: (file: string | Blob, options: Options = {}) => call('upload', options, file),
	destroy: (public_id: string, options: Options = {}) => call('destroy', { ...options, public_id }),
}

export const v2 = { config, uploader }
export default { v2, config, uploader }
