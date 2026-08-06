import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormField, SectionCard } from '@/components/shared'
import { useParticipants } from '@/features/participants/context/ParticipantsContext'
import { getParticipantDisplayName } from '@/features/participants/utils/participantFields'
import { COURSE_STATUSES } from '@/features/training/utils/courseStatus'
import { fetchUsers } from '@/services/userService'
import { ROUTE_PATHS } from '@/routes/routePaths'

const COURSE_FORM_DRAFT_KEY = 'drc-course-form-draft'

const EMPTY_VALUES = {
  courseId: '',
  courseName: '',
  startDate: '',
  endDate: '',
  description: '',
  status: '',
  participants: [],
  trainers: [],
  mediators: [],
}

export default function CourseForm({
  initialValues = EMPTY_VALUES,
  submitLabel = 'Save Course',
  onSubmit,
  onCancel,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { participants: allParticipants } = useParticipants()
  const [teamMembers, setTeamMembers] = useState([])

  useEffect(() => {
    fetchUsers()
      .then((data) =>
        setTeamMembers(
          data
            .filter((u) => u.isActive !== false)
            .map((u) => ({ id: String(u.id), name: u.username, email: u.email || '' })),
        ),
      )
      .catch(() => setTeamMembers([]))
  }, [])

  const [courseId, setCourseId] = useState(initialValues.courseId || '')
  const [courseName, setCourseName] = useState(initialValues.courseName || '')
  const [startDate, setStartDate] = useState(initialValues.startDate || '')
  const [endDate, setEndDate] = useState(initialValues.endDate || '')
  const [description, setDescription] = useState(initialValues.description || '')
  const [status, setStatus] = useState(initialValues.status || '')
  const [selectedParticipants, setSelectedParticipants] = useState(
    initialValues.participants || [],
  )
  const [selectedTrainers, setSelectedTrainers] = useState(initialValues.trainers || [])
  const [selectedMediators, setSelectedMediators] = useState(initialValues.mediators || [])
  const [participantSelect, setParticipantSelect] = useState('')
  const [trainerSelect, setTrainerSelect] = useState('')
  const [mediatorSelect, setMediatorSelect] = useState('')

  useEffect(() => {
    const draftRaw = sessionStorage.getItem(COURSE_FORM_DRAFT_KEY)
    if (draftRaw) {
      try {
        const draft = JSON.parse(draftRaw)
        if (draft.returnPath === location.pathname) {
          setCourseId(draft.courseId || '')
          setCourseName(draft.courseName || '')
          setStartDate(draft.startDate || '')
          setEndDate(draft.endDate || '')
          setDescription(draft.description || '')
          setStatus(draft.status || '')
          setSelectedParticipants(draft.selectedParticipants || [])
          setSelectedTrainers(draft.selectedTrainers || [])
          setSelectedMediators(draft.selectedMediators || [])
          sessionStorage.removeItem(COURSE_FORM_DRAFT_KEY)
        }
      } catch {
        sessionStorage.removeItem(COURSE_FORM_DRAFT_KEY)
      }
    }
  }, [location.pathname])

  useEffect(() => {
    const newParticipantId = location.state && location.state.newParticipantId
    if (!newParticipantId) return

    const participant = allParticipants.find((p) => p.id === newParticipantId)
    if (participant) {
      setSelectedParticipants((prev) => {
        if (prev.some((p) => p.id === participant.id)) return prev
        return [
          ...prev,
          {
            id: participant.id,
            participantId: participant.participantId,
            fullName: getParticipantDisplayName(participant),
            email: participant.email,
          },
        ]
      })
    }

    navigate(location.pathname, { replace: true, state: null })
  }, [allParticipants, location.pathname, location.state, navigate])

  const handleAddParticipant = () => {
    if (!participantSelect) return
    const participant = allParticipants.find((p) => p.id === participantSelect)
    if (!participant) return
    if (selectedParticipants.some((p) => p.id === participant.id)) return

    setSelectedParticipants((prev) => [
      ...prev,
      {
        id: participant.id,
        participantId: participant.participantId,
        fullName: getParticipantDisplayName(participant),
        email: participant.email,
      },
    ])
    setParticipantSelect('')
  }

  const handleRemoveParticipant = (id) => {
    setSelectedParticipants((prev) => prev.filter((p) => p.id !== id))
  }

  const handleAddTrainer = () => {
    if (!trainerSelect) return
    const member = teamMembers.find((m) => m.id === trainerSelect)
    if (!member) return
    if (selectedTrainers.some((t) => t.id === member.id)) return

    setSelectedTrainers((prev) => [
      ...prev,
      { id: member.id, name: member.name, email: member.email },
    ])
    setTrainerSelect('')
  }

  const handleRemoveTrainer = (id) => {
    setSelectedTrainers((prev) => prev.filter((t) => t.id !== id))
  }

  const handleAddMediator = () => {
    if (!mediatorSelect) return
    const member = teamMembers.find((m) => m.id === mediatorSelect)
    if (!member) return
    if (selectedMediators.some((m) => m.id === member.id)) return

    setSelectedMediators((prev) => [
      ...prev,
      { id: member.id, name: member.name, email: member.email },
    ])
    setMediatorSelect('')
  }

  const handleRemoveMediator = (id) => {
    setSelectedMediators((prev) => prev.filter((m) => m.id !== id))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const data = {
      courseId: courseId.trim(),
      courseName: courseName.trim(),
      startDate,
      endDate,
      description: description.trim(),
      status,
      participants: selectedParticipants,
      trainers: selectedTrainers,
      mediators: selectedMediators,
      members: [
        ...selectedParticipants.map((p) => ({ id: p.id, name: p.fullName, role: 'participant' })),
        ...selectedTrainers.map((t) => ({ id: t.id, name: t.name, role: 'trainer' })),
        ...selectedMediators.map((m) => ({ id: m.id, name: m.name, role: 'mediator' })),
      ],
    }

    if (!data.courseId || !data.courseName || !data.startDate || !data.endDate || !data.status) {
      return
    }

    if (data.endDate < data.startDate) return

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Course ID" htmlFor="courseId" required>
          <Input
            id="courseId"
            name="courseId"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            placeholder="e.g. CRS-001"
            required
          />
        </FormField>

        <FormField label="Course Name" htmlFor="courseName" required>
          <Input
            id="courseName"
            name="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Enter course name"
            required
          />
        </FormField>

        <FormField label="Start Date" htmlFor="startDate" required>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </FormField>

        <FormField label="End Date" htmlFor="endDate" required>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Status" htmlFor="status" required className="sm:col-span-2">
          <Select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select status</option>
            {COURSE_STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Description" htmlFor="description" className="sm:col-span-2">
          <Textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Course description"
            rows={4}
          />
        </FormField>
      </div>

      <SectionCard title="Participants">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Select
              value={participantSelect}
              onChange={(e) => setParticipantSelect(e.target.value)}
              className="min-w-[200px] flex-1"
            >
              <option value="">Select existing participant</option>
              {allParticipants.map((p) => (
                <option key={p.id} value={p.id}>
                  {getParticipantDisplayName(p)} ({p.participantId || p.email})
                </option>
              ))}
            </Select>
            <Button type="button" variant="outline" onClick={handleAddParticipant}>
              Add
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to={ROUTE_PATHS.MANAGE_USERS + '?add=1'}>
                <Plus className="size-4" aria-hidden="true" />
                Add User
              </Link>
            </Button>
          </div>

          {selectedParticipants.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {selectedParticipants.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{p.fullName}</p>
                    <p className="text-xs text-muted-foreground">{p.participantId || p.email}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0"
                    onClick={() => handleRemoveParticipant(p.id)}
                    aria-label={'Remove ' + p.fullName}
                  >
                    <X className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No participants added yet.</p>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Trainers">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Select
              value={trainerSelect}
              onChange={(e) => setTrainerSelect(e.target.value)}
              className="min-w-[200px] flex-1"
            >
              <option value="">Select team member as trainer</option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
            <Button type="button" variant="outline" onClick={handleAddTrainer}>
              Add
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to={ROUTE_PATHS.MANAGE_USERS + '?add=1'}>
                <Plus className="size-4" aria-hidden="true" />
                Add User
              </Link>
            </Button>
          </div>

          {selectedTrainers.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {selectedTrainers.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.email}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0"
                    onClick={() => handleRemoveTrainer(t.id)}
                    aria-label={'Remove ' + t.name}
                  >
                    <X className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No trainers added yet.</p>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Mediators">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Select
              value={mediatorSelect}
              onChange={(e) => setMediatorSelect(e.target.value)}
              className="min-w-[200px] flex-1"
            >
              <option value="">Select team member as mediator</option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
            <Button type="button" variant="outline" onClick={handleAddMediator}>
              Add
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to={ROUTE_PATHS.MANAGE_USERS + '?add=1'}>
                <Plus className="size-4" aria-hidden="true" />
                Add User
              </Link>
            </Button>
          </div>

          {selectedMediators.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {selectedMediators.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0"
                    onClick={() => handleRemoveMediator(m.id)}
                    aria-label={'Remove ' + m.name}
                  >
                    <X className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No mediators added yet.</p>
          )}
        </div>
      </SectionCard>

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
