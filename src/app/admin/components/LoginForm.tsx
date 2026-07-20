'use client';

import { useState } from 'react';
import { loginAdmin } from '../actions';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await loginAdmin(password);
    if (res?.error) {
      setError(res.error);
    } else {
      window.location.reload();
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-[380px] w-full">
        <div className="glass rounded-3xl p-8 hover-lift relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <div className="flex justify-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white/80" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl font-black text-gradient tracking-tight uppercase mb-1">Admin</h2>
            <p className="text-white/30 text-sm font-medium">Masukkan password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input text-white rounded-xl py-3.5 pl-11 pr-4 placeholder:text-white/15 font-medium text-sm tracking-[0.3em] outline-none"
                  required
                  suppressHydrationWarning
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-white to-white/80 text-black hover:from-white/90 hover:to-white/70 border-none rounded-xl py-6 font-bold text-xs uppercase tracking-[0.2em] btn-glow transition-all duration-500 flex items-center justify-center gap-2"
              suppressHydrationWarning
            >
              {isLoading ? 'Memverifikasi...' : 'Masuk'}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>

          {error && (
            <div className="mt-5 p-3 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400/80 text-xs font-medium text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
