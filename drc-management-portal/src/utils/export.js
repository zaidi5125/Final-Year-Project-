import * as XLSX from 'xlsx'

export function exportToCSV(rows, filename = 'export.csv') {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h] ?? ''
          const str = String(val).replace(/"/g, '""')
          return `"${str}"`
        })
        .join(','),
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, filename)
}

export function exportToPDF(rows, title = 'Export', filename = 'export.pdf') {
  const headers = rows.length ? Object.keys(rows[0]) : []
  const tableRows = rows
    .map(
      (row) =>
        `<tr>${headers.map((h) => `<td style="border:1px solid #ddd;padding:6px;">${escapeHtml(String(row[h] ?? ''))}</td>`).join('')}</tr>`,
    )
    .join('')

  const html = `<!DOCTYPE html><html><head><title>${escapeHtml(title)}</title>
    <style>body{font-family:Arial,sans-serif;padding:20px;}table{border-collapse:collapse;width:100%;}th{background:#f4f4f4;border:1px solid #ddd;padding:8px;text-align:left;}</style>
    </head><body><h2>${escapeHtml(title)}</h2><table>
    <thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
    <tbody>${tableRows}</tbody></table></body></html>`

  const blob = new Blob([html], { type: 'text/html' })
  downloadBlob(blob, filename.replace('.pdf', '.html'))
}

export function exportToExcel(rows, filename = 'export.xlsx') {
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data')
  XLSX.writeFile(wb, filename)
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
