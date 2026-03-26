'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Video, MapPin, Clock, CheckCircle, ChevronDown } from 'lucide-react'

interface Asesoria {
  id: string
  title: string
  titleEs: string
  description: string
  descriptionEs: string
  type: string
  price: number
  durationMins: number
  features: string
}

function BookingModal({
  asesoria,
  locale,
  onClose,
}: {
  asesoria: Asesoria
  locale: string
  onClose: () => void
}) {
  const t = useTranslations('asesorias')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const title = locale === 'es' ? asesoria.titleEs : asesoria.title

  const submit = async () => {
    if (!name || !email) return
    setLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asesoriaId: asesoria.id, name, email, phone, notes }),
      })
      if (res.ok) setSuccess(true)
      else setError('Error submitting booking')
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
            <h3 className="font-bold text-white">{t('bookingTitle')}</h3>
            <p className="text-brand-400 text-sm">{title}</p>
          </div>
          <button onClick={onClose} className="text-brand-400 hover:text-white text-xl font-bold">×</button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <CheckCircle className="text-brand-600 mx-auto mb-4" size={48} />
            <h4 className="font-bold text-gray-900 text-lg mb-2">{t('bookingSuccess')}</h4>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-500">{t('bookingSubtitle')}</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')} *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')} *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('notes')}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              onClick={submit}
              disabled={loading || !name || !email}
              className="w-full bg-brand-700 text-white py-3 rounded-xl font-bold hover:bg-brand-800 transition-colors disabled:opacity-50"
            >
              {loading ? '...' : t('submitBooking')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AsesoriaContent({ asesorias }: { asesorias: Asesoria[] }) {
  const t = useTranslations('asesorias')
  const locale = useLocale()
  const [selected, setSelected] = useState<Asesoria | null>(null)

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} ${t('minutes')}`
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return m > 0 ? `${h}${t('hours')} ${m}${t('minutes')}` : `${h} ${t('hours')}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-950 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-800 text-brand-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Video size={14} />
            Expert Advisory
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{t('title')}</h1>
          <p className="text-brand-300 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Asesoria cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {asesorias.map((a) => {
            const features = JSON.parse(a.features) as string[]
            const title = locale === 'es' ? a.titleEs : a.title
            const description = locale === 'es' ? a.descriptionEs : a.description

            return (
              <div key={a.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                {/* Header */}
                <div className={`px-6 py-5 ${a.type === 'PHYSICAL' ? 'bg-brand-950' : 'bg-brand-800'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {a.type === 'VIRTUAL' ? (
                      <Video size={18} className="text-brand-300" />
                    ) : (
                      <MapPin size={18} className="text-brand-300" />
                    )}
                    <span className="text-brand-300 text-xs font-semibold uppercase tracking-wider">
                      {a.type === 'VIRTUAL' ? t('virtual') : t('physical')}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-lg leading-snug">{title}</h3>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  {/* Price & duration */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="text-3xl font-black text-gray-900">${a.price}</div>
                      <div className="text-xs text-gray-400">USD</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-gray-600 font-semibold">
                        <Clock size={14} />
                        {formatDuration(a.durationMins)}
                      </div>
                      <div className="text-xs text-gray-400">session</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{description}</p>

                  {/* Features */}
                  <div className="mb-6 flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('includes')}</p>
                    <ul className="space-y-2">
                      {features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle size={15} className="text-brand-600 shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setSelected(a)}
                    className="w-full bg-brand-700 text-white py-3 rounded-xl font-bold hover:bg-brand-800 transition-colors"
                  >
                    {t('bookNow')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* About Carlos */}
        <div className="bg-brand-950 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-brand-800 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
            👨‍🌾
          </div>
          <h2 className="text-2xl font-black text-white mb-3">{t('aboutCarlos')}</h2>
          <p className="text-brand-300 max-w-2xl mx-auto leading-relaxed">{t('carlosDesc')}</p>
          <a
            href="https://www.tiktok.com/@carloseduardopinzon2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 bg-brand-800 text-brand-300 hover:text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
            @carloseduardopinzon2 on TikTok →
          </a>
        </div>
      </div>

      {/* Booking modal */}
      {selected && (
        <BookingModal
          asesoria={selected}
          locale={locale}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
