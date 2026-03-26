import { useTranslations, useLocale } from 'next-intl'
import { prisma } from '@/lib/prisma'
import AsesoriaContent from './AsesoriaContent'

async function getAsesorias() {
  return prisma.asesoria.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  })
}

export default async function AsesoriasPage() {
  const asesorias = await getAsesorias()
  return <AsesoriaContent asesorias={asesorias} />
}
