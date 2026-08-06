import { useState } from 'react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ModuleSubNav, PageHeader } from '@/components/shared'
import { NOTIFICATIONS_SUB_NAV_ITEMS } from '@/pages/notifications/NotificationsPage'

function PreferenceToggle({ id, label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
      <div className="space-y-0.5">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
          checked ? 'bg-primary' : 'bg-muted',
        )}
      >
        <span
          className={cn(
            'inline-block size-4 rounded-full bg-background shadow-soft transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1',
          )}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}

export default function NotificationPreferencesPage() {
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <section aria-label="Notification Preferences" className="flex flex-col gap-6">
      <PageHeader
        title="Notification Preferences"
        description="Configure how you receive notifications. Changes are stored locally for this session."
      />

      <ModuleSubNav items={NOTIFICATIONS_SUB_NAV_ITEMS} />

      <Card>
        <CardHeader>
          <CardTitle>Delivery Channels</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <PreferenceToggle
            id="email-notifications"
            label="Email notifications"
            description="Receive notifications via email when enabled."
            checked={emailEnabled}
            onChange={setEmailEnabled}
          />
          <PreferenceToggle
            id="push-notifications"
            label="Push notifications"
            description="Receive browser push notifications when enabled."
            checked={pushEnabled}
            onChange={setPushEnabled}
          />

          <div className="flex items-center gap-2 border-t border-border pt-4">
            <Button type="button" onClick={handleSave}>
              Save Preferences
            </Button>
            {saved && (
              <span className="text-xs text-muted-foreground">Preferences saved locally.</span>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
