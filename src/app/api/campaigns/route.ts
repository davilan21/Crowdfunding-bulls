import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const where = status && status !== 'all' ? { status: status.toUpperCase() } : {}

  const campaigns = await prisma.campaign.findMany({
    where,
    include: {
      publisher: { select: { name: true } },
      _count: { select: { investments: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(campaigns)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role === 'INVESTOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      title, titleEs, description, descriptionEs,
      targetAmount, returnRate, durationMonths,
      cowCount, breed, location, minInvestment, imageUrl,
      videoUrl, mediaGallery, hasInsurance, insuranceDetails,
    } = body

    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + Number(durationMonths))

    // Normalize mediaGallery: accept comma-separated string or array, store as JSON
    let galleryJson: string | undefined
    if (mediaGallery) {
      const urls = Array.isArray(mediaGallery)
        ? mediaGallery
        : String(mediaGallery).split(',').map((s: string) => s.trim()).filter(Boolean)
      galleryJson = JSON.stringify(urls)
    }

    const campaign = await prisma.campaign.create({
      data: {
        title,
        titleEs,
        description,
        descriptionEs,
        targetAmount: Number(targetAmount),
        returnRate: Number(returnRate),
        durationMonths: Number(durationMonths),
        cowCount: Number(cowCount),
        breed,
        location,
        minInvestment: Number(minInvestment) || 500,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        mediaGallery: galleryJson || null,
        hasInsurance: Boolean(hasInsurance),
        insuranceDetails: insuranceDetails || null,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate,
        publisherId: session.user.id,
      },
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
