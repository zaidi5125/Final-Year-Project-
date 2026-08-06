import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from '@/lib/queryClient'
import { AuthProvider } from '@/store/AuthContext'
import { NotificationsProvider } from '@/features/notifications/context/NotificationsContext'
import { MeetingsProvider } from '@/features/meetings/context/MeetingsContext'
import { TasksProvider } from '@/features/tasks/context/TasksContext'
import { ServicesProvider } from '@/features/services/context/ServicesContext'
import { PartyMembersProvider } from '@/features/party-members/context/PartyMembersContext'
import { ResearchesProvider } from '@/features/researches/context/ResearchesContext'
import { LeadsProvider } from '@/features/leads/context/LeadsContext'
import { TeamsProvider } from '@/features/teams/context/TeamsContext'
import { TeamMembersProvider } from '@/features/teams/context/TeamMembersContext'
import { ParticipantsProvider } from '@/features/participants/context/ParticipantsContext'
import { TrainingProvider } from '@/features/training/context/TrainingContext'

export default function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationsProvider>
          <MeetingsProvider>
            <TasksProvider>
              <ServicesProvider>
                <PartyMembersProvider>
                  <ResearchesProvider>
                    <LeadsProvider>
                      <TeamsProvider>
                        <TeamMembersProvider>
                          <ParticipantsProvider>
                            <TrainingProvider>
                              {children}
                            </TrainingProvider>
                          </ParticipantsProvider>
                        </TeamMembersProvider>
                      </TeamsProvider>
                    </LeadsProvider>
                  </ResearchesProvider>
                </PartyMembersProvider>
              </ServicesProvider>
            </TasksProvider>
          </MeetingsProvider>
        </NotificationsProvider>
      </AuthProvider>
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  )
}