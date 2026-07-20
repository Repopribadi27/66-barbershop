import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { MapPin, Phone, Camera, Smartphone } from "lucide-react";
import Link from "next/link";
import { Toaster } from 'sonner';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "66 Barbershop | Point Tracker",
  description: "Track your loyalty points at 66 Barbershop Bojonegoro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col text-white relative overflow-x-hidden"
        style={{
          fontFamily: 'var(--font-poppins), Poppins, sans-serif',
          background: 'linear-gradient(160deg, #080808 0%, #151515 30%, #0e0e0e 60%, #121212 100%)',
        }}
        suppressHydrationWarning
      >
        {/* Dot Grid Overlay */}
        <div className="fixed inset-0 dot-grid pointer-events-none z-0" />

        {/* Ambient Orbs — ultra premium subtle glow */}
        <div className="fixed top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full pointer-events-none z-0 mix-blend-screen"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)' }} />
        <div className="fixed bottom-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none z-0 mix-blend-screen"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 60%)' }} />
        <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[1000px] h-[600px] rounded-full pointer-events-none z-0 mix-blend-screen"
          style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.01) 0%, transparent 70%)' }} />

        {/* Header */}
        <header className="sticky top-0 z-50 glass-strong">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative w-10 h-11 group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-[0_0_12px_rgba(255,255,255,0.12)]">
                <Image src="/logo.png" alt="66 Barbershop" fill className="object-contain" />
              </div>
              <div className="flex flex-col justify-center mt-0.5">
                <span className="text-2xl font-black tracking-[0.08em] text-white uppercase leading-none">66 BARBERSHOP</span>
                <span className="text-[10px] text-[#808080] font-bold tracking-[0.4em] uppercase mt-1">Bojonegoro</span>
              </div>
            </Link>
            {/* Decorative dots */}
            <div className="hidden md:flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="w-1 h-1 rounded-full bg-white/10" />
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 relative z-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/[0.06] py-10 mt-auto">
          <div className="container mx-auto px-6 flex flex-col items-center text-center">
            <div className="relative w-10 h-11 mb-5 opacity-30 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
              <Image src="/logo.png" alt="66 Barbershop" fill className="object-contain" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 mb-6">
              <a href="#" className="flex items-center gap-2 text-white/40 hover:text-white transition-all duration-500 hover:-translate-y-0.5 group">
                <MapPin className="w-3.5 h-3.5 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Bojonegoro, Jatim</span>
              </a>
              <a href="https://wa.me/6285855634650" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/40 hover:text-white transition-all duration-500 hover:-translate-y-0.5 group">
                <Phone className="w-3.5 h-3.5 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                <span className="text-[10px] uppercase tracking-widest font-bold">085855634650</span>
              </a>
              <a href="https://instagram.com/66_BARBERR" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/40 hover:text-white transition-all duration-500 hover:-translate-y-0.5 group">
                <Camera className="w-3.5 h-3.5 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                <span className="text-[10px] uppercase tracking-widest font-bold">@66_BARBERR</span>
              </a>
              <a href="https://tiktok.com/@66_barberr" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/40 hover:text-white transition-all duration-500 hover:-translate-y-0.5 group">
                <Smartphone className="w-3.5 h-3.5 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                <span className="text-[10px] uppercase tracking-widest font-bold">@66_barberr</span>
              </a>
            </div>

            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

            <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-white/20">
              © {new Date().getFullYear()} 66 Barbershop. All rights reserved.
            </p>
          </div>
        </footer>
        <Toaster theme="dark" toastOptions={{
          style: {
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'white',
          }
        }} />
      </body>
    </html>
  );
}
