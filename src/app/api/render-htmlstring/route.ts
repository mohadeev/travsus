export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { bookingConfirmation } from '@/components/email-templates/bookingConfirmation/bookingConfirmation'
import { emailTemplatesFooter } from '@/components/email-templates/EmailTemplatesFooter'
import { newsletterWelcomeTemplate } from '@/components/email-templates/newsletterWelcomeTemplate/newsletterWelcomeTemplate'
import { thankyouEmailTemplate } from '@/components/email-templates/thank-you-email/thank-you-email'
import { generateInvoice } from '@/components/pdf-templates/generateInvoice'
import { generateReceipt } from '@/components/pdf-templates/generateReceipt'
import { NextResponse } from 'next/server'

import { Provider } from 'react-redux'

export async function GET() {
	const html = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
  <title></title>
  
    <style type="text/css">
      
      @media only screen and (min-width: 620px) {
        .u-row {
          width: 600px !important;
        }

        .u-row .u-col {
          vertical-align: top;
        }

        
            .u-row .u-col-50 {
              width: 300px !important;
            }
          

            .u-row .u-col-100 {
              width: 600px !important;
            }
          
      }

      @media only screen and (max-width: 620px) {
        .u-row-container {
          max-width: 100% !important;
          padding-left: 0px !important;
          padding-right: 0px !important;
        }

        .u-row {
          width: 100% !important;
        }

        .u-row .u-col {
          display: block !important;
          width: 100% !important;
          min-width: 320px !important;
          max-width: 100% !important;
        }

        .u-row .u-col > div {
          margin: 0 auto;
        }


        .u-row .u-col img {
          max-width: 100% !important;
        }

        .no-stack .u-col {
          min-width: 0 !important;
          display: table-cell !important;
        }

        
            .no-stack .u-col-50 {
              width: 50% !important;
            }
          

}
    
body{margin:0;padding:0}table,td,tr{border-collapse:collapse;vertical-align:top}p{margin:0}.ie-container table,.mso-container table{table-layout:fixed}*{line-height:inherit}a[x-apple-data-detectors=true]{color:inherit!important;text-decoration:none!important}


table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_1 .v-src-width { width: auto !important; } #u_content_image_1 .v-src-max-width { max-width: 65% !important; } #u_content_heading_1 .v-font-size { font-size: 22px !important; } #u_content_heading_2 .v-text-align { text-align: center !important; } #u_content_text_2 .v-container-padding-padding { padding: 0px 20px 20px !important; } #u_content_text_2 .v-text-align { text-align: center !important; } #u_content_heading_5 .v-text-align { text-align: center !important; } #u_content_text_9 .v-text-align { text-align: center !important; } #u_content_heading_6 .v-text-align { text-align: center !important; } #u_content_heading_3 .v-text-align { text-align: center !important; } #u_content_text_8 .v-text-align { text-align: center !important; } #u_content_heading_4 .v-text-align { text-align: center !important; } #u_content_text_10 .v-container-padding-padding { padding: 0px 20px 10px !important; } #u_content_button_1 .v-size-width { width: 50% !important; } }
    </style>
  
  

<!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Rubik:400,700&display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->

</head>

<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #eeeeee;color: #000000">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #eeeeee;width:100%" cellpadding="0" cellspacing="0">
  <tbody>
  <tr style="vertical-align: top">
    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #eeeeee;"><![endif]-->
    
  
  
<div class="u-row-container" style="padding: 0px;background-color: #34449a">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #34449a;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #34449a;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="background-color: #34449a;height: 100%;width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
  
<table id="u_content_image_1" style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:50px 10px 10px;font-family:'Rubik',sans-serif;" align="left">
        
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
      
      <img align="center" border="0" src="images/image-1.png" alt="email icon" title="email icon" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 50%;max-width: 290px;" width="290" class="v-src-width v-src-max-width"/>
      
    </td>
  </tr>
</table>

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_heading_1" style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 0px;font-family:'Rubik',sans-serif;" align="left">
        
  <!--[if mso]><table width="100%"><tr><td><![endif]-->
    <h1 class="v-text-align v-font-size" style="margin: 0px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Montserrat',sans-serif; font-size: 28px; font-weight: 400;"><strong>Order Confirmation</strong></h1>
  <!--[if mso]></td></tr></table><![endif]-->

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px 40px;font-family:'Rubik',sans-serif;" align="left">
        
  <div class="v-text-align v-font-size" style="font-size: 14px; color: #ecf0f1; line-height: 140%; text-align: center; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 18px; line-height: 25.2px;">24 Mar 2022</span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #eeeeee;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="background-color: #eeeeee;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
<table id="u_content_heading_2" style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:35px 30px 0px;font-family:'Rubik',sans-serif;" align="left">
        
  <!--[if mso]><table width="100%"><tr><td><![endif]-->
    <h1 class="v-text-align v-font-size" style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Rubik',sans-serif; font-size: 18px; font-weight: 400;"><strong>Hi Mark Henry!</strong></h1>
  <!--[if mso]></td></tr></table><![endif]-->

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_text_2" style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px 30px 20px;font-family:'Rubik',sans-serif;" align="left">
        
  <div class="v-text-align v-font-size" style="font-size: 14px; line-height: 170%; text-align: left; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 170%;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="300" style="background-color: #eeeeee;width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-50" style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
  <div style="background-color: #eeeeee;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
<table style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:'Rubik',sans-serif;" align="left">
        
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
      
      <img align="center" border="0" src="images/image-2.png" alt="Model" title="Model" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 201px;" width="201" class="v-src-width v-src-max-width"/>
      
    </td>
  </tr>
</table>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="300" style="background-color: #eeeeee;width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-50" style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
  <div style="background-color: #eeeeee;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
<table id="u_content_heading_5" style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:33px 10px 0px;font-family:'Rubik',sans-serif;" align="left">
        
  <!--[if mso]><table width="100%"><tr><td><![endif]-->
    <h1 class="v-text-align v-font-size" style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Rubik',sans-serif; font-size: 18px; font-weight: 400;"><strong>Product Name</strong></h1>
  <!--[if mso]></td></tr></table><![endif]-->

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_text_9" style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px 10px;font-family:'Rubik',sans-serif;" align="left">
        
  <div class="v-text-align v-font-size" style="font-size: 14px; line-height: 170%; text-align: left; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 170%;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_heading_6" style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 32px;font-family:'Rubik',sans-serif;" align="left">
        
  <!--[if mso]><table width="100%"><tr><td><![endif]-->
    <h1 class="v-text-align v-font-size" style="margin: 0px; color: #ba372a; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Rubik',sans-serif; font-size: 18px; font-weight: 400;">Price: <strong> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;$69.99</strong></h1>
  <!--[if mso]></td></tr></table><![endif]-->

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="300" style="background-color: #eeeeee;width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-50" style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
  <div style="background-color: #eeeeee;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
<table style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px 5px 15px;font-family:'Rubik',sans-serif;" align="left">
        
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
      
      <img align="center" border="0" src="images/image-3.png" alt="Model" title="Model" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 201px;" width="201" class="v-src-width v-src-max-width"/>
      
    </td>
  </tr>
</table>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="300" style="background-color: #eeeeee;width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-50" style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
  <div style="background-color: #eeeeee;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
<table id="u_content_heading_3" style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:33px 10px 0px;font-family:'Rubik',sans-serif;" align="left">
        
  <!--[if mso]><table width="100%"><tr><td><![endif]-->
    <h1 class="v-text-align v-font-size" style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Rubik',sans-serif; font-size: 18px; font-weight: 400;"><strong>Product Name</strong></h1>
  <!--[if mso]></td></tr></table><![endif]-->

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_text_8" style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px 10px;font-family:'Rubik',sans-serif;" align="left">
        
  <div class="v-text-align v-font-size" style="font-size: 14px; line-height: 170%; text-align: left; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 170%;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_heading_4" style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 42px;font-family:'Rubik',sans-serif;" align="left">
        
  <!--[if mso]><table width="100%"><tr><td><![endif]-->
    <h1 class="v-text-align v-font-size" style="margin: 0px; color: #ba372a; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Rubik',sans-serif; font-size: 18px; font-weight: 400;">Price: <strong> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;$50.00</strong></h1>
  <!--[if mso]></td></tr></table><![endif]-->

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row no-stack" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="299" style="background-color: #ffffff;width: 299px;padding: 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-50" style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
  <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 0px solid transparent;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
<table style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:15px 10px;font-family:'Rubik',sans-serif;" align="left">
        
  <!--[if mso]><table width="100%"><tr><td><![endif]-->
    <h1 class="v-text-align v-font-size" style="margin: 0px; color: #ba372a; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Rubik',sans-serif; font-size: 18px; font-weight: 400;"><strong>Total Price:</strong></h1>
  <!--[if mso]></td></tr></table><![endif]-->

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="299" style="background-color: #ffffff;width: 299px;padding: 0px;border-top: 1px solid #CCC;border-left: 0px solid transparent;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-50" style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
  <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 1px solid #CCC;border-left: 0px solid transparent;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
<table style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:15px 10px;font-family:'Rubik',sans-serif;" align="left">
        
  <!--[if mso]><table width="100%"><tr><td><![endif]-->
    <h1 class="v-text-align v-font-size" style="margin: 0px; color: #ba372a; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Rubik',sans-serif; font-size: 18px; font-weight: 400;"><strong>$119.99</strong></h1>
  <!--[if mso]></td></tr></table><![endif]-->

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #eeeeee;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="background-color: #eeeeee;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
<table style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:25px 10px 5px;font-family:'Rubik',sans-serif;" align="left">
        
  <!--[if mso]><table width="100%"><tr><td><![endif]-->
    <h1 class="v-text-align v-font-size" style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Rubik',sans-serif; font-size: 18px; font-weight: 400;"><strong>Need Help</strong></h1>
  <!--[if mso]></td></tr></table><![endif]-->

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_text_10" style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px 70px 10px;font-family:'Rubik',sans-serif;" align="left">
        
  <div class="v-text-align v-font-size" style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 140%;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.</p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_button_1" style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 30px;font-family:'Rubik',sans-serif;" align="left">
        
  <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
<div class="v-text-align" align="center">
  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.unlayer.com" style="height:37px; v-text-anchor:middle; width:174px;" arcsize="11%"  stroke="f" fillcolor="#ba372a"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
    <a href="https://www.unlayer.com" target="_blank" class="v-button v-size-width v-font-size" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #ba372a; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:30%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
      <span style="display:block;padding:10px 20px;line-height:120%;"><span style="font-size: 14px; line-height: 16.8px;">Contact Us</span></span>
    </a>
    <!--[if mso]></center></v:roundrect><![endif]-->
</div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: #34449a">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #34449a;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #34449a;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="background-color: #34449a;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
  
<table style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 10px;font-family:'Rubik',sans-serif;" align="left">
        
<div align="center" style="direction: ltr;">
  <div style="display: table; max-width:187px;">
  <!--[if (mso)|(IE)]><table width="187" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:187px;"><tr><![endif]-->
  
    
    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
    <table border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px">
      <tbody><tr style="vertical-align: top"><td valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <a href="https://facebook.com/" title="Facebook" target="_blank">
          <img src="images/image-4.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
        </a>
      </td></tr>
    </tbody></table>
    <!--[if (mso)|(IE)]></td><![endif]-->
    
    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
    <table border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px">
      <tbody><tr style="vertical-align: top"><td valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <a href="https://twitter.com/" title="Twitter" target="_blank">
          <img src="images/image-5.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
        </a>
      </td></tr>
    </tbody></table>
    <!--[if (mso)|(IE)]></td><![endif]-->
    
    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 15px;" valign="top"><![endif]-->
    <table border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px">
      <tbody><tr style="vertical-align: top"><td valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <a href="https://instagram.com/" title="Instagram" target="_blank">
          <img src="images/image-6.png" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
        </a>
      </td></tr>
    </tbody></table>
    <!--[if (mso)|(IE)]></td><![endif]-->
    
    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
    <table border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
      <tbody><tr style="vertical-align: top"><td valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <a href="https://youtube.com/" title="YouTube" target="_blank">
          <img src="images/image-7.png" alt="YouTube" title="YouTube" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
        </a>
      </td></tr>
    </tbody></table>
    <!--[if (mso)|(IE)]></td><![endif]-->
    
    
    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
  </div>
</div>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 40px;font-family:'Rubik',sans-serif;" align="left">
        
  <div class="v-text-align v-font-size" style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 140%;">2261 Market Street #4667 San Francisco, CA 94114</p>
<p style="font-size: 14px; line-height: 140%;">All rights reserved. &nbsp;Company No. 94114</p>
<p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
<p style="font-size: 14px; line-height: 140%;">Preferences | Unsubscribe &nbsp;| View in browser</p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    </td>
  </tr>
  </tbody>
  </table>
  <!--[if mso]></div><![endif]-->
  <!--[if IE]></div><![endif]-->
</body>

</html>

  `

	const invoiceHtml = await generateInvoice(bookingData)
	const receiptHtml = await generateReceipt(bookingData)
	const bookingConfirmationHtml = await bookingConfirmation(bookingData)
	const data = await newsletterWelcomeTemplate({})
	return new NextResponse(data, {
		status: 200,
		headers: {
			'Content-Type': 'text/html',
		},
	})
}

const bookingData: any = {
	accommodation: {
		Standard: {
			single: { adult: 3, child: 3 },
			twin: { adult: 3, child: 2 },
			couple: { adult: 3, child: 2 },
		},
		Luxury: {
			single: { adult: 2, child: 2 },
			twin: { adult: 0, child: 0 },
			couple: { adult: 0, child: 0 },
		},
	},
	guests: null,
	bookingStates: [
		{
			state: 'initiated',
			by: 'customer',
			createdAt: '2024-12-06T21:20:44.963Z',
			updatedAt: '2024-12-06T21:20:44.963Z',
		},
	],
	lineItems: [
		{
			description: 'accommodation',
			unitPrice: 37,
			totalPrice: 1110,
			totalGuests: 30,
			serviceQuantity: 1,
			includeInTotal: true,
			currency: 'EUR',
		},
		{
			description: 'transport',
			unitPrice: 26.67,
			totalPrice: 800,
			totalGuests: 30,
			serviceQuantity: 1,
			includeInTotal: true,
			currency: 'EUR',
		},
		{
			description: 'tax',
			unitPrice: 401.1,
			totalPrice: 401.1,
			totalGuests: 1,
			serviceQuantity: 1,
			includeInTotal: true,
			currency: 'EUR',
		},
	],
	selectedDate: { startDate: 1736204400000, endDate: 1736377200000 },
	id: '67536aad31dcd195d35de04f',
	customerId: '673a1768ec99ae645fc474a9',
	providerId: '673a1768ec99ae645fc474a9',
	tourId: '631e46a1027691bd18f0cfdd',
	duration: 10,
	services: [],
	createdAt: '2024-12-06T21:20:44.968Z',
	updatedAt: '2024-12-06T21:21:24.595Z',
	bookOwnHotels: false,
	bookingState: 'initiated',
	pricePerSeat: null,
	serviceCharge: null,
	subtotal: null,
	totalPrice: null,
	paymentIntentId: 'pi_3QT8xjI438knnysQ1oWl6Boc',
	orderNumber: 'TR-1000000029',
	receiptNumber: 'REC-1000000029',
	invoiceNumber: 'INV-1000000029',
	bookingReference: 'TRVS-24-1000000029',
	paymentMethodId: '673a2c6eec99ae645fc47508',
	customer: {
		id: '673a1768ec99ae645fc474a9',
		email: 'skendoulmohamed@gmail.com',
		username: 'Mohamed Skendoul',
		name: null,
		phone: '+33434324423',
		password: '$2b$10$CZ.MUTGAa4HoUKgE70poKuuP.hIqS/bsDCkDwol6F0FnhUgEUAche',
		senders: {},
		date: '2024-11-17T16:18:48.173Z',
		library: {},
		accountData: {
			lastname: 'Skendoul ',
			firstname: 'Mohamed ',
			gender: 'Male',
			dateOfBirth: '',
			address: '',
			about: '',
		},
		createdAt: '2024-11-17T16:18:48.173Z',
		updatedAt: '2024-12-07T03:39:05.874Z',
		savedList: ['631e46a1027691bd18f0cfdd'],
		passwordResetToken:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNrZW5kb3VsbW9oYW1lZEBnbWFpbC5jb20iLCJleHAiOjE3MzMxMTQ2NDksImlhdCI6MTczMzAyODI0OX0.Xa0FvC4DflvQh1Nuw8wlSAGPB4JsJ7Mg2ivhEFFtksE',
		passwordResetTokens: [
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNrZW5kb3VsbW9oYW1lZEBnbWFpbC5jb20iLCJleHAiOjE3MzI2NjMxNTMsImlhdCI6MTczMjU3Njc1M30.kFEHWwIKnnKzhA_iEnjm77tKPPWjZsnJfIiYppiVrDU',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNrZW5kb3VsbW9oYW1lZEBnbWFpbC5jb20iLCJleHAiOjE3MzI2NjMxNTMsImlhdCI6MTczMjU3Njc1M30.kFEHWwIKnnKzhA_iEnjm77tKPPWjZsnJfIiYppiVrDU',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNrZW5kb3VsbW9oYW1lZEBnbWFpbC5jb20iLCJleHAiOjE3MzI3MzA2MTEsImlhdCI6MTczMjY0NDIxMX0.OgCRN8Wir8eseBSQ58qN2xCtq6dIE2KyXWJldCw5I0s',
		],
		passwordHistory: [
			'$2b$10$6ThL2PUZ9i/zFyQI7GDx5uabNe2SBp5yojtVFEws5LBzZ/xnNBS.e',
			'$2b$10$rQ.GG2r3CnRlS23SCcmxkeUHtJbpm92x1SWDL0a69S6ysMC0St50y',
			'$2b$10$CZ.MUTGAa4HoUKgE70poKuuP.hIqS/bsDCkDwol6F0FnhUgEUAche',
		],
		passwordResetTokenExpiry: '2024-12-02T04:44:09.000Z',
		addressId: null,
		profileImage: {
			url: 'https://res.cloudinary.com/travsus/image/upload/v1731863696/hzydcgxjw8pxk59qc5qh.png',
			public_id: 'hzydcgxjw8pxk59qc5qh',
		},
		stripeCustomerId: 'cus_REfwxQCEd8ze0x',
		emailVerified: false,
		verificationLinkToken: null,
		verificationCodeToken: null,
		verificationTokenExpiry: null,
		verificationCode: null,
		verificationCodeExpiry: null,
	},
	provider: {
		id: '673a1768ec99ae645fc474a9',
		email: 'skendoulmohamed@gmail.com',
		username: 'Mohamed Skendoul',
		name: null,
		phone: '+33434324423',
		password: '$2b$10$CZ.MUTGAa4HoUKgE70poKuuP.hIqS/bsDCkDwol6F0FnhUgEUAche',
		senders: {},
		date: '2024-11-17T16:18:48.173Z',
		library: {},
		accountData: {
			lastname: 'Skendoul ',
			firstname: 'Mohamed ',
			gender: 'Male',
			dateOfBirth: '',
			address: '',
			about: '',
		},
		createdAt: '2024-11-17T16:18:48.173Z',
		updatedAt: '2024-12-07T03:39:05.874Z',
		savedList: ['631e46a1027691bd18f0cfdd'],
		passwordResetToken:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNrZW5kb3VsbW9oYW1lZEBnbWFpbC5jb20iLCJleHAiOjE3MzMxMTQ2NDksImlhdCI6MTczMzAyODI0OX0.Xa0FvC4DflvQh1Nuw8wlSAGPB4JsJ7Mg2ivhEFFtksE',
		passwordResetTokens: [
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNrZW5kb3VsbW9oYW1lZEBnbWFpbC5jb20iLCJleHAiOjE3MzI2NjMxNTMsImlhdCI6MTczMjU3Njc1M30.kFEHWwIKnnKzhA_iEnjm77tKPPWjZsnJfIiYppiVrDU',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNrZW5kb3VsbW9oYW1lZEBnbWFpbC5jb20iLCJleHAiOjE3MzI2NjMxNTMsImlhdCI6MTczMjU3Njc1M30.kFEHWwIKnnKzhA_iEnjm77tKPPWjZsnJfIiYppiVrDU',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNrZW5kb3VsbW9oYW1lZEBnbWFpbC5jb20iLCJleHAiOjE3MzI3MzA2MTEsImlhdCI6MTczMjY0NDIxMX0.OgCRN8Wir8eseBSQ58qN2xCtq6dIE2KyXWJldCw5I0s',
		],
		passwordHistory: [
			'$2b$10$6ThL2PUZ9i/zFyQI7GDx5uabNe2SBp5yojtVFEws5LBzZ/xnNBS.e',
			'$2b$10$rQ.GG2r3CnRlS23SCcmxkeUHtJbpm92x1SWDL0a69S6ysMC0St50y',
			'$2b$10$CZ.MUTGAa4HoUKgE70poKuuP.hIqS/bsDCkDwol6F0FnhUgEUAche',
		],
		passwordResetTokenExpiry: '2024-12-02T04:44:09.000Z',
		addressId: null,
		profileImage: {
			url: 'https://res.cloudinary.com/travsus/image/upload/v1731863696/hzydcgxjw8pxk59qc5qh.png',
			public_id: 'hzydcgxjw8pxk59qc5qh',
		},
		stripeCustomerId: 'cus_REfwxQCEd8ze0x',
		emailVerified: false,
		verificationLinkToken: null,
		verificationCodeToken: null,
		verificationTokenExpiry: null,
		verificationCode: null,
		verificationCodeExpiry: null,
	},
	tour: {
		pricingTiers: [
			{
				minSeats: 1,
				maxSeats: 5,
				pricing: { pricePerDay: 150, totalPrice: 450, currency: 'EUR' },
			},
			{
				minSeats: 6,
				maxSeats: 9,
				pricing: { pricePerDay: 166.67, totalPrice: 500, currency: 'EUR' },
			},
			{
				minSeats: 10,
				maxSeats: 19,
				pricing: { pricePerDay: 200, totalPrice: 600, currency: 'EUR' },
			},
			{
				minSeats: 20,
				maxSeats: 40,
				pricing: { pricePerDay: 266.67, totalPrice: 800, currency: 'EUR' },
			},
		],
		accommodations: [
			{
				name: 'Luxury',
				description: 'Experience ultimate comfort and elegance',
				pricingTiers: [
					{
						name: 'Luxury',
						minSeats: 1,
						maxSeats: 4,
						bedOptions: [
							{
								bedType: 'TWIN',
								maxOccupancy: 2,
								basePrice: 100,
								currency: 'EUR',
							},
							{
								bedType: 'SINGLE',
								maxOccupancy: 1,
								basePrice: 50,
								currency: 'EUR',
							},
							{
								bedType: 'COUPLE',
								maxOccupancy: 2,
								basePrice: 100,
								currency: 'EUR',
							},
						],
					},
				],
			},
			{
				name: 'Standard',
				description: 'Comfortable and affordable accommodation',
				pricingTiers: [
					{
						name: 'Standard',
						minSeats: 1,
						maxSeats: 4,
						bedOptions: [
							{
								bedType: 'TWIN',
								maxOccupancy: 2,
								basePrice: 70,
								currency: 'EUR',
							},
							{
								bedType: 'SINGLE',
								maxOccupancy: 1,
								basePrice: 35,
								currency: 'EUR',
							},
							{
								bedType: 'COUPLE',
								maxOccupancy: 2,
								basePrice: 70,
								currency: 'EUR',
							},
						],
					},
				],
			},
		],
		id: '631e46a1027691bd18f0cfdd',
		creatorId: '673a1768ec99ae645fc474a9',
		businessId: '673a18ddec99ae645fc474b2',
		name: '3 Days Sahara Desert Tour from Marrakech to Merzouga Desert Dunes ',
		subtitle: '3 Days Marrakech Trip from To Merzouga Dunes',
		overview:
			'The 3 Days Sahara Desert Tour from Marrakech to Merzouga Desert Dunes takes you through the spectacular High Atlas Mountains, kasbahs, spice markets, and cities pulsing with energy. Walk the cliffs of Dades- Tadra Gorges and travel to each destination in the comfort of an air-conditioned private vehicle. Climb onto a camel and explore the edge of the Sahara before admiring the views from the heights of the Atlas Mountains..\n\nIn Merzouga, you will see the first dunes, undisturbed sand hills, and infinite spaces subject to the sun and wind. In turns their color becomes pink, ocher, and reddish subject to the dazzling sun, they mesmerize the onlookers ... A divine show which calls for contemplation. The activities available in the Merzouga Sahara Desert are up to the grandeur of the place. Hiking, Quad biking, or camel riding, night in a Hotel at the dunes line or in bivouacs in Berber or luxury tents will make your experience unforgettable. At the heart of the Sahara, it is time for meditation and relaxation. Revel in the healing virtues of sand dunes. Take a dive and experience the healing powers of sand baths and let yourself be carried away by the total feeling of well-being. Untouched by the constraints of time and space, alone in a silent and pure open land, Merzouga Sahara Desert is simply subjugating.',
		productCategory: null,
		slug: null,
		images: [
			{
				public_id: 'cysxlmxlumy6oyjwfxha',
				url: 'http://res.cloudinary.com/travsus/image/upload/v1728822103/cysxlmxlumy6oyjwfxha.jpg',
			},
			{
				url: 'http://res.cloudinary.com/travsus/image/upload/v1728822103/cysxlmxlumy6oyjwfxha.jpg',
				public_id: 'cysxlmxlumy6oyjwfxha',
			},
			{
				url: 'http://res.cloudinary.com/travsus/image/upload/v1728822103/cysxlmxlumy6oyjwfxha.jpg',
				public_id: 'cysxlmxlumy6oyjwfxha',
			},
			{
				url: 'http://res.cloudinary.com/travsus/image/upload/v1728822103/cysxlmxlumy6oyjwfxha.jpg',
				public_id: 'cysxlmxlumy6oyjwfxha',
			},
			{
				url: 'http://res.cloudinary.com/travsus/image/upload/v1728822103/cysxlmxlumy6oyjwfxha.jpg',
				public_id: 'cysxlmxlumy6oyjwfxha',
			},
			{
				url: 'http://res.cloudinary.com/travsus/image/upload/v1728822103/cysxlmxlumy6oyjwfxha.jpg',
				public_id: 'cysxlmxlumy6oyjwfxha',
			},
		],
		people: [],
		services: [],
		places: [],
		highlights: [
			{ name: ' Cross the High Atlas Mountains with its pass of Tizi Ntichka' },
			{
				name: ' Visit the legendary world heritage site of Kasbah Ait Ben Haddou',
			},
			{ name: ' Climb up to Dades canyons' },
			{ name: ' Visit Todra gorges and Tinghir oasis' },
			{
				name: ' Ride a camel in Erg Chebbi to watch the colour changing sunset',
			},
		],
		days: [
			{
				name: 'Day 1: Marrakech to Dades Valley 330km / 7hr drive',
				descreption: null,
				description:
					'Pick up at 08 am from your Riad or any point of your choice, starting your 3 Days Sahara Desert Tour from Marrakech to Merzouga Desert Dunes, and crossing the Tizi N Tichka pass of the High Atlas Mountains(2260m) enjoying the mountainous road and the spectacular Berber villages, to reach the UNESCO world heritage site "Ait Benhaddou village", the fortified ksar with its beautiful Kasbahs. Ait Benhaddou has served as a natural scenery for many movie producers. You will go on a walk with a local guide crossing the river to the other side to discover The Ksar and climb to the top of the hill through the alleys of Ait-ben-Haddou, which is like rambling through the middle ages for an amazing view of the fertile Ounila river valley, surrounded by desertic landscape, and with the snow-capped Atlas mountains as a background, the view from the top seems to encompass the whole world. After Lunch, we will continue to Dades Gorge via Ouarzazate and Skoura and the long Valley of roses (the season of roses is in late May). Upon arrival at Boumalne Dades, we will deviate into a secondary road heading up through Dades Gorges. From here, we will enjoy beautiful Rock formations (Called the monkey feet) and fortified Kasbahs scenery along the Dades River, with the sunset as a backdrop. After a stop at the canyons for a drink or to admire the majestic scenery, we continue to our hotel. Dinner and overnight',
			},
			{
				name: 'Day 2: Dades Valley to Merzouga Sahara Desert 270km / 5hr drive',
				descreption: null,
				description:
					'Your 3 Days Sahara Desert Tour from Marrakech to Merzouga Desert Dunes adventure continues after a traditional Breakfast, taking the road of 1000 kasbahs drive around the colorful Berber villages of the Dades valley, to get to Tineghir A beautiful valley of 15 km of date palms ending with spectacular Gorges, often used for rock climbing. The road to the Gorge of Todra passes green palmeraies and Berber villages, where we go on a trek along the canyons about 300m high. Afterward, we will head to Erg Chebbi dunes in the Merzouga Sahara Desert and you will have time for lunch in Tinjdad or Touroug, depending on your hunger meter. Once you arrive at the dunes of Erg Chebbi, a small offroad takes you to the edge of the golden dunes where camels are waiting for you, the luggage will be loaded in a 4x4 car and transported to the camp, and you can enjoy a beautiful camel ride over the sand dunes and watch a majestic Sahara sunset on your way to the camp. After reaching your destination, you will be greeted with tea and smiles. You will be shown your beautiful comfortable private tents equipped with ensuite bathrooms and showers to relax and settle before dinner time. After a delicious meal, a fire will be lit and a festive ambiance takes over with musical plays by the staff and cameleers under the starry night of the desert!',
			},
			{
				name: 'Day 3: Merzouga - Marrakech 567km/ 10hr drive',
				descreption: null,
				description:
					'An early wake up to enjoy the sunrise over the highest dunes of Erg Chebbi in Merzouga one of the best moments of the desert, afterwards you will have breakfast in the camp, pack and go back either on camels or by 4x4 leaving the dunes behind. Back on the asphalt roads, you will drive to Marrakech through Alnif, Tazarine, Draa Valley, Agdez, and Ouarzazate. In Ouarzazate, we will have free time for lunch and a photo stop in front of the famous Taourirt Kasbah. Afterward, we will continue to Marrakech, where your Merzouga desert experience ends. Crossing again the Atlas Mountains and the Berber villages between Ouarzazate and Marrakech. Drop off at your accommodation.',
			},
		],
		paths: [],
		price: '500',
		discount: null,
		start: { id: '631beb608d3728d32dde881c', name: 'Marrakech' },
		end: { id: '631beb608d3728d32dde881c', name: 'Marrakech' },
		reviews: [],
		lang: 'EN',
		tourfor: '',
		updated: true,
		conclusion: null,
		tags: [],
		keyphrase: [],
		createdAt: '2022-09-11T20:35:45.447Z',
		updatedAt: '2024-12-01T20:42:25.783Z',
		addressId: '67118213fd3f8157911b9bcc',
	},
	paymentMethod: {
		id: '673a2c6eec99ae645fc47508',
		userId: '673a1768ec99ae645fc474a9',
		stripePaymentMethodId: 'pm_1QMCa2I438knnysQwJcdXVuL',
		type: null,
		last4: '4242',
		brand: 'visa',
		exp_month: 11,
		exp_year: 2029,
		cardHolder: null,
		createdAt: '2024-11-17T17:48:30.156Z',
		updatedAt: '2024-11-17T17:48:30.156Z',
		billingAddressLine1: null,
		billingAddressLine2: null,
		billingCity: null,
		billingState: null,
		billingPostalCode: null,
		billingCountry: null,
	},
}
