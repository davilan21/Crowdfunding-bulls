import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardContent from './DashboardContent'

async function getDashboardData(userId: string) {
  const [investments, campaigns] = await Promise.all([
    prisma.investment.findMany({
      where: { userId },
      include: {
        campaign: { select: { id: true, title: true, titleEs: true, returnRate: true, status: true } },
        withdrawal: { select: { status: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.campaign.findMany({
      where: { publisherId: userId },
      include: { _count: { select: { investments: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ])
  return { investments, campaigns }
}

export default async function DashboardPage({ params }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect(`/${params.locale}/auth/signin`)

  const { investments, campaigns } = await getDashboardData(session.user.id)

  return (
    <DashboardContent
      user={session.user}
      investments={investments}
      campaigns={campaigns}
      locale={params.locale}
    />
  )
}
