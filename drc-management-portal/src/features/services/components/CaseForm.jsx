import { useState } from 'react'
import { Copy, FileText, FolderOpen, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField } from '@/components/shared'
import PartySection from '@/features/services/components/PartySection'
import {
  CASE_STATUSES,
  EMPTY_PARTY,
  EMPTY_VALUES,
  PAYMENT_STATUSES,
} from '@/features/services/utils/caseFields'
import { createId } from '@/utils/id'

function OverviewDocumentField({ document, onSelect, onRemove }) {
  const handleChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    onSelect({ id: createId(), name: file.name, size: file.size, type: file.type })
    event.target.value = ''
  }

  const handleCopy = async () => {
    if (document?.name) await navigator.clipboard.writeText(document.name)
  }

  if (document) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
        <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-sm">{document.name}</span>
        <Button type="button" variant="ghost" size="icon-sm" onClick={handleCopy} aria-label="Copy filename">
          <Copy className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove} aria-label="Remove document">
          <X className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <label
        htmlFor="case-overview-document"
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/40"
      >
        <FileText className="size-4" aria-hidden="true" />
        Upload document
      </label>
      <input id="case-overview-document" type="file" className="sr-only" onChange={handleChange} />
    </>
  )
}

export default function CaseForm({
  formId = 'case-form',
  initialValues = EMPTY_VALUES,
  caseId,
  onSubmit,
  hideBottomActions = false,
}) {
  const [overviewDocument, setOverviewDocument] = useState(initialValues.document ?? null)
  const [pendingPartyMembers, setPendingPartyMembers] = useState([])
  const [complainant, setComplainant] = useState(
    initialValues.complainant ?? { ...EMPTY_PARTY, additionalMembers: [] },
  )
  const [respondent, setRespondent] = useState(
    initialValues.respondent ?? { ...EMPTY_PARTY, additionalMembers: [] },
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const data = {
      title: formData.get('title')?.toString().trim() ?? '',
      caseId: formData.get('caseId')?.toString().trim() ?? '',
      caseNumber: formData.get('caseId')?.toString().trim() ?? '',
      courtCaseId: formData.get('courtCaseId')?.toString().trim() ?? '',
      caseType: formData.get('caseType')?.toString().trim() ?? '',
      court: formData.get('court')?.toString().trim() ?? '',
      paymentStatus: formData.get('paymentStatus')?.toString() ?? '',
      status: formData.get('status')?.toString() ?? '',
      startDate: formData.get('startDate')?.toString() ?? '',
      endDate: formData.get('endDate')?.toString() ?? '',
      openedDate: formData.get('startDate')?.toString() ?? '',
      result: formData.get('result')?.toString().trim() ?? '',
      document: overviewDocument,
      documents: overviewDocument ? [overviewDocument] : [],
      description: formData.get('description')?.toString().trim() ?? '',
      complainant,
      respondent,
      client: complainant,
      opponent: respondent,
      partyMembers: pendingPartyMembers,
    }

    onSubmit(data)
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <FolderOpen className="size-4 text-primary" aria-hidden="true" />
            Case Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <FormField label="Case Title" htmlFor="title">
              <Input id="title" name="title" defaultValue={initialValues.title} className="bg-muted/30" />
            </FormField>

            <FormField label="Case ID" htmlFor="caseId">
              <Input id="caseId" name="caseId" defaultValue={initialValues.caseId} className="bg-muted/30" />
            </FormField>

            <FormField label="Court Case ID" htmlFor="courtCaseId">
              <Input
                id="courtCaseId"
                name="courtCaseId"
                defaultValue={initialValues.courtCaseId}
                className="bg-muted/30"
              />
            </FormField>

            <FormField label="Case Type" htmlFor="caseType">
              <Input id="caseType" name="caseType" defaultValue={initialValues.caseType} className="bg-muted/30" />
            </FormField>

            <FormField label="Court" htmlFor="court">
              <Input id="court" name="court" defaultValue={initialValues.court} className="bg-muted/30" />
            </FormField>

            <FormField label="Payment Status" htmlFor="paymentStatus">
              <Select
                id="paymentStatus"
                name="paymentStatus"
                defaultValue={initialValues.paymentStatus}
                className="bg-muted/30"
              >
                <option value="">Select payment status</option>
                {PAYMENT_STATUSES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Status" htmlFor="status">
              <Select id="status" name="status" defaultValue={initialValues.status} className="bg-muted/30">
                <option value="">Select status</option>
                {CASE_STATUSES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Start Date" htmlFor="startDate">
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={initialValues.startDate}
                className="bg-muted/30"
              />
            </FormField>

            <FormField label="End Date" htmlFor="endDate">
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={initialValues.endDate}
                className="bg-muted/30"
              />
            </FormField>

            <FormField label="Result" htmlFor="result">
              <Input id="result" name="result" defaultValue={initialValues.result} className="bg-muted/30" />
            </FormField>

            <FormField label="Document" htmlFor="case-overview-document">
              <OverviewDocumentField
                document={overviewDocument}
                onSelect={setOverviewDocument}
                onRemove={() => setOverviewDocument(null)}
              />
            </FormField>
          </div>

          <FormField label="Description" htmlFor="description">
            <Textarea
              id="description"
              name="description"
              defaultValue={initialValues.description}
              rows={4}
              className="bg-muted/30"
            />
          </FormField>
        </CardContent>
      </Card>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <PartySection
          title="Party 1 - Complainant (Main Person)"
          namePrefix="complainant"
          partyType="complainant"
          party={complainant}
          onChange={setComplainant}
          caseId={caseId}
          pendingMembers={pendingPartyMembers}
          onPendingMembersChange={setPendingPartyMembers}
        />
        <PartySection
          title="Party 2 - Respondent (Main Person)"
          namePrefix="respondent"
          partyType="respondent"
          party={respondent}
          onChange={setRespondent}
          caseId={caseId}
          pendingMembers={pendingPartyMembers}
          onPendingMembersChange={setPendingPartyMembers}
        />
      </div>

      {!hideBottomActions && (
        <div className="flex items-center gap-2 border-t border-border pt-4">
          <Button type="submit">Save Case</Button>
        </div>
      )}
    </form>
  )
}
