import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload QR code buffer to Cloudinary
 */
export async function uploadQRCodeToCloudinary(
  buffer: Buffer,
  ticketNumber: string
): Promise<string> {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'event-trybe/qr-codes',
          public_id: `qr-${ticketNumber}`,
          resource_type: 'image',
          format: 'png',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            reject(new Error('Failed to upload QR code to Cloudinary'))
          } else if (result) {
            resolve(result.secure_url)
          } else {
            reject(new Error('No result from Cloudinary upload'))
          }
        }
      )

      uploadStream.end(buffer)
    })
  } catch (error) {
    console.error('Error uploading QR code:', error)
    throw error
  }
}
