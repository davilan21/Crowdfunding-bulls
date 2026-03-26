import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

export default function Footer() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const link = (path: string) => `/${locale}${path}`

  return (
    <footer className="bg-brand-950 text-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🐄</span>
              <span className="text-xl font-bold text-white">Toros.co</span>
            </div>
            <p className="text-sm text-brand-400 max-w-xs">
              Crowdfunding ganadero. Invierte en ganado colombiano y gana hasta 20% anual.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={link('/campaigns')} className="text-brand-400 hover:text-white transition-colors">{t('campaigns')}</Link></li>
              <li><Link href={link('/asesorias')} className="text-brand-400 hover:text-white transition-colors">{t('asesorias')}</Link></li>
              <li><Link href={link('/auth/signup')} className="text-brand-400 hover:text-white transition-colors">{t('signup')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-brand-400">
              <li>Carlos Eduardo Pinzon</li>
              <li>
                <a href="https://www.tiktok.com/@carloseduardopinzon2" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  TikTok @carloseduardopinzon2
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-900 text-center text-xs text-brand-600">
          © {new Date().getFullYear()} Toros.co — All rights reserved.
        </div>
      </div>
    </footer>
  )
}
