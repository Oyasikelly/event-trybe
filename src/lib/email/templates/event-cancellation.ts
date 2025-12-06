interface EventCancellationData {
  userName: string
  eventTitle: string
  eventDate: string
  eventTime: string
  cancellationReason?: string
}

export function generateEventCancellationEmail(data: EventCancellationData) {
  const {
    userName,
    eventTitle,
    eventDate,
    eventTime,
    cancellationReason,
  } = data

  const subject = `Event Cancelled: ${eventTitle}`

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
                  <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                      ⚠️ Event Cancelled
                    </h1>
                    <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                      We're sorry to inform you
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
                      We regret to inform you that <strong>${eventTitle}</strong> has been cancelled by the organizer.
                    </p>

                    <!-- Event Details -->
                    <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 20px; margin: 30px 0; border-radius: 4px;">
                      <h2 style="margin: 0 0 15px; font-size: 20px; color: #991b1b;">Cancelled Event</h2>
                      
                      <p style="margin: 10px 0; font-size: 14px; color: #7f1d1d;">
                        <strong>Event:</strong> ${eventTitle}
                      </p>
                      
                      <p style="margin: 10px 0; font-size: 14px; color: #7f1d1d;">
                        <strong>Originally Scheduled:</strong> ${eventDate} at ${eventTime}
                      </p>
                    </div>

                    ${cancellationReason ? `
                      <!-- Cancellation Reason -->
                      <div style="background-color: #f8f9fa; padding: 20px; margin: 30px 0; border-radius: 4px; border: 1px solid #e9ecef;">
                        <h3 style="margin: 0 0 10px; font-size: 16px; color: #333333;">Reason for Cancellation:</h3>
                        <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">
                          ${cancellationReason}
                        </p>
                      </div>
                    ` : ''}

                    <div style="background-color: #dbeafe; border: 1px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 6px;">
                      <p style="margin: 0; font-size: 14px; color: #1e40af; line-height: 1.6;">
                        <strong>💡 What's Next?</strong><br>
                        Your registration has been automatically cancelled. If this was a paid event, you will receive a full refund within 5-7 business days.
                      </p>
                    </div>

                    <p style="margin: 30px 0 0; font-size: 14px; color: #666666; line-height: 1.6;">
                      We apologize for any inconvenience this may cause. We hope to see you at future events!
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
                      You're receiving this email because you were registered for this event.
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
