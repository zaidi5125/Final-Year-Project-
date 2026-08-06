import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/shared'

const EMPTY_VALUES = {
  title: '',
  message: '',
  recipient: '',
}

export default function SendNotificationForm({
  initialValues = EMPTY_VALUES,
  submitLabel = 'Send Notification',
  onSubmit,
  onCancel,
}) {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const data = {
      title: formData.get('title')?.toString().trim() ?? '',
      message: formData.get('message')?.toString().trim() ?? '',
      recipient: formData.get('recipient')?.toString().trim() ?? '',
    }

    if (!data.title || !data.message || !data.recipient) {
      return
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FormField label="Title" htmlFor="title" required>
        <Input
          id="title"
          name="title"
          defaultValue={initialValues.title}
          placeholder="Notification title"
          required
        />
      </FormField>

      <FormField label="Message" htmlFor="message" required>
        <Textarea
          id="message"
          name="message"
          defaultValue={initialValues.message}
          placeholder="Write your notification message"
          rows={4}
          required
        />
      </FormField>

      <FormField label="Recipient" htmlFor="recipient" required>
        <Input
          id="recipient"
          name="recipient"
          defaultValue={initialValues.recipient}
          placeholder="Email or user name"
          required
        />
      </FormField>

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
