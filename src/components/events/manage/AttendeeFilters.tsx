'use client'

import { useState } from 'react'
import { Download, Mail, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface AttendeeFiltersProps {
  onFilterChange: (filters: FilterState) => void
  onExport: () => void
  onBulkEmail: () => void
  totalCount: number
  filteredCount: number
}

export interface FilterState {
  search: string
  status: string
  checkedIn: string
}

export function AttendeeFilters({
  onFilterChange,
  onExport,
  onBulkEmail,
  totalCount,
  filteredCount,
}: AttendeeFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    checkedIn: 'all',
  })

  const handleFilterUpdate = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = { search: '', status: 'all', checkedIn: 'all' }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.checkedIn !== 'all'

  return (
    <div className="space-y-4">
      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">
            Attendees
            {filteredCount !== totalCount && (
              <span className="ml-2 text-sm text-muted-foreground">
                ({filteredCount} of {totalCount})
              </span>
            )}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onBulkEmail} variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button onClick={onExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => handleFilterUpdate('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterUpdate('status', value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Registration Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending_email">Pending Email</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Check-in Filter */}
        <Select
          value={filters.checkedIn}
          onValueChange={(value) => handleFilterUpdate('checkedIn', value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Check-in Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Checked In</SelectItem>
            <SelectItem value="false">Not Checked In</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button onClick={clearFilters} variant="ghost" size="sm">
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.search && (
            <Badge variant="secondary">
              Search: {filters.search}
            </Badge>
          )}
          {filters.status !== 'all' && (
            <Badge variant="secondary">
              Status: {filters.status}
            </Badge>
          )}
          {filters.checkedIn !== 'all' && (
            <Badge variant="secondary">
              {filters.checkedIn === 'true' ? 'Checked In' : 'Not Checked In'}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
