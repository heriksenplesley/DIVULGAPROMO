import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'affiliate' | 'merchant' | 'creator' | 'team_admin';
  plan: 'free' | 'start' | 'pro' | 'business';
  planStatus: 'active' | 'trial' | 'past_due' | 'canceled';
  aiCredits: number;
  aiCreditsLimit: number;
  referralCode: string;
  referredBy?: string;
  timezone: string;
  currency: string;
  storefrontSlug: string;
  createdAt: string;
  niche: string[];
  affiliateIds: {
    shopee?: string;
    mercadolivre?: string;
    amazon?: string;
    aliexpress?: string;
    magalu?: string;
    hotmart?: string;
  };
}

export interface Offer {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  marketplace: 'shopee' | 'mercadolivre' | 'amazon' | 'aliexpress' | 'magalu' | 'hotmart' | 'outros';
  originalPrice: number;
  promoPrice: number;
  discountPercent: number;
  couponCode?: string;
  couponDiscount?: string;
  imageUrl: string;
  originalUrl: string;
  affiliateUrl: string;
  shortCode: string;
  freeShipping: boolean;
  rating: number;
  reviewsCount: number;
  commercialPotential: 'alta' | 'media' | 'moderada';
  potentialScore: number; // 0 - 100
  status: 'active' | 'expired' | 'price_changed' | 'pending_review';
  lastCheckedAt: string;
  createdAt: string;
  approved: boolean;
  featuredInStorefront: boolean;
}

export interface TrackedLink {
  id: string;
  code: string;
  userId: string;
  offerId?: string;
  originalUrl: string;
  targetAffiliateUrl: string;
  marketplace: string;
  title: string;
  totalClicks: number;
  uniqueClicks: number;
  createdAt: string;
}

export interface ClickEvent {
  id: string;
  linkCode: string;
  userId: string;
  offerId?: string;
  timestamp: string;
  userAgent: string;
  device: 'mobile' | 'desktop' | 'tablet';
  channel?: string;
  referrer: string;
  converted?: boolean;
  commissionValue?: number;
}

export interface Campaign {
  id: string;
  userId: string;
  offerId: string;
  title: string;
  copyText: string;
  copyType: string;
  channels: ('whatsapp' | 'telegram' | 'instagram' | 'facebook' | 'web_store' | 'email')[];
  status: 'draft' | 'pending_approval' | 'scheduled' | 'published' | 'failed';
  scheduledFor: string;
  publishedAt?: string;
  errorMessage?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface CreativeArt {
  id: string;
  userId: string;
  offerId?: string;
  title: string;
  format: '1:1' | '9:16' | '4:5' | 'banner';
  templateId: string;
  headline: string;
  promoBadge: string;
  primaryColor: string;
  accentColor: string;
  productImageUrl: string;
  originalPrice: number;
  promoPrice: number;
  couponCode?: string;
  qrCodeUrl?: string;
  previewDataUrl?: string;
  createdAt: string;
}

export interface StorefrontSettings {
  userId: string;
  slug: string;
  storeName: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
  bannerUrl?: string;
  whatsappGroupUrl?: string;
  telegramChannelUrl?: string;
  instagramUrl?: string;
  showDisclaimers: boolean;
  customDomain?: string;
}

export interface IntegrationAccount {
  id: string;
  userId: string;
  type: 'whatsapp' | 'telegram' | 'instagram' | 'facebook' | 'mercadopago' | 'stripe';
  name: string;
  status: 'connected' | 'disconnected' | 'testing';
  credentials: Record<string, string>;
  lastTestedAt?: string;
}

export interface ReferralRecord {
  id: string;
  referrerUserId: string;
  referredUserId: string;
  referredUserName: string;
  status: 'pending' | 'qualified' | 'paid';
  commissionAmount: number;
  subscriptionPlan: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  ip: string;
  timestamp: string;
}

interface DatabaseSchema {
  users: User[];
  offers: Offer[];
  trackedLinks: TrackedLink[];
  clickEvents: ClickEvent[];
  campaigns: Campaign[];
  creatives: CreativeArt[];
  storefronts: StorefrontSettings[];
  integrations: IntegrationAccount[];
  referrals: ReferralRecord[];
  auditLogs: AuditLog[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

const INITIAL_DATA: DatabaseSchema = {
  users: [
    {
      id: 'usr_superadmin',
      name: 'Administrador DivulgaPromo',
      email: 'admin@divulgapromo.com.br',
      role: 'superadmin',
      plan: 'business',
      planStatus: 'active',
      aiCredits: 9999,
      aiCreditsLimit: 10000,
      referralCode: 'DIVULGA-BOSS',
      timezone: 'America/Campo_Grande',
      currency: 'BRL',
      storefrontSlug: 'oficial',
      createdAt: '2026-01-10T10:00:00Z',
      niche: ['Eletrônicos', 'Casa', 'Moda'],
      affiliateIds: {
        shopee: 'divulgapromo_shopee',
        mercadolivre: 'divulgapromo_ml',
        amazon: 'divulgapromo-20',
        aliexpress: 'divulga_ali',
        magalu: 'divulgamagalu',
        hotmart: 'divulgahotmart',
      },
    },
    {
      id: 'usr_affiliate_demo',
      name: 'Carlos Oliveira (Afiliado Pro)',
      email: 'carlos.afiliado@exemplo.com.br',
      role: 'affiliate',
      plan: 'pro',
      planStatus: 'active',
      aiCredits: 380,
      aiCreditsLimit: 500,
      referralCode: 'CARLOS-PROMO',
      referredBy: 'usr_superadmin',
      timezone: 'America/Campo_Grande',
      currency: 'BRL',
      storefrontSlug: 'achadinhos-do-carlos',
      createdAt: '2026-03-15T14:20:00Z',
      niche: ['Eletrônicos', 'Casa e decoração', 'Informática'],
      affiliateIds: {
        shopee: 'carlos_shopee_br',
        mercadolivre: 'carlos_ml_vip',
        amazon: 'carlosachados-20',
        magalu: 'carlosmagalu',
      },
    },
    {
      id: 'usr_merchant_demo',
      name: 'Loja TechSmart Oficial',
      email: 'contato@techsmart.com.br',
      role: 'merchant',
      plan: 'business',
      planStatus: 'active',
      aiCredits: 850,
      aiCreditsLimit: 1000,
      referralCode: 'TECHSMART-STORE',
      timezone: 'America/Campo_Grande',
      currency: 'BRL',
      storefrontSlug: 'techsmart-outlet',
      createdAt: '2026-04-01T08:00:00Z',
      niche: ['Eletrônicos', 'Celulares e acessórios'],
      affiliateIds: {},
    },
  ],
  offers: [
    {
      id: 'off_1',
      userId: 'usr_affiliate_demo',
      title: 'Fone de Ouvido Bluetooth Anker Soundcore Q30 com Cancelamento de Ruído Ativo',
      description: 'Áudio de alta resolução, bateria de até 40 horas e múltiplos modos de ANC personalizáveis por aplicativo.',
      category: 'Eletrônicos',
      marketplace: 'amazon',
      originalPrice: 499.0,
      promoPrice: 289.9,
      discountPercent: 42,
      couponCode: 'SOUNDCORE10',
      couponDiscount: '10% OFF extra',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
      originalUrl: 'https://www.amazon.com.br/dp/B08HMWZBXC',
      affiliateUrl: 'https://www.amazon.com.br/dp/B08HMWZBXC?tag=carlosachados-20',
      shortCode: 'anker-q30',
      freeShipping: true,
      rating: 4.8,
      reviewsCount: 3410,
      commercialPotential: 'alta',
      potentialScore: 94,
      status: 'active',
      lastCheckedAt: new Date().toISOString(),
      createdAt: '2026-10-25T11:00:00Z',
      approved: true,
      featuredInStorefront: true,
    },
    {
      id: 'off_2',
      userId: 'usr_affiliate_demo',
      title: 'Fritadeira Elétrica Air Fryer Gaabor 4L Sem Óleo Antiaderente Touch Digital',
      description: 'Painel digital com 8 funções pré-definidas, circulação 360° e desligamento automático de segurança.',
      category: 'Eletrodomésticos',
      marketplace: 'shopee',
      originalPrice: 389.0,
      promoPrice: 199.9,
      discountPercent: 49,
      couponCode: 'GAABOR20',
      couponDiscount: 'R$ 20 OFF',
      imageUrl: 'https://images.unsplash.com/photo-1585675100414-add2e465a136?w=800&auto=format&fit=crop&q=60',
      originalUrl: 'https://shopee.com.br/air-fryer-gaabor-4l',
      affiliateUrl: 'https://shopee.com.br/air-fryer-gaabor-4l?af=carlos_shopee_br',
      shortCode: 'airfryer-gaabor',
      freeShipping: true,
      rating: 4.9,
      reviewsCount: 1850,
      commercialPotential: 'alta',
      potentialScore: 96,
      status: 'active',
      lastCheckedAt: new Date().toISOString(),
      createdAt: '2026-10-26T09:30:00Z',
      approved: true,
      featuredInStorefront: true,
    },
    {
      id: 'off_3',
      userId: 'usr_affiliate_demo',
      title: 'Smartwatch Amazfit Bip 5 com Tela Curva de 1.91" e Chamadas Bluetooth',
      description: 'Mais de 120 modos de treino, monitoramento cardíaco 24h, oxigenação sanguínea e GPS integrado.',
      category: 'Celulares e acessórios',
      marketplace: 'mercadolivre',
      originalPrice: 450.0,
      promoPrice: 289.0,
      discountPercent: 36,
      couponCode: 'MLTECH25',
      couponDiscount: 'R$ 25 OFF',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
      originalUrl: 'https://produto.mercadolivre.com.br/MLB-amazfit-bip-5',
      affiliateUrl: 'https://mercadolivre.com/sec/amazfit-bip-5?matt_tool=carlos_ml_vip',
      shortCode: 'amazfit-bip5',
      freeShipping: true,
      rating: 4.7,
      reviewsCount: 920,
      commercialPotential: 'alta',
      potentialScore: 89,
      status: 'active',
      lastCheckedAt: new Date().toISOString(),
      createdAt: '2026-10-27T08:15:00Z',
      approved: true,
      featuredInStorefront: true,
    },
    {
      id: 'off_4',
      userId: 'usr_affiliate_demo',
      title: 'Cafeteira Espresso Nespresso Essenza Mini 110V Vermelha',
      description: 'Design ultra compacto, pressão de 19 bar e aquecimento rápido em apenas 25 segundos.',
      category: 'Casa e decoração',
      marketplace: 'magalu',
      originalPrice: 599.9,
      promoPrice: 379.0,
      discountPercent: 37,
      imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=60',
      originalUrl: 'https://www.magazineluiza.com.br/nespresso-essenza-mini',
      affiliateUrl: 'https://www.magazinevoce.com.br/magazinecarlosmagalu/p/nespresso-essenza-mini/12345',
      shortCode: 'nespresso-mini',
      freeShipping: false,
      rating: 4.9,
      reviewsCount: 2450,
      commercialPotential: 'media',
      potentialScore: 82,
      status: 'active',
      lastCheckedAt: new Date().toISOString(),
      createdAt: '2026-10-27T10:00:00Z',
      approved: true,
      featuredInStorefront: false,
    },
    {
      id: 'off_5',
      userId: 'usr_affiliate_demo',
      title: 'Robô Aspirador de Pó Inteligente WAP Robot W300 com Varredura e Filtro HEPA',
      description: 'Sensores antiqueda e antichoque, controle remoto incluso e retorno automático à base.',
      category: 'Eletrodomésticos',
      marketplace: 'amazon',
      originalPrice: 1199.0,
      promoPrice: 699.0,
      discountPercent: 42,
      couponCode: 'CASA100',
      couponDiscount: 'R$ 100 no Pix',
      imageUrl: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=800&auto=format&fit=crop&q=60',
      originalUrl: 'https://www.amazon.com.br/dp/B07XB3WXYZ',
      affiliateUrl: 'https://www.amazon.com.br/dp/B07XB3WXYZ?tag=carlosachados-20',
      shortCode: 'wap-robot',
      freeShipping: true,
      rating: 4.6,
      reviewsCount: 1120,
      commercialPotential: 'alta',
      potentialScore: 91,
      status: 'active',
      lastCheckedAt: new Date().toISOString(),
      createdAt: '2026-10-27T15:45:00Z',
      approved: true,
      featuredInStorefront: true,
    },
  ],
  trackedLinks: [
    {
      id: 'lnk_1',
      code: 'anker-q30',
      userId: 'usr_affiliate_demo',
      offerId: 'off_1',
      originalUrl: 'https://www.amazon.com.br/dp/B08HMWZBXC',
      targetAffiliateUrl: 'https://www.amazon.com.br/dp/B08HMWZBXC?tag=carlosachados-20',
      marketplace: 'amazon',
      title: 'Fone Anker Soundcore Q30',
      totalClicks: 284,
      uniqueClicks: 218,
      createdAt: '2026-10-25T11:00:00Z',
    },
    {
      id: 'lnk_2',
      code: 'airfryer-gaabor',
      userId: 'usr_affiliate_demo',
      offerId: 'off_2',
      originalUrl: 'https://shopee.com.br/air-fryer-gaabor-4l',
      targetAffiliateUrl: 'https://shopee.com.br/air-fryer-gaabor-4l?af=carlos_shopee_br',
      marketplace: 'shopee',
      title: 'Air Fryer Gaabor 4L',
      totalClicks: 412,
      uniqueClicks: 349,
      createdAt: '2026-10-26T09:30:00Z',
    },
    {
      id: 'lnk_3',
      code: 'amazfit-bip5',
      userId: 'usr_affiliate_demo',
      offerId: 'off_3',
      originalUrl: 'https://produto.mercadolivre.com.br/MLB-amazfit-bip-5',
      targetAffiliateUrl: 'https://mercadolivre.com/sec/amazfit-bip-5?matt_tool=carlos_ml_vip',
      marketplace: 'mercadolivre',
      title: 'Smartwatch Amazfit Bip 5',
      totalClicks: 175,
      uniqueClicks: 142,
      createdAt: '2026-10-27T08:15:00Z',
    },
  ],
  clickEvents: [
    {
      id: 'clk_1',
      linkCode: 'anker-q30',
      userId: 'usr_affiliate_demo',
      offerId: 'off_1',
      timestamp: '2026-10-28T10:14:22Z',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      device: 'mobile',
      channel: 'whatsapp',
      referrer: 'https://chat.whatsapp.com',
      converted: true,
      commissionValue: 23.19,
    },
    {
      id: 'clk_2',
      linkCode: 'airfryer-gaabor',
      userId: 'usr_affiliate_demo',
      offerId: 'off_2',
      timestamp: '2026-10-28T09:45:10Z',
      userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S928B)',
      device: 'mobile',
      channel: 'telegram',
      referrer: 'https://t.me/achadinhos_promo',
      converted: true,
      commissionValue: 15.99,
    },
    {
      id: 'clk_3',
      linkCode: 'amazfit-bip5',
      userId: 'usr_affiliate_demo',
      offerId: 'off_3',
      timestamp: '2026-10-28T08:30:00Z',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      device: 'desktop',
      channel: 'web_store',
      referrer: 'https://divulgapromo.com.br/ofertas/achadinhos-do-carlos',
      converted: false,
    },
  ],
  campaigns: [
    {
      id: 'cmp_1',
      userId: 'usr_affiliate_demo',
      offerId: 'off_1',
      title: 'Disparo Matinal Anker Q30 - Grupo VIP WhatsApp',
      copyType: 'oferta_relampago',
      copyText: `🔥 *OFERTA RELÂMPAGO DO DIA!* 🔥\n\n🎧 *Fone Anker Soundcore Q30 (Original com Cancelamento Ativo de Ruído)*\n\nDe ~R$ 499,00~ por apenas *R$ 289,90* à vista!\n🎟️ Cupom de 10%: *SOUNDCORE10*\n🚚 Frete Grátis com Prime\n\n👉 *Pegue aqui antes de esgotar:* https://divulgapromo.com.br/r/anker-q30\n\n⚠️ Preços sujeitos a alteração sem aviso prévio.`,
      channels: ['whatsapp', 'telegram'],
      status: 'published',
      scheduledFor: '2026-10-28T08:00:00Z',
      publishedAt: '2026-10-28T08:00:15Z',
      createdAt: '2026-10-27T18:00:00Z',
    },
    {
      id: 'cmp_2',
      userId: 'usr_affiliate_demo',
      offerId: 'off_2',
      title: 'Campanha Gaabor Air Fryer - Almoço',
      copyType: 'achadinho_do_dia',
      copyText: `✨ *ACHADINHO IMPERDÍVEL!* ✨\n\nAir Fryer Gaabor 4L Touch Digital com *49% DE DESCONTO!*\nDe R$ 389,00 por apenas *R$ 199,90*!\n\n🎟️ Aplique o cupom *GAABOR20*\n🔗 Link Seguro: https://divulgapromo.com.br/r/airfryer-gaabor`,
      channels: ['telegram', 'whatsapp'],
      status: 'scheduled',
      scheduledFor: '2026-10-28T12:30:00Z',
      createdAt: '2026-10-28T07:30:00Z',
    },
  ],
  creatives: [
    {
      id: 'crt_1',
      userId: 'usr_affiliate_demo',
      offerId: 'off_1',
      title: 'Arte Quadrada Feed - Fone Anker Q30',
      format: '1:1',
      templateId: 'dark_neon',
      headline: 'SUPER DESCONTO 42% OFF',
      promoBadge: 'MENOR PREÇO DO ANO',
      primaryColor: '#0a192f',
      accentColor: '#00d2ff',
      productImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
      originalPrice: 499.0,
      promoPrice: 289.9,
      couponCode: 'SOUNDCORE10',
      createdAt: '2026-10-26T16:00:00Z',
    },
  ],
  storefronts: [
    {
      userId: 'usr_affiliate_demo',
      slug: 'achadinhos-do-carlos',
      storeName: 'Achadinhos do Carlos - Ofertas Verificadas',
      tagline: 'As melhores promoções de tecnologia, casa e eletrônicos testadas e garimpadas diariamente.',
      primaryColor: '#0B1E36',
      accentColor: '#2563EB',
      whatsappGroupUrl: 'https://chat.whatsapp.com/demo-vip-carlos',
      telegramChannelUrl: 'https://t.me/achadinhos_carlos_oficial',
      showDisclaimers: true,
    },
    {
      userId: 'usr_superadmin',
      slug: 'oficial',
      storeName: 'DivulgaPromo Vitrine Central',
      tagline: 'Seleção das melhores ofertas verificadas de todos os principais marketplaces.',
      primaryColor: '#0B1E36',
      accentColor: '#10B981',
      showDisclaimers: true,
    },
  ],
  integrations: [
    {
      id: 'int_1',
      userId: 'usr_affiliate_demo',
      type: 'telegram',
      name: 'Canal VIP Ofertas Telegram',
      status: 'connected',
      credentials: {
        botToken: '6892341234:AAHq_DEMO_TOKEN_DIVULGA',
        chatId: '@achadinhos_carlos_oficial',
      },
      lastTestedAt: '2026-10-27T19:00:00Z',
    },
    {
      id: 'int_2',
      userId: 'usr_affiliate_demo',
      type: 'whatsapp',
      name: 'WhatsApp Business Cloud API',
      status: 'connected',
      credentials: {
        phoneNumberId: '1092837465',
        wabaId: '987654321',
        accessToken: 'EAAG_DEMO_TOKEN_WHATSAPP_DIVULGAPROMO',
      },
      lastTestedAt: '2026-10-28T07:10:00Z',
    },
  ],
  referrals: [
    {
      id: 'ref_1',
      referrerUserId: 'usr_affiliate_demo',
      referredUserId: 'usr_new_1',
      referredUserName: 'Mariana Duarte',
      status: 'qualified',
      commissionAmount: 39.8,
      subscriptionPlan: 'Plano Pro (R$ 199/mês)',
      createdAt: '2026-10-10T11:00:00Z',
    },
    {
      id: 'ref_2',
      referrerUserId: 'usr_affiliate_demo',
      referredUserId: 'usr_new_2',
      referredUserName: 'Rodrigo Santoro',
      status: 'pending',
      commissionAmount: 19.8,
      subscriptionPlan: 'Plano Start (R$ 99/mês)',
      createdAt: '2026-10-22T14:30:00Z',
    },
  ],
  auditLogs: [
    {
      id: 'log_1',
      userId: 'usr_affiliate_demo',
      action: 'LOGIN_SUCCESS',
      details: 'Login autenticado via e-mail e senha',
      ip: '177.136.24.12',
      timestamp: '2026-10-28T07:00:00Z',
    },
    {
      id: 'log_2',
      userId: 'usr_affiliate_demo',
      action: 'LINK_CONVERTED',
      details: 'Link da Amazon convertido para tag carlosachados-20',
      ip: '177.136.24.12',
      timestamp: '2026-10-28T07:05:00Z',
    },
  ],
};

function ensureDbFile(): void {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
  }
}

export function getDb(): DatabaseSchema {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as DatabaseSchema;
  } catch (err) {
    console.error('Error reading db file, restoring fallback:', err);
    return INITIAL_DATA;
  }
}

export function saveDb(data: DatabaseSchema): void {
  ensureDbFile();
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
}
