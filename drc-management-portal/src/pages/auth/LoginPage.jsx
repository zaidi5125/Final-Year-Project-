import { useState } from 'react'
import { Lock, Menu, Shield, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROUTE_PATHS } from '@/routes/routePaths'
import { showError, showSuccess } from '@/utils/toast'
import { useAuth } from '@/store/AuthContext'

function resolveHomeRoute(roles) {
  const normalized = (roles || []).map((r) => r.toLowerCase())
  if (normalized.includes('admin')) return ROUTE_PATHS.ADMIN_DASHBOARD
  if (normalized.includes('sub admin')) return ROUTE_PATHS.SUBADMIN_DASHBOARD
  return ROUTE_PATHS.STAFF_DASHBOARD
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (!name.trim() || !password.trim()) {
      showError('Name and password are required.')
      return
    }

    setIsSubmitting(true)
    try {
      const loggedInUser = await login(name.trim(), password)
      showSuccess(`Welcome, ${loggedInUser.fullName}`)

      if (loggedInUser.forcePasswordChange) {
        navigate(ROUTE_PATHS.CHANGE_PASSWORD)
        return
      }

      navigate(resolveHomeRoute(loggedInUser.roles))
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        'Invalid username or password.'
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
              <Shield className="size-6" aria-hidden="true" />
            </div>
          </div>
          <h2 className="mb-2 text-center text-xl font-bold text-foreground">
            DRC - Management Portal
          </h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Sign in to access the portal
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="login-name">Name</Label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="login-name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="pl-10"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pl-10"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                to={ROUTE_PATHS.CHANGE_PASSWORD}
                className="text-sm font-medium text-primary hover:underline"
              >
                Change password
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border-0 bg-gradient-to-r from-[#8e54e9] to-[#4776e6] text-base font-semibold shadow-md hover:opacity-95"
            >
              {isSubmitting ? 'Signing in...' : 'Log in'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
