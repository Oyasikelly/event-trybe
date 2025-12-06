interface EventReminderData {
  userName: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventLocation: string
  eventLink: string
  hoursUntil: number
  qrCodeUrl?: string
}

export function generateEventReminderEmail(data: EventReminderData) {
  const {
    userName,
    eventTitle,
    eventDate,
    eventTime,
    eventLocation,
    eventLink,
    hoursUntil,
    qrCodeUrl,
  } = data

  const subject = hoursUntil === 24
    ? `Reminder: ${eventTitle} is tomorrow!`
    : `Starting Soon: ${eventTitle} in 1 hour!`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 0; text-align: center;">
              <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                      ${hoursUntil === 24 ? '⏰ Event Tomorrow!' : '🚀 Starting Soon!'}
                    </h1>
                    <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                      ${hoursUntil === 24 ? 'Your event is happening tomorrow' : 'Your event starts in 1 hour'}
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">
                      Hi ${userName},
                    </p>

                    <p style="margin: 0 0 20px; font-size: 16px; color: #333333; line-height: 1.6;">
                      This is a friendly reminder that <strong>${eventTitle}</strong> is ${hoursUntil === 24 ? 'happening tomorrow' : 'starting in 1 hour'}!
                    </p>

                    <!-- Event Details Card -->
                    <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                      <h2 style="margin: 0 0 15px; font-size: 20px; color: #333333;">${eventTitle}</h2>
                      
                      <p style="margin: 10px 0; font-size: 14px; color: #666666;">
                        <strong>📅 Date:</strong> ${eventDate}
                      </p>
                      
                      <p style="margin: 10px 0; font-size: 14px; color: #666666;">
                        <strong>🕐 Time:</strong> ${eventTime}
                      </p>
                      
                      <p style="margin: 10px 0; font-size: 14px; color: #666666;">
                        <strong>📍 Location:</strong> ${eventLocation}
                      </p>
                    </div>

                    ${qrCodeUrl ? `
                      <!-- QR Code -->
                      <div style="text-align: center; margin: 30px 0;">
                        <p style="margin: 0 0 15px; font-size: 14px; color: #666666; font-weight: 600;">
                          Your Event QR Code
                        </p>
                        <img src="${qrCodeUrl}" alt="QR Code" style="width: 200px; height: 200px; border: 2px solid #e9ecef; border-radius: 8px;" />
                        <p style="margin: 15px 0 0; font-size: 12px; color: #999999;">Show this QR code at the event entrance</p>
                      </div>
                    ` : ''}

                    <!-- Action Button -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${eventLink}" style="display: inline-block; padding: 14px 32px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                        View Event Details
                      </a>
                    </div>

                    ${hoursUntil === 1 ? `
                      <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 14px; color: #856404;">
                          <strong>⚡ Quick Tip:</strong> Make sure to arrive a few minutes early for check-in!
                        </p>
                      </div>
                    ` : ''}

                    <p style="margin: 30px 0 0; font-size: 14px; color: #666666; line-height: 1.6;">
                      We're looking forward to seeing you there!
                    </p>

                    <p style="margin: 20px 0 0; font-size: 14px; color: #666666;">
                      Best regards,<br>
                      <strong>EventTrybe Team</strong>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; font-size: 12px; color: #999999;">
                      You're receiving this email because you registered for this event.
                    </p>
                    <p style="margin: 10px 0 0; font-size: 12px; color: #999999;">
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

  return { subject, html }
}
