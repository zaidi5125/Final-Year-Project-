import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { FormField } from '@/components/shared'
import {
  PARTICIPANT_GENDERS,
  PARTICIPANT_STATUSES,
} from '@/features/participants/utils/participantFields'

const EMPTY_FILTERS = { gender: '', status: '' }

export default function FiltersDrawer({ open, onOpenChange, filters, onApply }) {
  const [draft, setDraft] = useState(filters)

  useEffect(() => {
    if (open) {
      setDraft(filters)
    }
  }, [open, filters])

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleApply = () => {
    onApply(draft)
    onOpenChange(false)
  }

  const handleClear = () => {
    setDraft(EMPTY_FILTERS)
    onApply(EMPTY_FILTERS)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent onClose={handleClose}>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Narrow the participants list by gender and status.
          </SheetDescription>
        </SheetHeader>

        <SheetBody>
          <div className="flex flex-col gap-5">
            <FormField label="Gender" htmlFor="filter-gender">
              <Select
                id="filter-gender"
                value={draft.gender}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, gender: event.target.value }))
                }
              >
                <option value="">All genders</option>
                {PARTICIPANT_GENDERS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Status" htmlFor="filter-status">
              <Select
                id="filter-status"
                value={draft.status}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, status: event.target.value }))
                }
              >
                <option value="">All statuses</option>
                {PARTICIPANT_STATUSES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        </SheetBody>

        <SheetFooter>
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button type="button" onClick={handleApply}>
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
