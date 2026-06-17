import React, { useState } from 'react';
import { X, Lock, Mail, ShieldAlert } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (isAdminUser: boolean) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simulate short network credential delay
    setLoading(true);
    setTimeout(() => {
      // Admin Credentials Checklist
      if (email.trim().toLowerCase() === 'admin@loja.com' && password === 'admin123') {
        onLoginSuccess(true);
        setLoading(false);
        setEmail('');
        setPassword('');
        onClose();
      } else {
        setError('E-mail ou senha administrativa incorretos.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Banner */}
        <div className="bg-slate-900 px-6 py-8 text-white relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 bg-blue-600 w-36 h-36 rounded-full opacity-40 pointer-events-none" />
          <h3 className="font-sans font-black text-xl sm:text-2xl leading-snug">Área do Administrador</h3>
          <p className="text-slate-300 text-xs mt-1">Insira suas credenciais do Tarb Sports para gerenciar o catálogo completo.</p>
        </div>

        {/* Content Panel */}
        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="bg-red-50 text-red-700 text-xs font-semibold p-3.5 rounded-xl border border-red-150 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-750 uppercase tracking-wide mb-1.5">
                E-mail de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  required
                  type="email"
                  placeholder="admin@loja.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 border border-gray-250 bg-gray-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-750 uppercase tracking-wide mb-1.5">
                Senha Administrativa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  required
                  type="password"
                  placeholder="Sua senha secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 border border-gray-250 bg-gray-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Acessando...' : 'Entrar no Painel'}</span>
            </button>
          </form>

          {/* Guidelines box for evaluation of features */}
          <div className="bg-gray-50 border border-gray-150 rounded-xl p-4 space-y-2">
            <h4 className="text-[11px] font-extrabold text-gray-700 uppercase tracking-widest font-mono">
              🔑 Credenciais para Testes:
            </h4>
            <div className="text-xs text-gray-650 space-y-1">
              <p>Utilize a conta administrativa padrão integrada:</p>
              <div className="bg-white px-2 py-1.5 rounded-lg border border-gray-100 font-mono text-center text-[11px] mt-1 text-blue-750 flex justify-around">
                <span>E-mail: <strong>admin@loja.com</strong></span>
                <span>Senha: <strong>admin123</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
