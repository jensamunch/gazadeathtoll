'use client'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule, themeQuartz, colorSchemeDark, colorSchemeLight, ColDef, FilterModel } from 'ag-grid-community'

const myThemeLight = themeQuartz.withPart(colorSchemeLight)
const myThemeDark = themeQuartz.withPart(colorSchemeDark)

// Register AG Grid community modules (required since v34)
ModuleRegistry.registerModules([AllCommunityModule])

// Define types for our data
type Person = {
  id: string
  name: string
  enName: string
  age?: number
  dob?: string
  sex?: 'm' | 'f'
  source?: string
  createdAt: string
}

type RowData = {
  id: string
  data: Record<string, unknown>
  createdAt: string
}

export default function Home() {
  const [rowData, setRowData] = useState<Person[]>([])
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [totalRows, setTotalRows] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchData = useCallback(async (filters: FilterModel = {}) => {
    const params = new URLSearchParams()
    params.append('limit', '1000')
    
    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.filterType) {
        console.log(`Processing filter for ${key}:`, value)
        switch (value.filterType) {
          case 'number':
            if (value.type && value.filter !== undefined) {
              const val = parseInt(value.filter.toString())
              console.log(`Number filter: type="${value.type}", value=${val}`)
              if (value.type === 'greaterThan' || value.type === 'gt') {
                params.append(key, `>${val}`)
              } else if (value.type === 'lessThan' || value.type === 'lt') {
                params.append(key, `<${val}`)
              } else if (value.type === 'greaterThanOrEqual' || value.type === 'gte') {
                params.append(key, `>=${val}`)
              } else if (value.type === 'lessThanOrEqual' || value.type === 'lte') {
                params.append(key, `<=${val}`)
              } else if (value.type === 'equals' || value.type === 'eq') {
                params.append(key, val.toString())
              } else {
                console.log(`Unknown type: ${value.type}`)
              }
            }
            break
          case 'text':
            if (value.filter) {
              params.append(key, value.filter)
            }
            break
          case 'set':
            if (value.values && value.values.length > 0) {
              params.append(key, value.values[0])
            }
            break
        }
      }
    })

    console.log('Sending API request with params:', params.toString())
    
    try {
      const response = await fetch(`/api/rows?${params}`)
      const data = await response.json()
      console.log('API Response with filters:', data)
      
      const rows = data.data || []
      setRowData(rows)
      setTotalRows(data.pagination?.total || rows.length)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const onFilterChanged = useCallback((event: any) => {
    const filterModel = event.api.getFilterModel()
    console.log('Filter changed:', filterModel)
    console.log('Filter model keys:', Object.keys(filterModel))
    Object.entries(filterModel).forEach(([key, value]) => {
      console.log(`Filter for ${key}:`, JSON.stringify(value, null, 2))
    })
    fetchData(filterModel)
  }, [fetchData])

  const columnDefs = useMemo((): ColDef[] => {
    const keySet = new Set<string>()
    for (const row of rowData) {
      if (row && typeof row === 'object' && !Array.isArray(row)) {
        Object.keys(row).forEach((k) => keySet.add(k))
      }
    }
    const keys = Array.from(keySet)
    return keys.map((k) => ({ field: k }))
  }, [rowData])

  if (!mounted) {
    return (
      <main className="p-6">

        <div className="ag-theme-quartz" style={{ height: 600, width: '100%' }}>
          <div className="flex items-center justify-center h-full">Loading...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="p-6">
      <div className="ag-theme-quartz" style={{ height: 600, width: '100%' }}>
        <AgGridReact 
          theme={theme === 'dark' ? myThemeDark : myThemeLight} 
          rowData={rowData} 
          columnDefs={columnDefs} 
          pagination={true}
          paginationPageSize={50}
          paginationPageSizeSelector={[25, 50, 100, 200]}

          rowSelection="multiple"
          suppressRowClickSelection={true}
          animateRows={true}
          defaultColDef={{
            minWidth: 100,
            flex: 1,
            filter: true,
            floatingFilter: true,
          }}
          onFilterChanged={onFilterChanged}
        />
      </div>
      <div className="mt-2 text-sm text-muted-foreground">
        Loaded {rowData.length.toLocaleString()} | Total matching row {totalRows.toLocaleString()}
      </div>
    </main>
  )
}
