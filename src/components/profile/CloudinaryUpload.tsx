'use client'

import { useState } from 'react'
import { Camera, Loader2, Upload } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface CloudinaryUploadProps {
  currentImageUrl?: string | null
  onUploadSuccess: (url: string) => void
  userName?: string
}

export function CloudinaryUpload({
  currentImageUrl,
  onUploadSuccess,
  userName = 'User',
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file',
        variant: 'destructive',
      })
      return
    }

    // Validate file size (5MB)
    if (file.size > 5000000) {
      toast({
        title: 'File too large',
        description: 'Please select an image under 5MB',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsUploading(true)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '')
      formData.append('folder', 'event-trybe/profiles')

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onUploadSuccess(data.secure_url)

      toast({
        title: 'Image uploaded',
        description: 'Your profile picture has been updated',
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="relative group">
      <input
        type="file"
        id="profile-image-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      
      <label
        htmlFor="profile-image-upload"
        className="cursor-pointer block"
      >
        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
          <AvatarImage src={currentImageUrl || undefined} alt={userName} />
          <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-primary/60 text-white">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Upload Overlay */}
        <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : (
            <div className="text-center">
              <Camera className="h-8 w-8 text-white mx-auto mb-1" />
              <p className="text-xs text-white font-medium">Change Photo</p>
            </div>
          )}
        </div>
      </label>
    </div>
  )
}
