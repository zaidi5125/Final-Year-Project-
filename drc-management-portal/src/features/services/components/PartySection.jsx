import { useMemo, useState } from 'react'
import { Copy, FileText, Pencil, Plus, Trash2, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog, FormField } from '@/components/shared'
import { usePartyMembers } from '@/features/party-members/context/PartyMembersContext'
import { getRelationLabel } from '@/features/party-members/utils/partyMemberFields'
import PartyMemberFormModal, { PARTY_MEMBER_EMPTY } from '@/features/services/components/PartyMemberFormModal'
import { PARTY_GENDERS } from '@/features/services/utils/caseFields'
import { createId } from '@/utils/id'
import { showSuccess } from '@/utils/toast'

function DocumentField({ document, onSelect, onRemove, inputId }) {
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
        htmlFor={inputId}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/40"
      >
        <FileText className="size-4" aria-hidden="true" />
        Upload document
      </label>
      <input id={inputId} type="file" className="sr-only" onChange={handleChange} />
    </>
  )
}

export default function PartySection({
  title,
  party,
  onChange,
  namePrefix,
  partyType,
  caseId,
  pendingMembers = [],
  onPendingMembersChange,
}) {
  const { getMembersByCase, addPartyMember, updatePartyMember, deletePartyMember } = usePartyMembers()
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const allMembers = caseId ? getMembersByCase(caseId) : pendingMembers
  const members = useMemo(
    () => allMembers.filter((member) => member.partyType === partyType),
    [allMembers, partyType],
  )

  const updateField = (field, value) => {
    onChange({ ...party, [field]: value })
  }

  const buildMemberPayload = (data, existingId) => ({
    id: existingId ?? createId(),
    caseId: caseId ?? '',
    partyId: caseId ? `${caseId}-${partyType}` : partyType,
    partyType,
    mainPartyName: party.fullName || party.name || title,
    ...data,
  })

  const handleSaveMember = (data) => {
    if (caseId) {
      if (editTarget) {
        updatePartyMember(editTarget.id, buildMemberPayload(data, editTarget.id))
      } else {
        addPartyMember(buildMemberPayload(data))
      }
    } else {
      const payload = buildMemberPayload(data, editTarget?.id)
      if (editTarget) {
        onPendingMembersChange?.(
          pendingMembers.map((m) => (m.id === editTarget.id ? payload : m)),
        )
      } else {
        onPendingMembersChange?.([...pendingMembers, payload])
      }
      showSuccess(editTarget ? 'Party member updated.' : 'Party member added.')
    }
    setEditTarget(null)
  }

  const handleDeleteMember = () => {
    if (!deleteTarget) return
    if (caseId) {
      deletePartyMember(deleteTarget.id)
    } else {
      onPendingMembersChange?.(pendingMembers.filter((m) => m.id !== deleteTarget.id))
      showSuccess('Party member removed.')
    }
    setDeleteTarget(null)
  }

  const openAddMember = () => {
    setEditTarget(null)
    setFormOpen(true)
  }

  const openEditMember = (member) => {
    setEditTarget(member)
    setFormOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="size-4 text-primary" aria-hidden="true" />
            {title}
          </CardTitle>
          <Button type="button" size="sm" onClick={openAddMember}>
            <Plus className="size-4" aria-hidden="true" />
            Add Member
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full Name" htmlFor={`${namePrefix}-fullName`}>
              <Input
                id={`${namePrefix}-fullName`}
                value={party.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                className="bg-muted/30"
              />
            </FormField>

            <FormField label="Father Name" htmlFor={`${namePrefix}-fatherName`}>
              <Input
                id={`${namePrefix}-fatherName`}
                value={party.fatherName}
                onChange={(e) => updateField('fatherName', e.target.value)}
                className="bg-muted/30"
              />
            </FormField>

            <FormField label="CNIC" htmlFor={`${namePrefix}-cnic`}>
              <Input
                id={`${namePrefix}-cnic`}
                value={party.cnic}
                onChange={(e) => updateField('cnic', e.target.value)}
                placeholder="XXXXX-XXXXXXX-X"
                className="bg-muted/30"
              />
            </FormField>

            <FormField label="Gender" htmlFor={`${namePrefix}-gender`}>
              <Select
                id={`${namePrefix}-gender`}
                value={party.gender}
                onChange={(e) => updateField('gender', e.target.value)}
                className="bg-muted/30"
              >
                <option value="">Select gender</option>
                {PARTY_GENDERS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="DOB" htmlFor={`${namePrefix}-dob`}>
              <Input
                id={`${namePrefix}-dob`}
                type="date"
                value={party.dob}
                onChange={(e) => updateField('dob', e.target.value)}
                className="bg-muted/30"
              />
            </FormField>

            <FormField label="Email" htmlFor={`${namePrefix}-email`}>
              <Input
                id={`${namePrefix}-email`}
                type="email"
                value={party.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="bg-muted/30"
              />
            </FormField>

            <FormField label="Contact Number" htmlFor={`${namePrefix}-contactNumber`}>
              <Input
                id={`${namePrefix}-contactNumber`}
                value={party.contactNumber}
                onChange={(e) => updateField('contactNumber', e.target.value)}
                className="bg-muted/30"
              />
            </FormField>

            <FormField label="Address" htmlFor={`${namePrefix}-address`}>
              <Input
                id={`${namePrefix}-address`}
                value={party.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="bg-muted/30"
              />
            </FormField>

            <FormField label="City" htmlFor={`${namePrefix}-city`}>
              <Input
                id={`${namePrefix}-city`}
                value={party.city}
                onChange={(e) => updateField('city', e.target.value)}
                className="bg-muted/30"
              />
            </FormField>

            <FormField label="Lawyer Name" htmlFor={`${namePrefix}-lawyerName`}>
              <Input
                id={`${namePrefix}-lawyerName`}
                value={party.lawyerName}
                onChange={(e) => updateField('lawyerName', e.target.value)}
                className="bg-muted/30"
              />
            </FormField>

            <FormField label="Lawyer Role" htmlFor={`${namePrefix}-lawyerRole`}>
              <Input
                id={`${namePrefix}-lawyerRole`}
                value={party.lawyerRole}
                onChange={(e) => updateField('lawyerRole', e.target.value)}
                className="bg-muted/30"
              />
            </FormField>

            <FormField label="Document" htmlFor={`${namePrefix}-document`} className="sm:col-span-2">
              <DocumentField
                inputId={`${namePrefix}-document`}
                document={party.document}
                onSelect={(doc) => updateField('document', doc)}
                onRemove={() => updateField('document', null)}
              />
            </FormField>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Name', 'Relation', 'CNIC', 'Contact', 'City', 'Actions'].map((header) => (
                    <th
                      key={header}
                      className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                      No party members added.
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr key={member.id} className="border-b border-border last:border-0">
                      <td className="px-3 py-2 font-medium">{member.fullName}</td>
                      <td className="px-3 py-2">{getRelationLabel(member.relation)}</td>
                      <td className="px-3 py-2">{member.cnic || '—'}</td>
                      <td className="px-3 py-2">{member.contactNumber || '—'}</td>
                      <td className="px-3 py-2">{member.city || '—'}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-primary"
                            onClick={() => openEditMember(member)}
                            aria-label={`Edit ${member.fullName}`}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive"
                            onClick={() => setDeleteTarget(member)}
                            aria-label={`Delete ${member.fullName}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <PartyMemberFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null) }}
        onSubmit={handleSaveMember}
        initialValues={editTarget ?? { ...PARTY_MEMBER_EMPTY, partyType }}
        title={editTarget ? 'Edit Party Member' : 'Add Party Member'}
        fixedPartyType={partyType}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Party Member"
        description={`Remove ${deleteTarget?.fullName} from this party?`}
        confirmLabel="Delete"
        onConfirm={handleDeleteMember}
      />
    </>
  )
}
