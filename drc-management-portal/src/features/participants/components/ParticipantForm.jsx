import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload, FormField, SectionCard } from '@/components/shared'
import {
  PARTICIPANT_GENDERS,
  PARTICIPANT_STATUSES,
} from '@/features/participants/utils/participantFields'

const EMPTY_VALUES = {
  participantId: '',
  profileImage: '',
  fullName: '',
  fatherName: '',
  gender: '',
  status: 'active',
  contactNumber: '',
  email: '',
  cnic: '',
  city: '',
  address: '',
  enrolledDate: '',
  sessionYear: '',
}

export default function ParticipantForm({
  initialValues = EMPTY_VALUES,
  submitLabel = 'Save Participant',
  onSubmit,
  onCancel,
}) {
  const [profileImage, setProfileImage] = useState(initialValues.profileImage ?? '')

  const handleProfileSelected = (files) => {
    const file = files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setProfileImage(reader.result?.toString() ?? '')
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const data = {
      participantId: formData.get('participantId')?.toString().trim() ?? '',
      profileImage,
      fullName: formData.get('fullName')?.toString().trim() ?? '',
      fatherName: formData.get('fatherName')?.toString().trim() ?? '',
      gender: formData.get('gender')?.toString() ?? '',
      status: formData.get('status')?.toString() ?? 'active',
      contactNumber: formData.get('contactNumber')?.toString().trim() ?? '',
      email: formData.get('email')?.toString().trim() ?? '',
      cnic: formData.get('cnic')?.toString().trim() ?? '',
      city: formData.get('city')?.toString().trim() ?? '',
      address: formData.get('address')?.toString().trim() ?? '',
      enrolledDate: formData.get('enrolledDate')?.toString() ?? '',
      sessionYear: formData.get('sessionYear')?.toString().trim() ?? '',
    }

    if (
      !data.fullName ||
      !data.fatherName ||
      !data.gender ||
      !data.status ||
      !data.contactNumber ||
      !data.email ||
      !data.cnic ||
      !data.city ||
      !data.address ||
      !data.enrolledDate ||
      !data.sessionYear
    ) {
      return
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <SectionCard title="Core Information">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Participant ID" htmlFor="participantId">
            <Input
              id="participantId"
              name="participantId"
              defaultValue={initialValues.participantId}
              placeholder="Auto-generated if empty"
            />
          </FormField>

          <FormField label="Full Name" htmlFor="fullName" required>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={initialValues.fullName}
              placeholder="Full name"
              required
            />
          </FormField>

          <FormField label="Father Name" htmlFor="fatherName" required>
            <Input
              id="fatherName"
              name="fatherName"
              defaultValue={initialValues.fatherName}
              placeholder="Father name"
              required
            />
          </FormField>

          <FormField label="Gender" htmlFor="gender" required>
            <Select id="gender" name="gender" defaultValue={initialValues.gender} required>
              <option value="">Select gender</option>
              {PARTICIPANT_GENDERS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Status" htmlFor="status" required>
            <Select id="status" name="status" defaultValue={initialValues.status} required>
              {PARTICIPANT_STATUSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Profile Image" htmlFor="profileImage" className="sm:col-span-2">
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
      </SectionCard>

      <SectionCard title="Contact Information">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Contact Number" htmlFor="contactNumber" required>
            <Input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              defaultValue={initialValues.contactNumber}
              placeholder="Contact number"
              required
            />
          </FormField>

          <FormField label="Email" htmlFor="email" required>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={initialValues.email}
              placeholder="email@example.com"
              required
            />
          </FormField>

          <FormField label="CNIC" htmlFor="cnic" required>
            <Input
              id="cnic"
              name="cnic"
              defaultValue={initialValues.cnic}
              placeholder="XXXXX-XXXXXXX-X"
              required
            />
          </FormField>

          <FormField label="City" htmlFor="city" required>
            <Input
              id="city"
              name="city"
              defaultValue={initialValues.city}
              placeholder="City"
              required
            />
          </FormField>

          <FormField label="Address" htmlFor="address" required className="sm:col-span-2">
            <Textarea
              id="address"
              name="address"
              defaultValue={initialValues.address}
              placeholder="Full address"
              rows={3}
              required
            />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Enrollment Information">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Enrolled Date" htmlFor="enrolledDate" required>
            <Input
              id="enrolledDate"
              name="enrolledDate"
              type="date"
              defaultValue={initialValues.enrolledDate}
              required
            />
          </FormField>

          <FormField label="Session Year" htmlFor="sessionYear" required>
            <Input
              id="sessionYear"
              name="sessionYear"
              defaultValue={initialValues.sessionYear}
              placeholder="e.g. 2025-2026"
              required
            />
          </FormField>
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
