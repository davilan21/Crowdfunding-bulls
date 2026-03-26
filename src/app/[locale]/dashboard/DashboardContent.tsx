'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { TrendingUp, Wallet, BarChart3, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import WithdrawalModal from './WithdrawalModal'

interface Investment {
  id: string
  amount: number
  expectedReturn: number
  totalAtMaturity: number
  status: string
  maturityDate: string | Date
  campaign: { id: string; title: string; titleEs: string; returnRate: number; status: string }
  withdrawal: { status: string } | null
}

interface Campaign {
  id: string
  title: string
  titleEs: string
  currentAmount: number
  targetAmount: number
  status: string
  returnRate: number
  _count: { investments: number }
}

interface User {
  id: string
  name?: string | null
  role: string
}

export default function DashboardContent({
  user,
  investments,
  campaigns,
  locale,
}: {
  user: User
  investments: Investment[]
  campaigns: Campaign[]
  locale: string
}) {
  const t = useTranslations('dashboard')
  const inv_t = useTranslations('dashboard.investment')
  const [tab, setTab] = useState<'investments' | 'campaigns'>('investments')
  const [withdrawalTarget, setWithdrawalTarget] = useState<Investment | null>(null)

  // Summary stats
  const totalInvested = investments.reduce((s, i) => s + i.amount, 0)
  const totalReturns = investments.reduce((s, i) => s + i.expectedReturn, 0)
  const totalAtMaturity = investments.reduce((s, i) => s + i.totalAtMaturity, 0)
  const activeCount = investments.filter(i => i.status === 'ACTIVE').length

  const stats = [
    { label: t('totalInvested'), value: `$${totalInvested.toLocaleString()}`, icon: Wallet, color: 'bg-brand-50 text-brand-700' },
    { label: t('expectedReturns'), value: `$${totalReturns.toLocaleString()}`, icon: TrendingUp, color: 'bg-green-50 text-green-700' },
    { label: t('totalAtMaturity'), value: `$${totalAtMaturity.toLocaleString()}`, icon: BarChart3, color: 'bg-blue-50 text-blue-700' },
    { label: t('activeInvestments'), value: activeCount.toString(), icon: CheckCircle, color: 'bg-amber-50 text-amber-700' },
  ]

  const canWithdraw = (inv: Investment) => {
    const maturity = new Date(inv.maturityDate)
    return (
      inv.status === 'ACTIVE' &&
      !inv.withdrawal &&
      (new Date() >= maturity || inv.campaign.status === 'COMPLETED')
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-950 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-brand-400 text-sm mb-1">{t('welcome')}</p>
            <h1 className="text-3xl font-black">{user.name}</h1>
          </div>
          {user.role !== 'INVESTOR' && (
            <Link
              href={`/${locale}/dashboard/campaigns/new`}
              className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-brand-500 transition-colors text-sm"
            >
              <Plus size={16} />
              {t('newCampaign')}
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon size={20} />
              </div>
              <div className="text-2xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200 rounded-xl p-1 mb-6 w-fit">
          {(['investments', 'campaigns'] as const).map((t_key) => (
            <button
              key={t_key}
              onClick={() => setTab(t_key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t_key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t(`tabs.${t_key}`)}
            </button>
          ))}
        </div>

        {/* Investments tab */}
        {tab === 'investments' && (
          <div>
            {investments.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <div className="text-5xl mb-4">🐄</div>
                <p className="text-gray-400 mb-4">{t('noInvestments')}</p>
                <Link
                  href={`/${locale}/campaigns`}
                  className="inline-block bg-brand-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-800"
                >
                  {t('startInvesting')}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {investments.map((inv) => {
                  const title = locale === 'es' ? inv.campaign.titleEs : inv.campaign.title
                  const maturity = new Date(inv.maturityDate)
                  const now = new Date()
                  const daysLeft = Math.max(0, Math.ceil((maturity.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
                  const isMatured = now >= maturity

                  return (
                    <div key={inv.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <Link
                              href={`/${locale}/campaigns/${inv.campaign.id}`}
                              className="font-bold text-gray-900 text-lg hover:text-brand-700 transition-colors"
                            >
                              {title}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                inv.status === 'WITHDRAWN'
                                  ? 'bg-gray-100 text-gray-500'
                                  : isMatured
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-brand-100 text-brand-700'
                              }`}>
                                {inv.status === 'WITHDRAWN'
                                  ? inv_t('withdrawn')
                                  : isMatured
                                  ? inv_t('completed')
                                  : inv_t('active')}
                              </span>
                              {inv.withdrawal && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">
                                  {inv_t('withdrawalPending')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Withdrawal button */}
                          {canWithdraw(inv) && (
                            <button
                              onClick={() => setWithdrawalTarget(inv)}
                              className="flex items-center gap-1.5 bg-brand-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-800 transition-colors"
                            >
                              <Wallet size={14} />
                              {inv_t('requestWithdrawal')}
                            </button>
                          )}
                        </div>

                        {/* Financial breakdown */}
                        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
                          <div>
                            <div className="text-xs text-gray-400 mb-1">{inv_t('invested')}</div>
                            <div className="text-xl font-black text-gray-900">${inv.amount.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400 mb-1">
                              {inv_t('return').replace('{rate}', inv.campaign.returnRate.toString())}
                            </div>
                            <div className="text-xl font-black text-brand-700">+${inv.expectedReturn.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400 mb-1">{inv_t('atMaturity')}</div>
                            <div className="text-xl font-black text-gray-900">${inv.totalAtMaturity.toLocaleString()}</div>
                          </div>
                        </div>

                        {/* Maturity info */}
                        <div className="mt-4 flex items-center gap-1.5 text-sm text-gray-400">
                          {isMatured ? (
                            <><CheckCircle size={14} className="text-green-500" /> Matured {maturity.toLocaleDateString()}</>
                          ) : (
                            <><Clock size={14} /> {daysLeft} days until {maturity.toLocaleDateString()}</>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Campaigns tab */}
        {tab === 'campaigns' && (
          <div>
            {campaigns.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <div className="text-5xl mb-4">🐄</div>
                <p className="text-gray-400 mb-4">{t('myCampaigns.noCampaigns')}</p>
                <Link
                  href={`/${locale}/dashboard/campaigns/new`}
                  className="inline-block bg-brand-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-800"
                >
                  {t('myCampaigns.createFirst')}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((c) => {
                  const title = locale === 'es' ? c.titleEs : c.title
                  const progress = Math.min((c.currentAmount / c.targetAmount) * 100, 100)
                  return (
                    <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <Link href={`/${locale}/campaigns/${c.id}`} className="font-bold text-gray-900 text-lg hover:text-brand-700">
                            {title}
                          </Link>
                          <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                            <span>{c._count.investments} investors</span>
                            <span>•</span>
                            <span>{c.returnRate}% return</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                              c.status === 'FUNDED' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>{c.status}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-gray-900">${c.currentAmount.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">of ${c.targetAmount.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-600 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Withdrawal modal */}
      {withdrawalTarget && (
        <WithdrawalModal
          investment={withdrawalTarget}
          locale={locale}
          onClose={() => setWithdrawalTarget(null)}
          onSuccess={() => {
            setWithdrawalTarget(null)
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
