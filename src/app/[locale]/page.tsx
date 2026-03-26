import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import CampaignCard from '@/components/CampaignCard'
import { TrendingUp, Shield, BarChart3, CheckCircle, Video, MapPin } from 'lucide-react'

async function getHomeData() {
  const [campaigns, totalInvested, investorCount] = await Promise.all([
    prisma.campaign.findMany({
      where: { status: { in: ['ACTIVE', 'FUNDED'] } },
      include: { _count: { select: { investments: true } } },
      orderBy: { currentAmount: 'desc' },
      take: 3,
    }),
    prisma.investment.aggregate({ _sum: { amount: true } }),
    prisma.user.count({ where: { role: 'INVESTOR' } }),
  ])
  return { campaigns, totalInvested: totalInvested._sum.amount ?? 0, investorCount }
}

export default async function HomePage() {
  const { campaigns, totalInvested, investorCount } = await getHomeData()

  return <HomeContent campaigns={campaigns} totalInvested={totalInvested} investorCount={investorCount} />
}

function HomeContent({
  campaigns,
  totalInvested,
  investorCount,
}: {
  campaigns: Awaited<ReturnType<typeof getHomeData>>['campaigns']
  totalInvested: number
  investorCount: number
}) {
  const t = useTranslations('home')
  const locale = useLocale()
  const link = (p: string) => `/${locale}${p}`

  const stats = [
    { label: t('stats.totalInvested'), value: `$${(totalInvested / 1000).toFixed(0)}K+` },
    { label: t('stats.activeCampaigns'), value: `${campaigns.length}` },
    { label: t('stats.avgReturn'), value: '17%' },
    { label: t('stats.investors'), value: `${investorCount}+` },
  ]

  const steps = [
    { icon: BarChart3, title: t('howItWorks.step1Title'), desc: t('howItWorks.step1Desc') },
    { icon: TrendingUp, title: t('howItWorks.step2Title'), desc: t('howItWorks.step2Desc') },
    { icon: CheckCircle, title: t('howItWorks.step3Title'), desc: t('howItWorks.step3Desc') },
  ]

  const trust = [
    { icon: Shield, title: t('trust.item1Title'), desc: t('trust.item1Desc') },
    { icon: BarChart3, title: t('trust.item2Title'), desc: t('trust.item2Desc') },
    { icon: CheckCircle, title: t('trust.item3Title'), desc: t('trust.item3Desc') },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[92vh] bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 flex items-center overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-brand-700/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-brand-500/10 rounded-full blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-700/40 border border-brand-600/50 text-brand-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <span>🐄</span>
              <span>{t('hero.badge')}</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05]">
              {t('hero.title')}
              <br />
              <span className="text-brand-400">{t('hero.titleHighlight')}</span>
            </h1>

            <p className="text-xl text-brand-200 mb-10 max-w-xl leading-relaxed">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href={link('/campaigns')}
                className="bg-brand-400 text-brand-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-300 transition-all shadow-lg shadow-brand-900/50"
              >
                {t('hero.ctaInvest')}
              </Link>
              <Link
                href="#how-it-works"
                className="border-2 border-brand-600 text-brand-300 px-8 py-4 rounded-xl font-medium text-lg hover:border-brand-400 hover:text-white transition-all"
              >
                {t('hero.ctaLearn')}
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-brand-950/60 backdrop-blur-sm border-t border-brand-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl md:text-2xl font-black text-brand-300">{s.value}</div>
                <div className="text-xs text-brand-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-3">{t('howItWorks.title')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t('howItWorks.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {i + 1}
                </div>
                <div className="flex justify-center mb-4 mt-2">
                  <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center">
                    <step.icon className="text-brand-700" size={26} />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-4xl font-black text-gray-900">{t('featured')}</h2>
            <Link
              href={link('/campaigns')}
              className="text-brand-700 font-semibold text-sm hover:text-brand-900 flex items-center gap-1"
            >
              {t('viewAll')} →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {campaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20 bg-brand-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-white text-center mb-12">{t('trust.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {trust.map((item, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-brand-800 rounded-2xl flex items-center justify-center">
                    <item.icon className="text-brand-400" size={26} />
                  </div>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-brand-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Asesorias CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Video size={14} />
            Advisory Services
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">{t('asesorias.title')}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">{t('asesorias.subtitle')}</p>
          <Link
            href={link('/asesorias')}
            className="inline-block bg-brand-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-800 transition-colors"
          >
            {t('asesorias.book')} →
          </Link>
        </div>
      </section>
    </>
  )
}
