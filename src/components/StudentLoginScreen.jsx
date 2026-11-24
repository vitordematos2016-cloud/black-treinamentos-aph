import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Phone,
  Sparkles,
  Database,
} from 'lucide-react';
import { BRAND_CONFIG, getWhatsAppUrl } from '../data/blackData';
import {
  authenticateStudent,
  loginAsDemoStudent,
  isSupabaseConfigured,
} from '../services/lmsContentService';

export default function StudentLoginScreen({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const supabaseReady = isSupabaseConfigured();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    const res = await authenticateStudent({ identifier, password });
    setLoading(false);
    if (!res.ok) {
      setErrorMsg(res.error);
      return;
    }
    onLoginSuccess(res.session);
  };

  const handleDemoAccess = () => {
    const session = loginAsDemoStudent();
    onLoginSuccess(session);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 py-12 pb-24 overflow-hidden">
      {/* Feixes Diagonais Vermelhos nos Cantos */}
      <div
        className="pointer-events-none absolute -top-12 -left-16 w-64 h-64 opacity-80 z-0"
        aria-hidden="true"
      >
        <div className="w-5 h-72 bg-gradient-to-b from-[#ED101C] via-[#ED101C]/70 to-transparent rotate-[32deg] transform origin-top-left shadow-[0_0_28px_#ED101C]" />
        <div className="w-2 h-64 bg-gradient-to-b from-[#ED101C]/85 to-transparent rotate-[32deg] transform origin-top-left translate-x-7 -translate-y-64" />
      </div>

      <div
        className="pointer-events-none absolute -bottom-16 -right-12 w-72 h-72 opacity-80 z-0"
        aria-hidden="true"
      >
        <div className="w-5 h-72 bg-gradient-to-t from-[#ED101C] via-[#ED101C]/70 to-transparent rotate-[32deg] transform origin-bottom-right translate-x-44 shadow-[0_0_28px_#ED101C]" />
        <div className="w-2 h-64 bg-gradient-to-t from-[#ED101C]/85 to-transparent rotate-[32deg] transform origin-bottom-right translate-x-34 -translate-y-72" />
      </div>

      {/* Fundo sutil desfocado dos socorristas */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/assets/hero-bg-socorristas.jpg"
          alt=""
          className="w-full h-full object-cover opacity-20 blur-[5px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/75 to-[#050505]" />
      </div>

      {/* Card Principal de Acesso */}
      <div className="relative z-10 w-full max-w-[440px]">
        <div className="cta-emergency-border rounded-3xl p-[1.5px] shadow-[0_24px_75px_rgba(0,0,0,0.9),0_0_40px_rgba(237,16,28,0.2)]">
          <div className="cta-emergency-border-ring rounded-3xl" aria-hidden="true" />

          <div className="relative z-10 bg-[#0B0C11]/95 backdrop-blur-xl rounded-[calc(1.5rem-1.5px)] p-6 sm:p-8 space-y-6">
            {/* Cabeçalho */}
            <div className="flex flex-col items-center text-center space-y-3">
              <img
                src="/assets/logo-header-sharp.png"
                alt="BLACK Treinamentos - Resgate & APH"
                className="h-14 w-auto object-contain drop-shadow-[0_4px_18px_rgba(237,16,28,0.35)]"
              />
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#190609] border border-[#ED101C]/60 text-[#ED101C] text-[10px] font-mono font-bold uppercase tracking-widest mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Ambiente Exclusivo do Aluno</span>
                </span>
                <h1 className="font-display font-extrabold text-2xl text-white">
                  Portal do Aluno — APH 200h
                </h1>
                <p className="text-xs text-white/70 mt-1">
                  Acesse seus 11 módulos, apostilas, frequência presencial, parcelas e certificado oficial.
                </p>
              </div>
            </div>

            {/* Formulário de Login */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="login-identifier"
                  className="block text-xs font-bold uppercase tracking-wider text-white/75 mb-1.5"
                >
                  CPF ou E-mail de Matrícula
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#ED101C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="000.000.000-00 ou seu@email.com"
                    className="w-full bg-[#06070A] border border-white/15 focus:border-[#ED101C] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-bold uppercase tracking-wider text-white/75"
                  >
                    Senha
                  </label>
                  <a
                    href={getWhatsAppUrl(
                      'Olá! Sou aluno da Turma de Socorrista APH (200h) e preciso redefinir minha senha do Portal do Aluno.'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#ED101C] hover:underline font-semibold"
                  >
                    Esqueci minha senha
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#ED101C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full bg-[#06070A] border border-white/15 focus:border-[#ED101C] rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-magnetic cta-btn-shimmer w-full py-3.5 px-5 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(237,16,28,0.45)] disabled:opacity-60 transition-colors"
              >
                <span>{loading ? 'Validando acesso...' : 'Entrar no Portal do Aluno'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divisor + Acesso Rápido Demonstração */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3 text-[11px] text-white/40">
                <span className="h-px flex-1 bg-white/10" />
                <span>ACESSO RÁPIDO PARA REVISÃO</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-[#ED101C]/60 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#ED101C]" />
                <span>Entrar como Aluno Demonstrativo (1 Clique)</span>
              </button>
            </div>

            {/* Rodapé Técnico de Status Supabase & Suporte */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/55">
              <span className="inline-flex items-center gap-1.5 font-mono">
                <Database className="w-3.5 h-3.5 text-[#ED101C]" />
                <span>
                  {supabaseReady ? 'Supabase Auth Ativo' : 'Pronto p/ Supabase Auth'}
                </span>
              </span>
              <a
                href={getWhatsAppUrl('Olá! Preciso de ajuda para acessar o Portal do Aluno BLACK Treinamentos.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-white/75 hover:text-white font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-[#ED101C]" />
                <span>Suporte {BRAND_CONFIG.whatsappDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
