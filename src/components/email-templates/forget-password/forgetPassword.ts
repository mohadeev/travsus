import { emailTemplatesFooter } from "../EmailTemplatesFooter"
import { emailTemplatesHeader } from "../EmailTemplatesHeader"

export const forgetPassword = (data:any)=> {
  return(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password</title>
  </head>
  <body style="background-color: #fff; color: #000; margin: 0; padding: 0; font-family: Arial, sans-serif;">

    <!-- Header Section -->
   ${emailTemplatesHeader}
    <!-- Main Content Section -->
    <div style="max-width: 500px; margin: 20px auto; padding: 10px;">
      <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
        Hello {{email}},
        <br /><br />
        Please click on the link below <b>within 24 hours</b> to reset your Travsus password.
        <br /><br />
        <a href="{{restLink}}" style="font-size: 16px; color: #fff; cursor: pointer; background-color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 20px;">Reset your Password</a>
        <br /><br />
        Once you reset your password, you will be signed in and able to enter the member-only area you tried to access.
        <br /><br />
        If you have any problems with this link, please visit the Travsus Help Center for more information.
        <br /><br />
        Happy travels,
        <br /><br />
          The Travsus Support Team
        <br />
        <a href=${process.env.NEXT_PUBLIC_SITE_URL} style="color: #000;">https://www.travsus.com</a>
      </p>
    </div>

    <!-- Footer Section -->
   ${emailTemplatesFooter}
  </body>
</html>`

)
}