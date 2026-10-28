import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  LayoutDashboard,
  ShoppingBag,
  Link2,
  FileText,
  Palette,
  FolderOpen,
  CalendarClock,
  Radio,
  Sparkles,
  Store,
  BarChart3,
  CreditCard,
  Gift,
  ShieldCheck,
  TrendingUp,
  Settings,
  HelpCircle,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAiModal: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
  ai?: boolean;
  admin?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, openAiModal }) => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';

  const navSections: NavSection[] = [
    {
      title: 'OPERAÇÃO DIÁRIA',
      items: [
        { id: 'dashboard', label: 'Painel Executivo', icon: LayoutDashboard },
        { id: 'offers', label: 'Central de Ofertas', icon: ShoppingBag, badge: '5 ativas' },
        { id: 'converter', label: 'Conversor de Links', icon: Link2 },
        { id: 'ad-generator', label: 'Gerador de Anúncios', icon: FileText },
        { id: 'art-studio', label: 'Estúdio de Artes IA', icon: Palette, highlight: true },
        { id: 'creatives', label: 'Biblioteca de Conteúdo', icon: FolderOpen },
      ],
    },
    {
      title: 'DISTRIBUIÇÃO & IA',
      items: [
        { id: 'campaigns', label: 'Agendador de Campanhas', icon: CalendarClock },
        { id: 'channels', label: 'Canais & Integrações', icon: Radio },
        { id: 'promo-ai', label: 'Agente Promo IA', icon: Sparkles, ai: true },
        { id: 'storefront', label: 'Minha Vitrine Pública', icon: Store },
      ],
    },
    {
      title: 'MONETIZAÇÃO & ESCALA',
      items: [
        { id: 'analytics', label: 'Métricas & Cliques', icon: BarChart3 },
        { id: 'subscriptions', label: 'Planos & Checkout', icon: CreditCard },
        { id: 'referrals', label: 'Programa de Indicação', icon: Gift },
      ],
    },
    ...(isSuperAdmin
      ? [
          {
            title: 'ADMINISTRAÇÃO SUPERADMIN',
            items: [
              { id: 'admin', label: 'Painel do Proprietário', icon: ShieldCheck, admin: true },
              { id: 'financial', label: 'Calculadora de Rentabilidade', icon: TrendingUp, admin: true },
            ],
          },
        ]
      : []),
    {
      title: 'CONFORMIDADE & CONTA',
      items: [
        { id: 'settings', label: 'Configurações & LGPD', icon: Settings },
        { id: 'support', label: 'Ajuda & Diretrizes', icon: HelpCircle },
        { id: 'policies', label: 'Termos & Políticas', icon: FileCheck2 },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-950 p-4 text-slate-300 hidden md:block select-none overflow-y-auto">
      
      {/* Vitrine rápida card */}
      <div className="mb-5 rounded-xl border border-blue-500/20 bg-gradient-to-b from-blue-950/40 to-slate-900/60 p-3 shadow-inner">
        <div className="flex items-center justify-between text-xs font-semibold text-white">
          <span className="flex items-center gap-1.5 text-blue-400">
            <Store className="h-3.5 w-3.5" />
            Vitrine Ativa
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400 truncate">
          divulgapromo.com.br/ofertas/{user?.storefrontSlug || 'sua-loja'}
        </p>
        <button
          onClick={() => setCurrentTab('storefront-public')}
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 px-2 py-1 text-[11px] font-semibold text-blue-300 transition-colors"
        >
          <span>Visualizar como Visitante</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      <nav className="space-y-6">
        {navSections.map(sec => (
          <div key={sec.title}>
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              {sec.title}
            </p>
            <div className="space-y-1">
              {sec.items.map(item => {
                const Icon = item.icon;
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm font-semibold'
                        : item.ai
                        ? 'text-purple-300 hover:bg-purple-950/30 hover:text-white'
                        : item.admin
                        ? 'text-purple-400 hover:bg-purple-950/30 hover:text-white'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 ${
                          active
                            ? 'text-white'
                            : item.ai
                            ? 'text-purple-400 group-hover:scale-110'
                            : item.admin
                            ? 'text-purple-400'
                            : 'text-slate-400 group-hover:text-blue-400'
                        } transition-transform`}
                      />
                      <span>{item.label}</span>
                    </span>

                    {item.badge && (
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-400 border border-slate-700">
                        {item.badge}
                      </span>
                    )}

                    {item.highlight && (
                      <span className="rounded bg-blue-500/20 px-1.5 py-0.2 text-[9px] font-bold text-blue-300 border border-blue-500/30">
                        Canvas
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="mt-8 pt-4 border-t border-slate-900 text-[10px] text-slate-400 space-y-1 px-2">
        <p className="font-semibold text-slate-400">DivulgaPromo SaaS v2.4</p>
        <p>Fuso: {user?.timezone || 'America/Campo_Grande'}</p>
        <p>LGPD & Compliance Ativos</p>
      </div>
    </aside>
  );
};
