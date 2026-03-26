import { useTranslations, useLocale } from 'next-intl'
import { prisma } from '@/lib/prisma'
import CampaignCard from '@/components/CampaignCard'

async function getCampaigns() {
  return prisma.campaign.findMany({
    where: { status: { in: ['ACTIVE', 'FUNDED', 'COMPLETED'] } },
    include: { _count: { select: { investments: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns()
  return <CampaignsContent campaigns={campaigns} />
}

function CampaignsContent({
  campaigns,
}: {
  campaigns: Awaited<ReturnType<typeof getCampaigns>>
}) {
  const t = useTranslations('campaigns')

  const filters = [
    { key: 'all', label: t('all') },
    { key: 'ACTIVE', label: t('active') },
    { key: 'FUNDED', label: t('funded') },
    { key: 'COMPLETED', label: t('completed') },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-950 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-3">{t('title')}</h1>
          <p className="text-brand-300 text-lg">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {filters.map((f) => (
            <span
              key={f.key}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-600"
            >
              {f.label} ({campaigns.filter(c => f.key === 'all' || c.status === f.key).length})
            </span>
          ))}
        </div>

        {campaigns.length === 0 ? (
          <p className="text-gray-400 text-center py-20">{t('noCampaigns')}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
