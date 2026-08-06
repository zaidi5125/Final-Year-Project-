import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { FormField, SectionCard } from '@/components/shared'
import {
  PARTY_MEMBER_GENDERS,
  PARTY_MEMBER_RELATIONS,
  PARTY_TYPES,
  partyMemberSchema,
} from '@/features/party-members/utils/partyMemberFields'
import { useServices } from '@/features/services/context/ServicesContext'
import { getCaseDisplayTitle } from '@/features/services/utils/caseFields'
import { createId } from '@/utils/id'
import { showError } from '@/utils/toast'

const EMPTY_VALUES = {
  caseId: '',
  partyId: '',
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

export default function PartyMemberForm({
  initialValues = EMPTY_VALUES,
  initialDocument = null,
  submitLabel = 'Save',
  onSubmit,
  onCancel,
}) {
  const { cases } = useServices()
  const [document, setDocument] = useState(initialDocument)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(partyMemberSchema),
    defaultValues: {
      caseId: initialValues.caseId ?? '',
      partyId: initialValues.partyId ?? '',
      partyType: initialValues.partyType ?? '',
      fullName: initialValues.fullName ?? '',
      fatherName: initialValues.fatherName ?? '',
      cnic: initialValues.cnic ?? '',
      gender: initialValues.gender ?? '',
      relation: initialValues.relation ?? '',
      dateOfBirth: initialValues.dateOfBirth ?? '',
      contactNumber: initialValues.contactNumber ?? '',
      email: initialValues.email ?? '',
      address: initialValues.address ?? '',
      city: initialValues.city ?? '',
    },
  })

  const selectedCaseId = watch('caseId')
  const selectedPartyId = watch('partyId')
  const selectedCase = cases.find((c) => c.id === selectedCaseId)

  const partyOptions = useMemo(() => {
    if (!selectedCase) return []
    return PARTY_TYPES.map((pt) => {
      const party = selectedCase[pt.value]
      const name = party?.fullName || pt.label
      return {
        value: `${selectedCase.id}-${pt.value}`,
        label: `${pt.label} — ${name}`,
        partyType: pt.value,
        mainPartyName: name,
      }
    })
  }, [selectedCase])

  const prevCaseIdRef = useRef(initialValues.caseId ?? '')

  useEffect(() => {
    if (prevCaseIdRef.current !== selectedCaseId) {
      if (prevCaseIdRef.current) {
        setValue('partyId', '')
        setValue('partyType', '')
      }
      prevCaseIdRef.current = selectedCaseId
    }
  }, [selectedCaseId, setValue])

  const handlePartyChange = (e) => {
    const val = e.target.value
    setValue('partyId', val, { shouldValidate: true })
    const opt = partyOptions.find((o) => o.value === val)
    if (opt) setValue('partyType', opt.partyType, { shouldValidate: true })
  }

  const onFormSubmit = (data) => {
    if (!data.caseId || !data.partyId) {
      showError('Case and party selection are required.')
      return
    }

    const opt = partyOptions.find((o) => o.value === data.partyId)
    onSubmit({
      ...data,
      email: data.email ?? '',
      mainPartyName: opt?.mainPartyName ?? initialValues.mainPartyName ?? '',
      caseTitle: selectedCase ? getCaseDisplayTitle(selectedCase) : initialValues.caseTitle ?? '',
      document,
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6">
      <input type="hidden" {...register('partyId')} />
      <input type="hidden" {...register('partyType')} />

      <SectionCard title="Party Information">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Select Case" htmlFor="caseId" required error={errors.caseId?.message}>
            <Select id="caseId" {...register('caseId')}>
              <option value="">Select a case</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>{getCaseDisplayTitle(c)}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Select Party" htmlFor="partyId" required error={errors.partyId?.message}>
            <Select
              id="partyId"
              value={selectedPartyId}
              onChange={handlePartyChange}
              disabled={!selectedCaseId}
            >
              <option value="">Select a party</option>
              {partyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Member Information">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Full Name" htmlFor="fullName" required error={errors.fullName?.message}>
            <Input id="fullName" {...register('fullName')} />
          </FormField>
          <FormField label="Father Name" htmlFor="fatherName" required error={errors.fatherName?.message}>
            <Input id="fatherName" {...register('fatherName')} />
          </FormField>
          <FormField label="CNIC" htmlFor="cnic" required error={errors.cnic?.message}>
            <Input id="cnic" placeholder="XXXXX-XXXXXXX-X" {...register('cnic')} />
          </FormField>
          <FormField label="Gender" htmlFor="gender" required error={errors.gender?.message}>
            <Select id="gender" {...register('gender')}>
              <option value="">Select gender</option>
              {PARTY_MEMBER_GENDERS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Relation" htmlFor="relation" required error={errors.relation?.message}>
            <Select id="relation" {...register('relation')}>
              <option value="">Select relation</option>
              {PARTY_MEMBER_RELATIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Date of Birth" htmlFor="dateOfBirth" required error={errors.dateOfBirth?.message}>
            <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
          </FormField>
          <FormField label="Contact Number" htmlFor="contactNumber" required error={errors.contactNumber?.message}>
            <Input id="contactNumber" {...register('contactNumber')} />
          </FormField>
          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" {...register('email')} />
          </FormField>
          <FormField label="Address" htmlFor="address" required className="sm:col-span-2" error={errors.address?.message}>
            <Input id="address" {...register('address')} />
          </FormField>
          <FormField label="City" htmlFor="city" required error={errors.city?.message}>
            <Input id="city" {...register('city')} />
          </FormField>
          <FormField label="Upload Document" htmlFor="document" className="sm:col-span-2">
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
                id="document"
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
      </SectionCard>

      <div className="flex items-center gap-2 border-t border-border pt-4">
        <Button type="submit">{submitLabel}</Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  )
}
