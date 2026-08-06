import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared'
import ResearchForm from '@/features/researches/components/ResearchForm'
import { useResearches } from '@/features/researches/context/ResearchesContext'
import { researchDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'

export default function AddResearchPage() {
  const navigate = useNavigate()
  const { addResearch } = useResearches()

  const handleSubmit = async (data) => {
    const research = await addResearch(data)
    if (!research) return
    navigate(researchDetailsPath(research.id))
  }

  const handleCancel = () => {
    navigate(ROUTE_PATHS.RESEARCHES)
  }

  return (
    <section aria-label="Create Research" className="flex flex-col gap-6">
      <PageHeader
        title="Create Research"
        description="Add a new research project to the system."
        backTo={ROUTE_PATHS.RESEARCHES}
        backLabel="Back to Researches"
      />
      <ResearchForm
        submitLabel="Create Research"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </section>
  )
}
