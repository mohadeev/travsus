// components/TravelBanner.js
import { useState, useEffect } from 'react'

const TravelBanner = () => {
	const [currentTextIndex, setCurrentTextIndex] = useState(0)
	const [isAnimating, setIsAnimating] = useState(false)

	const marketingTexts = [
		'Dream destinations await you!',
		'Your next adventure starts here',
		'Travel with confidence & joy',
		'Creating memories that last forever',
	]

	useEffect(() => {
		const interval = setInterval(() => {
			setIsAnimating(true)
			setTimeout(() => {
				setCurrentTextIndex((prev) => (prev + 1) % marketingTexts.length)
				setIsAnimating(false)
			}, 500)
		}, 4000)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className="banner-container">
			<div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent via-transparent to-black/70"></div>
			<div className="banner-content">
				<div className="text-section">
					<h1 className="main-heading">
						<span className="highlight">Tipcall</span> Happy People
					</h1>
					<p
						className={`marketing-text ${isAnimating ? 'fade-out' : 'fade-in'}`}
					>
						{marketingTexts[currentTextIndex]}
					</p>
					<button className="cta-button">Plan Your Trip Today</button>
				</div>
			</div>

			<style jsx>{`
				.banner-container {
					background-image: url('https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/97/97/75/happy-guests-of-morocco.jpg?w=1400&h=-1&s=1');
					background-size: cover;
					background-position: center;
					color: #fff; /* White text */
					padding: 4rem 2rem;
					border-radius: 50px;
					margin: 2rem auto;
					max-width: 1200px;
					box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
					overflow: hidden;
					position: relative;
					min-height: 500px;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.banner-content {
					display: flex;
					justify-content: center;
					align-items: center;
					flex-wrap: wrap;
					gap: 3rem;
					position: relative;
					z-index: 2;
					width: 100%;
					text-align: center;
				}

				.text-section {
					flex: 1;
					min-width: 300px;
					text-align: center;
					display: flex;
					flex-direction: column;
					align-items: center;
				}

				.main-heading {
					font-size: 3.5rem;
					margin-bottom: 1.5rem;
					font-weight: 800;
					color: #fff; /* White text */
					letter-spacing: -0.5px;
					text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
					text-align: center;
				}

				.highlight {
				}

				.marketing-text {
					font-size: 1.8rem;
					margin-bottom: 2.5rem;
					min-height: 2.5rem;
					transition: opacity 0.5s ease;
					font-weight: 600;
					color: #fff; /* White text */
					text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
					text-align: center;
				}

				.fade-in {
					opacity: 1;
				}

				.fade-out {
					opacity: 0;
				}

				.cta-button {
					background: #000; /* Black background */
					border: 2px solid #000;
					padding: 1.2rem 2.5rem;
					font-size: 1.2rem;
					color: #fff; /* White text */
					border-radius: 50px;
					cursor: pointer;
					font-weight: 600;
					box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
					transition: all 0.3s ease;
					margin: 0 auto;
					display: block;
				}

				.cta-button:hover {
					transform: translateY(-3px);
					box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
					background: #fff; /* White background on hover */
					color: #000; /* Black text on hover */
				}

				.graphic-section {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					min-width: 300px;
					justify-content: center;
				}

				.people-group {
					display: flex;
					margin-bottom: 2rem;
					position: relative;
					justify-content: center;
				}

				.person {
					font-size: 4rem;
					margin: 0 0.5rem;
					animation: float 3s ease-in-out infinite;
					filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
				}

				.person-1 {
					animation-delay: 0s;
				}
				.person-2 {
					animation-delay: 0.5s;
				}
				.person-3 {
					animation-delay: 1s;
				}
				.person-4 {
					animation-delay: 1.5s;
				}

				.travel-icons {
					display: flex;
					gap: 1.5rem;
					justify-content: center;
				}

				.icon {
					font-size: 3rem;
					animation: bounce 2s ease-in-out infinite;
					filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
				}

				.icon:nth-child(2) {
					animation-delay: 0.3s;
				}
				.icon:nth-child(3) {
					animation-delay: 0.6s;
				}

				@keyframes float {
					0%,
					100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-15px);
					}
				}

				@keyframes bounce {
					0%,
					100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-10px);
					}
				}

				@media (max-width: 768px) {
					.banner-container {
						min-height: 400px;
						padding: 2.5rem 1.5rem;
						border: 15px solid #000; /* Keep 15px border on mobile */
					}

					.banner-content {
						flex-direction: column;
						text-align: center;
						gap: 2rem;
					}

					.text-section {
						text-align: center;
					}

					.main-heading {
						font-size: 2.8rem;
					}

					.marketing-text {
						font-size: 1.5rem;
					}

					.person {
						font-size: 3.5rem;
					}
				}
			`}</style>
		</div>
	)
}

export default TravelBanner
