import { useCallback, useRef, useState } from 'react'
import { FileSpreadsheet, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { parseLeadFile } from '@/utils/leadImport'

export default function LeadImportDropzone({ onImport, className }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const processFiles = useCallback(
    async (files) => {
      setError('')
      setIsLoading(true)

      try {
        let totalImported = 0
        for (const file of files) {
          const leads = await parseLeadFile(file)
          if (leads.length > 0) {
            onImport?.(leads)
            totalImported += leads.length
          }
        }

        if (totalImported === 0) {
          setError('No valid lead rows found in the uploaded file(s).')
        }
      } catch (err) {
        setError(err.message ?? 'Failed to import file.')
      } finally {
        setIsLoading(false)
      }
    },
    [onImport],
  )

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    const files = Array.from(event.dataTransfer.files ?? [])
    if (files.length > 0) processFiles(files)
  }

  const handleChange = (event) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length > 0) processFiles(files)
    event.target.value = ''
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40',
        )}
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FileSpreadsheet className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Drag & drop CSV or Excel file
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Auto-maps columns into leads table (Name, Email, Phone, Company, Type, Status, Notes)
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" disabled={isLoading}>
          <Upload className="size-4" aria-hidden="true" />
          {isLoading ? 'Importing...' : 'Browse Files'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept=".csv,.xlsx,.xls"
          multiple
          onChange={handleChange}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
