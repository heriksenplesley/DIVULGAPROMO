export type UserRole = 'superadmin' | 'affiliate' | 'merchant' | 'creator' | 'team_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
  potentialScore: number;
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

export interface Plan {
  id: string;
  name: string;
  price: number;
  priceYearly: number;
  aiCredits: number;
  popular?: boolean;
  features: string[];
}
