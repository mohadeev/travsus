// The PDF attached to the "Booking confirmed" email: booking confirmation and
// invoice in one A4 page. Company details come from NEXT_PUBLIC_COMPANY_PROFILE
// (the same as the legal notice).
import 'server-only'
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from '@react-pdf/renderer'
import type { BookingEmail } from './templates'

const INK = '#0a0a0a'
const MUTED = '#737373'
const SOFT = '#f5f5f5'
const LINE = '#e5e5e5'

const s = StyleSheet.create({
	page: { padding: 48, fontFamily: 'Helvetica', fontSize: 10, color: INK, lineHeight: 1.45 },
	row: { flexDirection: 'row' },
	between: { flexDirection: 'row', justifyContent: 'space-between' },
	brand: { fontFamily: 'Helvetica-Bold', fontSize: 22, letterSpacing: 2, lineHeight: 1.1, marginBottom: 4 },
	docTitle: { fontFamily: 'Helvetica-Bold', fontSize: 13, textAlign: 'right' },
	muted: { color: MUTED },
	label: { color: MUTED, fontSize: 8, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 },
	bold: { fontFamily: 'Helvetica-Bold' },
	paid: { alignSelf: 'flex-end', marginTop: 8, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#d1fae5', color: '#065f46', fontFamily: 'Helvetica-Bold', fontSize: 9 },
	card: { backgroundColor: SOFT, borderRadius: 14, padding: 18, marginTop: 28 },
	tour: { fontFamily: 'Helvetica-Bold', fontSize: 15, marginBottom: 12 },
	cell: { flex: 1 },
	tableHead: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: LINE, paddingBottom: 6, marginTop: 28 },
	tableRow: { flexDirection: 'row', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: LINE },
	amount: { width: 110, textAlign: 'right' },
	total: { flexDirection: 'row', paddingTop: 10 },
	footer: { position: 'absolute', left: 48, right: 48, bottom: 40, borderTopWidth: 1, borderTopColor: LINE, paddingTop: 12, fontSize: 8, color: MUTED },
})

// The PDF's built-in font has no proper € glyph: amounts are written as "EUR 1,234.00"
const euros = (n: number) => `EUR ${(n || 0).toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const day = (d?: string | null) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : '–')

function company() {
	try {
		return JSON.parse(process.env.NEXT_PUBLIC_COMPANY_PROFILE || '{}')
	} catch {
		return {}
	}
}

function BookingPdf({ b }: { b: BookingEmail }) {
	const c = company()
	const legalName = c.fullLegalName || c.legalName || 'TRAVSUS LIMITED'
	const travellers = [b.adults && `${b.adults} adult${b.adults > 1 ? 's' : ''}`, b.children && `${b.children} child${b.children > 1 ? 'ren' : ''}`].filter(Boolean).join(', ') || '–'
	const dates = b.start ? (b.end && b.end !== b.start ? `${day(b.start)} – ${day(b.end)}` : day(b.start)) : 'To be confirmed'

	return (
		<Document title={`TRAVSUS booking ${b.reference}`} author="TRAVSUS" subject="Booking confirmation and invoice">
			<Page size="A4" style={s.page}>
				<View style={s.between}>
					<View>
						<Text style={s.brand}>TRAVSUS</Text>
						<Text style={[s.muted, { marginTop: 2 }]}>Tours and trips, booked in minutes.</Text>
					</View>
					<View>
						<Text style={s.docTitle}>Booking confirmation & invoice</Text>
						<Text style={[s.muted, { textAlign: 'right', marginTop: 4 }]}>Invoice no. INV-{b.reference}</Text>
						<Text style={[s.muted, { textAlign: 'right' }]}>Issued {day(b.paidAt)}</Text>
						<Text style={s.paid}>PAID</Text>
					</View>
				</View>

				<View style={[s.row, { marginTop: 32 }]}>
					<View style={s.cell}>
						<Text style={s.label}>Billed to</Text>
						<Text style={s.bold}>{b.customerName}</Text>
						<Text>{b.customerEmail}</Text>
					</View>
					<View style={s.cell}>
						<Text style={s.label}>From</Text>
						<Text style={s.bold}>{legalName}</Text>
						{c.legalAddress ? <Text>{c.legalAddress}</Text> : null}
						{c.registrationNumber ? <Text>Company no. {c.registrationNumber}</Text> : null}
						{c.vatNumber ? <Text>VAT {c.vatNumber}</Text> : null}
						{c.supportEmail || c.contactEmail ? <Text>{c.supportEmail || c.contactEmail}</Text> : null}
					</View>
				</View>

				<View style={s.card}>
					<Text style={s.tour}>{b.tourName}</Text>
					<View style={s.row}>
						{[
							['Booking reference', b.reference],
							['Dates', dates],
							['Duration', `${b.days} day${b.days > 1 ? 's' : ''}`],
							['Travellers', travellers],
						].map(([label, value]) => (
							<View key={label} style={s.cell}>
								<Text style={s.label}>{label}</Text>
								<Text style={s.bold}>{value}</Text>
							</View>
						))}
					</View>
				</View>

				<View style={s.tableHead}>
					<Text style={[s.cell, s.label, { marginBottom: 0 }]}>Description</Text>
					<Text style={[s.amount, s.label, { marginBottom: 0 }]}>Amount</Text>
				</View>
				{b.items.map(([label, amount], i) => (
					<View key={i} style={s.tableRow}>
						<Text style={s.cell}>{label}</Text>
						<Text style={s.amount}>{euros(amount)}</Text>
					</View>
				))}
				<View style={s.total}>
					<Text style={[s.cell, s.bold, { fontSize: 12 }]}>Total paid</Text>
					<Text style={[s.amount, s.bold, { fontSize: 12 }]}>{euros(b.total)}</Text>
				</View>
				<Text style={[s.muted, { marginTop: 6 }]}>Paid online by card (Stripe) on {day(b.paidAt)}. Amounts in euros, taxes included.</Text>

				<View style={[s.card, { marginTop: 32 }]}>
					<Text style={s.bold}>On the day</Text>
					<Text style={{ marginTop: 4 }}>
						Show this confirmation (on your phone is fine) to your guide. Your guide will contact you before the trip to confirm the pick-up time and place. Need to change something? Write to us at{' '}
						{c.supportEmail || c.contactEmail || 'travsus.com/contact'}.
					</Text>
				</View>

				<View style={s.footer}>
					<Text>
						{legalName}
						{c.legalAddress ? ` · ${c.legalAddress}` : ''}
						{c.registrationNumber ? ` · Company no. ${c.registrationNumber}` : ''} · www.travsus.com
					</Text>
					<Text>Thank you for travelling with TRAVSUS.</Text>
				</View>
			</Page>
		</Document>
	)
}

/** The PDF file for a booking */
export const bookingPdf = (b: BookingEmail) => renderToBuffer(<BookingPdf b={b} />)
export const bookingPdfName = (b: BookingEmail) => `TRAVSUS-${b.reference}.pdf`
