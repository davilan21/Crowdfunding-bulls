import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { asesoriaId, name, email, phone, notes } = await req.json()

    if (!asesoriaId || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const booking = await prisma.booking.create({
      data: {
        asesoriaId,
        name,
        email,
        phone,
        notes,
        userId: undefined,
        status: 'PENDING',
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
