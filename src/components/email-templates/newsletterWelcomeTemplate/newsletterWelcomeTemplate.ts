import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'
import { EmailText } from '../EmailText'
import { EmailBlackButton } from '../EmailBlackButton'

// Newsletter Header Media Component
const newsletterHeaderMedia = `
<div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
  <img src="https://example.com/newsletter-header.jpg" alt="Newsletter Welcome" style="max-width: 100%; height: auto;">
</div>
`

// Featured Article Card Component
const featuredArticleCard = `
<div style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; margin: 20px 0;">
  <img src="https://example.com/featured-article-image.jpg" alt="Featured Article" style="width: 100%; height: auto;">
  <div style="padding: 15px;">
    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Exciting New Trends in Our Industry</h3>
    <p style="font-size: 14px; color: #666;">Discover the latest innovations and insights that are shaping the future of our field. Don't miss out on this game-changing information!</p>
  </div>
</div>
`

export const newsletterWelcomeTemplate = (data: any) => `
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
    </style>
</head>

<body style="margin: 0; background-color: #fff; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<div style="max-width: 500px; margin: 0 auto;">
    ${emailTemplatesHeader()}
    ${newsletterHeaderMedia}
    ${EmailText('📬 Welcome to Our Newsletter 🎉', 'color: rgb(0, 0, 0); font-size: 50px; line-height: 54px; font-weight: bold;')}
    ${EmailText('Thank you for subscribing! Get ready for exclusive content, insider tips, and the latest updates delivered straight to your inbox. 🚀📚💡 Exciting insights await!', '')}
    ${EmailBlackButton('Explore Our Content', 'https://www.example.com/blog')}
    ${EmailText('Featured Articles Just for You:', 'font-size: 20px; font-weight: 600;')}
    ${featuredArticleCard}
    ${EmailBlackButton('Read More', 'https://www.example.com/featured-articles')}
    ${emailTemplatesFooter()}
</div>
</body>

</html>
`
