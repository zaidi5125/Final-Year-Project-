import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SectionCard({ title, children, className }) {
  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={title ? '' : 'pt-6'}>{children}</CardContent>
    </Card>
  )
}
