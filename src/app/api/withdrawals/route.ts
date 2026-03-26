import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { investmentId, bankName, accountNumber, routingNumber, notes } = await req.json()

    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
      include: { withdrawal: true },
    })

    if (!investment || investment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 })
    }

    if (investment.withdrawal) {
      return NextResponse.json({ error: 'Withdrawal already requested' }, { status: 400 })
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: session.user.id,
        investmentId,
        amount: investment.totalAtMaturity,
        bankName,
        accountNumber,
        routingNumber,
        notes,
        status: 'PENDING',
      },
    })

    await prisma.investment.update({
      where: { id: investmentId },
      data: { status: 'WITHDRAWN' },
    })

    return NextResponse.json(withdrawal, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
