import crypto from 'crypto'

/**
 * Generate a random verification token
 * @returns A random 32-character hex string
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Generate a random password reset token
 * @returns A random 32-character hex string
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Check if a token has expired
 * @param expiresAt The expiration date of the token
 * @returns true if the token has expired, false otherwise
 */
export function isTokenExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return true
  return new Date() > expiresAt
}

/**
 * Get expiration date for verification token (24 hours from now)
 */
export function getVerificationTokenExpiry(): Date {
  const expiry = new Date()
  expiry.setHours(expiry.getHours() + 24)
  return expiry
}

/**
 * Get expiration date for reset token (1 hour from now)
 */
export function getResetTokenExpiry(): Date {
  const expiry = new Date()
  expiry.setHours(expiry.getHours() + 1)
  return expiry
}
