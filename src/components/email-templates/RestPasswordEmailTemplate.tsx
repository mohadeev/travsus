// import { Html } from '@react-email/html'
// import { Text } from '@react-email/text'
// import { Section } from '@react-email/section'
// import { Container } from '@react-email/container'
// import { BsFacebook, BsInstagram } from 'react-icons/bs'
// import DivOutLine from "../modals/DivOutLine";
// import BookedCard from './TourConfirmationTemplateComopo/BookedCard'

// import tourData from "./tourData.json";
const RestPasswordEmailTemplate = () =>
	// { token, email }: any

	{
		const secailMedia = [
			{
				link: 'https://www.facebook.com/urexcursion',
				icon: 'https://www.urexcursion.com/images/logo/socail_media/facebook.png',
			},
			{
				link: 'https://www.instagram.com/ur_excursion/',
				icon: 'https://www.urexcursion.com/images/logo/socail_media/instagram.png',
			},
		]
		const restLink =
			process.env.NEXT_PUBLIC_ClIENT_URL +
			'/user/password?active=reset-password&token=' +
			'token'
		return (
			<div style={main}>
				<div style={headerContainer}>
					<a
						href="https://www.urexcursion.com/"
						style={{
							color: '#000000',
							textDecoration: 'none',
						}}
						target="_blank"
						data-saferedirecturl="https://www.urexcursion.com/"
					>
						<img
							src="https://www.urexcursion.com/images/logo/main-two/Frame1logo-500-500-cuted.png"
							height="35"
							alt="Travsus"
							style={{
								height: '35px',
							}}
						/>
					</a>
				</div>
				<div style={containerText}>
					<div>
						{/* Hello {email}: */}
						<br />
						<br />
						<p style={paragraph}>
							Please click on the link below within 24 hours to reset your Ur
							Excursion password.
						</p>
						<br />
						<br />
						<a href={restLink} style={buttonStyles}>
							Reset your Password
						</a>
						<p style={paragraph}>
							Once you reset your password, you will be signed in and able to
							enter the member-only area you tried to access.
						</p>
						<br />
						<br />
						<p style={paragraph}>
							If you have any problems with this link, please visit the Ur
							Excursion Help Center for more information.
						</p>
						<br />
						<br />
						<p style={paragraph}> {20 + 10},</p>

						<p style={paragraph}>Happy travels,</p>
						<br />
						<br />
						<p style={paragraph}>The Travsus Support Team</p>
						<br />
						<a style={paragraph}>http://www.urexcursion.com</a>
					</div>
				</div>
				<div style={bottomContainer}>
					<a
						href={'http://www.urexcursion.com'}
						style={{
							color: '#000000',
							textDecoration: 'none',
						}}
						// target="_blank"
						data-saferedirecturl={'http://www.urexcursion.com'}
					>
						<img
							src="https://www.urexcursion.com/images/logo/icon_black/logo_in_black_500_150.png"
							height="35"
							alt="Travsus"
							style={{
								height: '35px',
							}}
						/>
					</a>
					<div style={containerTextBottom}>
						<p style={verysamllText}>
							© urexcursion .Travsus Platforms, LLC.,Calle Mayor, 1 20400
							Tolosa Guipúzcoa Spain.
						</p>
						{/* <br /> */}
						<p style={verysamllTextMarginTop}>
							© 2024 Travsus LLC. All rights reserved. Travsus, the Travsus
							logo, the trail marker logo, Travelers' Choice and the Travelers'
							Choice logo are trademarks of Travsus LLC in the US and other
							countries.
						</p>
					</div>
					<div style={containerSocialMedia}>
						<p style={verysamllText}>Follow us for travel inspo: </p>
						<div style={smallContainerSocialMedia}>
							{secailMedia.map(({ icon, link }) => (
								<a key={link} style={hrefIcon} href={link}>
									<img style={socailLink} src={icon} />
								</a>
							))}{' '}
						</div>
					</div>
				</div>
			</div>
		)
	}

// Styles for the email template
const main = {
	backgroundColor: '#fff',
	width: '100%',
	maxWidth: '500px',
	margin: '0 auto',
	color: '#000',
}
const container_imgae_trip = {
	width: '200px',
	height: '200px',
	borderRadius: '10px',
}
const tour_name = {}

const paragraph = {
	fontSize: '16px',
	fontWeight: '400',
	lineHeight: '23px',
	color: '#000',
	align: 'center',
}

const headerContainer = {
	maxWidth: '500px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	margin: '0 auto',
}
const containerText = {
	maxWidth: '500px',
	// backgroundColor: "#F5F5F7",
	borderRadius: '20px',
	padding: '10px',
	color: '#000',
}

const bottomContainer = {
	maxWidth: '500px',
	width: '100%',
	color: '#000',
}
const containerTextBottom = {
	width: '100%',
	height: 'auto',
	color: '#000',
}

const BoldText = {
	fontWeight: '600',
}
const verysamllText = {
	fontSize: '11px',
	marginTop: '5px',
}

const verysamllTextMarginTop = {
	fontSize: '11px',
	marginTop: '5px',
	color: '#000',
}

const containerSocialMedia = {
	paddingTop: '5px',
	paddingBottom: '5px',
}
const smallContainerSocialMedia = {
	marginTop: '10px',
	display: 'flex',
}
const hrefIcon = {
	fontSize: '20px',
	color: '#000',
}
const socailLink = {
	width: '20px',
	height: '20px',
	margin: '5px',
	color: '#000',
}

const container_card_image: any = {
	width: '100%',
	display: 'flex',
	flexDirection: 'row',
	columnGap: '10px',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
}
const buttonStyles = {
	fontSize: '16px',
	/* fontFamily: 'Helvetica Neue', */
	color: '#fff',
	cursor: 'pointer',
	backgroundColor: '#000000',
	height: '40px',
	width: 'auto',
	border: 'none',
	outline: 'none',
	borderRadius: '20px',
	padding: '10px 10px',
	borderWidth: '2px',
	borderStyle: 'solid',
	textDicoration: 'none',
	borderColor: '#00000000',
}

export default RestPasswordEmailTemplate
