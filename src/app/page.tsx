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
      <div className="max-w-[440px] w-full relative z-10 animate-[float_6s_ease-in-out_infinite]">

        {/* Main Card */}
        <div className="gradient-border rounded-[2rem] p-8 sm:p-10 hover-lift relative overflow-hidden bg-[#0A0A0A]/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Top accent line */}
          <div className="absolute top-0 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
          <div className="absolute top-0 left-[25%] right-[25%] h-[2px] bg-gradient-to-r from-transparent via-[#FFDF73]/80 to-transparent blur-sm" />

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
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-[#D4AF37]/20 blur-2xl rounded-full" />
            <div className="w-16 h-16 rounded-2xl border border-[#D4AF37]/30 flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] relative z-10 shadow-[0_4px_20px_rgba(212,175,55,0.2)]">
              <Scissors className="w-7 h-7 text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8 relative">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40 tracking-tight mb-2 drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
              Cek Poin Anda
            </h1>
            <p className="text-white/40 text-sm font-medium tracking-wide">
              Kumpulkan <span className="text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">50 poin</span> untuk Free Haircut
            </p>
          </div>

          {/* Decorative dot row */}
          <div className="flex justify-center gap-1 mb-6 opacity-20">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-[#D4AF37]" />
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
              className="w-full relative group overflow-hidden bg-gradient-to-r from-[#D4AF37] via-[#FFDF73] to-[#B5A642] text-[#0A0A0A] hover:brightness-110 border-none rounded-xl py-6 font-extrabold text-[13px] uppercase tracking-[0.25em] transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2"
              suppressHydrationWarning
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? 'Mencari...' : 'Cek Sekarang'}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
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

              <div className="text-center mb-8">
                <p className="text-[10px] text-[#D4AF37]/70 font-bold uppercase tracking-[0.3em] mb-1.5">Member</p>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                  {member.name}
                </h2>
              </div>

              {/* Progress Card */}
              <div className="glass-strong rounded-[20px] p-7 relative overflow-hidden group hover:bg-white/[0.04] transition-colors duration-500">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex justify-between items-end mb-4">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Progress</span>
                  <div>
                    <span className="text-4xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">{member.totalPoints}</span>
                    <span className="text-base font-bold text-white/20 ml-1">/50</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4 justify-center">
                  {dots.map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-500 ${
                        i < member.totalPoints
                          ? 'bg-gradient-to-br from-[#FFDF73] to-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)] scale-110'
                          : 'bg-white/[0.04] shadow-inner'
                      }`}
                      style={{ transitionDelay: `${i * 15}ms` }}
                    />
                  ))}
                </div>

                <p className="text-white/40 text-[11px] font-medium tracking-wide mt-4 text-center">
                  {member.totalPoints >= 50
                    ? '✂️ Poin sudah cukup!'
                    : `${50 - member.totalPoints} poin lagi untuk Free Haircut`}
                </p>
              </div>

              {/* Reward */}
              {member.totalPoints >= 50 && (
                <div className="mt-4 border border-[#D4AF37]/30 rounded-2xl p-6 text-center bg-gradient-to-br from-[#D4AF37]/10 to-transparent relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#D4AF37]/5 blur-3xl animate-pulse-slow" />
                  <Gift className="w-8 h-8 text-[#FFDF73] mx-auto mb-3 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)] relative z-10" />
                  <p className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFDF73] to-[#D4AF37] relative z-10">Free Haircut!</p>
                  <p className="text-[10px] text-[#D4AF37]/60 font-semibold mt-1 relative z-10">Tunjukkan layar ini ke kasir</p>
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
