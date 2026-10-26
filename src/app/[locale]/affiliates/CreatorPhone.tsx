'use client'
// An iPhone showing where creators put their Travsus link: an Instagram bio,
// a TikTok bio, a Linktree page and a blog post. The screens change every few
// seconds (or with the tabs below), and a "new booking, +€84" notification
// drops in. The profile is "your" page (no real account); photos are the
// site's own.
import Image from 'next/image'
import { useEffect, useState, type ReactNode } from 'react'
import {
	ArrowRight,
	BadgeCheck,
	ChevronDown,
	ChevronLeft,
	Clapperboard,
	Grid3x3,
	Home,
	Link2,
	Lock,
	Menu,
	Play,
	Plus,
	RotateCw,
	Search,
	SquarePlus,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PHOTOS } from '@/lib/photos'
import styles from './CreatorPhone.module.css'

const PHOTOS_GRID = [PHOTOS.sahara, PHOTOS.sunsetHug, PHOTOS.hiking, PHOTOS.bookNow, PHOTOS.hero, PHOTOS.laughing]
const LINK = 'travsus.com/?ref=you'
const SCREENS = ['instagram', 'tiktok', 'linktree', 'blog'] as const
type Screen = (typeof SCREENS)[number]
const EVERY = 4500 // ms per screen

type T = ReturnType<typeof useTranslations<'Affiliates'>>

function StatusBar({ dark = false }: { dark?: boolean }) {
	const ink = dark ? 'bg-white' : 'bg-black'
	return (
		<div className={`relative flex h-11 items-center justify-between px-7 pt-1 text-[12px] font-semibold ${dark ? 'text-white' : 'text-black'}`}>
			<span>9:41</span>
			<span className="flex items-center gap-1">
				<span className="flex items-end gap-[1.5px]">
					{[4, 6, 8, 10].map((h) => (
						<span key={h} className={`w-[2.5px] rounded-sm ${ink}`} style={{ height: h }} />
					))}
				</span>
				<span className={`ml-1 h-[10px] w-[21px] rounded-[3px] border p-[1px] ${dark ? 'border-white/60' : 'border-black/50'}`}>
					<span className={`block h-full w-3/4 rounded-[1px] ${ink}`} />
				</span>
			</span>
		</div>
	)
}

const Avatar = ({ size, ring }: { size: number; ring?: string }) => (
	<span className="shrink-0 rounded-full p-[2.5px]" style={{ background: ring ?? 'transparent' }}>
		<span className="block rounded-full bg-white p-[2px]">
			<span className="relative block overflow-hidden rounded-full" style={{ width: size, height: size }}>
				<Image src={PHOTOS.laughing} alt="" fill sizes="80px" className="object-cover" />
			</span>
		</span>
	</span>
)

const BioLink = ({ className = '' }: { className?: string }) => (
	<p className={`-mx-1 mt-1 inline-flex items-center gap-1 rounded-md px-1 py-0.5 font-semibold ${styles.link} ${className}`}>
		<Link2 className="h-3.5 w-3.5 -rotate-45" strokeWidth={2.5} />
		{LINK}
	</p>
)

function Instagram({ t }: { t: T }) {
	const stat = (value: string, label: string) => (
		<div className="text-center">
			<p className="text-[13px] font-bold leading-none">{value}</p>
			<p className="mt-0.5 text-[10px] text-neutral-600">{label}</p>
		</div>
	)
	return (
		<div className="h-full bg-white text-black">
			<StatusBar />
			<div className="mt-1 flex items-center justify-between px-4">
				<p className="flex items-center gap-1 text-[15px] font-bold">
					your.travels
					<ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
				</p>
				<span className="flex items-center gap-3">
					<Plus className="h-5 w-5" />
					<Menu className="h-5 w-5" />
				</span>
			</div>
			<div className="mt-3 flex items-center gap-4 px-4">
				<Avatar size={62} ring="conic-gradient(from 200deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5, #feda75)" />
				<div className="flex flex-1 justify-between">
					{stat('248', t('ig_posts'))}
					{stat('52.4K', t('ig_followers'))}
					{stat('312', t('ig_following'))}
				</div>
			</div>
			<div className="mt-3 px-4 text-[11.5px] leading-snug">
				<p className="flex items-center gap-1 font-bold">
					{t('ig_name')}
					<BadgeCheck className="h-3.5 w-3.5 fill-[#0095F6] text-white" />
				</p>
				<p className="mt-0.5 text-neutral-800">{t('ig_bio')}</p>
				<BioLink className="text-[#00376B]" />
			</div>
			<div className="mt-3 grid grid-cols-2 gap-1.5 px-4">
				<span className="rounded-lg bg-[#0095F6] py-1.5 text-center text-[11.5px] font-semibold text-white">{t('ig_follow')}</span>
				<span className="rounded-lg bg-neutral-100 py-1.5 text-center text-[11.5px] font-semibold">{t('ig_message')}</span>
			</div>
			<div className="mt-3 flex justify-center border-b border-black py-2">
				<Grid3x3 className="h-4 w-4" />
			</div>
			<div className="grid grid-cols-3 gap-[2px]">
				{PHOTOS_GRID.map((src, i) => (
					<span key={i} className="relative block" style={{ aspectRatio: '1 / 1' }}>
						<Image src={src} alt="" fill sizes="90px" className="object-cover" />
					</span>
				))}
			</div>
			<div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-neutral-200 bg-white px-3 pb-6 pt-2.5">
				<Home className="h-5 w-5" />
				<Search className="h-5 w-5" />
				<SquarePlus className="h-5 w-5" />
				<Clapperboard className="h-5 w-5" />
				<span className="relative h-6 w-6 overflow-hidden rounded-full ring-2 ring-black">
					<Image src={PHOTOS.laughing} alt="" fill sizes="24px" className="object-cover" />
				</span>
			</div>
		</div>
	)
}

function TikTok({ t }: { t: T }) {
	const stat = (value: string, label: string) => (
		<div className="text-center">
			<p className="text-[13px] font-bold leading-none">{value}</p>
			<p className="mt-1 text-[10px] text-white/55">{label}</p>
		</div>
	)
	return (
		<div className="h-full bg-[#121212] text-white">
			<StatusBar dark />
			<div className="mt-1 flex items-center justify-center gap-1 text-[14px] font-bold">
				{t('ig_name')}
				<ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
			</div>
			<div className="mt-4 flex flex-col items-center">
				<span className="relative block h-[76px] w-[76px] overflow-hidden rounded-full">
					<Image src={PHOTOS.laughing} alt="" fill sizes="80px" className="object-cover" />
				</span>
				<p className="mt-2 text-[13px] font-semibold">@your.travels</p>
				<div className="mt-3 flex gap-6">
					{stat('312', t('tt_following'))}
					{stat('52.4K', t('tt_followers'))}
					{stat('1.2M', t('tt_likes'))}
				</div>
				<span className="mt-3 rounded-md bg-[#FE2C55] px-10 py-2 text-[12px] font-semibold">{t('tt_follow')}</span>
				<p className="mt-3 px-6 text-center text-[11px] leading-snug text-white/85">{t('ig_bio')}</p>
				<BioLink className="text-white" />
			</div>
			<div className="mt-3 grid grid-cols-3 gap-[2px]">
				{PHOTOS_GRID.map((src, i) => (
					<span key={i} className="relative block" style={{ aspectRatio: '3 / 4' }}>
						<Image src={src} alt="" fill sizes="90px" className="object-cover" />
						<span className="absolute bottom-1 left-1 flex items-center gap-0.5 text-[9px] font-semibold drop-shadow">
							<Play className="h-2.5 w-2.5 fill-white" strokeWidth={0} />
							{['48K', '120K', '9.4K', '31K', '210K', '15K'][i]}
						</span>
					</span>
				))}
			</div>
		</div>
	)
}

function Linktree({ t }: { t: T }) {
	const links = [t('lt_book'), t('lt_videos'), t('lt_guide'), t('lt_contact')]
	return (
		<div className="h-full text-black" style={{ background: 'linear-gradient(180deg, #e8efd6 0%, #d5e3b8 100%)' }}>
			<StatusBar />
			<div className="mt-6 flex flex-col items-center px-5">
				<Avatar size={72} />
				<p className="mt-3 text-[14px] font-bold">@your.travels</p>
				<p className="mt-1 text-center text-[11px] leading-snug text-black/70">{t('ig_bio')}</p>
				<ul className="mt-5 w-full space-y-2.5">
					{links.map((label, i) => (
						<li
							key={label}
							className={`rounded-full px-4 py-3 text-center text-[11.5px] font-semibold ${
								i === 0 ? `bg-black text-white ${styles.pulse}` : 'bg-white/90 text-black'
							}`}
						>
							{i === 0 ? '🐪 ' : ''}
							{label}
							{i === 0 && <span className="mt-0.5 block text-[9.5px] font-medium text-white/60">{LINK}</span>}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

function Blog({ t }: { t: T }) {
	return (
		<div className="h-full bg-white text-black">
			<StatusBar />
			{/* Safari address bar */}
			<div className="mx-3 flex items-center gap-2 rounded-xl bg-neutral-100 px-3 py-2 text-[11px] text-neutral-700">
				<ChevronLeft className="h-3.5 w-3.5" />
				<Lock className="h-3 w-3" />
				<span className="flex-1 truncate text-center font-medium">your-travel-blog.com</span>
				<RotateCw className="h-3 w-3" />
			</div>
			<div className="relative mx-3 mt-3 overflow-hidden rounded-xl" style={{ aspectRatio: '16 / 10' }}>
				<Image src={PHOTOS.sahara} alt="" fill sizes="260px" className="object-cover" />
			</div>
			<div className="px-4">
				<p className="mt-3 text-[15px] font-black leading-tight tracking-tight">{t('blog_post_title')}</p>
				<p className="mt-2 text-[11px] leading-relaxed text-neutral-600">{t('blog_post_text')}</p>
				<div className={`mt-3 rounded-2xl bg-black p-3 text-white ${styles.pulse}`}>
					<div className="flex items-center gap-2.5">
						<span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
							<Image src={PHOTOS.sahara} alt="" fill sizes="40px" className="object-cover" />
						</span>
						<div className="min-w-0 flex-1">
							<p className="truncate text-[11px] font-bold">{t('blog_post_cta')}</p>
							<p className="truncate text-[9.5px] text-white/60">{LINK}</p>
						</div>
						<ArrowRight className="h-4 w-4 shrink-0" />
					</div>
				</div>
				<div className="mt-3 space-y-1.5">
					{[100, 92, 96, 70].map((w) => (
						<span key={w} className="block h-1.5 rounded-full bg-neutral-200" style={{ width: `${w}%` }} />
					))}
				</div>
			</div>
		</div>
	)
}

const TAB_LABEL: Record<Screen, (t: T) => string> = {
	instagram: () => 'Instagram',
	tiktok: () => 'TikTok',
	linktree: () => 'Linktree',
	blog: (t) => t('tab_blog'),
}

export default function CreatorPhone({ className = '' }: { className?: string }) {
	const t = useTranslations('Affiliates')
	const [screen, setScreen] = useState(0)
	const [paused, setPaused] = useState(false)

	// Next screen every few seconds, unless the visitor picked one or prefers less motion
	useEffect(() => {
		if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
		const timer = setInterval(() => setScreen((i) => (i + 1) % SCREENS.length), EVERY)
		return () => clearInterval(timer)
	}, [paused])

	const views: Record<Screen, ReactNode> = {
		instagram: <Instagram t={t} />,
		tiktok: <TikTok t={t} />,
		linktree: <Linktree t={t} />,
		blog: <Blog t={t} />,
	}

	return (
		<div className={`relative mx-auto w-[260px] sm:w-[280px] ${className}`}>
			<div className={styles.float}>
				{/* iPhone: titanium edge, side buttons, black bezel */}
				<div className="relative rounded-[50px] p-[3px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.75)]" style={{ background: 'linear-gradient(145deg, #d7d4cf, #8d8a85 30%, #5e5b57 55%, #b9b6b0 80%, #75726d)' }}>
					<span aria-hidden className="absolute -left-[3px] top-[19%] h-6 w-[3px] rounded-l-sm bg-[#8d8a85]" />
					<span aria-hidden className="absolute -left-[3px] top-[27%] h-11 w-[3px] rounded-l-sm bg-[#8d8a85]" />
					<span aria-hidden className="absolute -left-[3px] top-[37%] h-11 w-[3px] rounded-l-sm bg-[#8d8a85]" />
					<span aria-hidden className="absolute -right-[3px] top-[30%] h-16 w-[3px] rounded-r-sm bg-[#8d8a85]" />
					<div className="rounded-[47px] bg-black p-[7px]">
						<div className="relative overflow-hidden rounded-[40px]" style={{ aspectRatio: '9 / 19.5' }}>
							{SCREENS.map((name, i) => (
								<div
									key={name}
									aria-hidden={i !== screen}
									className={`absolute inset-0 transition-all duration-700 ease-out ${i === screen ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-4 opacity-0'}`}
								>
									{views[name]}
								</div>
							))}
							{/* Dynamic Island and home bar */}
							<span aria-hidden className="absolute left-1/2 top-[9px] z-10 h-[24px] w-[86px] -translate-x-1/2 rounded-full bg-black" />
							<span aria-hidden className={`absolute bottom-[7px] left-1/2 z-10 h-[4px] w-[96px] -translate-x-1/2 rounded-full transition-colors duration-700 ${SCREENS[screen] === 'tiktok' ? 'bg-white' : 'bg-black'}`} />
						</div>
					</div>
				</div>
			</div>

			{/* Booking notification */}
			<div className={`absolute -right-4 top-[73%] w-[220px] rounded-2xl bg-white/95 p-3 text-black shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] ring-1 ring-black/5 backdrop-blur sm:-right-16 ${styles.notify}`}>
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

			{/* Which app is on screen */}
			<div role="tablist" className="-mx-10 mt-10 flex justify-center gap-1.5">
				{SCREENS.map((name, i) => (
					<button
						key={name}
						type="button"
						role="tab"
						aria-selected={i === screen}
						onClick={() => {
							setScreen(i)
							setPaused(true)
						}}
						className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold ring-1 transition ${
							i === screen ? 'bg-white text-black ring-white' : 'text-white/70 ring-white/20 hover:text-white hover:ring-white/50'
						}`}
					>
						{TAB_LABEL[name](t)}
					</button>
				))}
			</div>
		</div>
	)
}
