import { resend, FROM_EMAIL } from './resend-client'

interface EmailAttachment {
  filename: string
  content: string | Buffer
  contentType?: string
}

interface SendEmailParams {
  to: string
  subject: string
  html: string
  replyTo?: string
  attachments?: EmailAttachment[]
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  attachments,
}: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      replyTo,
      attachments: attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
        content_type: att.contentType,
      })),
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    console.log('Email sent successfully:', data)
    return data
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
