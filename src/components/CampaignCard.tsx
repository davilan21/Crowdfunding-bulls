import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { TrendingUp, Clock, Beef, MapPin } from 'lucide-react'

interface Campaign {
  id: string
  title: string
  titleEs: string
  targetAmount: number
  currentAmount: number
  returnRate: number
  durationMonths: number
  cowCount: number
  breed: string
  location: string
  imageUrl?: string | null
  minInvestment: number
  status: string
  _count?: { investments: number }
}

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const t = useTranslations('campaigns')
  const locale = useLocale()
  const progress = Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100)
  const isFunded = campaign.status === 'FUNDED' || campaign.status === 'COMPLETED'
  const title = locale === 'es' ? campaign.titleEs : campaign.title

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-brand-100">
        {campaign.imageUrl ? (
          <Image
            src={campaign.imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-6xl">🐄</div>
        )}
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            isFunded
              ? 'bg-green-100 text-green-700'
              : 'bg-brand-600 text-white'
          }`}>
            {isFunded ? t('funded100') : t('active')}
          </span>
        </div>
        {/* Return rate badge */}
        <div className="absolute bottom-3 left-3">
          <span className="flex items-center gap-1 bg-brand-900/80 text-brand-300 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
            <TrendingUp size={13} />
            {campaign.returnRate}% {t('returnRate')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg mb-1 leading-snug">{title}</h3>

        <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <MapPin size={12} />
          {campaign.location}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-brand-50 rounded-lg p-2">
            <div className="flex items-center justify-center gap-0.5 text-brand-700 font-bold text-sm">
              <TrendingUp size={12} />
              {campaign.returnRate}%
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{t('returnRate')}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex items-center justify-center gap-0.5 text-gray-700 font-bold text-sm">
              <Clock size={12} />
              {campaign.durationMonths}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{t('months')}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex items-center justify-center gap-0.5 text-gray-700 font-bold text-sm">
              <Beef size={12} />
              {campaign.cowCount}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{t('cowCount')}</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>${campaign.currentAmount.toLocaleString()}</span>
            <span className="font-medium">{progress.toFixed(0)}% {t('progressLabel')}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isFunded ? 'bg-green-500' : 'bg-brand-600'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{t('raised')}</span>
            <span>{t('target')}: ${campaign.targetAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Min investment */}
        <div className="text-xs text-gray-400 mb-4">
          {t('minInvestment')}: <span className="font-semibold text-gray-600">${campaign.minInvestment.toLocaleString()}</span>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Link
            href={`/${locale}/campaigns/${campaign.id}`}
            className={`block w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              isFunded
                ? 'bg-gray-100 text-gray-500 cursor-default'
                : 'bg-brand-700 text-white hover:bg-brand-800'
            }`}
          >
            {isFunded ? t('funded100') : t('invest')}
          </Link>
        </div>
      </div>
    </div>
  )
}
