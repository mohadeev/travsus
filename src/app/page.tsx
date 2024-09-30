// import React from "react";
// import SectionHero from "@/app/(server-components)/SectionHero";
// import BgGlassmorphism from "@/components/BgGlassmorphism";
// import { TaxonomyType } from "@/data/types";
// import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
// import SectionOurFeatures from "@/components/SectionOurFeatures";
// import BackgroundSection from "@/components/BackgroundSection";
// import SectionGridFeaturePlaces from "@/components/SectionGridFeaturePlaces";
// import SectionHowItWork from "@/components/SectionHowItWork";
// import SectionSubscribe2 from "@/components/SectionSubscribe2";
// import SectionGridAuthorBox from "@/components/SectionGridAuthorBox";
// import SectionGridCategoryBox from "@/components/SectionGridCategoryBox";
// import SectionBecomeAnAuthor from "@/components/SectionBecomeAnAuthor";
// import SectionVideos from "@/components/SectionVideos";
// import SectionClientSay from "@/components/SectionClientSay";

// const DEMO_CATS: TaxonomyType[] = [
//   {
//     id: "1",
//     href: "/listing-stay-map",
//     name: "New Yourk",
//     taxonomy: "category",
//     count: 188288,
//     thumbnail:
//       "https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
//   },
//   {
//     id: "2",
//     href: "/listing-stay-map",
//     name: "Singapore",
//     taxonomy: "category",
//     count: 188288,
//     thumbnail:
//       "https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
//   },
//   {
//     id: "3",
//     href: "/listing-stay-map",
//     name: "Paris",
//     taxonomy: "category",
//     count: 188288,
//     thumbnail:
//       "https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
//   },
//   {
//     id: "4",
//     href: "/listing-stay-map",
//     name: "London",
//     taxonomy: "category",
//     count: 188288,
//     thumbnail:
//       "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
//   },
//   {
//     id: "5",
//     href: "/listing-stay-map",
//     name: "Tokyo",
//     taxonomy: "category",
//     count: 188288,
//     thumbnail:
//       "https://images.pexels.com/photos/4151484/pexels-photo-4151484.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
//   },
//   {
//     id: "6",
//     href: "/listing-stay-map",
//     name: "Maldives",
//     taxonomy: "category",
//     count: 188288,
//     thumbnail:
//       "https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
//   },
//   {
//     id: "7",
//     href: "/listing-stay-map",
//     name: "Italy",
//     taxonomy: "category",
//     count: 188288,
//     thumbnail:
//       "https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
//   },
// ];

// const DEMO_CATS_2: TaxonomyType[] = [
//   {
//     id: "1",
//     href: "/listing-stay-map",
//     name: "Enjoy the great cold",
//     taxonomy: "category",
//     count: 188288,
//     thumbnail:
//       "https://images.pexels.com/photos/5764100/pexels-photo-5764100.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
//   },
//   {
//     id: "2",
//     href: "/listing-stay-map",
//     name: "Sleep in a floating way",
//     taxonomy: "category",
//     count: 188288,
//     thumbnail:
//       "https://images.pexels.com/photos/2869499/pexels-photo-2869499.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
//   },
//   {
//     id: "3",
//     href: "/listing-stay-map",
//     name: "In the billionaire's house",
//     taxonomy: "category",
//     count: 188288,
//     thumbnail:
//       "https://images.pexels.com/photos/7031413/pexels-photo-7031413.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
//   },
//   {
//     id: "4",
//     href: "/listing-stay-map",
//     name: "Cool in the deep forest",
//     taxonomy: "category",
//     count: 188288,
//     thumbnail:
//       "https://images.pexels.com/photos/247532/pexels-photo-247532.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
//   },
//   {
//     id: "5",
//     href: "/listing-stay-map",
//     name: "In the billionaire's house",
//     taxonomy: "category",
//     count: 188288,
//     thumbnail:
//       "https://images.pexels.com/photos/7031413/pexels-photo-7031413.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
//   },
//   {
//     id: "6",
//     href: "/listing-stay-map",
//     name: "In the billionaire's house",
//     taxonomy: "category",
//     count: 188288,
//     thumbnail:
//       "https://images.pexels.com/photos/9828170/pexels-photo-9828170.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
//   },
//   {
//     id: "7",
//     href: "/listing-stay-map",
//     name: "Cool in the deep forest",
//     taxonomy: "category",
//     count: 188288,
//     thumbnail:
//       "https://images.pexels.com/photos/247532/pexels-photo-247532.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
//   },
// ];

// function PageHome() {
//   return (
//     <main className="nc-PageHome relative overflow-hidden">
//       {/* GLASSMOPHIN */}
//       <BgGlassmorphism />

//       <div className="container relative space-y-24 mb-24 lg:space-y-28 lg:mb-28">
//         {/* SECTION HERO */}
//         <SectionHero className="pt-10 lg:pt-16 lg:pb-16" />

//         {/* SECTION 1 */}
//         <SectionSliderNewCategories categories={DEMO_CATS} />

//         <SectionOurFeatures />

//         <SectionGridFeaturePlaces cardType="card2" />

//         <SectionHowItWork />

//         <div className="relative py-16">
//           <BackgroundSection className="bg-orange-50 dark:bg-black/20" />
//           <SectionSliderNewCategories
//             categories={DEMO_CATS_2}
//             categoryCardType="card4"
//             itemPerRow={4}
//             heading="Suggestions for discovery"
//             subHeading="Popular places to stay that Chisfis recommends for you"
//             sliderStyle="style2"
//           />
//         </div>

//         <SectionSubscribe2 />

//         <div className="relative py-16">
//           <BackgroundSection className="bg-orange-50 dark:bg-black dark:bg-opacity-20 " />
//           <SectionGridAuthorBox />
//         </div>

//         <SectionGridCategoryBox />

//         <div className="relative py-16">
//           <BackgroundSection />
//           <SectionBecomeAnAuthor />
//         </div>

//         <SectionSliderNewCategories
//           heading="Explore by types of stays"
//           subHeading="Explore houses based on 10 types of stays"
//           categoryCardType="card5"
//           itemPerRow={5}
//         />

//         <SectionVideos />

//         <div className="relative py-16">
//           <BackgroundSection />
//           <SectionClientSay />
//         </div>
//       </div>
//     </main>
//   );
// }

// export default PageHome;
// 'use client'
import React from 'react'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import BackgroundSection from '@/components/BackgroundSection'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import { TaxonomyType } from '@/data/types'
import SectionGridAuthorBox from '@/components/SectionGridAuthorBox'
import SectionGridCategoryBox from '@/components/SectionGridCategoryBox'
import SectionHero3 from '@/app/(server-components)/SectionHero3'
import CardCategory6 from '@/components/CardCategory6'
import SectionGridFeaturePlaces from '@/components/SectionGridFeaturePlaces'
import SectionGridFilterCard from './(experience-listings)/SectionGridFilterCard'
import { headers } from 'next/headers'
import sendEmail from '@/utils/email/sendMail'
import VarticalExperiencesCard from '@/components/cards/VarticalExperiencesCard'
import SectionGridVerticalCard from './(car-listings)/SectionGridVerticalCard'
import { signOut } from 'next-auth/react'

// import WellcomeTemplate from '@/components/email-templates/WellcomeTemplate'

const DEMO_CATS_2: TaxonomyType[] = [
	{
		id: '1',
		href: '/listing-stay',
		name: 'Enjoy the great cold',
		taxonomy: 'category',
		count: 188288,
		thumbnail:
			'https://images.pexels.com/photos/5764100/pexels-photo-5764100.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
	},
	{
		id: '222',
		href: '/listing-stay',
		name: 'Sleep in a floating way',
		taxonomy: 'category',
		count: 188288,
		thumbnail:
			'https://images.pexels.com/photos/2869499/pexels-photo-2869499.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	},
	{
		id: '3',
		href: '/listing-stay',
		name: "In the billionaire's house",
		taxonomy: 'category',
		count: 188288,
		thumbnail:
			'https://images.pexels.com/photos/7031413/pexels-photo-7031413.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	},
	{
		id: '4',
		href: '/listing-stay',
		name: 'Cool in the deep forest',
		taxonomy: 'category',
		count: 188288,
		thumbnail:
			'https://images.pexels.com/photos/247532/pexels-photo-247532.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	},
	{
		id: '5',
		href: '/listing-stay',
		name: "In the billionaire's house",
		taxonomy: 'category',
		count: 188288,
		thumbnail:
			'https://images.pexels.com/photos/7031413/pexels-photo-7031413.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	},
]

async function PageHome3() {
	// const response = await fetch('/api/send-email', {
	// 	method: 'POST',
	// 	body: JSON.stringify({ data: 'data' }),
	// })
	// console.log(response)
	// sendEmail({
	// 	to: 'skendoulmohamed@gmail.com',
	// 	subject: 'first email',
	// 	message: 'this is the first email data',
	// 	Template: <WellcomeTemplate />,
	// })
	// useEffect(() => {
	// 	function handleSubmit() {
	// 		const postData = async () => {
	// 			const data = {
	// 				title: 'title',
	// 				post: 'post',
	// 			}

	// 			const response = await fetch('/api/send-email', {
	// 				method: 'POST',
	// 			})
	// 			return response.json()
	// 		}
	// 		postData().then((data) => {
	// 			alert(data.message)
	// 		})
	// 	}

	// 	return () => {}
	// }, [])

	// const headersList = headers()
	// const host = headersList.get('host') || '' // e.g., sub.example.com
	// const parts = host.split('.')

	// // Check if the environment is local or production
	// const isLocalhost = process.env.NODE_ENV === 'development'

	// // Determine if there's a subdomain
	// const hasSubdomain = parts.length >= 2 // Subdomain exists if more than two parts

	// // Combine conditions into one variable
	// const subdomainStatus = isLocalhost || hasSubdomain
	// signOut()
	return (
		<main className="nc-PageHome3 relative overflow-hidden">
			{/* GLASSMOPHIN */}
			<BgGlassmorphism />
			{/* <SectionGridFilterCard className="pb-24 lg:pb-28" /> */}
			{/* SECTION HERO */}
			<div className="container mb-24 px-1 sm:px-4">
				<SectionHero3 className="" />
			</div>
			<div className="container relative mb-24 space-y-24">
				{/* SECTION 1 */}
				{/* <div className="grid grid-cols-12 gap-6">
					<div className="col-span-12 flex sm:col-span-6 lg:col-span-4">
						<CardCategory6 taxonomy={DEMO_CATS_2[0]} />
					</div>
					<div className="col-span-12 grid grid-rows-2 gap-6 sm:col-span-6 lg:col-span-4">
						<CardCategory6 taxonomy={DEMO_CATS_2[3]} />
						<CardCategory6 taxonomy={DEMO_CATS_2[1]} />
					</div>
					<div className="col-span-12 flex sm:col-span-6 lg:col-span-4">
						<CardCategory6 taxonomy={DEMO_CATS_2[4]} />
					</div>
				</div> */}
				{/* SECTION */}
				<SectionGridCategoryBox />

				{/* SECTION */}
				{/* <div className="relative py-16">
					<BackgroundSection />
					<SectionGridAuthorBox boxCard="box2" />
				</div> */}

				{/* <SectionGridFeaturePlaces /> */}
				<SectionGridFilterCard />

				{/* SECTION */}
				<SectionSubscribe2 />
				{/* <WellcomeTemplate /> */}
				{/* <VarticalExperiencesCard /> */}
				{/* <SectionGridVerticalCard /> */}
			</div>
		</main>
	)
}

export default PageHome3
