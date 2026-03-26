'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggle = () => {
    const next = locale === 'en' ? 'es' : 'en'
    // Replace current locale prefix
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/'))
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-700 transition-colors"
      aria-label="Switch language"
    >
      <Globe size={16} />
      <span>{locale === 'en' ? 'ES' : 'EN'}</span>
    </button>
  )
}
