import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormField, Modal } from '@/components/shared'
import {
  ASSIGNED_ROLES,
  internalParticipantSchema,
  externalParticipantSchema,
  MEETING_PARTICIPANT_TYPES,
} from '@/features/meetings/utils/participantFields'
import { fetchUsers } from '@/services/userService'
import { createId } from '@/utils/id'
import { showError } from '@/utils/toast'

const INTERNAL_EMPTY = { teamMemberId: '', assignedRole: '', participantType: '', remarks: '' }
const EXTERNAL_EMPTY = { fullName: '', cnic: '', contactNumber: '', email: '', organization: '', city: '', participantType: '', remarks: '' }

export default function ParticipantModal({
  open,
  onClose,
  type,
  onAdd,
  onEdit,
  editData,
  existingInternalIds = [],
}) {
  const [teamMembers, setTeamMembers] = useState([])
  const isInternal = type === 'internal'
  const isEdit = !!editData

  useEffect(() => {
    fetchUsers()
      .then((data) =>
        setTeamMembers(
          data
            .filter((u) => u.isActive !== false)
            .map((u) => ({
              id: String(u.id),
              name: u.username,
              employeeId: u.id,
              cnic: '',
              email: u.email ?? '',
              city: '',
              teamName: (u.roles ?? [])[0] ?? '',
            })),
        ),
      )
      .catch(() => setTeamMembers([]))
  }, [])

  const internalForm = useForm({
    resolver: zodResolver(internalParticipantSchema),
    defaultValues: INTERNAL_EMPTY,
  })

  const externalForm = useForm({
    resolver: zodResolver(externalParticipantSchema),
    defaultValues: EXTERNAL_EMPTY,
  })

  useEffect(() => {
    if (!open) return
    if (isEdit && editData) {
      if (isInternal) {
        internalForm.reset({
          teamMemberId: editData.teamMemberId ?? '',
          assignedRole: editData.assignedRole ?? '',
          participantType: editData.participantType ?? '',
          remarks: editData.remarks ?? '',
        })
      } else {
        externalForm.reset({
          fullName: editData.fullName ?? editData.name ?? '',
          cnic: editData.cnic ?? '',
          contactNumber: editData.contactNumber ?? '',
          email: editData.email ?? '',
          organization: editData.organization ?? '',
          city: editData.city ?? '',
          participantType: editData.participantType ?? '',
          remarks: editData.remarks ?? '',
        })
      }
    } else {
      internalForm.reset(INTERNAL_EMPTY)
      externalForm.reset(EXTERNAL_EMPTY)
    }
  }, [open, isEdit, editData, isInternal, internalForm, externalForm])

  const handleClose = () => {
    internalForm.reset(INTERNAL_EMPTY)
    externalForm.reset(EXTERNAL_EMPTY)
    onClose?.()
  }

  const availableTeamMembers = teamMembers.filter(
    (m) => isEdit && editData?.teamMemberId === m.id
      ? true
      : !existingInternalIds.includes(m.id),
  )

  const handleInternalSubmit = (data) => {
    const member = teamMembers.find((m) => m.id === data.teamMemberId)
    if (!member) {
      showError('Selected team member not found.')
      return
    }

    if (!isEdit && existingInternalIds.includes(member.id)) {
      showError('This team member is already added to the meeting.')
      return
    }

    const payload = {
      id: editData?.id ?? createId(),
      type: 'internal',
      teamMemberId: member.id,
      name: member.name,
      employeeId: member.employeeId ?? member.id,
      cnic: member.cnic ?? '',
      email: member.email ?? '',
      city: member.city ?? '',
      assignedRole: data.assignedRole,
      participantType: data.participantType,
      remarks: data.remarks ?? '',
      hasPortalAccess: true,
    }

    if (isEdit) onEdit?.(payload)
    else onAdd?.(payload)
    handleClose()
  }

  const handleExternalSubmit = (data) => {
    const payload = {
      id: editData?.id ?? createId(),
      type: 'external',
      fullName: data.fullName,
      name: data.fullName,
      cnic: data.cnic ?? '',
      contactNumber: data.contactNumber,
      email: data.email ?? '',
      organization: data.organization ?? '',
      city: data.city ?? '',
      participantType: data.participantType,
      remarks: data.remarks ?? '',
      hasPortalAccess: false,
    }

    if (isEdit) onEdit?.(payload)
    else onAdd?.(payload)
    handleClose()
  }

  const typeLabel = isInternal ? 'Internal' : 'External'
  const title = `${isEdit ? 'Edit' : 'Add'} ${typeLabel} Participant`

  return (
    <Modal open={open} onClose={handleClose} title={title} size="lg">
      {isInternal ? (
        <form onSubmit={internalForm.handleSubmit(handleInternalSubmit)} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Internal participants are selected from portal users and receive portal access.
          </p>
          <FormField label="Team Member" htmlFor="teamMemberId" required error={internalForm.formState.errors.teamMemberId?.message}>
            <Select id="teamMemberId" {...internalForm.register('teamMemberId')}>
              <option value="">Select team member</option>
              {availableTeamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.teamName ? `(${m.teamName})` : ''}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Assigned Role" htmlFor="assignedRole" required error={internalForm.formState.errors.assignedRole?.message}>
            <Select id="assignedRole" {...internalForm.register('assignedRole')}>
              <option value="">Select role</option>
              {ASSIGNED_ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Participant Type" htmlFor="participantType" required error={internalForm.formState.errors.participantType?.message}>
            <Input
              id="participantType"
              placeholder="Enter participant type"
              {...internalForm.register('participantType')}
            />
          </FormField>
          <FormField label="Remarks" htmlFor="remarks">
            <Textarea id="remarks" rows={3} placeholder="Optional notes" {...internalForm.register('remarks')} />
          </FormField>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit">{isEdit ? 'Save Changes' : 'Add Participant'}</Button>
          </div>
        </form>
      ) : (
        <form onSubmit={externalForm.handleSubmit(handleExternalSubmit)} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            External participants are record-only and do not receive portal access.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full Name" htmlFor="fullName" required error={externalForm.formState.errors.fullName?.message}>
              <Input id="fullName" {...externalForm.register('fullName')} />
            </FormField>
            <FormField label="CNIC" htmlFor="cnic">
              <Input id="cnic" placeholder="XXXXX-XXXXXXX-X" {...externalForm.register('cnic')} />
            </FormField>
            <FormField label="Contact Number" htmlFor="contactNumber" required error={externalForm.formState.errors.contactNumber?.message}>
              <Input id="contactNumber" {...externalForm.register('contactNumber')} />
            </FormField>
            <FormField label="Email" htmlFor="email" error={externalForm.formState.errors.email?.message}>
              <Input id="email" type="email" {...externalForm.register('email')} />
            </FormField>
            <FormField label="Organization" htmlFor="organization">
              <Input id="organization" {...externalForm.register('organization')} />
            </FormField>
            <FormField label="City" htmlFor="city">
              <Input id="city" {...externalForm.register('city')} />
            </FormField>
            <FormField label="Participant Type" htmlFor="ext-participantType" required error={externalForm.formState.errors.participantType?.message}>
              <Select id="ext-participantType" {...externalForm.register('participantType')}>
                <option value="">Select type</option>
                {MEETING_PARTICIPANT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Remarks" htmlFor="ext-remarks" className="sm:col-span-2">
              <Textarea id="ext-remarks" rows={3} placeholder="Optional notes" {...externalForm.register('remarks')} />
            </FormField>
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit">{isEdit ? 'Save Changes' : 'Add Participant'}</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
