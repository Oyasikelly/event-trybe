'use client'

import { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Camera, CameraOff } from 'lucide-react'

interface QRScannerProps {
  onScan: (qrData: string) => void
  isScanning: boolean
}

export function QRScanner({ onScan, isScanning }: QRScannerProps) {
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  useEffect(() => {
    if (isScanning && !scanner) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      )

      html5QrcodeScanner.render(
        (decodedText) => {
          // Success callback
          onScan(decodedText)
          // Play success sound
          playSound('success')
        },
        (error) => {
          // Error callback - ignore continuous scanning errors
          // console.warn('QR scan error:', error)
        }
      )

      setScanner(html5QrcodeScanner)
      setIsCameraActive(true)
    }

    return () => {
      if (scanner) {
        scanner.clear().catch((error) => {
          console.error('Error clearing scanner:', error)
        })
      }
    }
  }, [isScanning])

  const playSound = (type: 'success' | 'error') => {
    // Create audio context for feedback
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    if (type === 'success') {
      oscillator.frequency.value = 800
      gainNode.gain.value = 0.3
    } else {
      oscillator.frequency.value = 200
      gainNode.gain.value = 0.5
    }

    oscillator.start()
    setTimeout(() => oscillator.stop(), 200)
  }

  const stopScanner = () => {
    if (scanner) {
      scanner.clear().catch((error) => {
        console.error('Error stopping scanner:', error)
      })
      setScanner(null)
      setIsCameraActive(false)
    }
  }

  return (
    <>
      {/* Custom styles for html5-qrcode UI elements */}
      <style jsx global>{`
        /* Style the camera permission request button */
        #qr-reader__dashboard_section_csr button {
          background: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          border: none !important;
          padding: 12px 24px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }

        #qr-reader__dashboard_section_csr button:hover {
          background: hsl(var(--primary) / 0.9) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }

        #qr-reader__dashboard_section_csr button:active {
          transform: translateY(0) !important;
        }

        /* Style the file input label to look like a secondary button */
        #qr-reader__dashboard_section_csr span {
          color: hsl(var(--primary)) !important;
          text-decoration: underline !important;
          cursor: pointer !important;
          font-weight: 600 !important;
          transition: all 0.2s ease !important;
          display: inline-block !important;
          padding: 4px 8px !important;
          border-radius: 4px !important;
        }

        #qr-reader__dashboard_section_csr span:hover {
          background: hsl(var(--primary) / 0.1) !important;
          text-decoration: none !important;
        }

        /* Style the permission request text container */
        #qr-reader__dashboard_section {
          padding: 24px !important;
          text-align: center !important;
        }

        /* Make the scan region more prominent */
        #qr-reader__scan_region {
          border: 2px dashed hsl(var(--primary) / 0.3) !important;
          border-radius: 12px !important;
        }

        /* Style the camera selection dropdown */
        #qr-reader__camera_selection select {
          padding: 8px 12px !important;
          border-radius: 6px !important;
          border: 1px solid hsl(var(--border)) !important;
          background: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          font-size: 14px !important;
          cursor: pointer !important;
        }

        /* Add animation to the scanner frame */
        #qr-reader video {
          border-radius: 8px !important;
        }

        /* Style error messages */
        #qr-reader__status_span {
          color: hsl(var(--destructive)) !important;
          font-weight: 500 !important;
          padding: 12px !important;
          background: hsl(var(--destructive) / 0.1) !important;
          border-radius: 8px !important;
          margin-top: 12px !important;
          display: inline-block !important;
        }
      `}</style>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">QR Code Scanner</h3>
              {isCameraActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopScanner}
                >
                  <CameraOff className="h-4 w-4 mr-2" />
                  Stop Camera
                </Button>
              )}
            </div>

            {/* Scanner Container */}
            <div
              id="qr-reader"
              className="w-full rounded-lg overflow-hidden"
            />

            {!isCameraActive && (
              <div className="text-center py-8 text-muted-foreground">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Camera will activate when you start scanning</p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Instructions:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Position the QR code within the frame</li>
                <li>• Ensure good lighting for best results</li>
                <li>• Hold steady until scan completes</li>
                <li>• You'll hear a beep on successful scan</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
