import { useState } from 'react'
import { Pencil, Plus, Trash2, Users } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { EmptyState, SectionCard } from '@/components/shared'
import {
  getInternalRoleLabel,
  getParticipantTypeLabel,
} from '@/features/meetings/utils/participantFields'

function getInitials(name) {
  return (name ?? '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

export function InternalParticipantsTable({ participants, onAdd, onEdit, onDelete }) {
  const [deleteTarget, setDeleteTarget] = useState(null)

  return (
    <SectionCard title="Internal Participants">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">Portal users linked to this meeting.</p>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="size-4" /> Add Internal Participant
        </Button>
      </div>

      {participants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No internal participants"
          description="Add internal team members from the portal user directory."
          action={
            <Button type="button" size="sm" onClick={onAdd}>
              <Plus className="size-4" /> Add Internal Participant
            </Button>
          }
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {['Avatar', 'Name', 'Employee ID', 'CNIC', 'Assigned Role', 'Participant Type', 'Email', 'City', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">{getInitials(p.name)}</AvatarFallback>
                      </Avatar>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{p.name}</span>
                        <Badge variant="secondary" className="w-fit text-[10px]">Portal Access</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3">{p.employeeId || '—'}</td>
                    <td className="px-4 py-3">{p.cnic || '—'}</td>
                    <td className="px-4 py-3">{getInternalRoleLabel(p.assignedRole)}</td>
                    <td className="px-4 py-3">{getParticipantTypeLabel(p.participantType)}</td>
                    <td className="px-4 py-3">{p.email || '—'}</td>
                    <td className="px-4 py-3">{p.city || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => onEdit(p)} aria-label="Edit">
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(p)} aria-label="Delete">
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {participants.map((p) => (
              <div key={p.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="size-10 shrink-0">
                    <AvatarFallback>{getInitials(p.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getInternalRoleLabel(p.assignedRole)} · {getParticipantTypeLabel(p.participantType)}
                    </p>
                    <Badge variant="secondary" className="mt-1 text-[10px]">Portal Access</Badge>
                  </div>
                </div>
                <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
                  <p>ID: {p.employeeId || '—'}</p>
                  <p>CNIC: {p.cnic || '—'}</p>
                  <p>{p.email || '—'} · {p.city || '—'}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(p)}>Edit</Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleteTarget(p)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Internal Participant"
        description={`Remove ${deleteTarget?.name} from this meeting?`}
        confirmLabel="Delete"
        onConfirm={() => { onDelete(deleteTarget.id); setDeleteTarget(null) }}
      />
    </SectionCard>
  )
}

export function ExternalParticipantsTable({ participants, onAdd, onEdit, onDelete }) {
  const [deleteTarget, setDeleteTarget] = useState(null)

  return (
    <SectionCard title="External Participants">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">Manually added guests — record only, no portal access.</p>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="size-4" /> Add External Participant
        </Button>
      </div>

      {participants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No external participants"
          description="Add external guests who attend the meeting without portal access."
          action={
            <Button type="button" size="sm" onClick={onAdd}>
              <Plus className="size-4" /> Add External Participant
            </Button>
          }
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {['Name', 'CNIC', 'Contact Number', 'Participant Type', 'Email', 'Organization', 'City', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{p.fullName || p.name}</td>
                    <td className="px-4 py-3">{p.cnic || '—'}</td>
                    <td className="px-4 py-3">{p.contactNumber || '—'}</td>
                    <td className="px-4 py-3">{getParticipantTypeLabel(p.participantType)}</td>
                    <td className="px-4 py-3">{p.email || '—'}</td>
                    <td className="px-4 py-3">{p.organization || '—'}</td>
                    <td className="px-4 py-3">{p.city || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => onEdit(p)} aria-label="Edit">
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(p)} aria-label="Delete">
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {participants.map((p) => (
              <div key={p.id} className="rounded-xl border border-border p-4">
                <p className="font-medium">{p.fullName || p.name}</p>
                <p className="text-xs text-muted-foreground">{getParticipantTypeLabel(p.participantType)}</p>
                <div className="mt-2 grid gap-1 text-sm text-muted-foreground">
                  <p>{p.contactNumber}</p>
                  <p>{p.email || '—'}</p>
                  <p>{p.organization || '—'} · {p.city || '—'}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(p)}>Edit</Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleteTarget(p)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete External Participant"
        description={`Remove ${deleteTarget?.fullName || deleteTarget?.name} from this meeting?`}
        confirmLabel="Delete"
        onConfirm={() => { onDelete(deleteTarget.id); setDeleteTarget(null) }}
      />
    </SectionCard>
  )
}
