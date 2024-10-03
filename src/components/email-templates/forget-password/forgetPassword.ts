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
    <div style="text-align: center; margin: 0 auto; max-width: 500px;">
      <a href="https://www.urexcursion.com/" style="text-decoration: none; color: #000;">
        <img
          src="https://www.urexcursion.com/images/logo/main-two/Frame1logo-500-500-cuted.png"
          height="35"
          alt="Ur Excursion"
          style="height: 35px;"
        />
      </a>
    </div>

    <!-- Main Content Section -->
    <div style="max-width: 500px; margin: 20px auto; padding: 10px;">
      <p style="font-size: 16px; font-weight: 400; line-height: 23px; color: #000;">
        Hello {{email}},
        <br /><br />
        Please click on the link below <b>within 24 hours</b> to reset your Ur Excursion password.
        <br /><br />
        <a href="{{restLink}}" style="font-size: 16px; color: #fff; cursor: pointer; background-color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 20px;">Reset your Password</a>
        <br /><br />
        Once you reset your password, you will be signed in and able to enter the member-only area you tried to access.
        <br /><br />
        If you have any problems with this link, please visit the Ur Excursion Help Center for more information.
        <br /><br />
        Happy travels,
        <br /><br />
        The Ur Excursion Support Team
        <br />
        <a href="http://www.urexcursion.com" style="color: #000;">http://www.urexcursion.com</a>
      </p>
    </div>

    <!-- Footer Section -->
    <div style="max-width: 500px; margin: 20px auto; text-align: center;">
      <a href="http://www.urexcursion.com" style="text-decoration: none; color: #000;">
        <img
          src="https://www.urexcursion.com/images/logo/icon_black/logo_in_black_500_150.png"
          height="35"
          alt="Ur Excursion"
          style="height: 35px;"
        />
      </a>
      
      <div style="margin-top: 10px; font-size: 11px; color: #000;">
        <p>© urexcursion .Ur Excursion Platforms, LLC.,Calle Mayor, 1 20400 Tolosa Guipúzcoa Spain.</p>
        <p>© 2024 Ur Excursion LLC. All rights reserved. Ur Excursion, the Ur Excursion logo, and other trademarks are property of Ur Excursion LLC.</p>
      </div>

      <!-- Social Media Links -->
      <div style="margin-top: 10px; text-align: center;">
        <p style="font-size: 11px;">Follow us for travel inspo:</p>
        <div style="display: flex; justify-content: center;">
          {{#each secailMedia}}
            <a href="{{this.link}}" style="margin: 5px;">
              <img src="{{this.icon}}" alt="Social Media" style="width: 20px; height: 20px;" />
            </a>
          {{/each}}
        </div>
      </div>
    </div>

  </body>
</html>`

)
}