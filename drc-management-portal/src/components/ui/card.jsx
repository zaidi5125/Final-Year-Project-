import { cn } from '@/utils/cn'

function Card({ className, ...props }) {
  return (
    <div
      className={cn('card-surface flex flex-col', className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 p-5 pb-0', className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn('text-base font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return <div className={cn('p-5', className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
