'use client'

import { useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface EventBannerUploadProps {
  currentImageUrl?: string | null
  onUploadSuccess: (url: string) => void
  onRemove?: () => void
}

export function EventBannerUpload({
  currentImageUrl,
  onUploadSuccess,
  onRemove,
}: EventBannerUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const { toast } = useToast()

  console.log('EventBannerUpload rendered', { currentImageUrl, previewUrl })

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

    // Validate file size (10MB for banners)
    if (file.size > 10000000) {
      toast({
        title: 'File too large',
        description: 'Please select an image under 10MB',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsUploading(true)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '')
      formData.append('folder', 'event-trybe/event-banners')

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
      setPreviewUrl(data.secure_url)

      toast({
        title: 'Banner uploaded',
        description: 'Your event banner has been uploaded successfully',
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: 'Failed to upload banner. Please try again.',
        variant: 'destructive',
      })
      setPreviewUrl(currentImageUrl || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    onRemove?.()
    toast({
      title: 'Banner removed',
      description: 'Event banner has been removed',
    })
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        id="event-banner-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {previewUrl ? (
        <div className="relative group">
          <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={previewUrl}
              alt="Event banner preview"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
            <label
              htmlFor="event-banner-upload"
              className="cursor-pointer"
            >
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isUploading}
                asChild
              >
                <span>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImagePlus className="mr-2 h-4 w-4" />
                      Change Banner
                    </>
                  )}
                </span>
              </Button>
            </label>
            
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <label
          htmlFor="event-banner-upload"
          className="cursor-pointer block"
        >
          <div className="aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-primary transition-colors flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100">
            {isUploading ? (
              <>
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-3" />
                <p className="text-sm text-muted-foreground">Uploading banner...</p>
              </>
            ) : (
              <>
                <ImagePlus className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700">Click to upload event banner</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 1920x1080px (16:9 ratio) • Max 10MB
                </p>
              </>
            )}
          </div>
        </label>
      )}
    </div>
  )
}
