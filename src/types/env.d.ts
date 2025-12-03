// Add Resend and Cloudinary environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Cloudinary
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string
      CLOUDINARY_API_KEY: string
      CLOUDINARY_API_SECRET: string
      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: string
      
      // Resend
      RESEND_API_KEY: string
      RESEND_FROM_EMAIL?: string
      
      // App
      NEXT_PUBLIC_APP_URL?: string
    }
  }
}

export {}
