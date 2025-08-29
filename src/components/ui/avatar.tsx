import * as React from 'react'
import { cn } from '@/lib/utils'

const Avatar = React.forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement> & { size?: 'sm' | 'md' | 'lg' }
>(({ className, size = 'md', ...props }, ref) => {
	const sizeClasses = {
		sm: 'h-8 w-8',
		md: 'h-10 w-10',
		lg: 'h-12 w-12',
	}

	return (
		<span
			ref={ref}
			className={cn(
				'relative flex shrink-0 overflow-hidden rounded-full',
				sizeClasses[size],
				className,
			)}
			{...props}
		/>
	)
})
Avatar.displayName = 'Avatar'

const AvatarImage = React.forwardRef<
	HTMLImageElement,
	React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
	<img
		ref={ref}
		className={cn('aspect-square h-full w-full', className)}
		{...props}
		src={
			props.src
				? props.src
				: 'https://static.vecteezy.com/system/resources/thumbnails/025/337/669/small_2x/default-male-avatar-profile-icon-social-media-chatting-online-user-free-vector.jpg'
		}
	/>
))
AvatarImage.displayName = 'AvatarImage'

const AvatarFallback = React.forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
	<span
		ref={ref}
		className={cn(
			'bg-muted flex h-full w-full items-center justify-center rounded-full',
			className,
		)}
		{...props}
	/>
))
AvatarFallback.displayName = 'AvatarFallback'

export { Avatar, AvatarImage, AvatarFallback }
