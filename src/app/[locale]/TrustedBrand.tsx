// logos.js
import React from 'react'

export const UberLogo = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="58"
		height="20"
		viewBox="0 0 58 20"
		fill="currentColor"
		{...props}
	>
		<path d="M3.63491 14.2837C3.87837..." />
		<path d="M20.9699 0V7.16291C21.6253..." />
		<path d="M35.1789 9.63485C35.5534..." />
		<path d="M54.4469 8.84824C53.8477..." />
	</svg>
)

export const HeadspaceLogo = (props) => (
	<svg
		width="155"
		height="34"
		viewBox="0 0 155 34"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path d="M41.9739 6.97815H44.5868..." />
		<path d="M65.769 19.0987H56.8184C..." />
		<path d="M86.1996 11.8704C86.8111..." />
		<path d="M102.155 13.8451L100.515..." />
		<path d="M110.522 24.8254C109.049..." />
		<path d="M142.015 21.3785C140.986..." />
		<path d="M154.607 19.0987H145.657..." />
		<path d="M72.9395 11.8998C73.551..." />
		<path d="M123.141 11.8998C123.753..." />
		<path d="M33.9133 16.764C34.3024..." />
	</svg>
)

export const MetaLogo = (props) => (
	<svg
		width="89"
		height="19"
		viewBox="0 0 89 19"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path d="M32.5547 1.26245H35.9075..." />
		<path d="M59.4156 18.5471C58.1484..." />
		<path d="M68.3468 7.83675H65.8281..." />
		<path d="M88.5478 18.2438H85.9571..." />
		<path d="M2.9771 12.4762C2.9771..." />
		<path d="M2.36719 4.18556C3.69597..." />
		<path d="M7.76337 3.61797C6.61879..." />
	</svg>
)

export const AirbnbLogo = (props) => (
	<svg
		width="102"
		height="32"
		viewBox="0 0 102 32"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path d="M53.5229 7.93993C53.5229..." />
		<path d="M45.0334 12.0569C45.0334..." />
		<path d="M49.9506 11.6197H53.0057..." />
		<path d="M95.3744 11.3114C93.2776..." />
	</svg>
)

const TrustedBrand = () => {
	return (
		<div>
			<UberLogo className="h-6" />
			<HeadspaceLogo className="h-10" />
			<MetaLogo className="h-8" />
			<AirbnbLogo className="h-10" />
		</div>
	)
}

export default TrustedBrand
