import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog, EmptyState, SectionCard } from '@/components/shared'
import TeamMemberFormModal, { TEAM_MEMBER_EMPTY } from '@/features/teams/components/TeamMemberFormModal'
import TeamMemberStatusBadge from '@/features/teams/components/TeamMemberStatusBadge'
import { useTeamMembersStore } from '@/features/teams/context/TeamMembersContext'
import {
  getMemberDisplayName,
  getMemberGenderLabel,
} from '@/features/teams/utils/teamMemberFields'
import { createId } from '@/utils/id'
import { formatDate } from '@/utils/formatDate'
import { showError, showSuccess } from '@/utils/toast'

export default function TeamMembersSection({
  teamId,
  pendingMembers = [],
  onPendingMembersChange,
}) {
  const {
    members: allMembers,
    getMembersByTeam,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    assignMemberToTeam,
    removeMembership,
  } = useTeamMembersStore()

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const savedMembers = teamId ? getMembersByTeam(teamId) : []
  const members = teamId ? savedMembers : pendingMembers

  const memberCountLabel = useMemo(
    () => `${members.length} member${members.length === 1 ? '' : 's'}`,
    [members.length],
  )

  const buildPendingPayload = (data, existingId) => ({
    id: existingId ?? createId(),
    teamMemberId: data.teamMemberId,
    profileImage: data.profileImage,
    fullName: data.fullName,
    fatherName: data.fatherName,
    cnic: data.cnic,
    contactNumber: data.contactNumber,
    email: data.email,
    address: data.address,
    city: data.city,
    gender: data.gender,
    experience: data.experience,
    status: data.status,
    joiningDate: data.joiningDate,
  })

  const handleSave = (data) => {
    if (teamId) {
      if (editTarget?.membershipId) {
        updateTeamMember(editTarget.id, {
          teamMemberId: data.teamMemberId,
          profileImage: data.profileImage,
          fullName: data.fullName,
          fatherName: data.fatherName,
          cnic: data.cnic,
          contactNumber: data.contactNumber,
          email: data.email,
          address: data.address,
          city: data.city,
          gender: data.gender,
          experience: data.experience,
          status: data.status,
        })
      } else {
        const existingMember = allMembers.find(
          (m) => m.cnic === data.cnic || m.email === data.email,
        )
        if (existingMember) {
          const membership = assignMemberToTeam(teamId, existingMember.id, data.joiningDate)
          if (membership) showSuccess('Member assigned to team.')
        } else {
          const member = addTeamMember(data)
          if (member) {
            assignMemberToTeam(teamId, member.id, data.joiningDate)
            showSuccess('Team member added.')
          }
        }
      }
    } else {
      const payload = buildPendingPayload(data, editTarget?.id)
      const duplicate = pendingMembers.some(
        (m) => m.id !== editTarget?.id && (m.cnic === payload.cnic || m.email === payload.email),
      )
      if (duplicate) {
        showError('Member with same CNIC or email already added.')
        return
      }

      if (editTarget) {
        onPendingMembersChange?.(
          pendingMembers.map((m) => (m.id === editTarget.id ? payload : m)),
        )
        showSuccess('Team member updated.')
      } else {
        onPendingMembersChange?.([...pendingMembers, payload])
        showSuccess('Team member added.')
      }
    }
    setEditTarget(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    if (teamId) {
      if (deleteTarget.membershipId) {
        removeMembership(deleteTarget.membershipId)
      } else {
        deleteTeamMember(deleteTarget.id)
      }
    } else {
      onPendingMembersChange?.(pendingMembers.filter((m) => m.id !== deleteTarget.id))
      showSuccess('Team member removed.')
    }
    setDeleteTarget(null)
  }

  return (
    <SectionCard title="Team Members">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{memberCountLabel}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="size-4" /> Add Member
        </Button>
      </div>

      {members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members yet"
          description="Add team members and assign them to this team."
          action={
            <Button type="button" size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="size-4" /> Add Member
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {['ID', 'Name', 'CNIC', 'Email', 'Contact', 'Gender', 'Experience', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.membershipId ?? member.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{member.teamMemberId || '—'}</td>
                  <td className="px-4 py-3 font-medium">{getMemberDisplayName(member)}</td>
                  <td className="px-4 py-3">{member.cnic || '—'}</td>
                  <td className="px-4 py-3">{member.email || '—'}</td>
                  <td className="px-4 py-3">{member.contactNumber || '—'}</td>
                  <td className="px-4 py-3">{getMemberGenderLabel(member.gender)}</td>
                  <td className="px-4 py-3">{member.experience || '—'}</td>
                  <td className="px-4 py-3">
                    <TeamMemberStatusBadge status={member.status} />
                  </td>
                  <td className="px-4 py-3">{member.joiningDate ? formatDate(member.joiningDate) : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => { setEditTarget(member); setFormOpen(true) }}
                        aria-label="Edit member"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(member)}
                        aria-label="Delete member"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TeamMemberFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null) }}
        onSubmit={handleSave}
        initialValues={editTarget ?? TEAM_MEMBER_EMPTY}
        title={editTarget ? 'Edit Team Member' : 'Add Team Member'}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Remove Team Member"
        description={`Remove ${getMemberDisplayName(deleteTarget)} from this team?`}
        confirmLabel="Remove"
        onConfirm={handleDelete}
      />
    </SectionCard>
  )
}
