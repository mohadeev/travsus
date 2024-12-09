const activities = [
	{
		name: ' Architecture',
		images: [
			{
				url: 'https://images.pexels.com/photos/3889986/pexels-photo-3889986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
			},
		],
	},
	{
		name: ' Desert safaris',
		images: [
			{
				url: 'https://images.pexels.com/photos/20450505/pexels-photo-20450505/free-photo-of-riding-a-quad-through-the-desert.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
			},
		],
	},
	{
		name: ' Photography tours',
		images: [
			{
				url: 'https://images.pexels.com/photos/21336291/pexels-photo-21336291/free-photo-of-woman-in-a-rocky-cave.jpeg?auto=compress&cs=tinysrgb&w=600',
			},
		],
	},
	{
		name: ' Jeep & 4WD tours',
		images: [
			{
				url: 'https://images.pexels.com/photos/15464846/pexels-photo-15464846/free-photo-of-jeep-on-desert-on-shore.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
			},
		],
	},
	{
		name: 'Hiking',
		images: [
			{
				url: 'https://images.pexels.com/photos/20819246/pexels-photo-20819246/free-photo-of-people-hiking-with-backpacks-in-forest.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
			},
		],
	},
	{
		name: 'Beach Tours',
		images: [
			{
				url: 'https://img.freepik.com/free-photo/beautiful-couple-showing-affection-beach-near-ocean_23-2150367611.jpg?t=st=1727608889~exp=1727612489~hmac=1aa164a268e8c77ea2c4cacfec1c3274521f10725c86c3ef4d3a8230363b8b77&w=360',
			},
		],
	},
]

function splitArrayIntoPairs() {
	const result = []

	for (let i = 0; i < activities.length; i += 2) {
		// Slice out pairs of two elements
		const pair = activities.slice(i, i + 2)
		result.push(pair)
	}

	return result
}
const newActivities = splitArrayIntoPairs()

export const werticalExperienceCard = `<table style="margin: 20px 0;" role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    ${newActivities
			.map((each) => {
				return `<tr>
            ${each
							.map(({ name, images }) => {
								return `<td width="50%" valign="top" style="padding: 0 10px 20px 10px;">
                        <div style="position: relative; background: #000; border: 4px solid black; border-radius: 20px; overflow: hidden;">
                            <img src="${images[0].url}" style="width: 100%; max-width: 100%; height: 200px; max-height: 200px; object-fit: cover !important; margin: 0; padding: 0;" />
                            <h2 style="padding: 5px; margin: 0; color: #fff; background: #000; text-align: center; font-weight: normal; font-size: 16px;">
                                ${name}
                            </h2>
                        </div>
                    </td>`
							})
							.join('')}
        </tr>`
			})
			.join('')}
</table>`

// const activities = [
// 	{
// 		name: ' Architecture',
// 		images: [
// 			{
// 				url: 'https://images.pexels.com/photos/3889986/pexels-photo-3889986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
// 			},
// 		],
// 	},
// 	{
// 		name: ' Desert safaris',
// 		images: [
// 			{
// 				url: 'https://images.pexels.com/photos/20450505/pexels-photo-20450505/free-photo-of-riding-a-quad-through-the-desert.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
// 			},
// 		],
// 	},
// 	{
// 		name: ' Photography tours',
// 		images: [
// 			{
// 				url: 'https://images.pexels.com/photos/21336291/pexels-photo-21336291/free-photo-of-woman-in-a-rocky-cave.jpeg?auto=compress&cs=tinysrgb&w=600',
// 			},
// 		],
// 	},
// 	{
// 		name: ' Jeep & 4WD tours',
// 		images: [
// 			{
// 				url: 'https://images.pexels.com/photos/15464846/pexels-photo-15464846/free-photo-of-jeep-on-desert-on-shore.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
// 			},
// 		],
// 	},
// 	{
// 		name: 'Hiking',
// 		images: [
// 			{
// 				url: '    https://images.pexels.com/photos/20819246/pexels-photo-20819246/free-photo-of-people-hiking-with-backpacks-in-forest.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
// 			},
// 		],
// 	},
// 	{
// 		name: 'Beach Tours',
// 		images: [
// 			{
// 				url: 'https://img.freepik.com/free-photo/beautiful-couple-showing-affection-beach-near-ocean_23-2150367611.jpg?t=st=1727608889~exp=1727612489~hmac=1aa164a268e8c77ea2c4cacfec1c3274521f10725c86c3ef4d3a8230363b8b77&w=360',
// 			},
// 		],
// 	},
// 	// Camel riding tours
// 	// { name: " Architecture Desert safaris Photography tours" },
// ]

// function splitArrayIntoPairs() {
// 	const result = []

// 	for (let i = 0; i < activities.length; i += 2) {
// 		// Slice out pairs of two elements
// 		const pair = activities.slice(i, i + 2)
// 		result.push(pair)
// 	}

// 	return result
// }
// const newActivities = splitArrayIntoPairs()

// export const werticalExperienceCard = `<div style="width : 100%; margin : 0 auto; height : auto; gap: 40px; display: grid;
// grid-auto-rows: min-content; row-gap: 40px;">${newActivities.map((each) => {
// 	return `<div style="width : 100%; margin : 0 auto; display:flex; flex-direction: row; height : auto; gap: 40px; display: grid;
// grid-auto-flow: column;
// column-gap: 40px;">${each.map(
// 		({ name, images }) => {
// 			return `<div style="width : 50%; margin : 0 auto; height: auto; position: relative; background: #000; border: 4px solid black; border-radius: 20px; overflow: hidden;gap:0;">
//                 <img src=${images[0].url} style="width : 100%; max-width : 100%; position: absolute !important; height: 250px; max-height: 250px; object-fit:cover; margin:0 ; padding:0;" />
//                 <h2  style="padding : 0; margin: 0; color: #fff; background:#000; width :auto; height : auto; text-align: center;  font-weight: normal;
// unicode-bidi: normal;">${name}</h2>
//                 </div>`
// 		},
// 	)}</div>`
// })}</div>`

// //
// // <h2 position: relative; padding : 0; margin: 0;>${name}</h2>
