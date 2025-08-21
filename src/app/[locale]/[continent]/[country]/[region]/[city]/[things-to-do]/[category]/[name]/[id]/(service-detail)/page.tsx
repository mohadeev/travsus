import React from 'react'

const page = ({ layoutParams }: any) => {
	console.log('pr: ', layoutParams)
	return <div>page , {JSON.stringify(layoutParams)}</div>
}

export default page
