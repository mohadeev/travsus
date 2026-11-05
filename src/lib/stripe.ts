// Stripe client, created on first use (not at import) so `next build` works
// without STRIPE_SECRET_KEY. Call sites keep using `stripe.customers...`.
import Stripe from 'stripe'

let client: Stripe | undefined
const getStripe = (): Stripe => {
	if (!client) {
		const key = process.env.STRIPE_SECRET_KEY
		if (!key) throw new Error('Missing STRIPE_SECRET_KEY env var')
		client = new Stripe(key)
	}
	return client
}

const stripe = new Proxy({} as Stripe, {
	get(_target, prop) {
		const real = getStripe()
		const value = Reflect.get(real, prop, real)
		return typeof value === 'function' ? value.bind(real) : value
	},
})

export default stripe
