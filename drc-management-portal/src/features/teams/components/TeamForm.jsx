import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FormField } from '@/components/shared'
import TeamMembersSection from '@/features/teams/components/TeamMembersSection'
import { formatDate } from '@/utils/formatDate'
import { showError } from '@/utils/toast'

const EMPTY_VALUES = {
  teamName: '',
  description: '',
  createdDate: '',
}

export default function TeamForm({
  formId = 'team-form',
  initialValues = EMPTY_VALUES,
  teamId,
  submitLabel = 'Save Team',
  onSubmit,
  onCancel,
}) {
  const createdDateValue = initialValues.createdDate || new Date().toISOString().slice(0, 10)
  const [overview, setOverview] = useState({
    teamName: initialValues.teamName ?? '',
    description: initialValues.description ?? '',
    createdDate: createdDateValue,
  })
  const [pendingMembers, setPendingMembers] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

  const updateOverview = (field, value) => {
    setOverview((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!overview.teamName.trim()) {
      showError('Team name is required.')
      setActiveTab('overview')
      return
    }

    onSubmit({
      ...overview,
      teamName: overview.teamName.trim(),
      description: overview.description.trim(),
      pendingMembers,
    })
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="overview" className="min-w-28">Overview</TabsTrigger>
          <TabsTrigger value="members" className="min-w-28">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Team Name" htmlFor="teamName" required>
              <Input
                id="teamName"
                name="teamName"
                value={overview.teamName}
                onChange={(e) => updateOverview('teamName', e.target.value)}
                placeholder="Enter team name"
                required
              />
            </FormField>

            <FormField label="Created Date" htmlFor="createdDate">
              <Input
                id="createdDate"
                name="createdDate"
                type="date"
                value={overview.createdDate}
                onChange={(e) => updateOverview('createdDate', e.target.value)}
                readOnly={!!teamId}
                className={teamId ? 'bg-muted/30' : undefined}
              />
            </FormField>

            <FormField label="Description" htmlFor="description" className="sm:col-span-2">
              <Textarea
                id="description"
                name="description"
                value={overview.description}
                onChange={(e) => updateOverview('description', e.target.value)}
                placeholder="Team description"
                rows={4}
              />
            </FormField>
          </div>

          {teamId && overview.createdDate && (
            <p className="mt-2 text-sm text-muted-foreground">
              Created on {formatDate(overview.createdDate)}
            </p>
          )}
        </TabsContent>

        <TabsContent value="members">
          <TeamMembersSection
            teamId={teamId}
            pendingMembers={pendingMembers}
            onPendingMembersChange={setPendingMembers}
          />
        </TabsContent>
      </Tabs>

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
