import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, Pencil, Plus, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  ConfirmDialog,
  DetailItem,
  EmptyState,
  FormField,
  Modal,
  Pagination,
  SearchFilterBar,
  SectionCard,
} from '@/components/shared'
import {
  BENEFICIARY_TYPES,
  beneficiarySchema,
  getBeneficiaryTypeLabel,
} from '@/features/researches/utils/beneficiaryFields'
import { useResearches } from '@/features/researches/context/ResearchesContext'
import { useTableState } from '@/hooks/useTableState'
import { createId } from '@/utils/id'
import { showSuccess } from '@/utils/toast'

const EMPTY = {
  fullName: '',
  fatherName: '',
  beneficiaryType: '',
  contactNumber: '',
  email: '',
  cnic: '',
  address: '',
  city: '',
}

function BeneficiaryFormModal({ open, onClose, onSubmit, initialValues, title }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: initialValues ?? EMPTY,
  })

  useEffect(() => {
    if (open) reset(initialValues ?? EMPTY)
  }, [open, initialValues, reset])

  const handleClose = () => {
    reset(EMPTY)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={title} size="lg">
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit({ ...data, email: data.email ?? '' })
          handleClose()
        })}
        className="flex flex-col gap-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full Name" htmlFor="b-fullName" required error={errors.fullName?.message}>
            <Input id="b-fullName" {...register('fullName')} />
          </FormField>
          <FormField label="Father Name" htmlFor="b-fatherName" required error={errors.fatherName?.message}>
            <Input id="b-fatherName" {...register('fatherName')} />
          </FormField>
          <FormField label="Beneficiary Type" htmlFor="b-type" required error={errors.beneficiaryType?.message}>
            <Select id="b-type" {...register('beneficiaryType')}>
              <option value="">Select type</option>
              {BENEFICIARY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="CNIC" htmlFor="b-cnic" required error={errors.cnic?.message}>
            <Input id="b-cnic" placeholder="XXXXX-XXXXXXX-X" {...register('cnic')} />
          </FormField>
          <FormField label="Contact Number" htmlFor="b-contact" required error={errors.contactNumber?.message}>
            <Input id="b-contact" {...register('contactNumber')} />
          </FormField>
          <FormField label="Email" htmlFor="b-email" error={errors.email?.message}>
            <Input id="b-email" type="email" {...register('email')} />
          </FormField>
          <FormField label="Address" htmlFor="b-address" required className="sm:col-span-2" error={errors.address?.message}>
            <Input id="b-address" {...register('address')} />
          </FormField>
          <FormField label="City" htmlFor="b-city" required error={errors.city?.message}>
            <Input id="b-city" {...register('city')} />
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

export default function BeneficiariesSection({ researchId, readOnly = false }) {
  const { getResearchById, updateResearch } = useResearches()
  const research = getResearchById(researchId)
  const beneficiaries = research?.beneficiaries ?? []

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [viewTarget, setViewTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const table = useTableState({
    data: beneficiaries,
    searchFields: ['fullName', 'cnic', 'city'],
    pageSize: 5,
  })

  const paginatedBeneficiaries = useMemo(() => {
    const start = (table.page - 1) * table.pageSize
    return table.filtered.slice(start, start + table.pageSize)
  }, [table.filtered, table.page, table.pageSize])

  const totalPages = Math.max(1, Math.ceil(table.filtered.length / table.pageSize))

  if (!research) return null

  const saveBeneficiaries = (next, message) => {
    updateResearch(researchId, { beneficiaries: next })
    if (message) showSuccess(message)
  }

  const handleAdd = (data) => {
    saveBeneficiaries(
      [
        ...beneficiaries,
        {
          id: createId(),
          researchId,
          researchTitle: research.title,
          researchTopic: research.topic,
          ...data,
        },
      ],
      'Beneficiary added successfully.',
    )
  }

  const handleEdit = (data) => {
    saveBeneficiaries(
      beneficiaries.map((b) =>
        b.id === editTarget.id
          ? { ...b, ...data, researchId, researchTitle: research.title, researchTopic: research.topic }
          : b,
      ),
      'Beneficiary updated successfully.',
    )
    setEditTarget(null)
  }

  const handleDelete = () => {
    saveBeneficiaries(
      beneficiaries.filter((b) => b.id !== deleteTarget.id),
      'Beneficiary deleted successfully.',
    )
    setDeleteTarget(null)
  }

  return (
    <SectionCard title="Beneficiaries">
      {!readOnly && (
        <div className="mb-4 flex justify-end">
          <Button type="button" size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="size-4" /> Add Beneficiary
          </Button>
        </div>
      )}

      <SearchFilterBar
        search={table.search}
        onSearchChange={(v) => { table.setSearch(v); table.setPage(1) }}
        searchPlaceholder="Search beneficiaries..."
        filters={[{
          key: 'beneficiaryType',
          label: 'All Types',
          value: table.activeFilters.beneficiaryType ?? '',
          onChange: (v) => table.setFilter('beneficiaryType', v),
          options: BENEFICIARY_TYPES,
        }]}
      />

      {beneficiaries.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No beneficiaries added"
          description="Beneficiaries linked to this research will appear here."
          action={
            !readOnly ? (
              <Button type="button" size="sm" onClick={() => setFormOpen(true)}>
                <Plus className="size-4" /> Add Beneficiary
              </Button>
            ) : undefined
          }
        />
      ) : table.filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No matching beneficiaries"
          description="Try adjusting your search or filters."
          action={<Button variant="outline" onClick={table.clearFilters}>Clear Filters</Button>}
        />
      ) : (
        <>
          <div className="mt-4 hidden overflow-x-auto rounded-xl border border-border md:block">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {['Full Name', 'Beneficiary Type', 'Father Name', 'CNIC', 'Contact Number', 'Email', 'City', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedBeneficiaries.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{b.fullName}</td>
                    <td className="px-4 py-3">{getBeneficiaryTypeLabel(b.beneficiaryType)}</td>
                    <td className="px-4 py-3">{b.fatherName}</td>
                    <td className="px-4 py-3">{b.cnic}</td>
                    <td className="px-4 py-3">{b.contactNumber}</td>
                    <td className="px-4 py-3">{b.email || '—'}</td>
                    <td className="px-4 py-3">{b.city}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => setViewTarget(b)} aria-label="View">
                          <Eye className="size-4" />
                        </Button>
                        {!readOnly && (
                          <>
                            <Button variant="ghost" size="icon-sm" onClick={() => setEditTarget(b)} aria-label="Edit">
                              <Pencil className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(b)} aria-label="Delete">
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:hidden">
            {paginatedBeneficiaries.map((b) => (
              <div key={b.id} className="rounded-xl border border-border p-4">
                <p className="font-medium">{b.fullName}</p>
                <p className="text-xs text-muted-foreground">{getBeneficiaryTypeLabel(b.beneficiaryType)}</p>
                <p className="mt-1 text-sm">{b.cnic} · {b.city}</p>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setViewTarget(b)}>View</Button>
                  {!readOnly && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setEditTarget(b)}>Edit</Button>
                      <Button variant="outline" size="sm" onClick={() => setDeleteTarget(b)}>Delete</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Pagination
              page={table.page}
              totalPages={totalPages}
              totalCount={table.filtered.length}
              pageSize={table.pageSize}
              onPageChange={table.setPage}
              onPageSizeChange={(s) => { table.setPageSize(s); table.setPage(1) }}
            />
          </div>
        </>
      )}

      {!readOnly && (
        <>
          <BeneficiaryFormModal
            open={formOpen}
            onClose={() => setFormOpen(false)}
            onSubmit={handleAdd}
            title="Add Beneficiary"
          />
          <BeneficiaryFormModal
            open={!!editTarget}
            onClose={() => setEditTarget(null)}
            onSubmit={handleEdit}
            initialValues={editTarget ?? undefined}
            title="Edit Beneficiary"
          />
        </>
      )}

      <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title="Beneficiary Details" size="lg">
        {viewTarget && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold">Personal Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem label="Full Name" value={viewTarget.fullName} />
                <DetailItem label="Father Name" value={viewTarget.fatherName} />
                <DetailItem label="Beneficiary Type" value={getBeneficiaryTypeLabel(viewTarget.beneficiaryType)} />
                <DetailItem label="CNIC" value={viewTarget.cnic} />
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold">Contact Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem label="Contact Number" value={viewTarget.contactNumber} />
                <DetailItem label="Email" value={viewTarget.email || '—'} />
                <DetailItem label="Address" value={viewTarget.address} className="sm:col-span-2" />
                <DetailItem label="City" value={viewTarget.city} />
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold">Research Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem label="Research Title" value={viewTarget.researchTitle ?? research.title} />
                <DetailItem label="Research Topic" value={viewTarget.researchTopic ?? research.topic} />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {!readOnly && (
        <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Beneficiary"
          description={`Are you sure you want to delete ${deleteTarget?.fullName}?`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
        />
      )}
    </SectionCard>
  )
}
