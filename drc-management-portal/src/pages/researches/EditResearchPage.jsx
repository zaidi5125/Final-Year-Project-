import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/shared'
import ResearchForm from '@/features/researches/components/ResearchForm'
import BeneficiariesSection from '@/features/researches/components/BeneficiariesSection'
import { useResearches } from '@/features/researches/context/ResearchesContext'
import { researchDetailsPath, ROUTE_PATHS } from '@/routes/routePaths'

export default function EditResearchPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getResearchById, updateResearch } = useResearches()
  const research = getResearchById(id)

  if (!research) {
    return (
      <section aria-label="Edit Research" className="flex flex-col gap-6">
        <PageHeader
          title="Research Not Found"
          description="The research you are looking for does not exist."
          backTo={ROUTE_PATHS.RESEARCHES}
          backLabel="Back to Researches"
        />
      </section>
    )
  }

  const handleSubmit = (data) => {
    updateResearch(id, data)
    navigate(researchDetailsPath(id))
  }

  const handleCancel = () => {
    navigate(researchDetailsPath(id))
  }

  return (
    <section aria-label="Edit Research" className="flex flex-col gap-6">
      <PageHeader
        title="Edit Research"
        description={`Update details for ${research.title}.`}
        backTo={researchDetailsPath(id)}
        backLabel="Back to Research"
      />

      <ResearchForm
        initialValues={{
          title: research.title,
          topic: research.topic,
          description: research.description ?? research.purpose,
          status: research.status,
          startDate: research.startDate,
          endDate: research.endDate,
          researchers: research.researchers,
          files: research.files,
          researchDocument: research.researchDocument,
        }}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      <BeneficiariesSection researchId={id} />
    </section>
  )
}
