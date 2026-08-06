import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  ConfirmDialog,
  DetailItem,
  PageHeader,
  SectionCard,
} from '@/components/shared'
import { usePartyMembers } from '@/features/party-members/context/PartyMembersContext'
import {
  getGenderLabel,
  getPartyTypeLabel,
  getRelationLabel,
} from '@/features/party-members/utils/partyMemberFields'
import { partyMemberEditPath, ROUTE_PATHS } from '@/routes/routePaths'
import { formatDate, formatDateTime } from '@/utils/formatDate'

export default function PartyMemberDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPartyMemberById, deletePartyMember } = usePartyMembers()
  const member = getPartyMemberById(id)
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!member) {
    return (
      <section className="flex flex-col gap-6">
        <PageHeader title="Member Not Found" backTo={ROUTE_PATHS.PARTY_MEMBERS} backLabel="Back" />
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: 'Home', to: ROUTE_PATHS.HOME }, { label: 'Party Members', to: ROUTE_PATHS.PARTY_MEMBERS }, { label: member.fullName }]} />

      <PageHeader
        title={member.fullName}
        description={`Member of ${getPartyTypeLabel(member.partyType)} party`}
        backTo={ROUTE_PATHS.PARTY_MEMBERS}
        backLabel="Back to Party Members"
        actions={
          <>
            <Button variant="outline" asChild><Link to={partyMemberEditPath(id)}><Pencil className="size-4" /> Edit</Link></Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}><Trash2 className="size-4" /> Delete</Button>
          </>
        }
      />

      <SectionCard title="Personal Information">
        <div className="grid gap-6 sm:grid-cols-2">
          <DetailItem label="Full Name" value={member.fullName} />
          <DetailItem label="Father Name" value={member.fatherName} />
          <DetailItem label="CNIC" value={member.cnic} />
          <DetailItem label="Gender" value={getGenderLabel(member.gender)} />
          <DetailItem label="Relation" value={getRelationLabel(member.relation)} />
          <DetailItem label="Date of Birth" value={formatDate(member.dateOfBirth)} />
        </div>
      </SectionCard>

      <SectionCard title="Contact Information">
        <div className="grid gap-6 sm:grid-cols-2">
          <DetailItem label="Contact Number" value={member.contactNumber} />
          <DetailItem label="Email" value={member.email || '—'} />
          <DetailItem label="Address" value={member.address} className="sm:col-span-2" />
          <DetailItem label="City" value={member.city} />
        </div>
      </SectionCard>

      <SectionCard title="Related Case Information">
        <div className="grid gap-6 sm:grid-cols-2">
          <DetailItem label="Case Title" value={member.caseTitle} />
        </div>
      </SectionCard>

      <SectionCard title="Main Party Information">
        <div className="grid gap-6 sm:grid-cols-2">
          <DetailItem label="Party Type" value={getPartyTypeLabel(member.partyType)} />
          <DetailItem label="Main Party Name" value={member.mainPartyName} />
        </div>
      </SectionCard>

      <SectionCard title="Uploaded Documents">
        <DetailItem label="Document" value={member.document?.name || 'No document uploaded'} />
      </SectionCard>

      <SectionCard title="Audit Information">
        <div className="grid gap-6 sm:grid-cols-2">
          <DetailItem label="Created By" value={member.createdByName || '—'} />
          <DetailItem label="Created Date" value={formatDateTime(member.createdAt)} />
          <DetailItem label="Updated By" value={member.updatedByName || '—'} />
          <DetailItem label="Updated Date" value={formatDateTime(member.updatedAt)} />
        </div>
      </SectionCard>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Party Member"
        description={`Delete ${member.fullName}?`}
        confirmLabel="Delete"
        onConfirm={() => { deletePartyMember(id); navigate(ROUTE_PATHS.PARTY_MEMBERS) }}
      />
    </section>
  )
}
