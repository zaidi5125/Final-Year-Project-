import { User } from 'lucide-react'
import { Breadcrumb } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ROUTE_PATHS } from '@/routes/routePaths'

const ADMIN_PROFILE = {
  fullName: 'admin',
  userId: 'ADM-2023',
  email: 'admin@platform.com',
  contactNumber: '+1 (555) 000-0000',
  password: '••••••••••',
  accessLevel: 'Super Admin',
  professionalDescription: '',
}

export default function AdministratorPage() {
  return (
    <section aria-label="User Settings" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Breadcrumb
          items={[
            { label: 'Accounts', to: ROUTE_PATHS.USER_SETTINGS },
            { label: 'User Settings' },
          ]}
        />
        <Button className="rounded-xl bg-[#7c3aed] px-6 hover:bg-[#6d28d9]">
          Save Changes
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="h-28 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9]" />

        <div className="relative px-6 pb-6">
          <div className="-mt-10 flex flex-wrap items-end gap-4">
            <div className="flex size-20 items-center justify-center rounded-full border-4 border-card bg-slate-200 text-2xl font-bold text-slate-600">
              A
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-bold text-foreground">Administrator</h1>
              <p className="text-sm text-muted-foreground">
                System Management &amp; User Oversight
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-6 flex items-center gap-2">
            <User className="size-5 text-[#7c3aed]" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">Personal Information</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="admin-full-name">Full Name</Label>
              <Input id="admin-full-name" defaultValue={ADMIN_PROFILE.fullName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-user-id">User ID</Label>
              <Input id="admin-user-id" defaultValue={ADMIN_PROFILE.userId} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email Address</Label>
              <Input id="admin-email" type="email" defaultValue={ADMIN_PROFILE.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-contact">Contact Number</Label>
              <Input id="admin-contact" defaultValue={ADMIN_PROFILE.contactNumber} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input id="admin-password" type="password" defaultValue={ADMIN_PROFILE.password} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-access">Access Level</Label>
              <Input id="admin-access" defaultValue={ADMIN_PROFILE.accessLevel} readOnly />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="admin-description">Professional Description</Label>
              <Textarea
                id="admin-description"
                placeholder="Briefly describe your responsibilities..."
                defaultValue={ADMIN_PROFILE.professionalDescription}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        <div className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="mb-4 text-base font-semibold text-foreground">Account Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Current Status</span>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This account is currently active and has full administrative privileges.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
