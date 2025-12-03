interface RegistrationConfirmationEmailProps {
  userName: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  ticketNumber: string
  qrCodeUrl?: string
}

export function renderRegistrationConfirmationEmail({
  userName,
  eventTitle,
  eventDate,
  eventLocation,
  ticketNumber,
  qrCodeUrl,
}: RegistrationConfirmationEmailProps): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🎉 Registration Confirmed!</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                      Hi <strong>${userName}</strong>,
                    </p>
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                      Great news! Your registration for <strong>${eventTitle}</strong> has been confirmed.
                    </p>

                    <!-- Event Details Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin: 30px 0; border: 1px solid #e9ecef;">
                      <tr>
                        <td style="padding: 20px;">
                          <h2 style="margin: 0 0 15px; font-size: 20px; color: #333333;">Event Details</h2>
                          <table width="100%" cellpadding="8" cellspacing="0">
                            <tr>
                              <td style="font-size: 14px; color: #666666; width: 100px;">📅 Date:</td>
                              <td style="font-size: 14px; color: #333333; font-weight: 500;">${eventDate}</td>
                            </tr>
                            <tr>
                              <td style="font-size: 14px; color: #666666;">📍 Location:</td>
                              <td style="font-size: 14px; color: #333333; font-weight: 500;">${eventLocation}</td>
                            </tr>
                            <tr>
                              <td style="font-size: 14px; color: #666666;">🎫 Ticket:</td>
                              <td style="font-size: 14px; color: #333333; font-weight: 500;">${ticketNumber}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    ${qrCodeUrl ? `
                      <!-- QR Code -->
                      <div style="text-align: center; margin: 30px 0;">
                        <p style="margin: 0 0 15px; font-size: 14px; color: #666666;">Your Event Ticket</p>
                        <img src="${qrCodeUrl}" alt="QR Code" style="width: 200px; height: 200px; border: 2px solid #e9ecef; border-radius: 8px;" />
                        <p style="margin: 15px 0 0; font-size: 12px; color: #999999;">Show this QR code at the event entrance</p>
                      </div>
                    ` : ''}

                    <p style="margin: 30px 0 0; font-size: 16px; line-height: 1.6; color: #333333;">
                      We're excited to see you there! If you have any questions, feel free to reach out.
                    </p>
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
