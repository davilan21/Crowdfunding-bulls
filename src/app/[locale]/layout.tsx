import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import SessionProvider from '@/components/SessionProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Cowsfunding.co — Cattle Crowdfunding',
  description: 'Invest in Colombian cattle operations and earn up to 20% annual returns.',
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!routing.locales.includes(locale as 'en' | 'es')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-white">
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <Navbar />
            <main className="pt-16">{children}</main>
            <Footer />
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
