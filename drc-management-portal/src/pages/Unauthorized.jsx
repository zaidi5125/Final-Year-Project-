import { ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ROUTE_PATHS } from '@/routes/routePaths'

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-soft-lg">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-7" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Unauthorized</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          You do not have permission to access this page. Please sign in with an account
          that has the required role, or go back to a page you can access.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="rounded-xl">
            <Link to={ROUTE_PATHS.HOME}>Go to Home</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to={ROUTE_PATHS.LOGIN}>Back to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
