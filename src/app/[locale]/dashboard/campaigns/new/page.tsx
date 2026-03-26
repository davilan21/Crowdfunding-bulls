import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import NewCampaignForm from './NewCampaignForm'

export default async function NewCampaignPage({ params }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) redirect(`/${params.locale}/auth/signin`)
  if (session.user.role === 'INVESTOR') redirect(`/${params.locale}/dashboard`)

  return <NewCampaignForm locale={params.locale} />
}
