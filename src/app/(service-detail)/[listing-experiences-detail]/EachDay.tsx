import React, { useEffect, useState, useRef } from 'react'

// import { IoFlag } from '@react-icons/all-files/io5/IoFlag'
// import { IoLocation } from '@react-icons/all-files/io5/IoLocation'
// import { BiRadioCircleMarked } from '@react-icons/all-files/bi/BiRadioCircleMarked'

// import { IoIosArrowDown } from '@react-icons/all-files/io/IoIosArrowDown'
// import { IoIosArrowUp } from '@react-icons/all-files/io/IoIosArrowUp'

import Style from './each-day.module.css'
// import { WhiteReadMore } from '../../../modals/text/WhiteReadMore'
// import MoroccoCities from '../../../../constant/MoroccoCities.json'
// import replaceKeyphrase from '../../../../utils/replaceKeyphrase'
interface props {
	isFirst: boolean
	isLast: boolean
	item: any
}

const Itinerary = ({ isFirst, isLast, dayData, Index, tourData }: any) => {
	const [active, setActive] = useState(false)
	const containerDiv = React.useRef<HTMLDivElement | null>(null)

	const handleActive = () => {
		setActive(!active)
	}
	useEffect(() => {
		if (!isLast && active) {
			if (containerDiv.current) {
				containerDiv.current.className = Style.active_container
			}
		} else if (!isLast && !active) {
			if (containerDiv.current) {
				containerDiv.current.className = Style.container
			}
		}
	}, [active])

	useEffect(() => {
		if (Index === 0) {
			setActive(true)
		}
	}, [])
	const divElement = useRef<HTMLDivElement>(null)
	const divElementCurrent = divElement.current

	const [isFirstTime, setFirstTime] = useState(false)
	const [totalHeight, setTotalHeight] = useState(10)
	const handelChangeWidth = () => {}
	useEffect(() => {
		if (divElementCurrent) {
			const height = divElementCurrent.clientHeight / 10
			setTotalHeight(height)
			const numberOfChildren = divElementCurrent.children.length
		}
		return () => {}
	})
	const originalItinerary = dayData?.description

	// Example usage

	// Function to render the HTML content with the read more component
	const renderContent = () => {
		return (
			<p className={active ? Style.text_active : Style.text}>
				<span dangerouslySetInnerHTML={{ __html: originalItinerary }} />

				{originalItinerary && (
					<span dangerouslySetInnerHTML={{ __html: originalItinerary }} />
				)}
			</p>
		)
	}

	return (
		<div
			ref={containerDiv}
			className={isLast ? Style.container_last : Style.container}
		>
			<div className={Style.container_div_name}>
				<div
					className={
						isLast ? Style.is_last_icon_container : Style.icon_container
					}
				>
					<span className={Style.icon_first}>
						{Index + 1}
						{/* {isFirst && <IoLocation />} */}
					</span>
					{/* <i className={Style.icon_tour}>
            {Index + 1}
            {!isFirst && !isLast && <BiRadioCircleMarked />}
          </i> */}
					{/* <i className={Style.icon_last}>{isLast && <IoFlag />}</i> */}
				</div>
				{!isLast && (
					<div ref={divElement} className={Style.container_line}>
						<div className={Style.centered_container}>
							{Array.from({ length: totalHeight }).map(() => (
								<div className={Style.dot}></div>
							))}
						</div>
					</div>
				)}
			</div>
			<div
				className={isLast ? Style.text_container__last : Style.text_container}
			>
				<div onClick={handleActive} className={Style.title_container}>
					<h3 className={Style.title}>{dayData?.name}</h3>
				</div>
				<div className={active ? Style.text_active : Style.text}>
					{renderContent()}

					{/* <p
            className={active ? Style.text_active : Style.text}
            dangerouslySetInnerHTML={{ __html: dynamicItinerary }}
          />
          <WhiteReadMore
            Text={active ? "        Show less" : "...Show more"}
            hanndelClick={handleActive}
          /> */}
				</div>
			</div>
		</div>
	)
}

export default Itinerary
