import { useState } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
  getGenderLabel,
  getPartyTypeLabel,
  getRelationLabel,
} from '@/features/party-members/utils/partyMemberFields'
import { partyMemberDetailsPath, partyMemberEditPath } from '@/routes/routePaths'

export default function PartyMembersTable({ members, onDelete }) {
  const [deleteTarget, setDeleteTarget] = useState(null)

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {['Full Name', 'Relation', 'Gender', 'CNIC', 'Contact Number', 'Email', 'City', 'Related Party', 'Case Title', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{m.fullName}</td>
                <td className="px-4 py-3">{getRelationLabel(m.relation)}</td>
                <td className="px-4 py-3">{getGenderLabel(m.gender)}</td>
                <td className="px-4 py-3">{m.cnic}</td>
                <td className="px-4 py-3">{m.contactNumber}</td>
                <td className="px-4 py-3">{m.email || '—'}</td>
                <td className="px-4 py-3">{m.city}</td>
                <td className="px-4 py-3">{getPartyTypeLabel(m.partyType)} — {m.mainPartyName}</td>
                <td className="px-4 py-3">{m.caseTitle}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" asChild><Link to={partyMemberDetailsPath(m.id)}><Eye className="size-4" /></Link></Button>
                    <Button variant="ghost" size="icon-sm" asChild><Link to={partyMemberEditPath(m.id)}><Pencil className="size-4" /></Link></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(m)}><Trash2 className="size-4 text-destructive" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {members.map((m) => (
          <div key={m.id} className="rounded-xl border border-border p-4">
            <p className="font-medium">{m.fullName}</p>
            <p className="text-xs text-muted-foreground">{getRelationLabel(m.relation)} · {getGenderLabel(m.gender)}</p>
            <p className="mt-2 text-sm">{m.cnic}</p>
            <p className="text-sm text-muted-foreground">{m.caseTitle}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" asChild><Link to={partyMemberDetailsPath(m.id)}>View</Link></Button>
              <Button variant="outline" size="sm" asChild><Link to={partyMemberEditPath(m.id)}>Edit</Link></Button>
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(m)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Party Member"
        description={`Are you sure you want to delete ${deleteTarget?.fullName}?`}
        confirmLabel="Delete"
        onConfirm={() => { onDelete(deleteTarget.id); setDeleteTarget(null) }}
      />
    </>
  )
}
