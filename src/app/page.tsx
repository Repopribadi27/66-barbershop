'use client';

import { useState } from 'react';
import { searchMember } from './actions';
import { Search, Scissors, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [member, setMember] = useState<{ name: string; totalPoints: number } | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMember(null);

    const result = await searchMember(phoneNumber);
    if (result.error) {
      setError(result.error);
    } else if (result.member) {
      setMember(result.member);
    }
    setIsLoading(false);
  };

  const progress = member ? Math.min((member.totalPoints / 50) * 100, 100) : 0;
  const dots = Array.from({ length: 50 }, (_, i) => i);

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-[440px] w-full">

        {/* Main Card */}
        <div className="gradient-border rounded-3xl p-8 hover-lift relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Corner accents */}
          <div className="absolute top-4 right-4 flex gap-1 opacity-20">
            <div className="w-6 h-px bg-white" />
            <div className="w-px h-6 bg-white -mt-[5px] ml-[-1px]" />
          </div>
          <div className="absolute bottom-4 left-4 flex gap-1 opacity-20">
            <div className="w-px h-6 bg-white" />
            <div className="w-6 h-px bg-white mt-[20px] ml-[-25px]" />
          </div>

          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-border flex items-center justify-center bg-gradient-to-br from-white/10 to-white/[0.02]">
              <Scissors className="w-7 h-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-[26px] font-black text-gradient tracking-tight mb-2">Cek Poin Anda</h1>
            <p className="text-white/35 text-sm font-medium">
              Kumpulkan <span className="text-white/80 font-bold">50 poin</span> untuk Free Haircut
            </p>
          </div>

          {/* Decorative dot row */}
          <div className="flex justify-center gap-1 mb-6 opacity-15">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-white" />
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-white/35 uppercase tracking-[0.2em] ml-1 mb-2 block">
                Nomor HP
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="tel"
                  placeholder="08xx xxxx xxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full glass-input text-white rounded-xl py-4 pl-12 pr-4 placeholder:text-white/15 font-medium text-sm outline-none"
                  required
                  suppressHydrationWarning
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-white to-white/85 text-[#0A0A0A] hover:from-white/95 hover:to-white/75 border-none rounded-xl py-6 font-extrabold text-xs uppercase tracking-[0.2em] btn-glow transition-all duration-500 flex items-center justify-center gap-2"
              suppressHydrationWarning
            >
              {isLoading ? 'Mencari...' : 'Cek Sekarang'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-5 p-4 rounded-xl glass text-red-400 text-xs font-semibold text-center border-red-500/20">
              {error}
            </div>
          )}

          {/* Result */}
          {member && (
            <div className="mt-8">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent mb-8" />

              <div className="text-center mb-6">
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.25em] mb-1">Member</p>
                <h2 className="text-xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{member.name}</h2>
              </div>

              {/* Progress Card */}
              <div className="glass-strong rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="flex justify-between items-end mb-4">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Progress</span>
                  <div>
                    <span className="text-4xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">{member.totalPoints}</span>
                    <span className="text-base font-bold text-white/20 ml-1">/50</span>
                  </div>
                </div>

                {/* Dot Progress — 50 dots */}
                <div className="flex flex-wrap gap-1 mb-3 justify-center">
                  {dots.map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-500 ${
                        i < member.totalPoints
                          ? 'bg-white shadow-[0_0_4px_rgba(255,255,255,0.4)]'
                          : 'bg-white/[0.08]'
                      }`}
                      style={{ transitionDelay: `${i * 20}ms` }}
                    />
                  ))}
                </div>

                <p className="text-white/30 text-[11px] font-semibold mt-3 text-center">
                  {member.totalPoints >= 50
                    ? '✂️ Poin sudah cukup!'
                    : `${50 - member.totalPoints} poin lagi untuk Free Haircut`}
                </p>
              </div>

              {/* Reward */}
              {member.totalPoints >= 50 && (
                <div className="mt-4 gradient-border rounded-2xl p-6 text-center bg-gradient-to-br from-white/10 to-white/[0.03]">
                  <Gift className="w-8 h-8 text-white mx-auto mb-3 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
                  <p className="text-base font-black text-white">Free Haircut!</p>
                  <p className="text-[10px] text-white/30 font-semibold mt-1">Tunjukkan layar ini ke kasir</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Admin */}
        <div className="mt-8 text-center">
          <Link href="/admin" className="text-[9px] font-semibold text-white/15 hover:text-white/40 uppercase tracking-[0.4em] transition-colors duration-500">
            Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
