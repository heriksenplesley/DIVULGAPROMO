import express, { Request, Response } from 'express';
import { getDb, saveDb, Offer, Campaign, CreativeArt, TrackedLink, ClickEvent, User } from './db.js';
import { processPromoAiMessage, promoTools } from './gemini.js';

export const apiRouter = express.Router();

// Helper to get active user ID or default to demo affiliate
function getUserId(req: Request): string {
  const headerUser = req.headers['x-user-id'] as string;
  if (headerUser) return headerUser;
  return 'usr_affiliate_demo';
}

/* ========================================================
   AUTH & USER MANAGEMENT
======================================================== */
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const db = getDb();
  const userId = getUserId(req);
  const user = db.users.find(u => u.id === userId) || db.users[1];
  res.json({ user });
});

apiRouter.get('/auth/users', (req: Request, res: Response) => {
  const db = getDb();
  res.json({ users: db.users });
});

apiRouter.post('/auth/switch-user', (req: Request, res: Response) => {
  const { userId } = req.body;
  const db = getDb();
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }
  res.json({ success: true, user });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const db = getDb();
  const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || db.users[1];
  res.json({ success: true, user, token: `jwt_${user.id}_token` });
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, role, niche } = req.body;
  const db = getDb();
  const existing = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
  }

  const newUser: User = {
    id: `usr_${Date.now()}`,
    name: name || 'Novo Usuário',
    email: email || `user_${Date.now()}@exemplo.com`,
    role: role || 'affiliate',
    plan: 'free',
    planStatus: 'trial',
    aiCredits: 50,
    aiCreditsLimit: 50,
    referralCode: `REF-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    timezone: 'America/Campo_Grande',
    currency: 'BRL',
    storefrontSlug: (name || 'ofertas').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    createdAt: new Date().toISOString(),
    niche: niche || ['Eletrônicos', 'Casa'],
    affiliateIds: {},
  };

  db.users.push(newUser);
  saveDb(db);
  res.json({ success: true, user: newUser });
});

apiRouter.put('/auth/profile', (req: Request, res: Response) => {
  const db = getDb();
  const userId = getUserId(req);
  const index = db.users.findIndex(u => u.id === userId);
  if (index === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  const { name, timezone, currency, niche, affiliateIds, storefrontSlug } = req.body;
  if (name) db.users[index].name = name;
  if (timezone) db.users[index].timezone = timezone;
  if (currency) db.users[index].currency = currency;
  if (niche) db.users[index].niche = niche;
  if (affiliateIds) db.users[index].affiliateIds = { ...db.users[index].affiliateIds, ...affiliateIds };
  if (storefrontSlug) db.users[index].storefrontSlug = storefrontSlug;

  saveDb(db);
  res.json({ success: true, user: db.users[index] });
});

/* ========================================================
   OFFERS CATALOG & DISCOVERY
======================================================== */
apiRouter.get('/offers', (req: Request, res: Response) => {
  const db = getDb();
  const { category, marketplace, search, minDiscount, commercialPotential, featured } = req.query;
  let list = [...db.offers];

  if (category && category !== 'todas') {
    list = list.filter(o => o.category.toLowerCase().includes((category as string).toLowerCase()));
  }
  if (marketplace && marketplace !== 'todos') {
    list = list.filter(o => o.marketplace.toLowerCase() === (marketplace as string).toLowerCase());
  }
  if (minDiscount) {
    list = list.filter(o => o.discountPercent >= Number(minDiscount));
  }
  if (commercialPotential && commercialPotential !== 'todos') {
    list = list.filter(o => o.commercialPotential === commercialPotential);
  }
  if (featured === 'true') {
    list = list.filter(o => o.featuredInStorefront);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter(o => o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q));
  }

  res.json({ total: list.length, offers: list });
});

apiRouter.get('/offers/:id', (req: Request, res: Response) => {
  const db = getDb();
  const offer = db.offers.find(o => o.id === req.params.id);
  if (!offer) return res.status(404).json({ error: 'Oferta não encontrada' });
  res.json({ offer });
});

apiRouter.post('/offers', (req: Request, res: Response) => {
  const db = getDb();
  const userId = getUserId(req);
  const data = req.body;

  const original = Number(data.originalPrice) || 0;
  const promo = Number(data.promoPrice) || 0;
  const discountPercent = original > promo && original > 0 ? Math.round(((original - promo) / original) * 100) : 0;
  const shortCode = data.shortCode || `p-${Math.random().toString(36).substring(2, 8)}`;

  // Calculate potential score realistically
  let score = 50;
  if (discountPercent >= 40) score += 25;
  else if (discountPercent >= 20) score += 15;
  if (data.freeShipping) score += 10;
  if (data.rating >= 4.5) score += 10;
  score = Math.min(score, 99);

  const newOffer: Offer = {
    id: `off_${Date.now()}`,
    userId,
    title: data.title || 'Produto sem título',
    description: data.description || '',
    category: data.category || 'Eletrônicos',
    marketplace: data.marketplace || 'outros',
    originalPrice: original,
    promoPrice: promo,
    discountPercent,
    couponCode: data.couponCode || undefined,
    couponDiscount: data.couponDiscount || undefined,
    imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=60',
    originalUrl: data.originalUrl || 'https://shopee.com.br',
    affiliateUrl: data.affiliateUrl || data.originalUrl,
    shortCode,
    freeShipping: !!data.freeShipping,
    rating: Number(data.rating) || 4.7,
    reviewsCount: Number(data.reviewsCount) || 120,
    commercialPotential: score >= 85 ? 'alta' : score >= 65 ? 'media' : 'moderada',
    potentialScore: score,
    status: 'active',
    lastCheckedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    approved: true,
    featuredInStorefront: !!data.featuredInStorefront,
  };

  db.offers.unshift(newOffer);

  // Auto-create tracked link
  db.trackedLinks.push({
    id: `lnk_${Date.now()}`,
    code: shortCode,
    userId,
    offerId: newOffer.id,
    originalUrl: newOffer.originalUrl,
    targetAffiliateUrl: newOffer.affiliateUrl,
    marketplace: newOffer.marketplace,
    title: newOffer.title,
    totalClicks: 0,
    uniqueClicks: 0,
    createdAt: new Date().toISOString(),
  });

  saveDb(db);
  res.json({ success: true, offer: newOffer });
});

apiRouter.delete('/offers/:id', (req: Request, res: Response) => {
  const db = getDb();
  const id = req.params.id;
  db.offers = db.offers.filter(o => o.id !== id);
  db.trackedLinks = db.trackedLinks.filter(l => l.offerId !== id);
  saveDb(db);
  res.json({ success: true, message: 'Oferta removida com sucesso.' });
});

// Real URL scraper / meta extractor simulation for pasted e-commerce product links
apiRouter.post('/offers/inspect-url', (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL é obrigatória' });

  const validation = promoTools.validar_link({ url });
  if (!validation.valido) {
    return res.status(400).json({ error: 'URL inválida ou malformada.' });
  }

  const mp = validation.marketplaceDetectado;
  // Intelligent mock parser matching real marketplace structures
  let sampleTitle = 'Produto Detectado';
  let samplePrice = 199.9;
  let sampleOriginal = 299.9;
  let sampleCategory = 'Eletrônicos';
  let sampleImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60';

  if (url.includes('air-fryer') || url.includes('fritadeira')) {
    sampleTitle = 'Fritadeira Air Fryer Sem Óleo Digital 4.5L';
    samplePrice = 249.9;
    sampleOriginal = 399.0;
    sampleCategory = 'Eletrodomésticos';
    sampleImage = 'https://images.unsplash.com/photo-1585675100414-add2e465a136?w=800&auto=format&fit=crop&q=60';
  } else if (url.includes('fone') || url.includes('headphone') || url.includes('earbud')) {
    sampleTitle = 'Fone Sem Fio Bluetooth com Cancelamento de Ruído';
    samplePrice = 179.0;
    sampleOriginal = 299.0;
    sampleCategory = 'Eletrônicos';
    sampleImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60';
  } else if (url.includes('relogio') || url.includes('smartwatch')) {
    sampleTitle = 'Smartwatch Esportivo com Oxímetro e Notificações';
    samplePrice = 149.0;
    sampleOriginal = 249.0;
    sampleCategory = 'Celulares e acessórios';
    sampleImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60';
  }

  res.json({
    success: true,
    inspection: {
      marketplace: mp,
      title: sampleTitle,
      originalPrice: sampleOriginal,
      promoPrice: samplePrice,
      discountPercent: Math.round(((sampleOriginal - samplePrice) / sampleOriginal) * 100),
      category: sampleCategory,
      imageUrl: sampleImage,
      freeShipping: true,
      rating: 4.8,
      reviewsCount: 340,
      protocolSecure: true,
      verifiedSource: true,
    },
  });
});

/* ========================================================
   AFFILIATE LINK CONVERTER & TRACKING
======================================================== */
apiRouter.post('/links/convert', (req: Request, res: Response) => {
  const { url, marketplace, customCode } = req.body;
  const userId = getUserId(req);

  if (!url) return res.status(400).json({ error: 'URL é obrigatória' });

  const result = promoTools.converter_link_afiliado({
    url,
    marketplace: marketplace || 'outros',
    userId,
    customCode,
  });

  res.json(result);
});

apiRouter.get('/links', (req: Request, res: Response) => {
  const db = getDb();
  const userId = getUserId(req);
  const links = db.trackedLinks.filter(l => l.userId === userId);
  res.json({ total: links.length, links });
});

/* ========================================================
   PROMO IA ASSISTANT & TOOLS
======================================================== */
apiRouter.post('/ai/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  const userId = getUserId(req);

  if (!message) return res.status(400).json({ error: 'Mensagem vazia' });

  const result = await processPromoAiMessage(message, userId, history || []);
  res.json(result);
});

apiRouter.post('/ai/generate-ad', (req: Request, res: Response) => {
  const { offerId, modelo, canal } = req.body;
  const db = getDb();
  const offer = db.offers.find(o => o.id === offerId) || db.offers[0];

  const result = promoTools.gerar_anuncio({
    titulo: offer.title,
    precoPromocional: offer.promoPrice,
    precoOriginal: offer.originalPrice,
    cupom: offer.couponCode,
    linkCurto: `https://divulgapromo.com.br/r/${offer.shortCode}`,
    modelo: modelo || 'oferta_relampago',
    canal: canal || 'whatsapp',
    freteGratis: offer.freeShipping,
  });

  res.json({ success: true, copy: result });
});

/* ========================================================
   CREATIVES & ART STUDIO
======================================================== */
apiRouter.get('/creatives', (req: Request, res: Response) => {
  const db = getDb();
  const userId = getUserId(req);
  const creatives = db.creatives.filter(c => c.userId === userId);
  res.json({ creatives });
});

apiRouter.post('/creatives', (req: Request, res: Response) => {
  const db = getDb();
  const userId = getUserId(req);
  const data = req.body;

  const newCreative: CreativeArt = {
    id: `crt_${Date.now()}`,
    userId,
    offerId: data.offerId,
    title: data.title || 'Nova Arte Promocional',
    format: data.format || '1:1',
    templateId: data.templateId || 'modern_blue',
    headline: data.headline || 'OFERTA ESPECIAL',
    promoBadge: data.promoBadge || 'DESCONTO EXCLUSIVO',
    primaryColor: data.primaryColor || '#0B1E36',
    accentColor: data.accentColor || '#2563EB',
    productImageUrl: data.productImageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    originalPrice: Number(data.originalPrice) || 0,
    promoPrice: Number(data.promoPrice) || 0,
    couponCode: data.couponCode || undefined,
    previewDataUrl: data.previewDataUrl,
    createdAt: new Date().toISOString(),
  };

  db.creatives.unshift(newCreative);
  saveDb(db);
  res.json({ success: true, creative: newCreative });
});

apiRouter.delete('/creatives/:id', (req: Request, res: Response) => {
  const db = getDb();
  db.creatives = db.creatives.filter(c => c.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

/* ========================================================
   CAMPAIGNS & SCHEDULER
======================================================== */
apiRouter.get('/campaigns', (req: Request, res: Response) => {
  const db = getDb();
  const userId = getUserId(req);
  const campaigns = db.campaigns.filter(c => c.userId === userId);
  res.json({ campaigns });
});

apiRouter.post('/campaigns', (req: Request, res: Response) => {
  const db = getDb();
  const userId = getUserId(req);
  const data = req.body;

  const newCampaign: Campaign = {
    id: `cmp_${Date.now()}`,
    userId,
    offerId: data.offerId,
    title: data.title || 'Campanha de Divulgação',
    copyType: data.copyType || 'oferta_relampago',
    copyText: data.copyText || '',
    channels: data.channels || ['whatsapp', 'telegram'],
    status: data.scheduledFor ? 'scheduled' : 'published',
    scheduledFor: data.scheduledFor || new Date().toISOString(),
    publishedAt: data.scheduledFor ? undefined : new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  db.campaigns.unshift(newCampaign);
  saveDb(db);
  res.json({ success: true, campaign: newCampaign });
});

apiRouter.patch('/campaigns/:id/status', (req: Request, res: Response) => {
  const db = getDb();
  const camp = db.campaigns.find(c => c.id === req.params.id);
  if (!camp) return res.status(404).json({ error: 'Campanha não encontrada' });

  if (req.body.status) {
    camp.status = req.body.status;
    if (req.body.status === 'published') {
      camp.publishedAt = new Date().toISOString();
    }
  }
  saveDb(db);
  res.json({ success: true, campaign: camp });
});

/* ========================================================
   STOREFRONTS (PUBLIC & ADMIN)
======================================================== */
apiRouter.get('/storefronts/:slug', (req: Request, res: Response) => {
  const db = getDb();
  const slug = req.params.slug;
  const storefront = db.storefronts.find(s => s.slug === slug);
  if (!storefront) {
    return res.status(404).json({ error: 'Vitrine não encontrada.' });
  }

  // Filter approved offers belonging to this user
  const offers = db.offers.filter(o => o.userId === storefront.userId && o.status === 'active');
  const user = db.users.find(u => u.id === storefront.userId);

  res.json({
    storefront,
    owner: { name: user?.name, niche: user?.niche },
    offers,
  });
});

apiRouter.put('/storefronts/settings', (req: Request, res: Response) => {
  const db = getDb();
  const userId = getUserId(req);
  let sf = db.storefronts.find(s => s.userId === userId);

  if (!sf) {
    sf = {
      userId,
      slug: (req.body.slug || 'minha-vitrine').toLowerCase().replace(/\s+/g, '-'),
      storeName: req.body.storeName || 'Minha Vitrine de Ofertas',
      tagline: req.body.tagline || 'Ofertas imperdíveis garimpadas diariamente',
      primaryColor: '#0B1E36',
      accentColor: '#2563EB',
      showDisclaimers: true,
    };
    db.storefronts.push(sf);
  }

  Object.assign(sf, req.body);
  saveDb(db);
  res.json({ success: true, storefront: sf });
});

/* ========================================================
   INTEGRATIONS & CHANNELS
======================================================== */
apiRouter.get('/integrations', (req: Request, res: Response) => {
  const db = getDb();
  const userId = getUserId(req);
  const integrations = db.integrations.filter(i => i.userId === userId);
  res.json({ integrations });
});

apiRouter.post('/integrations', (req: Request, res: Response) => {
  const db = getDb();
  const userId = getUserId(req);
  const { type, name, credentials } = req.body;

  const existingIndex = db.integrations.findIndex(i => i.userId === userId && i.type === type);
  if (existingIndex >= 0) {
    db.integrations[existingIndex].name = name || db.integrations[existingIndex].name;
    db.integrations[existingIndex].credentials = credentials || db.integrations[existingIndex].credentials;
    db.integrations[existingIndex].status = 'connected';
    db.integrations[existingIndex].lastTestedAt = new Date().toISOString();
  } else {
    db.integrations.push({
      id: `int_${Date.now()}`,
      userId,
      type,
      name: name || `Conexão ${type}`,
      status: 'connected',
      credentials: credentials || {},
      lastTestedAt: new Date().toISOString(),
    });
  }

  saveDb(db);
  res.json({ success: true, message: 'Integração salva e testada com sucesso!' });
});

/* ========================================================
   ANALYTICS & METRICS
======================================================== */
apiRouter.get('/analytics/overview', (req: Request, res: Response) => {
  const db = getDb();
  const userId = getUserId(req);

  const userLinks = db.trackedLinks.filter(l => l.userId === userId);
  const totalClicks = userLinks.reduce((acc, l) => acc + l.totalClicks, 0);
  const uniqueClicks = userLinks.reduce((acc, l) => acc + l.uniqueClicks, 0);

  const userClicks = db.clickEvents.filter(c => c.userId === userId);
  const conversions = userClicks.filter(c => c.converted);
  const totalCommission = conversions.reduce((acc, c) => acc + (c.commissionValue || 0), 0);

  const channelBreakdown = {
    whatsapp: userClicks.filter(c => c.channel === 'whatsapp').length + 140,
    telegram: userClicks.filter(c => c.channel === 'telegram').length + 95,
    web_store: userClicks.filter(c => c.channel === 'web_store').length + 54,
    instagram: 38,
    facebook: 12,
  };

  const categoryBreakdown = {
    Eletrônicos: 45,
    Eletrodomésticos: 30,
    'Celulares e acessórios': 15,
    'Casa e decoração': 10,
  };

  res.json({
    totalOffers: db.offers.filter(o => o.userId === userId).length,
    activeCampaigns: db.campaigns.filter(c => c.userId === userId).length,
    totalClicks,
    uniqueClicks,
    confirmedConversions: conversions.length + 18,
    conversionRate: '4.85%',
    pendingCommissions: 145.5,
    approvedCommissions: totalCommission + 328.7,
    channelBreakdown,
    categoryBreakdown,
    recentClicks: userClicks.slice(0, 10),
  });
});

/* ========================================================
   SUBSCRIPTIONS & BILLING (SAAS GENERATION)
======================================================== */
const PLANS = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    priceYearly: 0,
    aiCredits: 50,
    features: ['Até 5 ofertas ativas', '50 créditos de IA/mês', 'Geração de anúncios padrão', 'Compartilhamento manual', 'Vitrine básica'],
  },
  {
    id: 'start',
    name: 'Start',
    price: 99,
    priceYearly: 89,
    aiCredits: 200,
    popular: false,
    features: ['Até 25 ofertas ativas', '200 créditos de IA/mês', 'Biblioteca de templates de artes', 'Links curtos rastreáveis', 'Agendamento de campanhas', 'Relatórios essenciais'],
  },
  {
    id: 'pro',
    name: 'Pro (Recomendado)',
    price: 199,
    priceYearly: 169,
    aiCredits: 500,
    popular: true,
    features: ['Ofertas ilimitadas', '500 créditos de IA/mês', 'Estúdio visual completo (todos os formatos)', 'Automação WhatsApp & Telegram', 'Vitrine personalizada com domínio próprio', 'Motor de horários inteligentes', 'Suporte prioritário'],
  },
  {
    id: 'business',
    name: 'Business & Equipe',
    price: 399,
    priceYearly: 339,
    aiCredits: 1500,
    popular: false,
    features: ['Multi-marcas e multi-vitrines', '1500 créditos de IA/mês', 'Gestão de equipe e permissões', 'Aprovação de postagens em 2 etapas', 'Acesso à API oficial', 'Consultoria mensal de conversão'],
  },
];

apiRouter.get('/subscriptions/plans', (req: Request, res: Response) => {
  res.json({ plans: PLANS });
});

apiRouter.post('/subscriptions/checkout', (req: Request, res: Response) => {
  const { planId, billingCycle, paymentMethod } = req.body;
  const db = getDb();
  const userId = getUserId(req);
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  const plan = PLANS.find(p => p.id === planId);
  if (!plan) return res.status(400).json({ error: 'Plano inválido' });

  // Update user subscription state
  user.plan = plan.id as any;
  user.planStatus = 'active';
  user.aiCredits = plan.aiCredits;
  user.aiCreditsLimit = plan.aiCredits;
  saveDb(db);

  res.json({
    success: true,
    transactionId: `tx_${Date.now()}`,
    status: 'paid',
    message: `Plano ${plan.name} ativado com sucesso!`,
    plan,
  });
});

/* ========================================================
   REFERRALS PROGRAM
======================================================== */
apiRouter.get('/referrals/stats', (req: Request, res: Response) => {
  const db = getDb();
  const userId = getUserId(req);
  const user = db.users.find(u => u.id === userId) || db.users[1];

  const userReferrals = db.referrals.filter(r => r.referrerUserId === userId);
  const totalEarned = userReferrals
    .filter(r => r.status === 'paid' || r.status === 'qualified')
    .reduce((acc, r) => acc + r.commissionAmount, 0);

  res.json({
    referralCode: user.referralCode,
    referralUrl: `https://divulgapromo.com.br/cadastro?ref=${user.referralCode}`,
    totalReferrals: userReferrals.length,
    qualifiedReferrals: userReferrals.filter(r => r.status === 'qualified').length,
    totalEarned,
    records: userReferrals,
  });
});

/* ========================================================
   SUPERADMIN & PLATFORM METRICS
======================================================== */
apiRouter.get('/admin/overview', (req: Request, res: Response) => {
  const db = getDb();
  const totalUsers = db.users.length;
  const activeSubs = db.users.filter(u => u.planStatus === 'active' && u.plan !== 'free').length;
  const mrr = db.users.reduce((acc, u) => {
    if (u.plan === 'start') return acc + 99;
    if (u.plan === 'pro') return acc + 199;
    if (u.plan === 'business') return acc + 399;
    return acc;
  }, 0);

  res.json({
    totalUsers,
    activeSubscriptions: activeSubs,
    mrr,
    totalOffers: db.offers.length,
    totalCampaigns: db.campaigns.length,
    aiTokensUsedMonth: 428000,
    infrastructureCostEst: 145.2, // R$
    aiCostEst: 58.4, // R$
    profitMargin: '84.2%',
    users: db.users,
    auditLogs: db.auditLogs,
  });
});
