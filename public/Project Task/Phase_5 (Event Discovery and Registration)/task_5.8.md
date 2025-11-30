### Task 5.8: Add Manual Approval UI to Event Management Dashboard
**Description**: Add approve/reject functionality to registrations table.

**Implementation Steps**:
- Modify `components/events/manage/RegistrationsTable.tsx`
- For manual approval mode events, add action buttons:
  - "Approve" button (green)
  - "Reject" button (red)
- Show buttons only for pending_approval registrations
- On Approve click:
  - Call approve API
  - Show success toast
  - Update table to show confirmed status
- On Reject click:
  - Open modal to enter rejection reason
  - Call reject API with reason
  - Show success toast
  - Update table to show rejected status
- Add bulk actions: Select multiple and approve/reject

**Dependencies**: Task 5.7, Task 4.8

**Files to Modify**:
- `components/events/manage/RegistrationsTable.tsx`
- Add: `components/events/manage/RejectModal.tsx`
