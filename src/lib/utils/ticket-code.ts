/**
 * Generate a unique ticket number
 * Format: TKT-XXXXXX (6 random alphanumeric characters)
 */
export function generateTicketNumber(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let ticketNumber = 'TKT-'
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    ticketNumber += characters[randomIndex]
  }
  
  return ticketNumber
}

/**
 * Validate ticket number format
 */
export function isValidTicketNumber(ticketNumber: string): boolean {
  const ticketRegex = /^TKT-[A-Z0-9]{6}$/
  return ticketRegex.test(ticketNumber)
}
