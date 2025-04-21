import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'
import { EmailText } from '../EmailText'
import { EmailBlackButton } from '../EmailBlackButton'
import { PrismaClient } from '@prisma/client'
import { slugify } from '@/utils/slugify'

const prisma = new PrismaClient()

// Newsletter Header Media Component using table
const newsletterHeaderMedia = `
<table border="0" cellpadding="0" cellspacing="0" width="100%">
  <tr>
    <td style="background-color: #f0f0f0; padding: 20px; text-align: center;">
      <img src="https://example.com/newsletter-header.jpg" alt="Newsletter Welcome" style="max-width: 100%; height: auto;">
    </td>
  </tr>
</table>
`

// Function to create a post card component using tables for email compatibility
const createPostCard = (post: any) => {
	const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.id}?name=${slugify(post.title)}`

	return `
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e0e0e0; border-radius: 8px; margin: 20px 0; overflow: hidden;">
  <tr>
    <td style="padding: 0;">
      <a href="${postUrl}" target="_blank" style="text-decoration: none; color: inherit; display: block;">
        <img src="${post.featuredImage || 'https://example.com/default-image.jpg'}" alt="${post.title}" style="width: 100%; height: auto; display: block; border-top-left-radius: 8px; border-top-right-radius: 8px;">
      </a>
    </td>
  </tr>
  <tr>
    <td style="padding: 15px;">
      <a href="${postUrl}" target="_blank" style="text-decoration: none; color: inherit;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td>
              <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #000000;">${post.title}</h3>
            </td>
          </tr>
          <tr>
            <td>
              <p style="font-size: 14px; color: #000000;">${post.excerpt}</p>
            </td>
          </tr>
        </table>
      </a>
    </td>
  </tr>
</table>
`
}

// Featured Article Card Component (kept as fallback) using tables
const featuredArticleCard = `
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e0e0e0; border-radius: 8px; margin: 20px 0; overflow: hidden;">
  <tr>
    <td style="padding: 0;">
      <a href="https://www.travsus.com/blog" target="_blank" style="text-decoration: none; color: inherit; display: block;">
        <img src="https://example.com/featured-article-image.jpg" alt="Featured Article" style="width: 100%; height: auto; display: block; border-top-left-radius: 8px; border-top-right-radius: 8px;">
      </a>
    </td>
  </tr>
  <tr>
    <td style="padding: 15px;">
      <a href="https://www.travsus.com/blog" target="_blank" style="text-decoration: none; color: inherit;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td>
              <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #000000;">Exciting New Trends in Our Industry</h3>
            </td>
          </tr>
          <tr>
            <td>
              <p style="font-size: 14px; color: #000000;">Discover the latest innovations and insights that are shaping the future of our field. Don't miss out on this game-changing information!</p>
            </td>
          </tr>
        </table>
      </a>
    </td>
  </tr>
</table>
`

export const newsletterWelcomeTemplate = async (data: any) => {
	// Fetch posts from database
	let firstPost = null
	let additionalPosts = []

	try {
		// Fetch 3 most recent posts
		const posts = await prisma.post.findMany({
			take: 3,
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				author: true,
			},
		})

		if (posts.length > 0) {
			firstPost = posts[0]
			additionalPosts = posts.slice(1, 3)
		}
	} catch (error) {
		console.error('Error fetching posts for newsletter:', error)
	}

	return `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!--><!--<![endif]-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <style>
    * {
        margin-block-start: 0;
        margin-block-end: 0;
        margin-inline-start: 0;
        margin-inline-end: 0;
        font-weight: normal;
        unicode-bidi: normal;
        font-family: Helvetica, Arial, sans-serif;
    }
    a {
        text-decoration: none;
        color: inherit;
    }
    </style>
</head>

<body style="margin: 0; background-color: #fff; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
  <tr>
    <td>
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; margin: 0 auto;">
        <tr>
          <td>
            ${emailTemplatesHeader()}
            ${newsletterHeaderMedia}
            ${EmailText('📬 Welcome to Our Newsletter 🎉', 'color: rgb(0, 0, 0); font-size: 50px; line-height: 54px; font-weight: bold;')}
            ${EmailText('Thank you for subscribing! Get ready for exclusive content, insider tips, and the latest updates delivered straight to your inbox. 🚀📚💡 Exciting insights await!', '')}
            
            ${EmailText('Latest from Our Blog:', 'font-size: 20px; font-weight: 600;')}
            ${firstPost ? createPostCard(firstPost) : featuredArticleCard}
            ${EmailBlackButton('Read More', firstPost ? `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${firstPost.id}?name=${slugify(firstPost.title)}` : 'https://www.travsus.com/blog')}
            
            ${EmailText('Featured Articles Just for You:', 'font-size: 20px; font-weight: 600;')}
            ${additionalPosts.length > 0 ? additionalPosts.map((post) => createPostCard(post)).join('') : featuredArticleCard}
            ${EmailBlackButton('Explore Our Blog', 'https://www.travsus.com/blog')}
            
            ${emailTemplatesFooter()}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>

</html>
`
}
