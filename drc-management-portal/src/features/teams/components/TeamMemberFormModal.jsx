import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { FileUpload, FormField, Modal } from '@/components/shared'
import {
  TEAM_MEMBER_GENDERS,
  TEAM_MEMBER_STATUSES,
  teamMemberSchema,
} from '@/features/teams/utils/teamMemberFields'

export const TEAM_MEMBER_EMPTY = {
  teamMemberId: '',
  profileImage: '',
  fullName: '',
  fatherName: '',
  cnic: '',
  contactNumber: '',
  email: '',
  address: '',
  city: '',
  gender: '',
  experience: '',
  status: 'active',
  joiningDate: new Date().toISOString().slice(0, 10),
}

export default function TeamMemberFormModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  title,
}) {
  const [profileImage, setProfileImage] = useState(initialValues?.profileImage ?? '')
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: { ...TEAM_MEMBER_EMPTY, ...initialValues },
  })

  useEffect(() => {
    if (!open) return
    reset({ ...TEAM_MEMBER_EMPTY, ...initialValues })
    setProfileImage(initialValues?.profileImage ?? '')
  }, [open, initialValues, reset])

  const handleClose = () => {
    reset(TEAM_MEMBER_EMPTY)
    setProfileImage('')
    onClose?.()
  }

  const handleProfileSelected = (files) => {
    const file = files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setProfileImage(reader.result?.toString() ?? '')
    reader.readAsDataURL(file)
  }

  return (
    <Modal open={open} onClose={handleClose} title={title} size="lg">
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit({ ...data, profileImage })
          handleClose()
        })}
        className="flex flex-col gap-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Team Member ID" htmlFor="tm-id">
            <Input
              id="tm-id"
              {...register('teamMemberId')}
              placeholder="Auto-generated if empty"
            />
          </FormField>

          <FormField label="Full Name" htmlFor="tm-fullName" required error={errors.fullName?.message}>
            <Input id="tm-fullName" {...register('fullName')} />
          </FormField>

          <FormField label="Father Name" htmlFor="tm-fatherName" required error={errors.fatherName?.message}>
            <Input id="tm-fatherName" {...register('fatherName')} />
          </FormField>

          <FormField label="CNIC" htmlFor="tm-cnic" required error={errors.cnic?.message}>
            <Input id="tm-cnic" placeholder="XXXXX-XXXXXXX-X" {...register('cnic')} />
          </FormField>

          <FormField label="Contact Number" htmlFor="tm-contact" required error={errors.contactNumber?.message}>
            <Input id="tm-contact" {...register('contactNumber')} />
          </FormField>

          <FormField label="Email" htmlFor="tm-email" required error={errors.email?.message}>
            <Input id="tm-email" type="email" {...register('email')} />
          </FormField>

          <FormField label="Gender" htmlFor="tm-gender" required error={errors.gender?.message}>
            <Select id="tm-gender" {...register('gender')}>
              <option value="">Select gender</option>
              {TEAM_MEMBER_GENDERS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="Experience" htmlFor="tm-experience" required error={errors.experience?.message}>
            <Input id="tm-experience" placeholder="e.g. 3 years" {...register('experience')} />
          </FormField>

          <FormField label="Status" htmlFor="tm-status" required error={errors.status?.message}>
            <Select id="tm-status" {...register('status')}>
              {TEAM_MEMBER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="Joining Date" htmlFor="tm-joiningDate" required error={errors.joiningDate?.message}>
            <Input id="tm-joiningDate" type="date" {...register('joiningDate')} />
          </FormField>

          <FormField label="City" htmlFor="tm-city" required error={errors.city?.message}>
            <Input id="tm-city" {...register('city')} />
          </FormField>

          <FormField label="Address" htmlFor="tm-address" required className="sm:col-span-2" error={errors.address?.message}>
            <Input id="tm-address" {...register('address')} />
          </FormField>

          <FormField label="Profile Image" htmlFor="tm-profile" className="sm:col-span-2">
            <div className="flex flex-col gap-3">
              {profileImage && (
                <img
                  src={profileImage}
                  alt="Profile preview"
                  className="size-20 rounded-full border border-border object-cover"
                />
              )}
              <FileUpload
                label="Upload profile image"
                description="JPG or PNG profile photo"
                accept="image/*"
                multiple={false}
                onFilesSelected={handleProfileSelected}
              />
            </div>
          </FormField>
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save Member</Button>
        </div>
      </form>
    </Modal>
  )
}
