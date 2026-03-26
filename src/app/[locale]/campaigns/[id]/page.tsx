import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import CampaignDetail from './CampaignDetail'

async function getCampaign(id: string) {
  return prisma.campaign.findUnique({
    where: { id },
    include: {
      publisher: { select: { name: true } },
      _count: { select: { investments: true } },
    },
  })
}

export default async function CampaignPage({ params }: { params: { id: string; locale: string } }) {
  const [campaign, session] = await Promise.all([
    getCampaign(params.id),
    getServerSession(authOptions),
  ])

  if (!campaign) notFound()

  return <CampaignDetail campaign={campaign} userId={session?.user.id} locale={params.locale} />
}
