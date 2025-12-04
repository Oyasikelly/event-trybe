import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ExcelJS from 'exceljs'
import PDFDocument from 'pdfkit'

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
      return await generatePDF(exportData)
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

async function generatePDF(data: any) {
  return new Promise<NextResponse>((resolve, reject) => {
    const doc = new PDFDocument()
    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => {
      const buffer = Buffer.concat(chunks)
      resolve(
        new NextResponse(buffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="user-data-${Date.now()}.pdf"`,
          },
        })
      )
    })
    doc.on('error', reject)

    // PDF Content
    doc.fontSize(20).text('User Data Export', { align: 'center' })
    doc.moveDown()

    // Profile Section
    doc.fontSize(16).text('Profile Information')
    doc.fontSize(12)
    doc.text(`Name: ${data.name}`)
    doc.text(`Email: ${data.email}`)
    doc.text(`Bio: ${data.bio || 'N/A'}`)
    doc.text(`Location: ${data.location || 'N/A'}`)
    doc.text(`Email Verified: ${data.emailVerified ? 'Yes' : 'No'}`)
    doc.text(`Account Created: ${new Date(data.createdAt).toLocaleDateString()}`)
    doc.moveDown()

    // Events Section
    if (data.eventsOwned?.length > 0) {
      doc.fontSize(16).text('Events Created')
      doc.fontSize(12)
      data.eventsOwned.forEach((event: any, index: number) => {
        doc.text(`${index + 1}. ${event.title}`)
        doc.text(`   Status: ${event.status}`)
        doc.text(`   Start: ${new Date(event.startDatetime).toLocaleDateString()}`)
        doc.moveDown(0.5)
      })
      doc.moveDown()
    }

    // Registrations Section
    if (data.registrations?.length > 0) {
      doc.fontSize(16).text('Event Registrations')
      doc.fontSize(12)
      data.registrations.forEach((reg: any, index: number) => {
        doc.text(`${index + 1}. ${reg.event.title}`)
        doc.text(`   Status: ${reg.registrationStatus}`)
        doc.text(`   Registered: ${new Date(reg.registeredAt).toLocaleDateString()}`)
        doc.moveDown(0.5)
      })
    }

    doc.end()
  })
}
