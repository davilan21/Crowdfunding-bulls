import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create Carlos (publisher/admin)
  const hashedPassword = await bcrypt.hash('carlos123', 10)
  const carlos = await prisma.user.upsert({
    where: { email: 'carlos@toros.co' },
    update: {},
    create: {
      name: 'Carlos Eduardo Pinzon',
      email: 'carlos@toros.co',
      password: hashedPassword,
      role: 'PUBLISHER',
      phone: '+1 305 555 0100',
    },
  })

  // Create a demo investor
  const investorPassword = await bcrypt.hash('demo1234', 10)
  const investor = await prisma.user.upsert({
    where: { email: 'demo@investor.com' },
    update: {},
    create: {
      name: 'Demo Investor',
      email: 'demo@investor.com',
      password: investorPassword,
      role: 'INVESTOR',
    },
  })

  const VIDEO_URL = 'https://www.youtube.com/watch?v=QAHCIHSIK7U'

  // Create campaigns
  const now = new Date()
  const endDate = new Date(now)
  endDate.setMonth(endDate.getMonth() + 12)

  const campaign1 = await prisma.campaign.upsert({
    where: { id: 'campaign-brahman-001' },
    update: { videoUrl: VIDEO_URL },
    create: {
      id: 'campaign-brahman-001',
      title: 'Brahman Cattle — Córdoba',
      titleEs: 'Ganado Brahman — Córdoba',
      description: 'Premium Brahman cattle operation in the fertile plains of Córdoba, Colombia. These animals are known for their exceptional heat resistance and efficient feed conversion, making them ideal for the tropical climate. Your investment funds the purchase and 12-month fattening cycle of 60 Brahman bulls.',
      descriptionEs: 'Operación de ganado Brahman de primera calidad en las fértiles llanuras de Córdoba, Colombia. Estos animales son conocidos por su excepcional resistencia al calor y eficiente conversión alimenticia, lo que los hace ideales para el clima tropical. Tu inversión financia la compra y el ciclo de engorde de 12 meses de 60 toros Brahman.',
      targetAmount: 150000,
      currentAmount: 112500,
      returnRate: 18,
      durationMonths: 12,
      cowCount: 60,
      breed: 'Brahman',
      location: 'Montería, Córdoba',
      imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&q=80',
      videoUrl: VIDEO_URL,
      minInvestment: 500,
      status: 'ACTIVE',
      startDate: now,
      endDate: endDate,
      publisherId: carlos.id,
    },
  })

  const campaign2 = await prisma.campaign.upsert({
    where: { id: 'campaign-angus-002' },
    update: { videoUrl: VIDEO_URL },
    create: {
      id: 'campaign-angus-002',
      title: 'Angus × Zebu Cross — Antioquia',
      titleEs: 'Cruce Angus × Cebú — Antioquia',
      description: 'Angus-Zebu crossbred cattle combining superior meat quality with tropical adaptability. Located in the premium ranching region of Antioquia, this operation targets high-value export markets. 45 heads over 12 months with veterinary supervision and GPS tracking.',
      descriptionEs: 'Ganado cruzado Angus-Cebú que combina calidad de carne superior con adaptabilidad tropical. Ubicado en la región ganadera de primera de Antioquia, esta operación apunta a mercados de exportación de alto valor. 45 cabezas durante 12 meses con supervisión veterinaria y seguimiento GPS.',
      targetAmount: 120000,
      currentAmount: 48000,
      returnRate: 15,
      durationMonths: 12,
      cowCount: 45,
      breed: 'Angus × Cebú',
      location: 'Caucasia, Antioquia',
      imageUrl: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800&q=80',
      videoUrl: VIDEO_URL,
      minInvestment: 500,
      status: 'ACTIVE',
      startDate: now,
      endDate: endDate,
      publisherId: carlos.id,
    },
  })

  const campaign3 = await prisma.campaign.upsert({
    where: { id: 'campaign-cebu-003' },
    update: { videoUrl: VIDEO_URL },
    create: {
      id: 'campaign-cebu-003',
      title: 'Cebu Cattle — Llanos Orientales',
      titleEs: 'Ganado Cebú — Llanos Orientales',
      description: 'Large-scale Zebu cattle operation in the vast plains of the Eastern Llanos. 80 heads of select Nelore and Guzerat breeds raised in free-range conditions with natural pastures. 100% funded operation — now accepting expressions of interest for the next cycle.',
      descriptionEs: 'Operación ganadera Cebú de gran escala en los vastos llanos orientales. 80 cabezas de razas Nelore y Guzerat seleccionadas criadas en condiciones de pastoreo libre. Operación 100% financiada — ahora aceptando manifestaciones de interés para el próximo ciclo.',
      targetAmount: 200000,
      currentAmount: 200000,
      returnRate: 20,
      durationMonths: 12,
      cowCount: 80,
      breed: 'Nelore / Guzerat',
      location: 'Villavicencio, Meta',
      imageUrl: 'https://images.unsplash.com/photo-1527153818091-1a9638521e2a?w=800&q=80',
      minInvestment: 1000,
      status: 'FUNDED',
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      endDate: endDate,
      publisherId: carlos.id,
    },
  })

  // Create asesorias
  await prisma.asesoria.upsert({
    where: { id: 'asesoria-virtual-001' },
    update: {},
    create: {
      id: 'asesoria-virtual-001',
      title: 'Virtual Advisory — 1 Hour',
      titleEs: 'Asesoría Virtual — 1 Hora',
      description: 'One-on-one video consultation with Carlos. Perfect for investors wanting to understand the business model, evaluate a specific campaign, or get personalized cattle farming advice.',
      descriptionEs: 'Consulta en video uno a uno con Carlos. Perfecta para inversores que quieren entender el modelo de negocio, evaluar una campaña específica o recibir asesoría personalizada en ganadería.',
      type: 'VIRTUAL',
      price: 75,
      durationMins: 60,
      features: JSON.stringify([
        'Campaign evaluation & ROI analysis',
        'Personalized investment strategy',
        'Q&A with Carlos Eduardo',
        'Session recording provided',
      ]),
      publisherId: carlos.id,
    },
  })

  await prisma.asesoria.upsert({
    where: { id: 'asesoria-virtual-002' },
    update: {},
    create: {
      id: 'asesoria-virtual-002',
      title: 'Deep Dive Advisory — 3 Hours',
      titleEs: 'Asesoría Completa — 3 Horas',
      description: 'Extended consultation covering full portfolio strategy, market analysis, and detailed farm evaluation. Includes written report with actionable recommendations.',
      descriptionEs: 'Consulta extendida que cubre estrategia de portafolio completa, análisis de mercado y evaluación detallada de la finca. Incluye informe escrito con recomendaciones accionables.',
      type: 'VIRTUAL',
      price: 180,
      durationMins: 180,
      features: JSON.stringify([
        'Full portfolio strategy session',
        'Market analysis report',
        'Risk assessment',
        'Written recommendations report',
        '30-day follow-up email support',
      ]),
      publisherId: carlos.id,
    },
  })

  await prisma.asesoria.upsert({
    where: { id: 'asesoria-physical-001' },
    update: {},
    create: {
      id: 'asesoria-physical-001',
      title: 'On-Site Farm Visit',
      titleEs: 'Visita a la Finca',
      description: 'Carlos visits your farm or operation site for a full day of evaluation, optimization planning, and hands-on guidance. Ideal for active ranchers or investors considering large stakes.',
      descriptionEs: 'Carlos visita tu finca o sitio de operación para un día completo de evaluación, planificación de optimización y orientación práctica. Ideal para ganaderos activos o inversores que consideran participaciones grandes.',
      type: 'PHYSICAL',
      price: 500,
      durationMins: 480,
      features: JSON.stringify([
        'Full-day on-site evaluation',
        'Herd health assessment',
        'Feed & pasture optimization plan',
        'Financial projection modeling',
        'Written farm improvement report',
        'Travel within Colombia included',
      ]),
      publisherId: carlos.id,
    },
  })

  // Seed a demo investment
  const maturityDate = new Date()
  maturityDate.setMonth(maturityDate.getMonth() + 10)

  await prisma.investment.upsert({
    where: { id: 'investment-demo-001' },
    update: {},
    create: {
      id: 'investment-demo-001',
      userId: investor.id,
      campaignId: campaign1.id,
      amount: 2000,
      expectedReturn: 360,
      totalAtMaturity: 2360,
      status: 'ACTIVE',
      maturityDate,
    },
  })

  console.log('✅ Seeding complete!')
  console.log(`   Carlos: carlos@toros.co / carlos123`)
  console.log(`   Demo investor: demo@investor.com / demo1234`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
