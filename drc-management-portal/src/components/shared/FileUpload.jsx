import { Upload } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function FileUpload({
  label = 'Upload files',
  description = 'Drag and drop files here, or click to browse',
  className,
  accept,
  multiple = true,
  onFilesSelected,
}) {
  const handleChange = (e) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) onFilesSelected?.(files)
    e.target.value = ''
  }

  return (
    <label className={cn('flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-8 text-center transition-colors hover:border-primary/40 hover:bg-muted/40', className)}>
      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Upload className="size-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <input
        type="file"
        className="sr-only"
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
      />
    </label>
  )
}
