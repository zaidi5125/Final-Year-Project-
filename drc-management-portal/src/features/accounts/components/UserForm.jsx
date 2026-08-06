import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { FormField } from '@/components/shared'
import { showError } from '@/utils/toast'

export default function UserForm({ initialValues, roles, onSubmit, onCancel }) {
  const [username, setUsername] = useState(initialValues?.username ?? '')
  const [fullName, setFullName] = useState(initialValues?.fullName ?? '')
  const [email, setEmail] = useState(initialValues?.email ?? '')
  const [roleName, setRoleName] = useState(initialValues?.roles?.[0] ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (!username.trim()) {
      showError('Username is required.')
      return
    }

    if (!roleName) {
      showError('Please select a role.')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        username: username.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        isActive: true,
        roles: [roleName],
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FormField label="Username" htmlFor="user-username" required>
        <Input
          id="user-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. sara.khan"
          required
        />
      </FormField>

      <FormField label="Full Name" htmlFor="user-fullname">
        <Input
          id="user-fullname"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Sara Khan"
        />
      </FormField>

      <FormField label="Email" htmlFor="user-email">
        <Input
          id="user-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. sara@drc.com"
        />
      </FormField>

      <FormField label="Role" htmlFor="user-role" required>
        <Select
          id="user-role"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        >
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.name}>{role.name}</option>
          ))}
        </Select>
      </FormField>

      <div className="flex items-center gap-2 border-t border-border pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save User'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
