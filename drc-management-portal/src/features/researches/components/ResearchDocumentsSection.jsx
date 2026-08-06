import { useState } from 'react'
import { FileText } from 'lucide-react'
import { EmptyState, FileUpload, SectionCard } from '@/components/shared'
import { useResearches } from '@/features/researches/context/ResearchesContext'
import { getResearcherLevelLabel } from '@/features/researches/utils/researchStatus'
import { createId } from '@/utils/id'

function getDocumentTypeLabel(documentType) {
  return documentType === 'main' ? 'Main document' : 'Additional document'
}

export default function ResearchDocumentsSection({ research, id }) {
  const { addResearchFiles } = useResearches()
  const [files, setFiles] = useState(research.files ?? [])

  const handleFilesSelected = (selectedFiles) => {
    const newFiles = selectedFiles.map((file) => ({
      id: createId(),
      name: file.name,
      size: file.size,
      type: file.type,
      documentType: 'additional',
      uploadedAt: new Date().toISOString(),
    }))
    setFiles((prev) => [...prev, ...newFiles])
    addResearchFiles(id, newFiles)
  }

  const allFiles = [
    ...(research.researchDocument ? [{ ...research.researchDocument, documentType: 'main' }] : []),
    ...files,
  ]

  return (
    <SectionCard title="Documents">
      <div className="flex flex-col gap-4">
        <FileUpload
          label="Upload research documents"
          description="Researchers can upload documents linked to this research"
          onFilesSelected={handleFilesSelected}
        />

        {allFiles.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No files uploaded"
            description="Research documents and files will appear here once uploaded."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Document Name
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {allFiles.map((file) => (
                  <tr key={file.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{file.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {getDocumentTypeLabel(file.documentType)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SectionCard>
  )
}

export { getResearcherLevelLabel }
