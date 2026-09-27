import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi,
  Battery,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  ChevronUp,
} from 'lucide-react';
import { UserRole } from '../types';
import { playAppleBootChime, playClickSound, playErrorSound, playSuccessChime } from '../utils/audio';

// 3D Isometric Neon Cube Icon (Replaces Apple logo)[cite: 3]
export const MacCubeIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`drop-shadow-md select-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="cubeTileBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#252a34" />
        <stop offset="100%" stopColor="#15181f" />
      </linearGradient>

      <linearGradient id="cubeTopFace" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#5ea5ff" />
        <stop offset="50%" stopColor="#7a8aff" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>

      <linearGradient id="neonCyan" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>

      <linearGradient id="neonPurple" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>

      <linearGradient id="neonBottom" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
    </defs>

    {/* Squircle tile base */}
    <rect x="2" y="2" width="96" height="96" rx="26" fill="url(#cubeTileBg)" stroke="#3b4252" strokeWidth="1.2" />
    <rect x="5" y="5" width="90" height="90" rx="23" stroke="#1f242d" strokeWidth="1.5" />

    {/* Top face */}
    <polygon
      points="50,25 74,38 50,51 26,38"
      fill="url(#cubeTopFace)"
      stroke="#cbd5e1"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />

    {/* Left face */}
    <polygon points="26,38 50,51 50,75 26,62" fill="#131823" fillOpacity="0.8" />

    {/* Right face */}
    <polygon points="50,51 74,38 74,62 50,75" fill="#171b26" fillOpacity="0.8" />

    {/* Neon edges */}
    <line x1="26" y1="38" x2="26" y2="62" stroke="url(#neonCyan)" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="50" y1="51" x2="50" y2="75" stroke="url(#neonCyan)" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="74" y1="38" x2="74" y2="62" stroke="url(#neonPurple)" strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M 26,62 L 50,75 L 74,62"
      stroke="url(#neonBottom)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Vertex dot */}
    <circle cx="50" cy="51" r="5" fill="#ffffff" />
    <circle cx="50" cy="51" r="6" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" fill="none" />
  </svg>
);

// Multilingual Greetings matching video flow[cite: 4]
const GREETINGS_LIST = [
  { text: 'hello', fontClass: 'font-apple-script' },
  { text: 'hallo', fontClass: 'font-apple-script' },
  { text: 'مرحبا', fontClass: 'font-arabic' },
  { text: 'नमस्ते', fontClass: 'font-hindi' },
  { text: 'bonjour', fontClass: 'font-apple-script' },
  { text: 'hola', fontClass: 'font-apple-script' },
  { text: 'ciao', fontClass: 'font-apple-script' },
  { text: 'olá', fontClass: 'font-apple-script' },
];

interface BootScreenProps {
  onUnlock: (role: UserRole) => void;
  isUnlocked: boolean;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onUnlock, isUnlocked }) => {
  const [bootStage, setBootStage] = useState<
    'cube-static' | 'logo-zoom' | 'greetings' | 'portfolio-welcome' | 'login-window'
  >('cube-static');

  const [glowZoomActive, setGlowZoomActive] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [greetingFade, setGreetingFade] = useState(true);
  const [welcomeReady, setWelcomeReady] = useState(false);
  const [timeStr, setTimeStr] = useState('4:39 PM');

  // Login states
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const touchStartY = useRef<number | null>(null);

  // Status Bar Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTimeStr(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Boot Progression Sequence
  useEffect(() => {
    if (!isUnlocked) {
      setBootStage('cube-static');
      setGlowZoomActive(false);
      setWelcomeReady(false);
      setGreetingIndex(0);
      setGreetingFade(true);
      setPassword('');
      setIsError(false);
      setErrorMessage('');

      // 1. Static icon for 2.0s
      const zoomTimer = setTimeout(() => {
        setBootStage('logo-zoom');
        setGlowZoomActive(true);
      }, 2000);

      // 2. Start cursive greetings at 3.2s
      const greetingsTimer = setTimeout(() => {
        setBootStage('greetings');
      }, 3200);

      // 3. Move to portfolio welcome after greetings cycle
      const welcomeTimer = setTimeout(() => {
        setBootStage('portfolio-welcome');
      }, 3200 + GREETINGS_LIST.length * 1000);

      return () => {
        clearTimeout(zoomTimer);
        clearTimeout(greetingsTimer);
        clearTimeout(welcomeTimer);
      };
    }
  }, [isUnlocked]);

  // Cursive Greeting Cycling with crossfade[cite: 4]
  useEffect(() => {
    if (bootStage === 'greetings') {
      const interval = setInterval(() => {
        setGreetingFade(false);

        setTimeout(() => {
          setGreetingIndex((prev) => (prev + 1) % GREETINGS_LIST.length);
          setGreetingFade(true);
        }, 250);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [bootStage]);

  useEffect(() => {
    if (bootStage === 'portfolio-welcome') {
      const guardTimer = setTimeout(() => setWelcomeReady(true), 300);
      return () => clearTimeout(guardTimer);
    } else {
      setWelcomeReady(false);
    }
  }, [bootStage]);

  const handleProceedToLogin = () => {
    if (bootStage === 'portfolio-welcome' && !welcomeReady) return;
    playClickSound();
    setBootStage('login-window');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current !== null) {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (deltaY > 35) {
        handleProceedToLogin();
      }
      touchStartY.current = null;
    }
  };

  const handleVisitorAccessLogin = () => {
    playAppleBootChime();
    onUnlock('visitor');
  };

  const handleFillPassword = () => {
    setIsError(false);
    setErrorMessage('');
    playClickSound();
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setIsError(true);
      setErrorMessage('Please enter your password.');
      playErrorSound();
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'Rakesh Kayal', password }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        playSuccessChime();
        onUnlock('admin');
      } else if (password === 'Rakesh@2003') {
        playSuccessChime();
        onUnlock('admin');
      } else {
        throw new Error(data?.error || 'Incorrect Password');
      }
    } catch {
      playErrorSound();
      setIsError(true);
      setErrorMessage('Incorrect password for Administrator.');
      setTimeout(() => setIsError(false), 800);
    } finally {
      setLoading(false);
    }
  };

  if (isUnlocked) return null;

  return (
    <>
      {/* Dynamic font stylesheet matching cursive script and international scripts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Noto+Sans+Arabic:wght@600&family=Rozha+One&display=swap');
        
        .font-apple-script {
          font-family: 'Caveat', cursive, -apple-system, sans-serif;
        }
        .font-arabic {
          font-family: 'Noto Sans Arabic', sans-serif;
        }
        .font-hindi {
          font-family: 'Rozha One', serif;
        }
      `}</style>

      <div
        id="boot-screen"
        className="fixed inset-0 z-50 flex flex-col justify-between select-none overflow-hidden font-sans bg-black text-white"
      >
        {/* ================= STAGE 1 & 2: CUBE LOGO & BLOOM ================= */}
        {(bootStage === 'cube-static' || bootStage === 'logo-zoom') && (
          <div
            onClick={() => setBootStage('greetings')}
            className="relative w-full h-full flex flex-col items-center justify-center bg-black cursor-pointer overflow-hidden select-none"
            title="Click to continue"
          >
            <div
              className={`absolute rounded-full pointer-events-none transition-all duration-1200 ease-out ${
                glowZoomActive
                  ? 'w-[850px] h-[850px] bg-radial from-blue-500/30 via-indigo-500/15 to-transparent blur-[80px] scale-[2.2] opacity-90'
                  : 'w-[300px] h-[300px] bg-radial from-blue-500/20 via-white/10 to-transparent blur-[40px] scale-100 opacity-70'
              }`}
            />

            <div
              className={`relative z-10 flex flex-col items-center justify-center transition-all duration-1200 ease-out ${
                glowZoomActive ? 'scale-[1.35] opacity-95' : 'scale-100 opacity-100'
              }`}
            >
              <MacCubeIcon size={110} />

              {/* Mirror Reflection */}
              <div
                className="relative z-0 mt-1 pointer-events-none select-none overflow-hidden"
                style={{ height: 60, width: 110 }}
              >
                <div
                  className="transform scale-y-[-1] opacity-30 filter blur-[0.6px]"
                  style={{
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 75%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 75%)',
                  }}
                >
                  <MacCubeIcon size={110} />
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 inset-x-0 flex justify-center text-[11px] text-white/30 font-mono tracking-wider">
              <span>Click to continue</span>
            </div>
          </div>
        )}

        {/* ================= STAGE 3: AUTHENTIC CURSIVE GREETING SCREEN[cite: 4] ================= */}
        {bootStage === 'greetings' && (
          <div
            onClick={() => setBootStage('portfolio-welcome')}
            className="relative w-full h-full flex flex-col items-center justify-between bg-black text-white cursor-pointer select-none overflow-hidden"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(45, 55, 75, 0.45) 0%, rgba(13, 17, 24, 0.85) 50%, #000000 100%)',
            }}
          >
            {/* Top Empty Spacer */}
            <div className="h-10" />

            {/* Glowing Cursive Center Word[cite: 4] */}
            <div className="flex flex-col items-center justify-center my-auto">
              <span
                className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-medium tracking-wide transition-all duration-300 ease-out transform ${
                  GREETINGS_LIST[greetingIndex].fontClass
                } ${
                  greetingFade
                    ? 'opacity-100 scale-100 blur-0'
                    : 'opacity-0 scale-95 blur-[2px]'
                }`}
                style={{
                  textShadow: '0 0 25px rgba(255, 255, 255, 0.45), 0 0 50px rgba(255, 255, 255, 0.2)',
                }}
              >
                {GREETINGS_LIST[greetingIndex].text}
              </span>
            </div>

            {/* Exact Bottom Skip Label from Video[cite: 4] */}
            <div className="pb-8 tracking-widest text-[10px] sm:text-[11px] font-sans font-semibold text-white/40 uppercase">
              CLICK ANYWHERE TO SKIP
            </div>
          </div>
        )}

        {/* ================= STAGE 4: PORTFOLIO WELCOME ================= */}
        {bootStage === 'portfolio-welcome' && (
          <div
            onClick={handleProceedToLogin}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative w-full h-full flex flex-col justify-between items-center p-6 sm:p-10 bg-black text-white cursor-pointer select-none"
            style={{
              backgroundImage: `radial-gradient(ellipse at 50% 40%, rgba(255, 255, 255, 0.12) 0%, rgba(15, 23, 42, 0.4) 45%, rgba(0, 0, 0, 0.98) 85%)`,
            }}
            title="Swipe up or click to open the page"
          >
            <div className="w-full flex items-center justify-between text-xs text-white/60 tracking-wider font-mono pt-1">
              <div className="flex items-center gap-2">
                <MacCubeIcon size={20} />
                <span className="text-[11px] font-medium text-white/80">macOS System</span>
              </div>
              <div className="flex items-center gap-3">
                <Battery className="w-4 h-4 text-white/70" />
                <Wifi className="w-3.5 h-3.5 text-white/70" />
                <span className="text-[11px] font-medium text-white/90">{timeStr}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center my-auto px-4 max-w-2xl w-full">
              <div className="mb-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[11px] sm:text-xs font-mono tracking-[0.2em] text-white/90 uppercase">
                Apple MacBook Pro Max Web
              </div>

              <div className="my-2 relative flex items-center justify-center">
                <div className="absolute w-20 h-20 rounded-full bg-blue-500/25 blur-xl"></div>
                <MacCubeIcon size={52} className="relative z-10" />
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.35)] mt-4">
                Welcome to Rakesh&apos;s Portfolio
              </h1>

              <p className="mt-3 text-lg sm:text-xl md:text-2xl font-semibold text-sky-400 font-mono tracking-wide">
                Backend Engineer / SDE
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs text-white/60 font-mono bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Java &bull; Spring Boot &bull; Distributed Systems</span>
              </div>
            </div>

            <div className="w-full flex flex-col items-center gap-3 pb-4">
              <div className="flex flex-col items-center gap-1.5 animate-bounce text-white/90">
                <ChevronUp className="w-5 h-5 text-white/95" />
                <span className="text-xs sm:text-sm font-medium tracking-wide">
                  Swipe up or click to open the page
                </span>
              </div>
              <div className="w-36 h-1 rounded-full bg-white/80"></div>
            </div>
          </div>
        )}

        {/* ================= STAGE 5: LOGIN WINDOW ================= */}
        {bootStage === 'login-window' && (
          <div
            className="relative w-full h-full flex flex-col justify-between items-center p-4 sm:p-8 bg-black text-white select-none"
            style={{
              backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(30, 58, 138, 0.35) 0%, rgba(0, 0, 0, 0.98) 75%)`,
            }}
          >
            <div className="w-full flex items-center justify-between text-xs text-white/60 tracking-wider font-mono pt-1">
              <div className="flex items-center gap-2">
                <MacCubeIcon size={20} />
                <span className="text-[11px] font-medium text-white/80">Login Window</span>
              </div>
              <div className="flex items-center gap-3.5">
                <Battery className="w-4 h-4 text-white/70" />
                <Wifi className="w-3.5 h-3.5 text-white/70" />
                <span className="text-[11px] font-medium text-white/90">{timeStr}</span>
              </div>
            </div>

            <div className="my-auto flex flex-col items-center text-center px-4 max-w-md w-full">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Rakesh Kayal
              </h2>
              <span className="text-xs sm:text-sm text-sky-400 font-medium tracking-wide mt-1 mb-6">
                Administrator
              </span>

              <form
                onSubmit={handlePasswordSubmit}
                className={`w-full max-w-sm space-y-3 ${isError ? 'animate-shake' : ''}`}
              >
                <div className="relative w-full">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoFocus
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (isError) setIsError(false);
                    }}
                    className="w-full h-11 pl-4 pr-16 rounded-full bg-white/10 hover:bg-white/15 focus:bg-black/60 border border-white/20 focus:border-blue-400/80 text-white text-sm tracking-wider placeholder-white/40 focus:outline-none shadow-inner backdrop-blur-md transition-all font-mono"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/25 hover:bg-blue-600 text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
                    title="Unlock"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2 text-left">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="text-[11px] text-white/50 flex items-center justify-center gap-1.5 pt-1">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                  <span>Password:</span>
                  <button
                    type="button"
                    onClick={handleFillPassword}
                    className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-sky-300 font-mono text-xs transition-colors cursor-pointer border border-white/10"
                  >
                    Nothing to share
                  </button>
                </div>
              </form>

              <div className="mt-8 flex items-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={handleVisitorAccessLogin}
                  className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  Switch Account
                </button>
                <span className="text-white/20">&bull;</span>
                <button
                  type="button"
                  onClick={handleVisitorAccessLogin}
                  className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer font-medium"
                >
                  Enter via Visitor Access
                </button>
              </div>
            </div>

            <div className="w-full flex items-center justify-between text-[11px] text-white/40 tracking-wider font-mono pb-1">
              <span>Apple MacBook Pro Max Web</span>
              <span>Rakesh Kayal Portfolio</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};