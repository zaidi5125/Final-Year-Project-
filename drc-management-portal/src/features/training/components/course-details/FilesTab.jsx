import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared'

export default function FilesTab({ files }) {
  const isEmpty = files.length === 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Files</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyState
            icon={FileText}
            title="No files uploaded"
            description="Course files and documents will appear here once uploaded."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {files.map((file) => (
              <li
                key={file.id}
                className="rounded-lg border border-border px-4 py-3 text-sm"
              >
                {file.name}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
