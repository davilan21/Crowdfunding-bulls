'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { TrendingUp, DollarSign, Calendar, Calculator } from 'lucide-react'

export default function InvestmentCalculator() {
  const t = useTranslations('calculator')

  const [amount, setAmount] = useState(1000)
  const [returnRate, setReturnRate] = useState(15)
  const [durationMonths, setDurationMonths] = useState(12)

  const expectedReturn = (amount * returnRate) / 100
  const totalAtMaturity = amount + expectedReturn
  const monthlyEquivalent = expectedReturn / durationMonths

  const formatCurrency = (value: number) =>
    value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <section className="bg-brand-950 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-800 text-brand-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <Calculator className="w-4 h-4" />
            {t('badge')}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">{t('title')}</h2>
          <p className="text-brand-300 text-lg max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Controls */}
            <div className="p-8 space-y-8 border-b md:border-b-0 md:border-r border-gray-100">
              {/* Amount */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">{t('amountLabel')}</label>
                  <span className="text-brand-600 font-bold text-lg">${formatCurrency(amount)}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={50000}
                  step={500}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$500</span>
                  <span>$50,000</span>
                </div>
              </div>

              {/* Return Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">{t('returnRateLabel')}</label>
                  <span className="text-brand-600 font-bold text-lg">{returnRate}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={20}
                  step={0.5}
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* Duration */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">{t('durationLabel')}</label>
                  <span className="text-brand-600 font-bold text-lg">
                    {durationMonths} {t('months')}
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={24}
                  step={1}
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>6 {t('months')}</span>
                  <span>24 {t('months')}</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-8 bg-brand-50 flex flex-col justify-center space-y-5">
              <h3 className="text-sm font-semibold text-brand-700 uppercase tracking-wide mb-2">
                {t('projectionTitle')}
              </h3>

              {/* Invested */}
              <div className="flex items-center justify-between bg-white rounded-xl px-5 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-600">{t('youInvest')}</span>
                </div>
                <span className="font-bold text-gray-900">${formatCurrency(amount)}</span>
              </div>

              {/* Expected Return */}
              <div className="flex items-center justify-between bg-white rounded-xl px-5 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 block">{t('expectedReturn')}</span>
                    <span className="text-xs text-brand-500 font-medium">+{returnRate}%</span>
                  </div>
                </div>
                <span className="font-bold text-brand-600">+${formatCurrency(expectedReturn)}</span>
              </div>

              {/* Monthly */}
              <div className="flex items-center justify-between bg-white rounded-xl px-5 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-sm text-gray-600">{t('perMonth')}</span>
                </div>
                <span className="font-bold text-blue-600">${formatCurrency(monthlyEquivalent)}</span>
              </div>

              {/* Divider */}
              <div className="border-t border-brand-200 pt-4">
                <div className="flex items-center justify-between bg-brand-600 rounded-xl px-5 py-4">
                  <span className="text-white font-semibold">{t('totalAtMaturity')}</span>
                  <span className="text-white font-black text-xl">${formatCurrency(totalAtMaturity)}</span>
                </div>
              </div>

              <p className="text-xs text-brand-700 text-center">{t('disclaimer')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
