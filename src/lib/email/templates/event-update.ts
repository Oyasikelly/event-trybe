interface EventUpdateData {
  userName: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventLocation: string
  eventLink: string
  changes: string[]
}

export function generateEventUpdateEmail(data: EventUpdateData) {
  const {
    userName,
    eventTitle,
    eventDate,
    eventTime,
    eventLocation,
    eventLink,
    changes,
  } = data

  const subject = `Event Update: ${eventTitle}`

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
                  <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                      📢 Event Updated
                    </h1>
                    <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                      Important changes to your event
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
                      The event organizer has made some updates to <strong>${eventTitle}</strong>. Please review the changes below.
                    </p>

                    <!-- Changes Alert -->
                    <div style="background-color: #fff3cd; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
                      <h3 style="margin: 0 0 15px; font-size: 18px; color: #856404;">What's Changed:</h3>
                      <ul style="margin: 0; padding-left: 20px; color: #856404;">
                        ${changes.map(change => `<li style="margin: 8px 0; font-size: 14px;">${change}</li>`).join('')}
                      </ul>
                    </div>

                    <!-- Updated Event Details -->
                    <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                      <h2 style="margin: 0 0 15px; font-size: 20px; color: #333333;">Updated Event Details</h2>
                      
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

                    <!-- Action Button -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${eventLink}" style="display: inline-block; padding: 14px 32px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                        View Full Event Details
                      </a>
                    </div>

                    <p style="margin: 30px 0 0; font-size: 14px; color: #666666; line-height: 1.6;">
                      Your registration is still confirmed. If you have any questions about these changes, please contact the event organizer.
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
