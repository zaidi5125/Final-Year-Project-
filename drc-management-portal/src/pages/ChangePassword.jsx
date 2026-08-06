import { useState } from 'react'
import { KeyRound, Lock, Menu } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROUTE_PATHS } from '@/routes/routePaths'
import { showError, showSuccess } from '@/utils/toast'
import { useAuth } from '@/store/AuthContext'
import { changePassword } from '@/services/authService'

function resolveHomeRoute(roles) {
  const normalized = (roles || []).map((r) => r.toLowerCase())
  if (normalized.includes('admin')) return ROUTE_PATHS.ADMIN_DASHBOARD
  if (normalized.includes('sub admin')) return ROUTE_PATHS.SUBADMIN_DASHBOARD
  return ROUTE_PATHS.STAFF_DASHBOARD
}

export default function ChangePassword() {
  const navigate = useNavigate()
  const { user, completePasswordChange } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      showError('All password fields are required.')
      return
    }

    if (newPassword.length < 8) {
      showError('New password must be at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      showError('New password and confirm password do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      const data = await changePassword(currentPassword, newPassword)
      showSuccess('Password updated successfully.')

      if (user) {
        const updatedUser = completePasswordChange(data.access, data.refresh)
        navigate(resolveHomeRoute(updatedUser?.roles))
      } else {
        navigate(ROUTE_PATHS.LOGIN)
      }
    } catch (error) {
      const message =
        error.response?.data?.current_password?.[0] ||
        error.response?.data?.new_password?.[0] ||
        error.response?.data?.detail ||
        'Could not update password.'
      showError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="flex h-14 shrink-0 items-center gap-3 bg-[#1a1a2e] px-4 text-white">
        <button
          type="button"
          className="rounded-lg p-1.5 text-white/80 hover:bg-white/10"
          aria-label="Menu"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
        <h1 className="text-sm font-medium">DRC Management Portal</h1>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-soft-lg">
          <div className="mb-2 flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <KeyRound className="size-6" aria-hidden="true" />
            </div>
          </div>
          <h2 className="mb-2 text-center text-xl font-bold text-foreground">
            Change Password
          </h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Update your account password to keep your access secure.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="pl-10"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="pl-10"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="pl-10"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border-0 bg-gradient-to-r from-[#8e54e9] to-[#4776e6] text-base font-semibold shadow-md hover:opacity-95"
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              <Link to={ROUTE_PATHS.LOGIN} className="font-medium text-primary hover:underline">
                Back to login
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}
