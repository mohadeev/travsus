// // import necessary components
// import { Html } from '@react-email/html'
// import { Text } from '@react-email/text'
// import { Section } from '@react-email/section'
// import { Container } from '@react-email/container'
// import Image from 'next/image'

// // import tour data

// const RestPasswordEmailTemplate = () => {
// 	// { token, email }: any

// 	const socialMedia = [
// 		{
// 			link: 'https://www.facebook.com/urexcursion',
// 			icon: '/images/logo/socail_media/facebook.png', // Use local paths for optimization
// 		},
// 		{
// 			link: 'https://www.instagram.com/ur_excursion/',
// 			icon: '/images/logo/socail_media/instagram.png',
// 		},
// 	]

// 	const restLink =
// 		process.env.NEXT_PUBLIC_CLIENT_URL +
// 		'/user/password?active=reset-password&token=' +
// 		'token'

// 	return (
// 		<div style={main}>
// 			<div style={headerContainer}>
// 				<a
// 					href="https://www.urexcursion.com/"
// 					style={{ color: '#000000', textDecoration: 'none' }}
// 					target="_blank"
// 					rel="noopener noreferrer"
// 				>
// 					<Image
// 						src="/images/logo/main-two/Frame1logo-500-500-cuted.png"
// 						height={35}
// 						width={35}
// 						alt="Travsus"
// 					/>
// 				</a>
// 			</div>
// 			<div style={containerText}>
// 				<div>
// 					{/* Hello {email}: */}
// 					<br />
// 					<br />
// 					<p style={paragraph}>
// 						Please click on the link below within 24 hours to reset your Ur
// 						Excursion password.
// 					</p>
// 					<br />
// 					<br />
// 					<a href={restLink} style={buttonStyles}>
// 						Reset your Password
// 					</a>
// 					<p style={paragraph}>
// 						Once you reset your password, you&apos;ll be signed in and able to
// 						enter the member-only area you&apos;ve tried to access.
// 					</p>
// 					<br />
// 					<br />
// 					<p style={paragraph}>
// 						If you have any problems with this link, please visit the Ur
// 						Excursion Help Center for more information.
// 					</p>
// 					<br />
// 					<br />
// 					<p style={paragraph}>{20 + 10},</p>
// 					<p style={paragraph}>Happy travels,</p>
// 					<br />
// 					<br />
// 					<p style={paragraph}>The Travsus Support Team</p>
// 					<br />
// 					<a href="http://www.urexcursion.com" style={paragraph}>
// 						http://www.urexcursion.com
// 					</a>
// 				</div>
// 			</div>
// 			<div style={bottomContainer}>
// 				<a
// 					href="http://www.urexcursion.com"
// 					style={{ color: '#000000', textDecoration: 'none' }}
// 					target="_blank"
// 					rel="noopener noreferrer"
// 				>
// 					<Image
// 						src="/images/logo/icon_black/logo_in_black_500_150.png"
// 						height={35}
// 						width={35}
// 						alt="Travsus"
// 					/>
// 				</a>
// 				<div style={containerTextBottom}>
// 					<p style={verysmallText}>
// 						© urexcursion .Travsus Platforms, LLC., Calle Mayor, 1 20400 Tolosa
// 						Guipúzcoa Spain.
// 					</p>
// 					<p style={verysmallTextMarginTop}>
// 						© 2024 Travsus LLC. All rights reserved. Travsus, the Travsus logo,
// 						the trail marker logo, Travelers&apos; Choice and the
// 						Travelers&apos; Choice logo are trademarks of Travsus LLC in the US
// 						and other countries.
// 					</p>
// 				</div>
// 				<div style={containerSocialMedia}>
// 					<p style={verysmallText}>Follow us for travel inspiration:</p>
// 					<div style={smallContainerSocialMedia}>
// 						{socialMedia.map(({ icon, link }) => (
// 							<a
// 								key={link}
// 								style={hrefIcon}
// 								href={link}
// 								target="_blank"
// 								rel="noopener noreferrer"
// 							>
// 								<Image
// 									style={socialLink}
// 									src={icon}
// 									alt="Social Media Icon"
// 									width={20}
// 									height={20}
// 								/>
// 							</a>
// 						))}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// export default RestPasswordEmailTemplate


import React from 'react'

const RestPasswordEmailTemplate = () => {
  return (
	<div>RestPasswordEmailTemplate</div>
  )
}

export default RestPasswordEmailTemplate
