'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUpPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState('INVESTOR')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError(t('errorPasswordMatch'))
      return
    }

    setLoading(true)

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    })

    if (res.status === 409) {
      setError(t('errorExists'))
      setLoading(false)
      return
    }

    if (!res.ok) {
      setError('Error creating account')
      setLoading(false)
      return
    }

    // Auto sign-in
    await signIn('credentials', { email, password, redirect: false })
    router.push(`/${locale}/dashboard`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 to-brand-800 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2">
            <span className="text-4xl">🐄</span>
            <span className="text-2xl font-black text-white">Toros.co</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-brand-950 px-8 py-6">
            <h1 className="text-2xl font-black text-white">{t('signupTitle')}</h1>
            <p className="text-brand-400 text-sm mt-1">{t('signupSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('confirmPassword')}</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900"
                placeholder="••••••••"
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('role')}</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'INVESTOR', label: t('investor') },
                  { value: 'PUBLISHER', label: t('publisher') },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      role === r.value
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {r.value === 'INVESTOR' ? '💰' : '🐄'} {r.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-700 text-white py-3.5 rounded-xl font-bold hover:bg-brand-800 transition-colors disabled:opacity-50"
            >
              {loading ? '...' : t('signupButton')}
            </button>

            <p className="text-center text-sm text-gray-500">
              {t('hasAccount')}{' '}
              <Link href={`/${locale}/auth/signin`} className="text-brand-700 font-semibold hover:underline">
                {t('signinLink')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
