import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const investments = await prisma.investment.findMany({
    where: { userId: session.user.id },
    include: {
      campaign: { select: { title: true, titleEs: true, returnRate: true, status: true } },
      withdrawal: { select: { status: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(investments)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { campaignId, amount } = await req.json()

    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } })
    if (!campaign || campaign.status === 'FUNDED' || campaign.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Campaign not available' }, { status: 400 })
    }

    if (Number(amount) < campaign.minInvestment) {
      return NextResponse.json(
        { error: `Minimum investment is $${campaign.minInvestment}` },
        { status: 400 }
      )
    }

    const expectedReturn = (Number(amount) * campaign.returnRate) / 100
    const totalAtMaturity = Number(amount) + expectedReturn

    const maturityDate = new Date()
    maturityDate.setMonth(maturityDate.getMonth() + campaign.durationMonths)

    const [investment] = await prisma.$transaction([
      prisma.investment.create({
        data: {
          userId: session.user.id,
          campaignId,
          amount: Number(amount),
          expectedReturn,
          totalAtMaturity,
          maturityDate,
          status: 'ACTIVE',
        },
      }),
      prisma.campaign.update({
        where: { id: campaignId },
        data: {
          currentAmount: { increment: Number(amount) },
        },
      }),
    ])

    // Auto-mark as FUNDED if target reached
    const updated = await prisma.campaign.findUnique({ where: { id: campaignId } })
    if (updated && updated.currentAmount >= updated.targetAmount) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'FUNDED' },
      })
    }

    return NextResponse.json(investment, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
