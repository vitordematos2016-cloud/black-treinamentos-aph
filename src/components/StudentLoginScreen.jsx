import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Phone,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { BRAND_CONFIG, getWhatsAppUrl } from '../data/blackData';
import {
  authenticateStudent,
  loginAsDemoStudent,
  saveStudentSession,
  saveCustomStudentPassword,
  updateStudentProfileContact,
  validateStrongPassword,
} from '../services/lmsContentService';

export default function StudentLoginScreen({ onLoginSuccess, onBackToLanding }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'primeiro_acesso'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (authMode === 'primeiro_acesso') {
      if (!fullName.trim() || !identifier.trim()) {
        setErrorMsg('Preencha seu nome completo e seu CPF ou e-mail de matrícula.');
        return;
      }
      const pwdCheck = validateStrongPassword(password);
      if (!pwdCheck.valid) {
        setErrorMsg(pwdCheck.error);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('As senhas digitadas não conferem. Verifique e tente novamente.');
        return;
      }
      setLoading(true);
      const res = await authenticateStudent({
        identifier,
        password,
        skipPasswordCheck: true,
        rememberMe: true,
      });
      setLoading(false);
      if (!res.ok) {
        setErrorMsg(res.error);
        return;
      }
      saveCustomStudentPassword(res.session.id, password);
      updateStudentProfileContact({
        studentId: res.session.id,
        nome: fullName.trim().toUpperCase(),
        ...(identifier.includes('@') ? { email: identifier.trim() } : {}),
      });
      const updatedSession = {
        ...res.session,
        nome: fullName.trim().toUpperCase(),
        ...(identifier.includes('@') ? { email: identifier.trim() } : {}),
      };
      saveStudentSession(updatedSession, true);
      onLoginSuccess(updatedSession);
      return;
    }

    setLoading(true);
    const res = await authenticateStudent({ identifier, password, rememberMe });
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
    <div className="relative min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 py-10 pb-20 overflow-hidden">
      {/* Feixes Diagonais Vermelhos nos Cantos */}
      <div
        className="pointer-events-none absolute -top-12 -left-16 w-64 h-64 opacity-85 z-0"
        aria-hidden="true"
      >
        <div className="w-5 h-72 bg-gradient-to-b from-[#ED101C] via-[#ED101C]/70 to-transparent rotate-[32deg] transform origin-top-left shadow-[0_0_28px_#ED101C]" />
        <div className="w-2 h-64 bg-gradient-to-b from-[#ED101C]/85 to-transparent rotate-[32deg] transform origin-top-left translate-x-7 -translate-y-64" />
      </div>

      <div
        className="pointer-events-none absolute -bottom-16 -right-12 w-72 h-72 opacity-85 z-0"
        aria-hidden="true"
      >
        <div className="w-5 h-72 bg-gradient-to-t from-[#ED101C] via-[#ED101C]/70 to-transparent rotate-[32deg] transform origin-bottom-right translate-x-44 shadow-[0_0_28px_#ED101C]" />
        <div className="w-2 h-64 bg-gradient-to-t from-[#ED101C]/85 to-transparent rotate-[32deg] transform origin-bottom-right translate-x-34 -translate-y-72" />
      </div>

      {/* Fundo Cinematográfico dos Socorristas */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/assets/hero-bg-socorristas.jpg"
          alt=""
          className="w-full h-full object-cover opacity-30 blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/85 via-[#050505]/70 to-[#050505]" />
      </div>

      {/* Card Principal de Acesso */}
      <div className="relative z-10 w-full max-w-[460px]">
        {onBackToLanding && (
          <div className="mb-3 flex justify-center sm:justify-start">
            <button
              type="button"
              onClick={onBackToLanding}
              className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white/85 hover:text-white inline-flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#ED101C]" />
              <span>Voltar ao Site Principal</span>
            </button>
          </div>
        )}

        <div className="cta-emergency-border rounded-3xl p-[1.5px] shadow-[0_24px_75px_rgba(0,0,0,0.92),0_0_40px_rgba(237,16,28,0.22)]">
          <div className="cta-emergency-border-ring rounded-3xl" aria-hidden="true" />

          <div className="relative z-10 bg-[#0B0C11]/95 backdrop-blur-xl rounded-[calc(1.5rem-1.5px)] p-6 sm:p-8 space-y-5">
            {/* Cabeçalho Oficial BLACK */}
            <div className="flex flex-col items-center text-center space-y-2.5">
              <img
                src="/assets/logo-header-sharp.png"
                alt="BLACK Treinamentos - Resgate & APH"
                className="h-14 w-auto object-contain drop-shadow-[0_4px_18px_rgba(237,16,28,0.35)]"
              />
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#190609] border border-[#ED101C]/60 text-[#FF5A65] text-[10px] font-mono font-bold uppercase tracking-widest mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Área Exclusiva do Aluno</span>
                </span>
                <h1 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                  Portal do Aluno — Socorrista APH
                </h1>
              </div>
            </div>

            {/* Alternância Clara: Entrar | Primeiro Acesso */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#13151E] border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  authMode === 'login'
                    ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                Já tenho acesso
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('primeiro_acesso');
                  setErrorMsg('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  authMode === 'primeiro_acesso'
                    ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                Primeiro Acesso
              </button>
            </div>

            {/* Formulário de Login / Primeiro Acesso */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authMode === 'primeiro_acesso' && (
                <div>
                  <label
                    htmlFor="login-fullname"
                    className="block text-xs font-bold uppercase tracking-wider text-white/75 mb-1.5"
                  >
                    Nome Completo da Matrícula
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-[#ED101C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Como sairá no Certificado oficial"
                      className="w-full bg-[#06070A] border border-white/15 focus:border-[#ED101C] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

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
                    {authMode === 'primeiro_acesso' ? 'Crie sua Senha' : 'Senha de Acesso'}
                  </label>
                  {authMode === 'login' && (
                    <a
                      href={getWhatsAppUrl(
                        'Olá! Sou aluno da Turma de Socorrista APH (200h) e preciso recuperar/redefinir minha senha de acesso ao Portal do Aluno.'
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#FF6B74] hover:text-white hover:underline font-semibold"
                    >
                      Esqueci minha senha
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#ED101C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      authMode === 'primeiro_acesso'
                        ? 'Ex: Black@2027'
                        : 'Digite sua senha'
                    }
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
                {(() => {
                  const { checks } = validateStrongPassword(password);
                  if (authMode !== 'primeiro_acesso' && !password) return null;
                  return (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[
                        { ok: checks.minLength, label: 'Mín. 6 dígitos' },
                        { ok: checks.hasUppercase, label: '1 maiúscula' },
                        { ok: checks.hasSpecial, label: '1 caractere especial' },
                      ].map((item) => (
                        <span
                          key={item.label}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border transition-colors ${
                            item.ok
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                              : 'bg-white/[0.04] border-white/10 text-white/55'
                          }`}
                        >
                          {item.ok ? '✓ ' : '• '}
                          {item.label}
                        </span>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {authMode === 'primeiro_acesso' && (
                <div>
                  <label
                    htmlFor="login-confirm-password"
                    className="block text-xs font-bold uppercase tracking-wider text-white/75 mb-1.5"
                  >
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#ED101C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a senha (mín. 6 dígitos)"
                      className="w-full bg-[#06070A] border border-white/15 focus:border-[#ED101C] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {authMode === 'login' && (
                <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#ED101C]"
                  />
                  <span>Manter meu acesso conectado neste dispositivo</span>
                </label>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-[#1D090D] border border-[#ED101C]/55 text-[#FF9CA3] text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-magnetic cta-btn-shimmer w-full py-3.5 px-5 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white font-extrabold text-sm inline-flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(237,16,28,0.45)] disabled:opacity-60 transition-colors"
              >
                <span>
                  {loading
                    ? 'Validando acesso...'
                    : authMode === 'primeiro_acesso'
                    ? 'Ativar Matrícula e Entrar'
                    : 'Entrar no Portal do Aluno'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Acesso Rápido para Demonstração */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-3 text-[10px] font-mono text-white/40 uppercase tracking-wider">
                <span className="h-px flex-1 bg-white/10" />
                <span>Acesso Rápido (Demonstração)</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 hover:border-[#ED101C]/60 text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#ED101C]" />
                <span>Entrar como Aluno Demonstrativo (1 Clique)</span>
              </button>
            </div>

            {/* Rodapé Informativo para o Aluno: Matrícula + Suporte Oficial (zero jargão técnico!) */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/60">
              <a
                href={getWhatsAppUrl(
                  'Olá! Ainda não sou aluno da BLACK Treinamentos e quero fazer minha inscrição na Turma de Socorrista APH (200h).'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/75 hover:text-white transition-colors font-semibold"
              >
                Ainda não é aluno? <strong className="text-[#FF5A65]">Fazer Matrícula →</strong>
              </a>
              <a
                href={getWhatsAppUrl(
                  'Olá! Preciso de ajuda da Secretaria para acessar o Portal do Aluno BLACK Treinamentos.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-white/80 hover:text-white font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-[#ED101C]" />
                <span>Secretaria {BRAND_CONFIG.whatsappDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
