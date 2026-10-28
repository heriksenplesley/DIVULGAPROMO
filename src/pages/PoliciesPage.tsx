import React from 'react';
import { ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto text-xs text-slate-300">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">Termos de Uso, Privacidade & Conformidade Legal</h1>
          <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
            LGPD & Compliance
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Última atualização: 28 de Outubro de 2026 • Documentação pública da plataforma DivulgaPromo.
        </p>
      </div>

      {/* Terms of Use Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <FileText className="h-4 w-4 text-blue-400" />
          1. Termos de Uso da Plataforma DivulgaPromo
        </h2>
        <div className="space-y-2 leading-relaxed">
          <p>
            O <strong>DivulgaPromo</strong> é uma solução de software como serviço (SaaS) destinada à automação responsável de divulgação de ofertas, geração de anúncios com inteligência artificial, gerenciamento de links rastreáveis e publicação assistida para afiliados, lojistas e criadores de conteúdo.
          </p>
          <p>
            <strong>Regras de Conduta:</strong> É expressamente vedado o uso da plataforma para disseminação de spam não solicitado, criação de anúncios com especificações ou preços falsos, cloaking ilícito, ataques a sistemas terceiros, infração de direitos autorais ou violação dos termos específicos dos programas de afiliados integrados (Amazon, Shopee, Mercado Livre, Hotmart, Magalu).
          </p>
        </div>
      </div>

      {/* Privacy Policy LGPD Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <Lock className="h-4 w-4 text-purple-400" />
          2. Política de Privacidade & LGPD (Lei nº 13.709/2018)
        </h2>
        <div className="space-y-2 leading-relaxed">
          <p>
            O DivulgaPromo atua em estrita conformidade com a Lei Geral de Proteção de Dados (LGPD). Os dados cadastrais coletados (nome, e-mail, identificadores de afiliados, fuso horário) têm como finalidade exclusiva a execução dos serviços contratados.
          </p>
          <p>
            <strong>Isolamento e Segurança de Dados:</strong> Cada usuário possui isolamento integral de seus dados através de controle de acesso baseado em funções (RBAC). Seus links rastreáveis, cliques registrados e dados comerciais não são compartilhados com outros usuários.
          </p>
          <p>
            <strong>Direitos do Titular (Art. 18):</strong> O usuário pode a qualquer momento acessar seus dados, exportá-los em formato estruturado (JSON) ou solicitar a revogação de consentimento e eliminação definitiva de sua conta através do painel de Configurações.
          </p>
        </div>
      </div>

      {/* Affiliate Transparency Disclosure Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          3. Divulgação Transparente de Links de Afiliados
        </h2>
        <div className="space-y-2 leading-relaxed">
          <p>
            Todas as vitrines públicas e modelos de anúncios gerados pelo DivulgaPromo incluem avisos claros de que os links publicados podem gerar comissões de afiliação por vendas qualificadas, sem nenhum acréscimo no valor pago pelo consumidor.
          </p>
          <p>
            Os preços, estoques e condições promocionais são determinados exclusivamente pelos marketplaces e lojas anunciantes, podendo sofrer alterações a qualquer momento.
          </p>
        </div>
      </div>

    </div>
  );
};
