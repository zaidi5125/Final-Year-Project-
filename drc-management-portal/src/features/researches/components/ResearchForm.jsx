import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload, FormField, SectionCard } from '@/components/shared'
import {
  RESEARCH_STATUSES,
  RESEARCHER_LEVELS,
} from '@/features/researches/utils/researchStatus'
import { fetchUsers } from '@/services/userService'
import { createId } from '@/utils/id'
import { Link } from 'react-router-dom'
import { ROUTE_PATHS } from '@/routes/routePaths'

const EMPTY_VALUES = {
  title: '',
  topic: '',
  description: '',
  status: '',
  startDate: '',
  endDate: '',
  researchers: [],
  files: [],
  researchDocument: null,
}

export default function ResearchForm({
  initialValues = EMPTY_VALUES,
  submitLabel = 'Save Research',
  onSubmit,
  onCancel,
}) {
  const [teamMembers, setTeamMembers] = useState([])
  const [researchers, setResearchers] = useState(initialValues.researchers ?? [])
  const [files, setFiles] = useState(initialValues.files ?? [])
  const [researchDocument, setResearchDocument] = useState(initialValues.researchDocument)
  const [selectedMember, setSelectedMember] = useState('')
  const [researcherRole, setResearcherRole] = useState('junior')

  useEffect(() => {
    fetchUsers()
      .then((data) =>
        setTeamMembers(
          data
            .filter((u) => u.isActive !== false)
            .map((u) => ({ id: String(u.id), name: u.username, email: u.email ?? '' })),
        ),
      )
      .catch(() => setTeamMembers([]))
  }, [])

  const handleAddResearcher = () => {
    if (!selectedMember) return
    const member = teamMembers.find((m) => m.id === selectedMember)
    if (!member) return
    if (researchers.some((r) => r.userId === member.id || r.id === member.id)) return

    setResearchers((prev) => [
      ...prev,
      {
        id: createId(),
        userId: member.id,
        name: member.name,
        email: member.email,
        researcherRole,
      },
    ])
    setSelectedMember('')
  }

  const handleRemoveResearcher = (id) => {
    setResearchers((prev) => prev.filter((item) => item.id !== id))
  }

  const handleFilesSelected = (selectedFiles) => {
    const newFiles = selectedFiles.map((file) => ({
      id: createId(),
      name: file.name,
      size: file.size,
      type: file.type,
      documentType: 'additional',
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleMainDocumentSelected = (selectedFiles) => {
    const file = selectedFiles[0]
    if (!file) return
    setResearchDocument({
      id: createId(),
      name: file.name,
      size: file.size,
      type: file.type,
      documentType: 'main',
    })
  }

  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const data = {
      title: formData.get('title')?.toString().trim() ?? '',
      topic: formData.get('topic')?.toString().trim() ?? '',
      description: formData.get('description')?.toString().trim() ?? '',
      status: formData.get('status')?.toString() ?? '',
      startDate: formData.get('startDate')?.toString() ?? '',
      endDate: formData.get('endDate')?.toString().trim() ?? '',
      researchers,
      files,
      researchDocument,
    }

    if (!data.title || !data.topic || !data.status || !data.startDate || !data.endDate) {
      return
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <SectionCard title="Overview">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Title" htmlFor="title" required className="sm:col-span-2">
            <Input
              id="title"
              name="title"
              defaultValue={initialValues.title}
              placeholder="Enter research title"
              required
            />
          </FormField>

          <FormField label="Topic" htmlFor="topic" required>
            <Input
              id="topic"
              name="topic"
              defaultValue={initialValues.topic}
              placeholder="Research topic"
              required
            />
          </FormField>

          <FormField label="Status" htmlFor="status" required>
            <Select id="status" name="status" defaultValue={initialValues.status} required>
              <option value="">Select status</option>
              {RESEARCH_STATUSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Start Date" htmlFor="startDate" required>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              defaultValue={initialValues.startDate}
              required
            />
          </FormField>

          <FormField label="End Date" htmlFor="endDate" required>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              defaultValue={initialValues.endDate}
              required
            />
          </FormField>

          <FormField label="Description" htmlFor="description" className="sm:col-span-2">
            <Textarea
              id="description"
              name="description"
              defaultValue={initialValues.description ?? initialValues.purpose}
              placeholder="Describe this research"
              rows={4}
            />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Researchers">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="min-w-[200px] flex-1"
            >
              <option value="">Select team member</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </Select>
            <Select
              value={researcherRole}
              onChange={(e) => setResearcherRole(e.target.value)}
              className="min-w-[160px]"
            >
              {RESEARCHER_LEVELS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
            <Button type="button" variant="outline" onClick={handleAddResearcher}>
              <Plus className="size-4" aria-hidden="true" />
              Add Researcher
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to={ROUTE_PATHS.MANAGE_USERS + "?add=1"}>
                <Plus className="size-4" aria-hidden="true" />
                Add User
              </Link>
            </Button>
          </div>

          {researchers.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {researchers.map((researcher) => (
                <li
                  key={researcher.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm"
                >
                  <div>
                    <span className="font-medium">{researcher.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground capitalize">
                      ({researcher.researcherRole?.replace('_', ' ')})
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0 text-muted-foreground"
                    onClick={() => handleRemoveResearcher(researcher.id)}
                    aria-label={`Remove ${researcher.name}`}
                  >
                    <X className="size-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No researchers added yet.</p>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Documents">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Document uploads are not connected to the server yet. Files selected here will not be saved.
          </p>
          <FormField label="Main Research Document" htmlFor="research-document">
            <FileUpload
              label="Upload main research document"
              description="Primary research document linked to this research"
              multiple={false}
              onFilesSelected={handleMainDocumentSelected}
            />
            {researchDocument && (
              <p className="mt-2 text-sm">
                <span className="font-medium">{researchDocument.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">(Main document)</span>
              </p>
            )}
          </FormField>

          <FileUpload
            label="Upload additional documents"
            description="Attach research documents, reports, or related files"
            onFilesSelected={handleFilesSelected}
          />

          {files.length > 0 && (
            <ul className="flex flex-col gap-2">
              {files.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm"
                >
                  <div>
                    <span>{file.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">(Additional document)</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0 text-muted-foreground"
                    onClick={() => handleRemoveFile(file.id)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="size-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SectionCard>

      <div className="flex items-center gap-2 border-t border-border pt-4">
        <Button type="submit">{submitLabel}</Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}




