'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle } from 'lucide-react'

interface Investment {
  id: string
  totalAtMaturity: number
  campaign: { title: string; titleEs: string }
}

export default function WithdrawalModal({
  investment,
  locale,
  onClose,
  onSuccess,
}: {
  investment: Investment
  locale: string
  onClose: () => void
  onSuccess: () => void
}) {
  const t = useTranslations('withdrawal')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const title = locale === 'es' ? investment.campaign.titleEs : investment.campaign.title

  const submit = async () => {
    if (!bankName || !accountNumber) return
    setLoading(true)
    try {
      const res = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investmentId: investment.id,
          bankName,
          accountNumber,
          routingNumber,
          notes,
        }),
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(onSuccess, 2000)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-brand-950 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white">{t('title')}</h3>
            <p className="text-brand-400 text-sm">{title}</p>
          </div>
          <button onClick={onClose} className="text-brand-400 hover:text-white text-xl font-bold">×</button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <CheckCircle className="text-brand-600 mx-auto mb-4" size={48} />
            <h4 className="font-bold text-gray-900 text-lg mb-2">{t('success')}</h4>
            <p className="text-gray-500 text-sm">{t('processing')}</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-500">{t('subtitle')}</p>

            {/* Amount summary */}
            <div className="bg-brand-50 rounded-xl p-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">{t('totalAvailable')}</span>
              <span className="text-xl font-black text-brand-800">${investment.totalAtMaturity.toLocaleString()}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('bankName')} *</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                placeholder="e.g. Bank of America"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('accountNumber')} *</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('routingNumber')}</label>
              <input
                type="text"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('notes')}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              onClick={submit}
              disabled={loading || !bankName || !accountNumber}
              className="w-full bg-brand-700 text-white py-3 rounded-xl font-bold hover:bg-brand-800 transition-colors disabled:opacity-50"
            >
              {loading ? '...' : t('submit')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
