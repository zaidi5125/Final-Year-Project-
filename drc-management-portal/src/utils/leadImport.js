const LEAD_FIELD_MAP = {
  name: ['name', 'full name', 'full_name', 'lead name', 'contact name'],
  email: ['email', 'email address', 'e-mail'],
  phone: ['phone', 'contact', 'contact number', 'mobile', 'phone number'],
  company: ['company', 'organization', 'organisation', 'firm'],
  type: ['type', 'lead type', 'category'],
  status: ['status'],
  notes: ['notes', 'note', 'comments', 'description'],
}

function normalizeHeader(header) {
  return header?.toString().trim().toLowerCase() ?? ''
}

function mapHeaderToField(header) {
  const normalized = normalizeHeader(header)
  for (const [field, aliases] of Object.entries(LEAD_FIELD_MAP)) {
    if (aliases.includes(normalized)) return field
  }
  return null
}

function parseCsvLine(line) {
  const values = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  values.push(current.trim())
  return values
}

function rowsToLeads(rows) {
  if (rows.length < 2) return []

  const headers = rows[0].map(normalizeHeader)
  const fieldIndexes = headers.map(mapHeaderToField)
  const leads = []

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i]
    if (!row.some((cell) => cell?.toString().trim())) continue

    const lead = {}
    fieldIndexes.forEach((field, index) => {
      if (!field) return
      const value = row[index]?.toString().trim() ?? ''
      if (value) lead[field] = value
    })

    if (!lead.name && !lead.email) continue

    if (lead.type) {
      const typeLower = lead.type.toLowerCase()
      if (typeLower.includes('course') || typeLower.includes('training')) {
        lead.type = 'course'
      } else if (typeLower.includes('dispute') || typeLower.includes('case')) {
        lead.type = 'dispute'
      }
    }

    leads.push(lead)
  }

  return leads
}

export function parseCsvText(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim())
  const rows = lines.map(parseCsvLine)
  return rowsToLeads(rows)
}

export async function parseLeadFile(file) {
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (extension === 'csv') {
    const text = await file.text()
    return parseCsvText(text)
  }

  if (extension === 'xlsx' || extension === 'xls') {
    const XLSX = await import('xlsx')
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
    return rowsToLeads(rows)
  }

  throw new Error('Unsupported file format. Please upload CSV or XLSX.')
}
