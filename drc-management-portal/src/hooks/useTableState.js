import { useMemo, useState } from 'react'

export function useTableState({
  data,
  searchFields = [],
  filters = {},
  sortField = null,
  sortDirection = 'asc',
  pageSize = 10,
}) {
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState(filters)
  const [sort, setSort] = useState({ field: sortField, direction: sortDirection })
  const [page, setPage] = useState(1)
  const [pageSizeState, setPageSize] = useState(pageSize)

  const filtered = useMemo(() => {
    let result = [...data]

    if (search.trim() && searchFields.length) {
      const q = search.toLowerCase()
      result = result.filter((item) =>
        searchFields.some((field) => {
          const val = item[field]
          return val && String(val).toLowerCase().includes(q)
        }),
      )
    }

    for (const [key, value] of Object.entries(activeFilters)) {
      if (!value) continue
      result = result.filter((item) => {
        if (typeof value === 'function') return value(item)
        return item[key] === value
      })
    }

    if (sort.field) {
      result.sort((a, b) => {
        const aVal = a[sort.field] ?? ''
        const bVal = b[sort.field] ?? ''
        const cmp = String(aVal).localeCompare(String(bVal))
        return sort.direction === 'desc' ? -cmp : cmp
      })
    }

    return result
  }, [data, search, searchFields, activeFilters, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSizeState))
  const currentPage = Math.min(page, totalPages)

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSizeState
    return filtered.slice(start, start + pageSizeState)
  }, [filtered, currentPage, pageSizeState])

  const toggleSort = (field) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
    setPage(1)
  }

  const setFilter = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setActiveFilters({})
    setSearch('')
    setPage(1)
  }

  return {
    search,
    setSearch,
    activeFilters,
    setFilter,
    setActiveFilters,
    clearFilters,
    sort,
    toggleSort,
    page: currentPage,
    setPage,
    pageSize: pageSizeState,
    setPageSize,
    totalPages,
    totalCount: filtered.length,
    filtered,
    paginated,
  }
}
