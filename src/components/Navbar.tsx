import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Sparkles,
  Zap,
  Moon,
  Sun,
  Bell,
  ChevronDown,
  ShieldCheck,
  Store,
  Share2,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  ExternalLink,
  PlusCircle,
  Search,
} from 'lucide-react';
import { UserRole } from '../types/index.js';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAiModal: () => void;
  openNewOfferModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openAiModal,
  openNewOfferModal,
}) => {
  const { user, usersList, theme, toggleTheme, switchUser, switchRole } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const roleLabels: Record<UserRole, { label: string; icon: string; color: string }> = {
    superadmin: { label: 'SuperAdmin', icon: '👑', color: 'bg-purple-900/60 text-purple-300 border-purple-500/40' },
    affiliate: { label: 'Afiliado Pro', icon: '🚀', color: 'bg-blue-900/60 text-blue-300 border-blue-500/40' },
    merchant: { label: 'Lojista / Anunciante', icon: '🏬', color: 'bg-amber-900/60 text-amber-300 border-amber-500/40' },
    creator: { label: 'Criador de Conteúdo', icon: '🎬', color: 'bg-rose-900/60 text-rose-300 border-rose-500/40' },
    team_admin: { label: 'Admin de Equipe', icon: '👥', color: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40' },
  };

  const currentRoleInfo = user ? roleLabels[user.role] : roleLabels.affiliate;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md text-slate-100 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-600 shadow-md shadow-blue-900/40 ring-1 ring-blue-400/30 transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-lg text-white">
                  DIVULGA<span className="text-blue-400 font-black">PROMO</span>
                </span>
                <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                  SaaS
                </span>
              </div>
              <p className="hidden text-[10.5px] text-slate-400 font-medium sm:block">
                Inteligência de Ofertas & Divulgação
              </p>
            </div>
          </button>
        </div>

        {/* Action Shortcuts & Promo IA Trigger */}
        <div className="hidden lg:flex items-center gap-2.5">
          <button
            onClick={openAiModal}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-purple-900/40 hover:from-purple-500 hover:to-indigo-500 transition-all cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Promo IA Assistente</span>
            <span className="ml-1 rounded bg-black/20 px-1.5 py-0.2 text-[10px] text-purple-200">
              {user?.aiCredits || 0} cr.
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('converter')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Share2 className="h-3.5 w-3.5 text-blue-400" />
            <span>Colar Link</span>
          </button>

          <button
            onClick={openNewOfferModal}
            className="flex items-center gap-1.5 rounded-lg border border-blue-600/50 bg-blue-600/10 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-600 hover:text-white transition-all"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Nova Oferta</span>
          </button>
        </div>

        {/* Right Controls: Role Selector, Notifications, Theme, Profile */}
        <div className="flex items-center gap-2">
          
          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${currentRoleInfo.color}`}
              title="Alternar Perfil de Acesso"
            >
              <span>{currentRoleInfo.icon}</span>
              <span className="hidden md:inline font-semibold">{currentRoleInfo.label}</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Simular Perfil de Usuário
                </div>
                {(['superadmin', 'affiliate', 'merchant', 'creator', 'team_admin'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors ${
                      user?.role === r
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{roleLabels[r].icon}</span>
                      <span>{roleLabels[r].label}</span>
                    </span>
                    {user?.role === r && <span className="text-[10px]">Ativo</span>}
                  </button>
                ))}
                <div className="mt-1 pt-1 border-t border-slate-800 px-2 py-1 text-[10px] text-slate-400">
                  Controle de acesso granular (RBAC) com isolamento rigoroso de dados por usuário.
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            title="Alternar Modo Escuro / Claro"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-300" />}
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
              title="Notificações e Alertas"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white">Central de Alertas</span>
                  <span className="text-[10px] text-blue-400">Marcar lidas</span>
                </div>
                <div className="mt-2 space-y-2 text-xs text-slate-300">
                  <div className="rounded-lg bg-slate-800/80 p-2 border border-slate-700/50">
                    <p className="font-semibold text-emerald-400">🚀 Disparo concluído com sucesso</p>
                    <p className="text-[11px] text-slate-400">Oferta Anker Q30 enviada para 2 grupos de WhatsApp e Telegram.</p>
                    <span className="text-[9px] text-slate-500">Hoje às 08:00</span>
                  </div>
                  <div className="rounded-lg bg-slate-800/80 p-2 border border-slate-700/50">
                    <p className="font-semibold text-amber-400">⚠️ Cupom especial adicionado</p>
                    <p className="text-[11px] text-slate-400">Air Fryer Gaabor recebeu novo cupom GAABOR20 de R$ 20 OFF.</p>
                    <span className="text-[9px] text-slate-500">Hoje às 09:30</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 p-1.5 hover:bg-slate-800 transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 font-bold text-xs text-white">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/20">
                      Plano {user?.plan.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400">BRL (R$)</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setCurrentTab('settings');
                      setProfileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span>Configurações & LGPD</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab('subscriptions');
                      setProfileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    <span>Meu Plano & Assinatura</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab('support');
                      setProfileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
                    <span>Ajuda & Compliance</span>
                  </button>
                </div>

                <div className="border-t border-slate-800 pt-1">
                  <button
                    onClick={() => {
                      setCurrentTab('landing');
                      setProfileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Página Inicial Comercial</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
