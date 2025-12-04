import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ExcelJS from 'exceljs'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'

    // Fetch all user data
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        eventsOwned: true,
        registrations: {
          include: {
            event: {
              select: {
                title: true,
                startDatetime: true,
              },
            },
          },
        },
        notifications: true,
      },
    })

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove sensitive data
    const { passwordHash, resetToken, verificationToken, ...exportData } = userData

    if (format === 'excel') {
      return await generateExcel(exportData)
    } else if (format === 'pdf') {
      return generatePDF(exportData)
    } else {
      // JSON format
      return NextResponse.json(exportData, {
        headers: {
          'Content-Disposition': `attachment; filename="user-data-${session.user.id}.json"`,
          'Content-Type': 'application/json',
        },
      })
    }
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }
}

async function generateExcel(data: any) {
  const workbook = new ExcelJS.Workbook()
  
  // Profile sheet
  const profileSheet = workbook.addWorksheet('Profile')
  profileSheet.columns = [
    { header: 'Field', key: 'field', width: 20 },
    { header: 'Value', key: 'value', width: 50 },
  ]
  profileSheet.addRows([
    { field: 'Name', value: data.name },
    { field: 'Email', value: data.email },
    { field: 'Bio', value: data.bio || 'N/A' },
    { field: 'Location', value: data.location || 'N/A' },
    { field: 'Email Verified', value: data.emailVerified ? 'Yes' : 'No' },
    { field: 'Account Created', value: new Date(data.createdAt).toLocaleDateString() },
  ])

  // Events sheet
  if (data.eventsOwned?.length > 0) {
    const eventsSheet = workbook.addWorksheet('Events')
    eventsSheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Start Date', key: 'startDate', width: 20 },
      { header: 'Category', key: 'category', width: 20 },
    ]
    data.eventsOwned.forEach((event: any) => {
      eventsSheet.addRow({
        title: event.title,
        status: event.status,
        startDate: new Date(event.startDatetime).toLocaleDateString(),
        category: event.category,
      })
    })
  }

  // Registrations sheet
  if (data.registrations?.length > 0) {
    const regsSheet = workbook.addWorksheet('Registrations')
    regsSheet.columns = [
      { header: 'Event', key: 'event', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Registered At', key: 'registeredAt', width: 20 },
    ]
    data.registrations.forEach((reg: any) => {
      regsSheet.addRow({
        event: reg.event.title,
        status: reg.registrationStatus,
        registeredAt: new Date(reg.registeredAt).toLocaleDateString(),
      })
    })
  }

  const buffer = await workbook.xlsx.writeBuffer()
  
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="user-data-${Date.now()}.xlsx"`,
    },
  })
}

function generatePDF(data: any) {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(20)
  doc.text('User Data Export', 105, 15, { align: 'center' })
  
  let yPos = 30

  // Profile Information
  doc.setFontSize(16)
  doc.text('Profile Information', 14, yPos)
  yPos += 10

  const profileData = [
    ['Name', data.name],
    ['Email', data.email],
    ['Bio', data.bio || 'N/A'],
    ['Location', data.location || 'N/A'],
    ['Email Verified', data.emailVerified ? 'Yes' : 'No'],
    ['Account Created', new Date(data.createdAt).toLocaleDateString()],
  ]

  autoTable(doc, {
    startY: yPos,
    head: [['Field', 'Value']],
    body: profileData,
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
  })

  yPos = (doc as any).lastAutoTable.finalY + 15

  // Events Created
  if (data.eventsOwned?.length > 0) {
    doc.setFontSize(16)
    doc.text('Events Created', 14, yPos)
    yPos += 10

    const eventsData = data.eventsOwned.map((event: any) => [
      event.title,
      event.status,
      new Date(event.startDatetime).toLocaleDateString(),
      event.category || 'N/A',
    ])

    autoTable(doc, {
      startY: yPos,
      head: [['Title', 'Status', 'Start Date', 'Category']],
      body: eventsData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
    })

    yPos = (doc as any).lastAutoTable.finalY + 15
  }

  // Event Registrations
  if (data.registrations?.length > 0) {
    // Add new page if needed
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(16)
    doc.text('Event Registrations', 14, yPos)
    yPos += 10

    const registrationsData = data.registrations.map((reg: any) => [
      reg.event.title,
      reg.registrationStatus,
      new Date(reg.registeredAt).toLocaleDateString(),
    ])

    autoTable(doc, {
      startY: yPos,
      head: [['Event', 'Status', 'Registered At']],
      body: registrationsData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
    })
  }

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="user-data-${Date.now()}.pdf"`,
    },
  })
}
