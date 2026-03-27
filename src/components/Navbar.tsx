'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)

  const link = (path: string) => `/${locale}${path}`

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={link('/')} className="flex items-center gap-2">
            <span className="text-2xl">🐄</span>
            <span className="text-xl font-bold text-brand-800">Cowsfunding.co</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href={link('/campaigns')}
              className="text-sm font-medium text-gray-600 hover:text-brand-700 transition-colors"
            >
              {t('campaigns')}
            </Link>
            <Link
              href={link('/asesorias')}
              className="text-sm font-medium text-gray-600 hover:text-brand-700 transition-colors"
            >
              {t('asesorias')}
            </Link>
            <Link
              href={link('/#about-us')}
              className="text-sm font-medium text-gray-600 hover:text-brand-700 transition-colors"
            >
              {t('aboutUs')}
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-brand-700"
                >
                  <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                    {session.user.name?.[0]?.toUpperCase()}
                  </span>
                  <span className="max-w-[120px] truncate">{session.user.name}</span>
                  <ChevronDown size={14} />
                </button>
                {userMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                    <Link
                      href={link('/dashboard')}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50"
                      onClick={() => setUserMenu(false)}
                    >
                      {t('dashboard')}
                    </Link>
                    <button
                      onClick={() => { setUserMenu(false); signOut() }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      {t('signout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href={link('/auth/signin')}
                  className="text-sm font-medium text-gray-600 hover:text-brand-700"
                >
                  {t('signin')}
                </Link>
                <Link
                  href={link('/auth/signup')}
                  className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-800 transition-colors"
                >
                  {t('signup')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link
            href={link('/campaigns')}
            className="block text-sm font-medium text-gray-700 py-2"
            onClick={() => setOpen(false)}
          >
            {t('campaigns')}
          </Link>
          <Link
            href={link('/asesorias')}
            className="block text-sm font-medium text-gray-700 py-2"
            onClick={() => setOpen(false)}
          >
            {t('asesorias')}
          </Link>
          <Link
            href={link('/#about-us')}
            className="block text-sm font-medium text-gray-700 py-2"
            onClick={() => setOpen(false)}
          >
            {t('aboutUs')}
          </Link>
          {session ? (
            <>
              <Link
                href={link('/dashboard')}
                className="block text-sm font-medium text-gray-700 py-2"
                onClick={() => setOpen(false)}
              >
                {t('dashboard')}
              </Link>
              <button
                onClick={() => { setOpen(false); signOut() }}
                className="block text-sm font-medium text-red-600 py-2"
              >
                {t('signout')}
              </button>
            </>
          ) : (
            <>
              <Link
                href={link('/auth/signin')}
                className="block text-sm font-medium text-gray-700 py-2"
                onClick={() => setOpen(false)}
              >
                {t('signin')}
              </Link>
              <Link
                href={link('/auth/signup')}
                className="block bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
                onClick={() => setOpen(false)}
              >
                {t('signup')}
              </Link>
            </>
          )}
          <div className="pt-2 border-t border-gray-100">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </nav>
  )
}
