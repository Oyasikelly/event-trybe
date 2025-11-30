import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Send verification email to user
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'EventTrybe <onboarding@resend.dev>',
      to: email,
      subject: 'Verify your EventTrybe account',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to EventTrybe!</h1>
            </div>
            
            <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                Thank you for signing up for EventTrybe! We're excited to have you on board.
              </p>
              
              <p style="font-size: 16px; margin-bottom: 30px;">
                To complete your registration and start creating amazing events, please verify your email address by clicking the button below:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Or copy and paste this link into your browser:
              </p>
              <p style="font-size: 14px; color: #2575fc; word-break: break-all;">
                ${verificationUrl}
              </p>
              
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              
              <p style="font-size: 13px; color: #999; margin-bottom: 10px;">
                This verification link will expire in 24 hours.
              </p>
              
              <p style="font-size: 13px; color: #999;">
                If you didn't create an account with EventTrybe, you can safely ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} EventTrybe. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send verification email:', error)
      throw new Error('Failed to send verification email')
    }

    console.log('✅ Verification email sent to:', email)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'EventTrybe <onboarding@resend.dev>',
      to: email,
      subject: 'Reset your EventTrybe password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
            </div>
            
            <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                We received a request to reset your password for your EventTrybe account.
              </p>
              
              <p style="font-size: 16px; margin-bottom: 30px;">
                Click the button below to reset your password:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                  Reset Password
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                Or copy and paste this link into your browser:
              </p>
              <p style="font-size: 14px; color: #2575fc; word-break: break-all;">
                ${resetUrl}
              </p>
              
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              
              <p style="font-size: 13px; color: #999; margin-bottom: 10px;">
                This password reset link will expire in 1 hour.
              </p>
              
              <p style="font-size: 13px; color: #999;">
                If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} EventTrybe. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Failed to send password reset email:', error)
      throw new Error('Failed to send password reset email')
    }

    console.log('✅ Password reset email sent to:', email)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw error
  }
}
