import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { ShieldCheck, Lock, Mail, AlertCircle, X, LogOut, Sparkles } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, user, login, logout } = useAuth();
  const [email, setEmail] = useState('admin@businesshub.app');
  const [password, setPassword] = useState('AdminPass2026!');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Failed to authenticate');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-white/20 rounded-xl max-w-md w-full p-6 text-white space-y-5 shadow-2xl relative">
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 text-white/40 hover:text-white p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {user ? (
          /* Already Logged In State */
          <div className="space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center font-bold text-sky-400 font-mono">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-serif italic text-lg text-white">{user.name}</h3>
                <p className="text-xs font-mono text-sky-400">{user.email} &bull; <span className="uppercase font-bold">{user.role}</span></p>
              </div>
            </div>

            <div className="bg-zinc-900/60 p-4 rounded-lg border border-white/10 text-xs text-white/70 space-y-1">
              <div className="font-mono text-emerald-400 font-bold flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Session Active & Authenticated</span>
              </div>
              <p>Your session JWT httpOnly cookie is verified with server-side role gating.</p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs font-bold uppercase rounded border border-white/10"
              >
                Close
              </button>
              <button
                onClick={async () => {
                  await logout();
                  setIsLoginModalOpen(false);
                }}
                className="flex-1 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-mono text-xs font-bold uppercase rounded border border-rose-500/40 flex items-center justify-center space-x-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Login Form State */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Platform Authentication</span>
              </div>
              <h3 className="text-xl font-serif italic text-white">Business HUB Member Login</h3>
              <p className="text-xs text-white/60">Sign in to access protected operations, CRM, and AI Workforce controls.</p>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded text-rose-300 text-xs flex items-center space-x-2 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-white/70 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@businesshub.app"
                    className="w-full bg-zinc-950 border border-white/20 rounded pl-9 pr-3 py-2 text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 border border-white/20 rounded pl-9 pr-3 py-2 text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 p-3 rounded border border-white/10 text-[11px] font-mono text-white/50 space-y-1">
              <span className="text-sky-400 font-bold block">Default System Admin Credentials:</span>
              <div>Email: <span className="text-white">admin@businesshub.app</span></div>
              <div>Password: <span className="text-white">AdminPass2026!</span></div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-black font-mono font-bold text-xs uppercase rounded transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
