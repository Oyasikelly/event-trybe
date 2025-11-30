### Task 10.1: Build Event Analytics Dashboard
**Description**: Create comprehensive analytics dashboard for event owners.

**Implementation Steps**:
- Create `app/api/v1/events/[id]/analytics/route.ts`:
  - GET: Return event analytics data
  - Verify user is event owner
  - Calculate metrics:
    - Total registrations
    - Email confirmations
    - Pending confirmations
    - Confirmed attendees
    - Rejected registrations
    - Cancelled registrations
    - Capacity utilization percentage
    - Registration trend over time
    - Daily registration counts
    - Peak registration periods
- Create `components/events/analytics/AnalyticsOverview.tsx`:
  - Grid of metric cards
  - Total Registrations card
  - Confirmed Attendees card
  - Capacity Used card (with progress bar)
  - Pending Approvals card (manual mode)
- Create `components/events/analytics/RegistrationChart.tsx`:
  - Line chart showing registrations over time
  - Use Recharts library
  - X-axis: Date
  - Y-axis: Registration count
  - Cumulative and daily views
- Create `components/events/analytics/StatusBreakdown.tsx`:
  - Pie chart or donut chart
  - Show registration status distribution
  - Color-coded segments
  - Interactive tooltips
- Create `components/events/analytics/ExportButton.tsx`:
  - Export analytics to CSV
  - Export attendee list
  - Include registration details

**Analytics Calculations**:
```typescript
// app/api/v1/events/[id]/analytics/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      registrations: {
        select: {
          registrationStatus: true,
          registeredAt: true,
          emailConfirmedAt: true
        }
      }
    }
  })

  const analytics = {
    totalRegistrations: event.registrations.length,
    emailConfirmations: event.registrations.filter(
      r => r.emailConfirmedAt !== null
    ).length,
    pendingConfirmations: event.registrations.filter(
      r => r.registrationStatus === 'pending_email'
    ).length,
    confirmed: event.registrations.filter(
      r => r.registrationStatus === 'confirmed'
    ).length,
    rejected: event.registrations.filter(
      r => r.registrationStatus === 'rejected'
    ).length,
    cancelled: event.registrations.filter(
      r => r.registrationStatus === 'cancelled'
    ).length,
    capacityUsed: event.capacityLimit 
      ? (event.registrations.length / event.capacityLimit) * 100 
      : null,
    registrationsByDay: calculateDailyRegistrations(event.registrations)
  }

  return NextResponse.json(analytics)
}
```

**Dependencies**: Task 4.7 (Analytics API)

**Files to Create**:
- `components/events/analytics/AnalyticsOverview.tsx`
- `components/events/analytics/RegistrationChart.tsx`
- `components/events/analytics/StatusBreakdown.tsx`
- `components/events/analytics/ExportButton.tsx`
- `lib/analytics/calculations.ts`

**Files to Modify**:
- `app/events/[id]/manage/page.tsx` (add analytics section)

**Required Package**:
- `npm install recharts` (for charts)

**Testing**:
- [ ] View analytics for event with registrations
- [ ] Verify metric calculations
- [ ] Test chart rendering
- [ ] Export CSV file
- [ ] Verify data accuracy
