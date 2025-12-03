import QRCode from 'qrcode'

interface QRCodeData {
  ticketNumber: string
  eventId: string
  userId: string
  registrationId: string
  timestamp: string
}

/**
 * Generate QR code as base64 data URL
 */
export async function generateQRCode(data: QRCodeData): Promise<string> {
  try {
    const qrData = JSON.stringify(data)
    
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    return qrCodeDataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Generate QR code as buffer for upload
 */
export async function generateQRCodeBuffer(data: QRCodeData): Promise<Buffer> {
  try {
    const qrData = JSON.stringify(data)
    
    const buffer = await QRCode.toBuffer(qrData, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    return buffer
  } catch (error) {
    console.error('Error generating QR code buffer:', error)
    throw new Error('Failed to generate QR code buffer')
  }
}

/**
 * Verify QR code data
 */
export function verifyQRCodeData(qrData: string): QRCodeData | null {
  try {
    const data = JSON.parse(qrData) as QRCodeData
    
    // Validate required fields
    if (!data.ticketNumber || !data.eventId || !data.userId || !data.registrationId) {
      return null
    }

    return data
  } catch (error) {
    console.error('Error verifying QR code data:', error)
    return null
  }
}
