import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText, X } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { FormField, Modal } from '@/components/shared'
import {
  PARTY_MEMBER_GENDERS,
  PARTY_MEMBER_RELATIONS,
} from '@/features/party-members/utils/partyMemberFields'
import { createId } from '@/utils/id'

const partyMemberSchema = z.object({
  partyType: z.string().min(1, 'Party is required'),
  fullName: z.string().min(1, 'Full name is required'),
  fatherName: z.string().min(1, 'Father name is required'),
  cnic: z.string().min(1, 'CNIC is required'),
  gender: z.string().min(1, 'Gender is required'),
  relation: z.string().min(1, 'Relation is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
})

export const PARTY_MEMBER_EMPTY = {
  partyType: '',
  fullName: '',
  fatherName: '',
  cnic: '',
  gender: '',
  relation: '',
  dateOfBirth: '',
  contactNumber: '',
  email: '',
  address: '',
  city: '',
}

export default function PartyMemberFormModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  title,
  fixedPartyType,
}) {
  const [document, setDocument] = useState(initialValues?.document ?? null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(partyMemberSchema),
    defaultValues: { ...PARTY_MEMBER_EMPTY, partyType: fixedPartyType ?? '' },
  })

  useEffect(() => {
    if (!open) return
    const values = {
      ...(initialValues ?? PARTY_MEMBER_EMPTY),
      partyType: fixedPartyType ?? initialValues?.partyType ?? '',
    }
    reset(values)
    setDocument(initialValues?.document ?? null)
  }, [open, initialValues, fixedPartyType, reset])

  useEffect(() => {
    if (fixedPartyType) {
      setValue('partyType', fixedPartyType)
    }
  }, [fixedPartyType, setValue])

  const handleClose = () => {
    reset({ ...PARTY_MEMBER_EMPTY, partyType: fixedPartyType ?? '' })
    setDocument(null)
    onClose?.()
  }

  return (
    <Modal open={open} onClose={handleClose} title={title} size="lg">
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit({
            ...data,
            partyType: fixedPartyType ?? data.partyType,
            email: data.email ?? '',
            document,
          })
          handleClose()
        })}
        className="flex flex-col gap-4"
      >
        <input type="hidden" {...register('partyType')} />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full Name" htmlFor="pm-fullName" required error={errors.fullName?.message}>
            <Input id="pm-fullName" {...register('fullName')} />
          </FormField>
          <FormField label="Father Name" htmlFor="pm-fatherName" required error={errors.fatherName?.message}>
            <Input id="pm-fatherName" {...register('fatherName')} />
          </FormField>
          <FormField label="CNIC" htmlFor="pm-cnic" required error={errors.cnic?.message}>
            <Input id="pm-cnic" placeholder="XXXXX-XXXXXXX-X" {...register('cnic')} />
          </FormField>
          <FormField label="Gender" htmlFor="pm-gender" required error={errors.gender?.message}>
            <Select id="pm-gender" {...register('gender')}>
              <option value="">Select gender</option>
              {PARTY_MEMBER_GENDERS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Relation" htmlFor="pm-relation" required error={errors.relation?.message}>
            <Select id="pm-relation" {...register('relation')}>
              <option value="">Select relation</option>
              {PARTY_MEMBER_RELATIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Date of Birth" htmlFor="pm-dob" required error={errors.dateOfBirth?.message}>
            <Input id="pm-dob" type="date" {...register('dateOfBirth')} />
          </FormField>
          <FormField label="Contact Number" htmlFor="pm-contact" required error={errors.contactNumber?.message}>
            <Input id="pm-contact" {...register('contactNumber')} />
          </FormField>
          <FormField label="Email" htmlFor="pm-email" error={errors.email?.message}>
            <Input id="pm-email" type="email" {...register('email')} />
          </FormField>
          <FormField label="Address" htmlFor="pm-address" required className="sm:col-span-2" error={errors.address?.message}>
            <Input id="pm-address" {...register('address')} />
          </FormField>
          <FormField label="City" htmlFor="pm-city" required error={errors.city?.message}>
            <Input id="pm-city" {...register('city')} />
          </FormField>
          <FormField label="Upload Document" htmlFor="pm-document" className="sm:col-span-2">
            {document ? (
              <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                <FileText className="size-4" />
                <span className="flex-1 truncate text-sm">{document.name}</span>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => setDocument(null)}>
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <Input
                id="pm-document"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setDocument({ id: createId(), name: file.name, size: file.size, type: file.type })
                  e.target.value = ''
                }}
              />
            )}
          </FormField>
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  )
}
