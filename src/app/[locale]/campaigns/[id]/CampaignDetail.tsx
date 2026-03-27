'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import {
  TrendingUp, Clock, Beef, MapPin, Users, ArrowLeft, CheckCircle,
  Shield, Lock, CalendarCheck, AlertTriangle, BadgeCheck, Play,
  Images,
} from 'lucide-react'

interface Campaign {
  id: string
  title: string
  titleEs: string
  description: string
  descriptionEs: string
  targetAmount: number
  currentAmount: number
  returnRate: number
  durationMonths: number
  cowCount: number
  breed: string
  location: string
  imageUrl?: string | null
  videoUrl?: string | null
  mediaGallery?: string | null   // JSON: ["url1", "url2", ...]
  hasInsurance: boolean
  insuranceDetails?: string | null
  minInvestment: number
  status: string
  _count: { investments: number }
  publisher: { name: string }
}

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

function parseGallery(raw?: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.filter(Boolean)
  } catch {
    // comma-separated fallback
    return raw.split(',').map(s => s.trim()).filter(Boolean)
  }
  return []
}

export default function CampaignDetail({
  campaign,
  userId,
  locale,
}: {
  campaign: Campaign
  userId?: string
  locale: string
}) {
  const t = useTranslations('campaign')
  const [amount, setAmount] = useState(campaign.minInvestment.toString())
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [activePhoto, setActivePhoto] = useState<string | null>(null)

  const numAmount = parseFloat(amount) || 0
  const expectedReturn = (numAmount * campaign.returnRate) / 100
  const totalAtMaturity = numAmount + expectedReturn
  const progress = Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100)
  const isFunded = campaign.status === 'FUNDED' || campaign.status === 'COMPLETED'

  const title = locale === 'es' ? campaign.titleEs : campaign.title
  const description = locale === 'es' ? campaign.descriptionEs : campaign.description

  const gallery = parseGallery(campaign.mediaGallery)
  const youtubeId = campaign.videoUrl ? getYoutubeId(campaign.videoUrl) : null

  const handleInvest = async () => {
    if (!userId) {
      setError(t('loginRequired'))
      return
    }
    if (numAmount < campaign.minInvestment) {
      setError(`Minimum: $${campaign.minInvestment}`)
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: campaign.id, amount: numAmount }),
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Error')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero image */}
      <div className="relative h-72 md:h-96 bg-brand-900">
        {campaign.imageUrl ? (
          <Image
            src={campaign.imageUrl}
            alt={title}
            fill
            className="object-cover opacity-80"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-8xl">🐄</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Link
            href={`/${locale}/campaigns`}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition"
          >
            <ArrowLeft size={14} />
            {t('back')}
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute bottom-6 left-6 flex items-center gap-3">
          <span className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-full text-base font-bold shadow">
            <TrendingUp size={16} />
            {campaign.returnRate}% {t('returnRateLabel')}
          </span>
          {campaign.hasInsurance && (
            <span className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-2 rounded-full text-sm font-semibold shadow">
              <Shield size={14} />
              Insured
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Campaign info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & meta */}
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">{title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={14} />{campaign.location}</span>
                <span className="flex items-center gap-1"><Users size={14} />{campaign._count.investments} {t('investors')}</span>
                <span className="flex items-center gap-1"><Beef size={14} />{campaign.breed}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <div className="text-2xl font-black text-gray-900">${campaign.currentAmount.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">{t('back')} of ${campaign.targetAmount.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-brand-700">{progress.toFixed(0)}%</div>
                  <div className="text-sm text-gray-400">funded</div>
                </div>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isFunded ? 'bg-green-500' : 'bg-brand-600'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: t('returnRateLabel'), value: `${campaign.returnRate}%`, icon: TrendingUp },
                { label: t('durationLabel'), value: `${campaign.durationMonths} ${t('months')}`, icon: Clock },
                { label: t('cowCountLabel'), value: campaign.cowCount.toString(), icon: Beef },
                { label: t('minInvestmentLabel'), value: `$${campaign.minInvestment.toLocaleString()}`, icon: TrendingUp },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                  <div className="text-xl font-black text-brand-700">{item.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg mb-3">{t('about')}</h2>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>

            {/* ── Campaign Video ── */}
            {youtubeId && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Play size={15} className="text-red-600 fill-red-600" />
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">{t('videoTitle')}</h2>
                </div>
                <div className="relative w-full rounded-xl overflow-hidden shadow-md" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* ── Photo Gallery ── */}
            {gallery.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                    <Images size={15} className="text-brand-700" />
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">{t('galleryTitle')}</h2>
                  <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{gallery.length} photos</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhoto(url)}
                      className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 hover:ring-2 hover:ring-brand-500 transition-all"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Farm photo ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        {i + 1}/{gallery.length}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Rules & Protection ── */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-brand-900/20">
              {/* Header */}
              <div className="bg-brand-950 px-6 py-5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 bg-brand-800 rounded-xl flex items-center justify-center">
                    <Shield size={18} className="text-brand-300" />
                  </div>
                  <h2 className="font-black text-white text-xl">{t('rulesTitle')}</h2>
                </div>
                <p className="text-brand-400 text-sm ml-12">{t('rulesSubtitle')}</p>
              </div>

              {/* Cards grid */}
              <div className="bg-brand-950/95 p-6 grid md:grid-cols-2 gap-4">

                {/* Rule 1 — Cow dies */}
                <RuleCard
                  icon={<AlertTriangle size={18} className="text-amber-400" />}
                  iconBg="bg-amber-400/15 border border-amber-400/20"
                  accent="border-l-amber-500"
                  title={t('rule1Title')}
                  desc={t('rule1Desc')}
                />

                {/* Rule 2 — Insurance */}
                <RuleCard
                  icon={<Shield size={18} className={campaign.hasInsurance ? 'text-emerald-400' : 'text-gray-400'} />}
                  iconBg={campaign.hasInsurance
                    ? 'bg-emerald-400/15 border border-emerald-400/20'
                    : 'bg-gray-600/20 border border-gray-600/20'}
                  accent={campaign.hasInsurance ? 'border-l-emerald-500' : 'border-l-gray-600'}
                  title={campaign.hasInsurance ? t('rule2TitleInsured') : t('rule2TitleUninsured')}
                  desc={campaign.insuranceDetails || (campaign.hasInsurance ? t('rule2DescInsured') : t('rule2DescUninsured'))}
                  badge={campaign.hasInsurance
                    ? <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                        <BadgeCheck size={11} /> {t('rule2Badge')}
                      </span>
                    : null}
                />

                {/* Rule 3 — When paid */}
                <RuleCard
                  icon={<CalendarCheck size={18} className="text-brand-400" />}
                  iconBg="bg-brand-400/15 border border-brand-400/20"
                  accent="border-l-brand-500"
                  title={t('rule3Title')}
                  desc={t('rule3Desc')}
                />

                {/* Rule 4 — No early exit */}
                <RuleCard
                  icon={<Lock size={18} className="text-yellow-400" />}
                  iconBg="bg-yellow-400/15 border border-yellow-400/20"
                  accent="border-l-yellow-500"
                  title={t('rule4Title')}
                  desc={t('rule4Desc')}
                />

                {/* Rule 5 — Verified — full width */}
                <div className="md:col-span-2">
                  <RuleCard
                    icon={<BadgeCheck size={18} className="text-emerald-400" />}
                    iconBg="bg-emerald-400/15 border border-emerald-400/20"
                    accent="border-l-emerald-500"
                    title={t('rule5Title')}
                    desc={t('rule5Desc')}
                  />
                </div>

              </div>
            </div>

          </div>

          {/* Right: Investment panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              {isFunded ? (
                <div className="p-6 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{t('funded')}</h3>
                  <p className="text-gray-500 text-sm">{t('fundedDesc')}</p>
                </div>
              ) : success ? (
                <div className="p-6 text-center">
                  <CheckCircle className="text-brand-600 mx-auto mb-3" size={40} />
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{t('successMessage')}</h3>
                  <p className="text-gray-500 text-sm">{t('investmentNote')}</p>
                </div>
              ) : (
                <>
                  <div className="bg-brand-950 px-6 py-4">
                    <h3 className="font-bold text-white">{t('investNow')}</h3>
                  </div>
                  <div className="p-6 space-y-5">
                    {/* Amount input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t('amount')}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          min={campaign.minInvestment}
                          step={100}
                          className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 font-semibold"
                          placeholder={t('amountPlaceholder')}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Min: ${campaign.minInvestment.toLocaleString()}</p>
                    </div>

                    {/* Projection */}
                    {numAmount >= campaign.minInvestment && (
                      <div className="bg-brand-50 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">{t('amount').replace(' (USD)', '')}</span>
                          <span className="font-bold text-gray-900">${numAmount.toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">{t('expectedReturn')} ({campaign.returnRate}%)</span>
                          <span className="font-bold text-brand-700">+${expectedReturn.toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="border-t border-brand-100 pt-3 flex justify-between">
                          <span className="font-semibold text-gray-700">{t('totalAtMaturity')}</span>
                          <span className="font-black text-brand-800 text-lg">${totalAtMaturity.toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="text-xs text-gray-400 text-center">
                          After {campaign.durationMonths} months
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</div>
                    )}

                    <button
                      onClick={handleInvest}
                      disabled={loading || numAmount < campaign.minInvestment}
                      className="w-full bg-brand-700 text-white py-3.5 rounded-xl font-bold hover:bg-brand-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? '...' : t('confirmInvestment')}
                    </button>

                    <p className="text-xs text-gray-400 text-center leading-relaxed">
                      {t('investmentNote')}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activePhoto}
            alt="Farm photo"
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl font-light leading-none"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

function RuleCard({
  icon,
  iconBg,
  accent,
  title,
  desc,
  badge,
}: {
  icon: React.ReactNode
  iconBg: string
  accent: string
  title: string
  desc: string
  badge?: React.ReactNode
}) {
  return (
    <div className={`bg-brand-900/50 border-l-4 ${accent} rounded-r-xl p-5 flex gap-4`}>
      <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center mt-0.5`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <h3 className="font-bold text-white text-sm">{title}</h3>
          {badge}
        </div>
        <p className="text-brand-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
