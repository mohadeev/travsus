// The account sections, in menu order: [path, label key in "Account", icon].
import { CalendarCheck, CreditCard, Gift, Handshake, Heart, LayoutGrid, Lock, UserRound, type LucideIcon } from 'lucide-react'

export const ACCOUNT_NAV: [string, string, LucideIcon][] = [
	['/account-settings', 'nav_overview', LayoutGrid],
	['/account-settings/personal-info', 'nav_personal', UserRound],
	['/account-settings/login-and-security', 'nav_security', Lock],
	['/bookings', 'nav_bookings', CalendarCheck],
	['/account-savelists', 'nav_saved', Heart],
	['/account-settings/payment-methods', 'nav_payments', CreditCard],
	['/account-settings/invite', 'nav_invite', Gift],
]

/** Only for accepted affiliates, after "Saved" */
export const AFFILIATE_NAV: [string, string, LucideIcon] = ['/account-affiliate', 'nav_affiliate', Handshake]
