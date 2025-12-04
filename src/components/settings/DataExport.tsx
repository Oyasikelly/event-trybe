'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Download, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function DataExport() {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [format, setFormat] = useState<'pdf' | 'excel' | 'json'>('pdf')

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const response = await fetch(`/api/settings/export-data?format=${format}`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to export data')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      // Set filename based on format
      const extension = format === 'excel' ? 'xlsx' : format
      a.download = `user-data-${Date.now()}.${extension}`
      
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Data exported',
        description: `Your data has been downloaded as ${format.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export data',
        variant: 'destructive',
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Your Data</CardTitle>
        <CardDescription>
          Download a copy of all your data (GDPR compliance)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Download all your profile information, events, registrations, and notifications in your preferred format.
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="export-format">Export Format</Label>
          <Select value={format} onValueChange={(value: any) => setFormat(value)}>
            <SelectTrigger id="export-format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document</SelectItem>
              <SelectItem value="excel">Excel Spreadsheet (.xlsx)</SelectItem>
              <SelectItem value="json">JSON (Raw Data)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleExport} disabled={isExporting} variant="outline" className="w-full">
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export as {format.toUpperCase()}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
