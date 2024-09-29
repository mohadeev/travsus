import React from 'react'

const VarticalExperiencesCard = ({ data }: any) => {
	const images = data?.images
	const firstImage = images?.[0]?.url
	const name = data?.name

	return (
		<main className="flex w-full flex-col items-center justify-center">
			<div className="border-10 border-blac relative h-[400px] w-full cursor-pointer overflow-hidden rounded-[40px] border-[10px] border-solid border-black text-white">
				<img
					src={firstImage}
					alt={name}
					className="absolute h-full w-full object-cover transition-opacity duration-300"
				/>
				<div className="absolute bottom-5 left-5 rounded-md bg-black bg-opacity-80 px-2 py-1 font-bold text-white">
					<h2 className="text-lg">{name}</h2>
				</div>
			</div>
		</main>
	)
}

export default VarticalExperiencesCard
