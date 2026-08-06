import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/shared'
import { LEAD_STATUSES, LEAD_TYPES } from '@/features/leads/utils/leadStatus'

const EMPTY_VALUES = {
  name: '',
  email: '',
  phone: '',
  company: '',
  type: '',
  status: 'new',
  notes: '',
}

export default function LeadForm({
  initialValues = EMPTY_VALUES,
  submitLabel = 'Save Lead',
  onSubmit,
  onCancel,
  showStatus = false,
}) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const data = {
      name: formData.get('name')?.toString().trim() ?? '',
      email: formData.get('email')?.toString().trim() ?? '',
      phone: formData.get('phone')?.toString().trim() ?? '',
      company: formData.get('company')?.toString().trim() ?? '',
      type: formData.get('type')?.toString() ?? '',
      notes: formData.get('notes')?.toString().trim() ?? '',
    }

    if (showStatus) {
      data.status = formData.get('status')?.toString() ?? ''
    }

    if (!data.name || !data.email || !data.type) {
      return
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Name" htmlFor="name" required>
          <Input
            id="name"
            name="name"
            defaultValue={initialValues.name}
            placeholder="Full name"
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

        <FormField label="Phone" htmlFor="phone">
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={initialValues.phone}
            placeholder="Phone number"
          />
        </FormField>

        <FormField label="Company" htmlFor="company">
          <Input
            id="company"
            name="company"
            defaultValue={initialValues.company}
            placeholder="Company name"
          />
        </FormField>

        <FormField label="Type" htmlFor="type" required>
          <Select
            id="type"
            name="type"
            defaultValue={initialValues.type}
            required
          >
            <option value="">Select type</option>
            {LEAD_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </FormField>

        {showStatus && (
          <FormField label="Status" htmlFor="status" required>
            <Select
              id="status"
              name="status"
              defaultValue={initialValues.status}
              required
            >
              {LEAD_STATUSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </FormField>
        )}

        <FormField label="Notes" htmlFor="notes" className="sm:col-span-2">
          <Textarea
            id="notes"
            name="notes"
            defaultValue={initialValues.notes}
            placeholder="Additional notes"
            rows={4}
          />
        </FormField>
      </div>

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
