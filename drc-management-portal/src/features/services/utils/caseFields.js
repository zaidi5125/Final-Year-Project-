export const CASE_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
]

export const PAYMENT_STATUSES = [
  { value: 'received', label: 'Received' },
  { value: 'pending', label: 'Pending' },
  { value: 'partial', label: 'Partial' },
]

export const PARTY_GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

export const EMPTY_PARTY = {
  fullName: '',
  fatherName: '',
  cnic: '',
  gender: '',
  dob: '',
  email: '',
  contactNumber: '',
  address: '',
  city: '',
  lawyerName: '',
  lawyerRole: '',
  document: null,
  additionalMembers: [],
}

export const EMPTY_VALUES = {
  title: '',
  caseId: '',
  courtCaseId: '',
  caseType: '',
  court: '',
  paymentStatus: '',
  status: '',
  startDate: '',
  endDate: '',
  result: '',
  document: null,
  description: '',
  complainant: { ...EMPTY_PARTY, additionalMembers: [] },
  respondent: { ...EMPTY_PARTY, additionalMembers: [] },
}

function mapLegacyParty(party = {}) {
  return {
    fullName: party.fullName ?? party.name ?? '',
    fatherName: party.fatherName ?? '',
    cnic: party.cnic ?? '',
    gender: party.gender ?? '',
    dob: party.dob ?? '',
    email: party.email ?? '',
    contactNumber: party.contactNumber ?? party.phone ?? '',
    address: party.address ?? '',
    city: party.city ?? '',
    lawyerName: party.lawyerName ?? '',
    lawyerRole: party.lawyerRole ?? '',
    document: party.document ?? null,
    additionalMembers: party.additionalMembers ?? [],
  }
}

export function mapCaseToFormValues(caseItem) {
  if (!caseItem) return EMPTY_VALUES

  return {
    title: caseItem.title ?? '',
    caseId: caseItem.caseId ?? caseItem.caseNumber ?? '',
    courtCaseId: caseItem.courtCaseId ?? '',
    caseType: caseItem.caseType ?? '',
    court: caseItem.court ?? '',
    paymentStatus: caseItem.paymentStatus ?? '',
    status: caseItem.status ?? '',
    startDate: caseItem.startDate ?? caseItem.openedDate ?? '',
    endDate: caseItem.endDate ?? '',
    result: caseItem.result ?? '',
    document: caseItem.document ?? caseItem.documents?.[0] ?? null,
    description: caseItem.description ?? '',
    complainant: mapLegacyParty(caseItem.complainant ?? caseItem.client),
    respondent: mapLegacyParty(caseItem.respondent ?? caseItem.opponent),
  }
}

export function getCaseDisplayId(caseItem) {
  return caseItem?.caseId ?? caseItem?.caseNumber ?? ''
}

export function getCaseDisplayTitle(caseItem) {
  return caseItem?.title || 'Untitled Case'
}
