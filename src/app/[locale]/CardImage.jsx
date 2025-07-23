const CardImage = (props) => {
	console.log('props:', props)
	return (
		<div>
			Hello {props?.name} age {props.age}{' '}
		</div>
	)
}

export default CardImage
