import { welcomeHeaderMedia } from '../WelcomeHeaderMedia'
import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'
import { werticalExperienceCard } from '../VerticalExperienceCard'
import { EmailText } from '../EmailText'
import { EmailBlackButton } from '../EmailBlackButton'
export const welcomeTemplate = (data: any) => `
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
*{
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
<div style="max-width: 500px; margin:  0 auto;">
${emailTemplatesHeader} 
${welcomeHeaderMedia}  
${EmailText('🌍 Your journey begins now, {{name}}! ✨', 'color: rgb(0, 0, 0);  font-size: 50px; line-height: 54px; font-weight: bold;')}
${EmailText('🎉 Welcome to the Travsus community! Get ready for travel inspiration straight to your inbox and curated recommendations from passionate travelers. ✨✈️🗺️ Exciting adventures are just around the corner!', '')}
${EmailBlackButton('Start exploring!', 'https://www.travsus.com/')} 
${EmailText('Adventure Awaits: Explore Diverse Experiences!', 'font-size: 20px; font-weight: 600;')}
${werticalExperienceCard}  
${EmailBlackButton('See all!', 'https://www.travsus.com/')} 

${emailTemplatesFooter()}
</div>
</body>

</html>
`
