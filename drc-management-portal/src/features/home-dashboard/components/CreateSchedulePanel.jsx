import { useState } from 'react'
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MeetingForm from '@/features/home-dashboard/components/forms/MeetingForm'
import TaskForm from '@/features/home-dashboard/components/forms/TaskForm'
import MeetingOverviewView from '@/features/home-dashboard/components/MeetingOverviewView'
import { useCalendarItems } from '@/features/home-dashboard/hooks/useCalendarItems'
import { formatDisplayDate } from '@/features/home-dashboard/utils/calendar'

export default function CreateSchedulePanel({ open, selectedDate, onOpenChange }) {
  const { getItemsForDate } = useCalendarItems()
  const [view, setView] = useState('overview')
  const [activeTab, setActiveTab] = useState('meeting')

  const dayItems = selectedDate ? getItemsForDate(selectedDate) : []

  const handleClose = () => {
    onOpenChange(false)
    setView('overview')
  }

  const handleSuccess = () => {
    onOpenChange(false)
    setView('overview')
  }

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setView('overview')
    }
    onOpenChange(isOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent onClose={handleClose}>
        <SheetHeader>
          <SheetTitle>
            {view === 'overview' ? 'Day Overview' : 'Create Schedule'}
          </SheetTitle>
          <SheetDescription>
            {selectedDate
              ? `${formatDisplayDate(selectedDate)} — ${view === 'overview' ? 'meetings and tasks' : 'add new item'}`
              : 'Manage your calendar schedule'}
          </SheetDescription>
        </SheetHeader>

        <SheetBody>
          {view === 'overview' ? (
            <MeetingOverviewView
              selectedDate={selectedDate}
              items={dayItems}
              onCreateMeeting={() => {
                setActiveTab('meeting')
                setView('create')
              }}
              onCreateTask={() => {
                setActiveTab('task')
                setView('create')
              }}
            />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="meeting" className="flex-1">
                  Meeting
                </TabsTrigger>
                <TabsTrigger value="task" className="flex-1">
                  Task
                </TabsTrigger>
              </TabsList>

              <TabsContent value="meeting">
                <MeetingForm
                  key={`meeting-${selectedDate}-${open}`}
                  selectedDate={selectedDate}
                  onSuccess={handleSuccess}
                />
              </TabsContent>

              <TabsContent value="task">
                <TaskForm
                  key={`task-${selectedDate}-${open}`}
                  selectedDate={selectedDate}
                  onSuccess={handleSuccess}
                />
              </TabsContent>
            </Tabs>
          )}
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
