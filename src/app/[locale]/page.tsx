import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import CampaignCard from '@/components/CampaignCard'
import { TrendingUp, Shield, BarChart3, CheckCircle, Video, MapPin, Award, Users } from 'lucide-react'

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
      <section className="relative min-h-[92vh] flex items-center overflow-hidden" style={{ background: '#030f07' }}>
        {/* Fintech grid background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-bg.svg')" }}
        />

        {/* Subtle left-side gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

        {/* Accent glow top-right */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-brand-600/8 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: copy */}
            <div>
              {/* Live badge */}
              <div className="inline-flex items-center gap-2.5 bg-white/5 border border-brand-500/30 text-brand-300 px-4 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-400" />
                </span>
                {t('hero.badge')}
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-[1.08] tracking-tight">
                {t('hero.title')}
                <br />
                <span className="text-brand-400">{t('hero.titleHighlight')}</span>
              </h1>

              <p className="text-lg text-brand-200/80 mb-10 max-w-lg leading-relaxed">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={link('/campaigns')}
                  className="bg-brand-400 text-brand-950 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-brand-300 transition-all shadow-lg shadow-brand-500/20"
                >
                  {t('hero.ctaInvest')}
                </Link>
                <Link
                  href="#how-it-works"
                  className="border border-brand-700 text-brand-300 px-8 py-3.5 rounded-xl font-medium text-base hover:border-brand-500 hover:text-white transition-all backdrop-blur-sm"
                >
                  {t('hero.ctaLearn')}
                </Link>
              </div>

              {/* Mini trust row */}
              <div className="flex items-center gap-6 mt-10">
                <div className="flex items-center gap-1.5 text-brand-500 text-xs">
                  <CheckCircle size={13} className="text-brand-500" />
                  Verified operations
                </div>
                <div className="flex items-center gap-1.5 text-brand-500 text-xs">
                  <CheckCircle size={13} className="text-brand-500" />
                  SEC-compliant structure
                </div>
                <div className="flex items-center gap-1.5 text-brand-500 text-xs">
                  <CheckCircle size={13} className="text-brand-500" />
                  Real-time tracking
                </div>
              </div>
            </div>

            {/* Right: floating investment card */}
            <div className="hidden lg:flex flex-col items-end gap-4">

              {/* Main campaign card */}
              <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-xs text-brand-500 font-medium uppercase tracking-widest mb-1">Active Campaign</div>
                    <div className="text-white font-bold text-lg leading-tight">Brahman Cattle</div>
                    <div className="text-brand-400 text-xs mt-0.5 flex items-center gap-1">
                      <MapPin size={10} /> Montería, Córdoba
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-brand-400">18%</div>
                    <div className="text-xs text-brand-600">Annual ROI</div>
                  </div>
                </div>

                {/* Mini chart bars */}
                <div className="flex items-end gap-1.5 h-12 mb-5">
                  {[40, 55, 48, 70, 62, 80, 75, 90, 85, 100, 95, 112].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h}%`,
                        background: i === 11
                          ? '#4ade80'
                          : `rgba(74,222,128,${0.15 + i * 0.05})`,
                      }}
                    />
                  ))}
                </div>

                {/* Progress */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-brand-500 mb-1.5">
                    <span>$112,500 raised</span>
                    <span className="text-brand-400 font-semibold">75%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full" style={{ width: '75%' }} />
                  </div>
                  <div className="text-xs text-brand-600 mt-1">Target: $150,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-brand-500 text-xs">
                    <Users size={12} />
                    42 investors
                  </div>
                  <Link
                    href={link('/campaigns')}
                    className="text-xs bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-600/30 px-3 py-1.5 rounded-lg font-semibold transition-colors"
                  >
                    View Campaign →
                  </Link>
                </div>
              </div>

              {/* Small return projection card */}
              <div className="w-72 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl">
                <div className="text-xs text-brand-500 font-medium mb-3">Return Projection · $5,000 invested</div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-2xl font-black text-white">$5,900</div>
                    <div className="text-xs text-brand-500 mt-0.5">at maturity · 12 months</div>
                  </div>
                  <div className="text-right">
                    <div className="text-brand-400 font-black text-lg">+$900</div>
                    <div className="text-xs text-brand-600">profit</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/5 bg-black/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl md:text-2xl font-black text-brand-300">{s.value}</div>
                <div className="text-xs text-brand-600 mt-0.5">{s.label}</div>
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

      {/* About Us */}
      <section id="about-us" className="py-24 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 overflow-hidden relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url('/images/cow-pattern.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-700/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-500/8 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-700/30 border border-brand-600/40 text-brand-300 px-4 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm">
                <Award size={14} />
                <span>{t('aboutUs.badge')}</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
                {t('aboutUs.title')}
              </h2>
              <h2 className="text-4xl md:text-5xl font-black text-brand-400 mb-8 leading-tight">
                {t('aboutUs.titleHighlight')}
              </h2>

              <p className="text-brand-200 text-lg leading-relaxed mb-5">
                {t('aboutUs.bio1')}
              </p>
              <p className="text-brand-300 leading-relaxed mb-10">
                {t('aboutUs.bio2')}
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                  { value: t('aboutUs.stat1Value'), label: t('aboutUs.stat1Label') },
                  { value: t('aboutUs.stat2Value'), label: t('aboutUs.stat2Label') },
                  { value: t('aboutUs.stat3Value'), label: t('aboutUs.stat3Label') },
                ].map((s) => (
                  <div key={s.label} className="border-l-2 border-brand-600 pl-4">
                    <div className="text-3xl font-black text-brand-300">{s.value}</div>
                    <div className="text-xs text-brand-500 mt-1 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>

              <Link
                href={link('/asesorias')}
                className="inline-flex items-center gap-2 bg-brand-400 text-brand-950 px-7 py-3.5 rounded-xl font-bold hover:bg-brand-300 transition-all shadow-lg shadow-brand-900/40"
              >
                {t('aboutUs.ctaLabel')} →
              </Link>
            </div>

            {/* Right: profile card */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm">
                {/* Glow behind card */}
                <div className="absolute inset-0 bg-brand-500/15 rounded-3xl blur-2xl scale-110" />

                <div className="relative bg-brand-900/60 backdrop-blur-sm border border-brand-700/50 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Photo */}
                  <div className="relative w-full aspect-[3/4]">
                    <Image
                      src="/images/carlos.jpg"
                      alt="Carlos Eduardo Pinzon"
                      fill
                      className="object-cover object-top"
                    />
                    {/* Gradient fade at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/30 to-transparent" />
                    {/* 🐄 badge */}
                    <div className="absolute top-4 right-4 bg-brand-400 text-brand-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      🐄 Founder
                    </div>
                  </div>

                  {/* Name & title — over the gradient */}
                  <div className="px-6 pt-2 pb-6">
                    <h3 className="text-xl font-black text-white">Carlos Eduardo Pinzon</h3>
                    <p className="text-brand-400 text-sm mt-0.5 mb-5">Founder & Head of Operations</p>

                  {/* Divider */}
                  <div className="border-t border-brand-700/50 mb-5" />

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: Award, label: t('aboutUs.tag1') },
                      { icon: MapPin, label: t('aboutUs.tag2') },
                      { icon: Users, label: t('aboutUs.tag3') },
                      { icon: BarChart3, label: t('aboutUs.tag4') },
                    ].map(({ icon: Icon, label }) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1.5 bg-brand-800/70 border border-brand-700/50 text-brand-300 text-xs px-3 py-1.5 rounded-full"
                      >
                        <Icon size={11} />
                        {label}
                      </span>
                    ))}
                  </div>
                  </div>{/* end px-6 panel */}
                </div>{/* end card */}
              </div>
            </div>

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
