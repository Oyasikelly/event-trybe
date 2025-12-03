interface RegistrationRejectedEmailProps {
  userName: string
  eventTitle: string
  reason?: string
}

export function renderRegistrationRejectedEmail({
  userName,
  eventTitle,
  reason,
}: RegistrationRejectedEmailProps): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Update</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Registration Update</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                      Hi <strong>${userName}</strong>,
                    </p>
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                      We regret to inform you that your registration for <strong>${eventTitle}</strong> was not approved at this time.
                    </p>

                    ${reason ? `
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-radius: 8px; margin: 30px 0; border: 1px solid #fde68a;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="margin: 0; font-size: 14px; color: #92400e;">
                              <strong>Reason:</strong> ${reason}
                            </p>
                          </td>
                        </tr>
                      </table>
                    ` : ''}

                    <p style="margin: 30px 0 0; font-size: 16px; line-height: 1.6; color: #333333;">
                      We appreciate your interest and encourage you to explore other events that might be a better fit.
                    </p>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/find-events" style="display: inline-block; background-color: #f59e0b; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                        Browse Other Events
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; font-size: 14px; color: #666666;">
                      © ${new Date().getFullYear()} EventTrybe. All rights reserved.
                    </p>
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
