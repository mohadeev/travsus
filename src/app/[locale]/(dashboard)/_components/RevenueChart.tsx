'use client'
// Revenue per month (bars), with paid bookings in the tooltip.
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Point = { month: string; revenue: number; bookings: number }

const label = (key: string) => new Date(`${key}-01T12:00:00`).toLocaleDateString('en-GB', { month: 'short' })
const euro = (n: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

export default function RevenueChart({ data, height = 260 }: { data: Point[]; height?: number }) {
	return (
		<div style={{ height }}>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={data} margin={{ left: -12, right: 4, top: 8 }}>
					<CartesianGrid vertical={false} stroke="#e5e5e5" strokeDasharray="3 3" />
					<XAxis dataKey="month" tickFormatter={label} tickLine={false} axisLine={false} fontSize={12} />
					<YAxis tickFormatter={(v: number) => (v >= 1000 ? `€${Number((v / 1000).toFixed(1))}k` : `€${v}`)} tickLine={false} axisLine={false} fontSize={12} width={56} />
					<Tooltip
						cursor={{ fill: 'rgba(0,0,0,0.04)' }}
						content={({ active, payload }) => {
							const p = active && (payload?.[0]?.payload as Point | undefined)
							if (!p) return null
							return (
								<div className="rounded-2xl bg-neutral-950 px-4 py-3 text-sm text-white shadow-xl">
									<p className="font-semibold">{new Date(`${p.month}-01T12:00:00`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
									<p className="mt-1 tabular-nums">{euro(p.revenue)}</p>
									<p className="text-xs text-white/60">{p.bookings} paid {p.bookings === 1 ? 'booking' : 'bookings'}</p>
								</div>
							)
						}}
					/>
					<Bar dataKey="revenue" fill="#0a0a0a" radius={[8, 8, 0, 0]} maxBarSize={44} animationDuration={500} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}
