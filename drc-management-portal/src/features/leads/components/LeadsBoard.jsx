import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, FileText } from 'lucide-react'
import { cn } from '@/utils/cn'
import { EmptyState } from '@/components/shared'
import { useLeads } from '@/features/leads/context/LeadsContext'
import { LEAD_STATUSES } from '@/features/leads/utils/leadStatus'
import { leadDetailsPath } from '@/routes/routePaths'

const ZONES = [
  { type: 'course', label: 'Course Leads', icon: GraduationCap },
  { type: 'dispute', label: 'Dispute Leads', icon: FileText },
]

function LeadCard({ lead, onDragStart, onDragEnd }) {
  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, lead.id)}
      onDragEnd={onDragEnd}
      className="cursor-grab rounded-lg border border-border bg-background p-3 shadow-soft active:cursor-grabbing"
    >
      <Link
        to={leadDetailsPath(lead.id)}
        className="text-sm font-medium text-foreground hover:text-primary"
        onClick={(event) => event.stopPropagation()}
      >
        {lead.name}
      </Link>
      {lead.company && (
        <p className="mt-1 text-xs text-muted-foreground">{lead.company}</p>
      )}
      {lead.email && (
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{lead.email}</p>
      )}
    </div>
  )
}

function StatusColumn({ status, leads, isDragOver, onDragOver, onDragLeave, onDrop, onDragStart, onDragEnd }) {
  const statusLabel = LEAD_STATUSES.find((s) => s.value === status)?.label ?? status

  return (
    <div
      className={cn(
        'flex min-h-[120px] flex-col gap-2 rounded-xl border border-dashed p-2 transition-colors',
        isDragOver ? 'border-primary bg-primary/5' : 'border-border bg-muted/20',
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <p className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {statusLabel}
        <span className="ml-1 text-muted-foreground/70">({leads.length})</span>
      </p>
      <div className="flex flex-col gap-2">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onDragStart={onDragStart} onDragEnd={onDragEnd} />
        ))}
      </div>
    </div>
  )
}

function ZoneSection({ zone, leads, dragOverKey, isDragging, onDragOver, onDragLeave, onDrop, onDragStart, onDragEnd }) {
  const Icon = zone.icon
  const zoneLeads = leads.filter((lead) => lead.type === zone.type)
  const isEmpty = zoneLeads.length === 0
  const showColumns = !isEmpty || isDragging || dragOverKey?.startsWith(`${zone.type}-`)

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-foreground">{zone.label}</h2>
        <span className="text-sm text-muted-foreground">({zoneLeads.length})</span>
      </div>

      {showColumns ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {LEAD_STATUSES.map((statusItem) => {
            const columnLeads = zoneLeads.filter((lead) => lead.status === statusItem.value)
            const columnKey = `${zone.type}-${statusItem.value}`

            return (
              <StatusColumn
                key={columnKey}
                status={statusItem.value}
                leads={columnLeads}
                isDragOver={dragOverKey === columnKey}
                onDragOver={(event) => onDragOver(event, columnKey)}
                onDragLeave={onDragLeave}
                onDrop={(event) => onDrop(event, zone.type, statusItem.value)}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            )
          })}
        </div>
      ) : (
        <EmptyState
          title={`No ${zone.label.toLowerCase()}`}
          description="Drag leads here or add a new lead to get started."
          className="rounded-xl border border-dashed border-border py-8"
        />
      )}
    </section>
  )
}

export default function LeadsBoard() {
  const { leads, updateLead, updateLeadStatus } = useLeads()
  const [dragOverKey, setDragOverKey] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (event, leadId) => {
    event.dataTransfer.setData('text/plain', leadId)
    event.dataTransfer.effectAllowed = 'move'
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setDragOverKey(null)
  }

  const handleDragOver = (event, columnKey) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setDragOverKey(columnKey)
  }

  const handleDragLeave = () => {
    setDragOverKey(null)
  }

  const handleDrop = (event, targetType, targetStatus) => {
    event.preventDefault()
    setDragOverKey(null)

    const leadId = event.dataTransfer.getData('text/plain')
    if (!leadId) return

    const lead = leads.find((l) => l.id === leadId)
    if (!lead) return

    if (lead.type !== targetType) {
      updateLead(leadId, { type: targetType })
    }

    if (lead.status !== targetStatus) {
      updateLeadStatus(leadId, targetStatus)
    }
  }

  const isEmpty = leads.length === 0

  if (isEmpty) {
    return (
      <EmptyState
        title="No leads on the board"
        description="Add leads to organize them by type and status."
        className="rounded-xl border border-dashed border-border"
      />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {ZONES.map((zone) => (
        <ZoneSection
          key={zone.type}
          zone={zone}
          leads={leads}
          dragOverKey={dragOverKey}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  )
}
