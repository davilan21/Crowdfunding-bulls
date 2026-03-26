import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const asesorias = await prisma.asesoria.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  })
  return NextResponse.json(asesorias)
}
