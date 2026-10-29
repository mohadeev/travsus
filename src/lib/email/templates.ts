// Every email TRAVSUS sends, in one place. Each template says who it goes
// to, which address sends it, when it's sent, and how it looks (built from
// ./layout). `sample` is example data for the preview in /admin/emails.
//
// To add an email: add a template here, then send it with
// sendTemplate('<id>', { to, data }) from ./send.
import {
	bullets, button, check, details, divider, emailPage, esc, euros, eyebrow, heading, image, link, longDate,
	priceTable, quote, raw, SITE, small, strong, text, title, type Html,
} from './layout'

export type Sender = { email: string; name: string }
// Addresses verified in Brevo
const FROM = {
	bookings: { email: 'no-reply@travsus.com', name: 'TRAVSUS' },
	payments: { email: 'payment@travsus.com', name: 'TRAVSUS Payments' },
	hello: { email: 'notifications@travsus.com', name: 'TRAVSUS' },
	form: { email: 'form@travsus.com', name: 'TRAVSUS website' },
} satisfies Record<string, Sender>

/** A booking, as the booking emails and the PDF show it */
export type BookingEmail = {
	reference: string
	customerName: string
	customerEmail: string
	tourName: string
	tourImage?: string
	tourUrl?: string
	start?: string | null
	end?: string | null
	days: number
	adults: number
	children: number
	items: [string, number][]
	total: number
	paidAt?: string | null
	/** Book now, pay later: paid now, and what is charged on the tour day */
	deposit?: { paid: number; balance: number; dueAt: string | null } | null
}

const guests = (b: BookingEmail) =>
	[b.adults && `${b.adults} adult${b.adults > 1 ? 's' : ''}`, b.children && `${b.children} child${b.children > 1 ? 'ren' : ''}`].filter(Boolean).join(', ') || '–'
const dates = (b: BookingEmail) => (b.start ? (b.end && b.end !== b.start ? `${longDate(b.start)} – ${longDate(b.end)}` : longDate(b.start)) : 'To be confirmed')
const tripRows = (b: BookingEmail): [string, string][] => [
	['Booking reference', b.reference],
	['Dates', dates(b)],
	['Duration', `${b.days} day${b.days > 1 ? 's' : ''}`],
	['Travellers', guests(b)],
]
const bookingsLink = `${SITE}/en-US/bookings`

const SAMPLE_BOOKING: BookingEmail = {
	reference: 'TRVS-26-1000000208',
	customerName: 'Sofia Martin',
	customerEmail: 'sofia@example.com',
	tourName: '3 Days Trip from Marrakech to Merzouga Desert',
	tourImage: 'https://res.cloudinary.com/travsus/image/upload/c_fill,w_1040,h_600,q_auto/v1750840552/cd9mmcnidncyxahuwsor.jpg',
	tourUrl: `${SITE}/en-US`,
	start: '2026-11-12T00:00:00.000Z',
	end: '2026-11-14T00:00:00.000Z',
	days: 3,
	adults: 2,
	children: 0,
	items: [
		['Transport', 500],
		['Accommodation', 60],
		['Taxes & fees', 117.6],
	],
	total: 677.6,
	paidAt: '2026-10-15T10:24:00.000Z',
}

type Template<D> = {
	name: string
	category: 'Account' | 'Bookings' | 'Payments' | 'Newsletter' | 'Affiliates' | 'Team'
	to: 'Customer' | 'Team' | 'Affiliate' | 'Subscriber'
	from: Sender
	/** When it's sent (shown in the admin) */
	when: string
	/** false: designed but nothing sends it yet */
	connected: boolean
	/** Has the booking PDF attached */
	pdf?: boolean
	subject: (d: D) => string
	preheader: (d: D) => string
	body: (d: D) => Html[]
	replyTo?: (d: D) => Sender | undefined
	sample: D
}
const template = <D,>(t: Template<D>) => t

export const TEMPLATES = {
	welcome: template<{ name?: string }>({
		name: 'Welcome',
		category: 'Account',
		to: 'Customer',
		from: FROM.hello,
		when: 'The first time someone signs in (account created).',
		connected: true,
		subject: () => 'Welcome to TRAVSUS',
		preheader: () => 'Your account is ready. Here’s what you can do with it.',
		body: (d) => [
			eyebrow('Welcome'),
			title(d.name ? `Hi ${d.name}, you’re in.` : 'You’re in.'),
			text('Your TRAVSUS account is ready. Find tours with local guides, book in minutes and keep every trip in one place.'),
			bullets(['Save the tours you love', 'Book and pay securely online', 'All your bookings and receipts in your account']),
			button('Explore tours', `${SITE}/en-US/search?query=`),
		],
		sample: { name: 'Sofia' },
	}),

	'newsletter-welcome': template<Record<string, never>>({
		name: 'Newsletter welcome',
		category: 'Newsletter',
		to: 'Subscriber',
		from: FROM.hello,
		when: 'Right after someone subscribes to the newsletter (pop-up or footer). The newsletters themselves are sent from MailRelay.',
		connected: true,
		subject: () => 'Welcome aboard: travel ideas are on their way',
		preheader: () => 'Deals, local tips and new trips, straight to your inbox.',
		body: () => [
			image('https://res.cloudinary.com/travsus/image/upload/c_fill,w_1040,h_600,q_auto/v1750840552/cd9mmcnidncyxahuwsor.jpg', 'Camel caravan in the Merzouga dunes'),
			eyebrow('TRAVSUS newsletter'),
			title('Thanks for subscribing.'),
			text('You’ll be the first to hear about new trips, deals for subscribers and tips from our local guides. No spam, and you can unsubscribe in one click.'),
			button('See our top tours', `${SITE}/en-US/search?query=`),
		],
		sample: {},
	}),

	'booking-confirmed': template<BookingEmail>({
		name: 'Booking confirmed',
		category: 'Bookings',
		to: 'Customer',
		from: FROM.bookings,
		when: 'As soon as the payment succeeds. The booking confirmation & invoice PDF is attached.',
		connected: true,
		pdf: true,
		subject: (b) => `You’re booked: ${b.tourName}`,
		preheader: (b) => `Booking ${b.reference} · ${dates(b)}. Your confirmation and invoice are attached.`,
		body: (b) => [
			check(),
			eyebrow('Booking confirmed'),
			title(`Get ready, ${b.customerName.split(' ')[0] || 'traveller'}!`),
			b.deposit
				? text('Your trip is reserved. We’ve attached your ', strong('booking confirmation'), ' as a PDF. Keep it handy for the day.')
				: text('Your trip is booked and paid. We’ve attached your ', strong('booking confirmation & invoice'), ' as a PDF. Keep it handy for the day.'),
			image(b.tourImage, b.tourName),
			heading(b.tourName),
			details(tripRows(b)),
			heading('Payment'),
			priceTable(b.items, b.deposit ? 'Trip total' : 'Total paid', b.total),
			b.deposit
				? details([
						['Paid today', euros(b.deposit.paid)],
						['Charged on ' + (b.deposit.dueAt ? longDate(b.deposit.dueAt) : 'the first tour day'), euros(b.deposit.balance)],
					])
				: raw(''),
			b.deposit ? small('The remaining amount is charged automatically to the card you used, on the morning of your first tour day. Free cancellation up to 24 hours before the trip.') : raw(''),
			button('View my booking', bookingsLink),
			divider(),
			small('Questions about your trip? Just reply to this email or ', link('contact us', `${SITE}/en-US/contact`), '. Our local team is happy to help.'),
		],
		sample: SAMPLE_BOOKING,
	}),

	'trip-reminder': template<BookingEmail>({
		name: 'Trip reminder',
		category: 'Bookings',
		to: 'Customer',
		from: FROM.bookings,
		when: 'A few days before the trip. Not sent automatically yet (needs a daily scheduled job).',
		connected: false,
		subject: (b) => `Your trip starts soon: ${b.tourName}`,
		preheader: (b) => `${dates(b)}. Everything you need for the day.`,
		body: (b) => [
			eyebrow('See you soon'),
			title('Your trip is almost here.'),
			image(b.tourImage, b.tourName),
			heading(b.tourName),
			details(tripRows(b)),
			bullets(['Bring your passport or ID', 'Comfortable shoes and a light jacket for the evenings', 'Your guide will contact you the day before']),
			button('View my booking', bookingsLink),
		],
		sample: SAMPLE_BOOKING,
	}),

	'booking-cancelled': template<BookingEmail & { refund?: number }>({
		name: 'Booking cancelled',
		category: 'Bookings',
		to: 'Customer',
		from: FROM.bookings,
		when: 'When a booking is cancelled. Not connected yet: cancellations are handled by hand for now.',
		connected: false,
		subject: (b) => `Booking cancelled: ${b.tourName}`,
		preheader: (b) => `Booking ${b.reference} has been cancelled.`,
		body: (b) => [
			eyebrow('Booking cancelled'),
			title('Your booking has been cancelled.'),
			text('We’re sorry to see this trip go. Here are the details of the cancelled booking.'),
			details([...tripRows(b), ['Tour', b.tourName]]),
			b.refund ? text('A refund of ', strong(euros(b.refund)), ' is on its way to your original payment method. It usually arrives within 5–10 business days.') : raw(''),
			button('Find another trip', `${SITE}/en-US/search?query=`),
		],
		sample: { ...SAMPLE_BOOKING, refund: 677.6 },
	}),

	'refund-confirmed': template<{ name: string; reference: string; tourName: string; amount: number; method: string; date: string }>({
		name: 'Refund confirmed',
		category: 'Payments',
		to: 'Customer',
		from: FROM.payments,
		when: 'When a refund is made in Stripe (Stripe webhook).',
		connected: true,
		subject: (d) => `Your refund of ${euros(d.amount)} is on its way`,
		preheader: (d) => `Refund for booking ${d.reference}.`,
		body: (d) => [
			check(),
			eyebrow('Refund confirmed'),
			title(`Your refund of ${euros(d.amount)} is on its way.`),
			text(`Hi ${d.name}, we’ve refunded your payment for `, strong(d.tourName), '. It usually shows on your statement within 5–10 business days.'),
			details([
				['Booking reference', d.reference],
				['Amount', euros(d.amount)],
				['Refunded to', d.method],
				['Date', longDate(d.date)],
			]),
			button('View my bookings', bookingsLink),
		],
		sample: { name: 'Sofia', reference: 'TRVS-26-1000000208', tourName: SAMPLE_BOOKING.tourName, amount: 677.6, method: 'Visa ending in 4242', date: '2026-10-20T00:00:00.000Z' },
	}),

	'new-booking-team': template<BookingEmail>({
		name: 'New booking',
		category: 'Team',
		to: 'Team',
		from: FROM.bookings,
		when: 'To the TRAVSUS inbox each time a booking is paid.',
		connected: true,
		subject: (b) => `New booking: ${euros(b.total)}${b.deposit ? ` (deposit ${euros(b.deposit.paid)})` : ''} · ${b.tourName}`,
		preheader: (b) => `${b.customerName} booked ${dates(b)}.`,
		body: (b) => [
			eyebrow('New paid booking'),
			title(euros(b.total)),
			text(strong(b.customerName), ` (${b.customerEmail}) booked `, strong(b.tourName), '.'),
			details([...tripRows(b), ['Paid', longDate(b.paidAt)], ...(b.deposit ? ([['Deposit paid', euros(b.deposit.paid)], ['Balance on tour day', euros(b.deposit.balance)]] as [string, string][]) : [])]),
			button('Open in the dashboard', `${SITE}/en-US/dashboard/bookings`),
		],
		replyTo: (b) => ({ email: b.customerEmail, name: b.customerName }),
		sample: SAMPLE_BOOKING,
	}),

	'balance-failed': template<BookingEmail & { reason?: string; payUrl: string }>({
		name: 'Balance payment failed',
		category: 'Payments',
		to: 'Customer',
		from: FROM.payments,
		when: 'Book now, pay later: when the balance could not be charged to the saved card on the tour day.',
		connected: true,
		subject: (b) => `Action needed: pay the balance for ${b.tourName}`,
		preheader: (b) => `We couldn’t charge ${euros(b.deposit?.balance ?? 0)} to your card. It takes one minute to fix.`,
		body: (b) => [
			eyebrow('Payment needed'),
			title('We couldn’t charge your card.'),
			text('Your trip is still reserved, but the remaining ', strong(euros(b.deposit?.balance ?? 0)), ' could not be charged to the card you used for the deposit', b.reason ? ` (${b.reason})` : '', '.'),
			text('Please pay it now with any card, so your guide and driver can confirm everything for the day.'),
			button('Pay the balance', b.payUrl),
			details(tripRows(b)),
			divider(),
			small('Questions? Just reply to this email or ', link('contact us', `${SITE}/en-US/contact`), '.'),
		],
		sample: { ...SAMPLE_BOOKING, deposit: { paid: 20, balance: 657.6, dueAt: '2026-11-12T06:00:00.000Z' }, reason: 'Your card was declined.', payUrl: `${SITE}/en-US/bookings` },
	}),

	'contact-team': template<{ name: string; email: string; message: string }>({
		name: 'Contact form message',
		category: 'Team',
		to: 'Team',
		from: FROM.form,
		when: 'To the TRAVSUS inbox when someone sends the contact form. Reply goes straight to them.',
		connected: true,
		subject: (d) => `Contact form: ${d.name.replace(/[\r\n]+/g, ' ')}`,
		preheader: (d) => d.message.slice(0, 120),
		body: (d) => [
			eyebrow('Contact form'),
			title(d.name),
			text(link(d.email, `mailto:${d.email}`)),
			raw(`<div style="margin:16px 0;padding:20px;background:#f5f5f5;border-radius:20px;font:400 15px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#262626;white-space:pre-line">${esc(d.message)}</div>`),
			small('Reply to this email to answer them directly.'),
		],
		replyTo: (d) => ({ email: d.email, name: d.name }),
		sample: { name: 'Sofia Martin', email: 'sofia@example.com', message: 'Hello! Is the Merzouga trip suitable for a 7-year-old?\nThanks a lot.' },
	}),

	'affiliate-request-team': template<{ email: string; website?: string; locale?: string }>({
		name: 'Affiliate request',
		category: 'Team',
		to: 'Team',
		from: FROM.hello,
		when: 'To the TRAVSUS inbox when someone requests access on the affiliates page.',
		connected: true,
		subject: (d) => `Affiliate access request: ${d.email}`,
		preheader: (d) => `${d.email} wants to join the affiliate program.`,
		body: (d) => [
			eyebrow('Affiliate program'),
			title('New access request'),
			details([
				['Email', d.email],
				['Website / channel', d.website || '–'],
				['Language', d.locale || '–'],
			]),
			button('Accept or decline', `${SITE}/en-US/admin/affiliates`),
		],
		sample: { email: 'creator@example.com', website: 'instagram.com/wanderwithsofia', locale: 'fr-FR' },
	}),

	'affiliate-invite': template<{ name?: string; message?: string; link: string }>({
		name: 'Affiliate invitation',
		category: 'Affiliates',
		to: 'Affiliate',
		from: FROM.hello,
		when: 'When you send an invitation from this page (Admin → Emails → Affiliate invitation). The button opens their personal invitation: they sign in, then accept.',
		connected: true,
		subject: (d) => (d.name ? `${d.name.split(' ')[0]}, you’re invited to the TRAVSUS affiliate program` : 'You’re invited to the TRAVSUS affiliate program'),
		preheader: () => 'Earn up to 15% on every tour booked through your link.',
		body: (d) => [
			eyebrow('Affiliate program'),
			title(d.name ? `${d.name.split(' ')[0]}, you’re invited.` : 'You’re invited.'),
			text('We’d love to have you as a TRAVSUS partner. Share our tours in Morocco and beyond with your audience, and earn a commission on every booking made through your link.'),
			...(d.message?.trim()
				? [quote(d.message.trim())]
				: []),
			details([
				['Commission', 'Up to 15% per booking'],
				['Cookie', '60 days'],
				['Payouts', 'Monthly, from €50'],
			]),
			bullets(['Your personal link on every tour page, ready to share', 'Clicks, bookings and earnings in your account', 'Free to join, no minimum audience']),
			button('Accept invitation', d.link),
			small('You’ll be asked to sign in or create your TRAVSUS account, then to confirm.'),
		],
		sample: { name: 'Sofia Martin', message: 'I love your travel videos about Morocco, I think your audience would enjoy our desert tours.', link: `${SITE}/en-US/affiliates/invite/sample` },
	}),

	'affiliate-invite-accepted-team': template<{ email: string; name?: string; code: string; link: string; invitedAt?: string }>({
		name: 'Invitation accepted',
		category: 'Team',
		to: 'Team',
		from: FROM.hello,
		when: 'To the TRAVSUS inbox the first time someone accepts an affiliate invitation.',
		connected: true,
		subject: (d) => `${d.name || d.email} accepted your affiliate invitation`,
		preheader: (d) => `${d.email} is now an affiliate, with the link code ${d.code}.`,
		body: (d) => [
			check(),
			eyebrow('Affiliate program'),
			title(`${d.name?.split(' ')[0] || 'Your invitation'} ${d.name ? 'accepted your invitation.' : 'was accepted.'}`),
			text('They’re now an accepted affiliate and have their personal link.'),
			details([
				['Email', d.email],
				...(d.name ? ([['Name', d.name]] as [string, string][]) : []),
				['Link code', d.code],
				['Their link', d.link],
				...(d.invitedAt ? ([['Invited on', longDate(d.invitedAt)]] as [string, string][]) : []),
			]),
			button('Open affiliates', `${SITE}/en-US/admin/affiliates`),
		],
		sample: { email: 'sofia@example.com', name: 'Sofia Martin', code: 'k4x9qm', link: `${SITE}/en-US?ref=k4x9qm`, invitedAt: '2026-10-24T10:00:00.000Z' },
	}),

	'affiliate-approved': template<{ rate: string; link: string }>({
		name: 'Affiliate accepted',
		category: 'Affiliates',
		to: 'Affiliate',
		from: FROM.hello,
		when: 'When you accept a request in Admin → Affiliates (with “Email them” ticked).',
		connected: true,
		subject: () => 'Welcome to the TRAVSUS affiliate program',
		preheader: (d) => `You’re in. Your commission: ${d.rate}.`,
		body: (d) => [
			check(),
			eyebrow('Affiliate program'),
			title('You’re in. Welcome aboard!'),
			text('Your request to join the TRAVSUS affiliate program has been accepted.'),
			details([
				['Your commission', d.rate],
				['Cookie', '60 days'],
				['Payouts', 'Monthly, from €50'],
			]),
			heading('Your link'),
			raw(`<p style="margin:0 0 16px;padding:14px 18px;background:#0a0a0a;border-radius:999px;font:600 14px/1.4 ui-monospace,Menlo,monospace;color:#ffffff;word-break:break-all">${esc(d.link)}</p>`),
			text('Sign in to TRAVSUS with this email: every tour page shows your personal link ready to share, and your clicks, bookings and earnings are in your account.'),
			button('Open my affiliate area', `${SITE}/en-US/account-affiliate`),
		],
		sample: { rate: '10% to 15%, growing with your bookings', link: `${SITE}/en-US?ref=k4x9qm` },
	}),

	'affiliate-declined': template<Record<string, never>>({
		name: 'Affiliate declined',
		category: 'Affiliates',
		to: 'Affiliate',
		from: FROM.hello,
		when: 'Always, when you decline a request in Admin → Affiliates.',
		connected: true,
		subject: () => 'Your TRAVSUS affiliate request',
		preheader: () => 'An update on your request.',
		body: () => [
			eyebrow('Affiliate program'),
			title('Thank you for your interest.'),
			text('We’ve reviewed your request to join the TRAVSUS affiliate program and we’re not able to accept it at the moment.'),
			text('Thanks again for thinking of us. You’re welcome to apply again in the future.'),
		],
		sample: {},
	}),
}

export type TemplateId = keyof typeof TEMPLATES
export type TemplateData<K extends TemplateId> = (typeof TEMPLATES)[K]['sample']

/** Subject and full HTML of a template for the given data */
export function renderTemplate<K extends TemplateId>(id: K, data: TemplateData<K>) {
	const t = TEMPLATES[id] as unknown as Template<TemplateData<K>>
	return {
		subject: t.subject(data),
		html: emailPage({ preheader: t.preheader(data), blocks: t.body(data) }),
		from: t.from,
		replyTo: t.replyTo?.(data),
	}
}
