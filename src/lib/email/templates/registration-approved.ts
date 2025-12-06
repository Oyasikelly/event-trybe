interface RegistrationApprovedEmailProps {
  userName: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  eventUrl: string
  ticketNumber: string
  qrCodeUrl?: string
  googleCalendarUrl?: string
  outlookCalendarUrl?: string
  office365CalendarUrl?: string
  yahooCalendarUrl?: string
}

export function renderRegistrationApprovedEmail({
  userName,
  eventTitle,
  eventDate,
  eventLocation,
  eventUrl,
  ticketNumber,
  qrCodeUrl,
  googleCalendarUrl,
  outlookCalendarUrl,
  office365CalendarUrl,
  yahooCalendarUrl,
}: RegistrationApprovedEmailProps): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Approved</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">✅ Registration Approved!</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                      Hi <strong>${userName}</strong>,
                    </p>
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                      Excellent news! Your registration for <strong>${eventTitle}</strong> has been approved by the event organizer.
                    </p>

                    <!-- Event Details Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 8px; margin: 30px 0; border: 1px solid #bbf7d0;">
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
                        <img src="${qrCodeUrl}" alt="QR Code" style="width: 200px; height: 200px; border: 2px solid #bbf7d0; border-radius: 8px;" />
                        <p style="margin: 15px 0 0; font-size: 12px; color: #999999;">Show this QR code at the event entrance</p>
                      </div>
                    ` : ''}

                    <!-- Add to Calendar Section -->
                    ${googleCalendarUrl || outlookCalendarUrl ? `
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td style="text-align: center;">
                            <p style="margin: 0 0 15px; font-size: 16px; font-weight: 600; color: #333333;">📅 Add to Your Calendar</p>
                            <p style="margin: 0 0 20px; font-size: 14px; color: #666666;">Never miss this event - add it to your calendar now!</p>
                            
                            <!-- Calendar Buttons -->
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                              <tr>
                                ${googleCalendarUrl ? `
                                  <td style="padding: 5px;">
                                    <a href="${googleCalendarUrl}" target="_blank" rel="noopener" style="display: inline-block; padding: 12px 24px; background-color: #4285f4; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
                                      Google Calendar
                                    </a>
                                  </td>
                                ` : ''}
                                ${outlookCalendarUrl ? `
                                  <td style="padding: 5px;">
                                    <a href="${outlookCalendarUrl}" target="_blank" rel="noopener" style="display: inline-block; padding: 12px 24px; background-color: #0078d4; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
                                      Outlook
                                    </a>
                                  </td>
                                ` : ''}
                              </tr>
                              ${office365CalendarUrl || yahooCalendarUrl ? `
                                <tr>
                                  ${office365CalendarUrl ? `
                                    <td style="padding: 5px;">
                                      <a href="${office365CalendarUrl}" target="_blank" rel="noopener" style="display: inline-block; padding: 12px 24px; background-color: #d83b01; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
                                        Office 365
                                      </a>
                                    </td>
                                  ` : ''}
                                  ${yahooCalendarUrl ? `
                                    <td style="padding: 5px;">
                                      <a href="${yahooCalendarUrl}" target="_blank" rel="noopener" style="display: inline-block; padding: 12px 24px; background-color: #6001d2; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
                                        Yahoo
                                      </a>
                                    </td>
                                  ` : ''}
                                </tr>
                              ` : ''}
                            </table>
                            
                            <p style="margin: 15px 0 0; font-size: 12px; color: #999999;">
                              Or download the attached calendar file (.ics) to import into any calendar app
                            </p>
                          </td>
                        </tr>
                      </table>
                    ` : ''}

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${eventUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                        View Event Details
                      </a>
                    </div>

                    <p style="margin: 30px 0 0; font-size: 16px; line-height: 1.6; color: #333333;">
                      We look forward to seeing you at the event!
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
