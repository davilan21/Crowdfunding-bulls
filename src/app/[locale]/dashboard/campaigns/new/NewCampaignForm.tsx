'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function NewCampaignForm({ locale }: { locale: string }) {
  const t = useTranslations('newCampaign')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    titleEs: '',
    description: '',
    descriptionEs: '',
    targetAmount: '',
    returnRate: '15',
    durationMonths: '12',
    cowCount: '',
    breed: '',
    location: '',
    minInvestment: '500',
    imageUrl: '',
  })

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => router.push(`/${locale}/dashboard`), 2000)
    } else {
      setError('Error creating campaign')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="text-brand-600 mx-auto mb-4" size={56} />
          <h2 className="text-2xl font-black text-gray-900 mb-2">{t('success')}</h2>
          <p className="text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-950 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/${locale}/dashboard`}
            className="flex items-center gap-2 text-brand-400 hover:text-white mb-4 text-sm"
          >
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <h1 className="text-3xl font-black">{t('title')}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <form onSubmit={submit} className="space-y-6">
          {/* Titles */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-900">Campaign Title</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('titleEn')}</label>
                <input type="text" value={form.title} onChange={e => set('title', e.target.value)} required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('titleEs')}</label>
                <input type="text" value={form.titleEs} onChange={e => set('titleEs', e.target.value)} required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-900">Description</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('descriptionEn')}</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={4}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('descriptionEs')}</label>
              <textarea value={form.descriptionEs} onChange={e => set('descriptionEs', e.target.value)} required rows={4}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none" />
            </div>
          </div>

          {/* Financial */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-900">Financial Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('targetAmount')}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input type="number" value={form.targetAmount} onChange={e => set('targetAmount', e.target.value)} required min={1000}
                    className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('returnRate')}</label>
                <div className="relative">
                  <input type="number" value={form.returnRate} onChange={e => set('returnRate', e.target.value)} required min={1} max={50}
                    className="w-full pr-8 pl-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('durationMonths')}</label>
                <input type="number" value={form.durationMonths} onChange={e => set('durationMonths', e.target.value)} required min={1}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('minInvestment')}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input type="number" value={form.minInvestment} onChange={e => set('minInvestment', e.target.value)} required min={100}
                    className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Cattle details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-900">Cattle Details</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('cowCount')}</label>
                <input type="number" value={form.cowCount} onChange={e => set('cowCount', e.target.value)} required min={1}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('breed')}</label>
                <input type="text" value={form.breed} onChange={e => set('breed', e.target.value)} required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" placeholder="e.g. Brahman" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('location')}</label>
                <input type="text" value={form.location} onChange={e => set('location', e.target.value)} required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" placeholder="e.g. Córdoba" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('imageUrl')}</label>
              <input type="url" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" placeholder="https://..." />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-800 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : t('submit')}
          </button>
        </form>
      </div>
    </div>
  )
}
