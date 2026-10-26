// An iPhone showing a travel creator's Instagram profile with the Travsus
// link in the bio, and a "new booking, +€84" notification dropping in.
// The profile is "your" page (no real account), photos are the site's own.
import Image from 'next/image'
import { BadgeCheck, ChevronDown, Clapperboard, Grid3x3, Home, Link2, Menu, Plus, Search, SquarePlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PHOTOS } from '@/lib/photos'
import styles from './CreatorPhone.module.css'

const GRID = [PHOTOS.sahara, PHOTOS.sunsetHug, PHOTOS.hiking, PHOTOS.bookNow, PHOTOS.hero, PHOTOS.laughing]

export default function CreatorPhone({ className = '' }: { className?: string }) {
	const t = useTranslations('Affiliates')

	const stat = (value: string, label: string) => (
		<div className="text-center">
			<p className="text-[13px] font-bold leading-none">{value}</p>
			<p className="mt-0.5 text-[10px] text-neutral-600">{label}</p>
		</div>
	)

	return (
		<div className={`relative mx-auto w-[260px] sm:w-[280px] ${className}`}>
			<div className={styles.float}>
				{/* Frame */}
				<div className="rounded-[46px] bg-neutral-900 p-[9px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/15">
					<div className="relative overflow-hidden rounded-[38px] bg-white text-black" style={{ aspectRatio: '9 / 19.5' }}>
						{/* Status bar and the island */}
						<div className="flex items-center justify-between px-6 pt-3 text-[11px] font-semibold">
							<span>9:41</span>
							<span className="absolute left-1/2 top-2 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
							<span className="flex items-center gap-1">
								<span className="flex items-end gap-[1.5px]">
									{[4, 6, 8, 10].map((h) => (
										<span key={h} className="w-[2.5px] rounded-sm bg-black" style={{ height: h }} />
									))}
								</span>
								<span className="ml-1 h-[10px] w-[20px] rounded-[3px] border border-black/50 p-[1px]">
									<span className="block h-full w-3/4 rounded-[1px] bg-black" />
								</span>
							</span>
						</div>

						{/* Profile header */}
						<div className="mt-4 flex items-center justify-between px-4">
							<p className="flex items-center gap-1 text-[15px] font-bold">
								your.travels
								<ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
							</p>
							<span className="flex items-center gap-3">
								<Plus className="h-5 w-5" strokeWidth={2} />
								<Menu className="h-5 w-5" strokeWidth={2} />
							</span>
						</div>

						<div className="mt-3 flex items-center gap-4 px-4">
							{/* Story ring */}
							<span className="shrink-0 rounded-full p-[2.5px]" style={{ background: 'conic-gradient(from 200deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5, #feda75)' }}>
								<span className="block rounded-full bg-white p-[2px]">
									<span className="relative block h-[62px] w-[62px] overflow-hidden rounded-full">
										<Image src={PHOTOS.laughing} alt="" fill sizes="64px" className="object-cover" />
									</span>
								</span>
							</span>
							<div className="flex flex-1 justify-between">
								{stat('248', t('ig_posts'))}
								{stat('52.4K', t('ig_followers'))}
								{stat('312', t('ig_following'))}
							</div>
						</div>

						{/* Bio, with the Travsus link */}
						<div className="mt-3 px-4 text-[11.5px] leading-snug">
							<p className="flex items-center gap-1 font-bold">
								{t('ig_name')}
								<BadgeCheck className="h-3.5 w-3.5 fill-[#0095F6] text-white" />
							</p>
							<p className="mt-0.5 text-neutral-800">{t('ig_bio')}</p>
							<p className={`-mx-1 mt-1 inline-flex items-center gap-1 rounded-md px-1 py-0.5 font-semibold text-[#00376B] ${styles.link}`}>
								<Link2 className="h-3.5 w-3.5 -rotate-45" strokeWidth={2.5} />
								travsus.com/?ref=you
							</p>
						</div>

						<div className="mt-3 grid grid-cols-2 gap-1.5 px-4">
							<span className="rounded-lg bg-[#0095F6] py-1.5 text-center text-[11.5px] font-semibold text-white">{t('ig_follow')}</span>
							<span className="rounded-lg bg-neutral-100 py-1.5 text-center text-[11.5px] font-semibold">{t('ig_message')}</span>
						</div>

						{/* Grid tab and posts */}
						<div className="mt-3 flex justify-center border-b border-black py-2">
							<Grid3x3 className="h-4 w-4" />
						</div>
						<div className="grid grid-cols-3 gap-[2px]">
							{GRID.map((src, i) => (
								<span key={i} className="relative block" style={{ aspectRatio: '1 / 1' }}>
									<Image src={src} alt="" fill sizes="90px" className="object-cover" />
								</span>
							))}
						</div>

						{/* Tab bar */}
						<div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-neutral-200 bg-white px-3 pb-5 pt-2.5">
							<Home className="h-5 w-5" strokeWidth={2} />
							<Search className="h-5 w-5" strokeWidth={2} />
							<SquarePlus className="h-5 w-5" strokeWidth={2} />
							<Clapperboard className="h-5 w-5" strokeWidth={2} />
							<span className="relative h-6 w-6 overflow-hidden rounded-full ring-2 ring-black">
								<Image src={PHOTOS.laughing} alt="" fill sizes="24px" className="object-cover" />
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Booking notification */}
			<div className={`absolute -right-4 top-[60%] w-[220px] sm:-right-16 rounded-2xl bg-white/95 p-3 text-black shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] ring-1 ring-black/5 backdrop-blur ${styles.notify}`}>
				<div className="flex items-center gap-2.5">
					<span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-black text-[13px] font-black text-white">T</span>
					<div className="min-w-0">
						<p className="truncate text-[12px] font-bold">{t('chip_booking')}</p>
						<p className="whitespace-nowrap text-[11px] text-neutral-500">{t('chip_booking_trip')}</p>
					</div>
				</div>
				<div className="mt-2 flex items-baseline justify-between border-t border-neutral-100 pt-2">
					<span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">{t('chip_commission')}</span>
					<span className="text-lg font-black tracking-tight">+€84</span>
				</div>
			</div>
		</div>
	)
}
