### Task 10.2: Create Registration Export Functionality
**Description**: Implement CSV export for event registrations and attendee lists.

**Implementation Steps**:
- Install CSV library: `npm install papaparse @types/papaparse`
- Create `lib/export/csv-generator.ts`:
  - `generateRegistrationCSV(registrations)` - Create CSV content
  - Include columns: Name, Email, Status, Registered At, Confirmed At
  - Format dates in readable format
  - Handle special characters in data
- Create `app/api/v1/events/[id]/export/route.ts`:
  - GET: Export registrations as CSV
  - Verify user is event owner
  - Fetch all registrations with user details
  - Generate CSV file
  - Return with download headers
  - Query params: `status` filter, `includeRejected`, `includeCancelled`
- Create `components/events/manage/ExportMenu.tsx`:
  - Dropdown menu with export options
  - Export All Registrations
  - Export Confirmed Only
  - Export Pending Only
  - Custom filter options
- Add export button to:
  - Event management dashboard
  - Registrations table header

**CSV Generation**:
```typescript
// lib/export/csv-generator.ts
import Papa from 'papaparse'

export function generateRegistrationCSV(registrations: Registration[]) {
  const data = registrations.map(reg => ({
    'Name': reg.user.name,
    'Email': reg.user.email,
    'Status': formatStatus(reg.registrationStatus),
    'Registered At': formatDate(reg.registeredAt),
    'Email Confirmed': reg.emailConfirmedAt ? formatDate(reg.emailConfirmedAt) : 'Pending',
    'Approval Status': reg.approvalStatus || 'N/A',
    'Approved At': reg.approvedAt ? formatDate(reg.approvedAt) : 'N/A'
  }))

  return Papa.unparse(data)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

function formatStatus(status: RegistrationStatus): string {
  const statusMap = {
    pending_email: 'Pending Email',
    pending_approval: 'Pending Approval',
    confirmed: 'Confirmed',
    rejected: 'Rejected',
    cancelled: 'Cancelled'
  }
  return statusMap[status]
}
```

**API Endpoint**:
```typescript
// app/api/v1/events/[id]/export/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  const registrations = await prisma.registration.findMany({
    where: {
      eventId: params.id,
      ...(status && { registrationStatus: status as RegistrationStatus })
    },
    include: {
      user: {
        select: { name: true, email: true }
      }
    },
    orderBy: { registeredAt: 'desc' }
  })

  const csv = generateRegistrationCSV(registrations)
  const filename = `event-registrations-${params.id}-${Date.now()}.csv`

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  })
}
```

**Dependencies**: Task 10.1

**Files to Create**:
- `lib/export/csv-generator.ts`
- `app/api/v1/events/[id]/export/route.ts`
- `components/events/manage/ExportMenu.tsx`

**Files to Modify**:
- `app/events/[id]/manage/page.tsx` (add export button)
- `components/events/manage/RegistrationsTable.tsx` (add export option)

**Testing**:
- [ ] Export all registrations
- [ ] Export filtered registrations
- [ ] Verify CSV format
- [ ] Test with special characters in names
- [ ] Verify date formatting
- [ ] Test with large datasets
