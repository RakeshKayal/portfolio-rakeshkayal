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
import { MacAppleIcon } from './MacIcons';

interface BootScreenProps {
  onUnlock: (role: UserRole) => void;
  isUnlocked: boolean;
}

// Multilingual Greetings sequenced like Apple's official welcome setup
const GREETINGS_LIST = [
  { text: 'Hello', sub: 'Welcome', lang: 'English' },
  { text: 'Namaste', sub: 'Aapka Swagat Hai', lang: 'Hindi' },
  { text: 'Bonjour', sub: 'Bienvenue', lang: 'French' },
  { text: 'Hola', sub: 'Bienvenido', lang: 'Spanish' },
  { text: 'Ciao', sub: 'Benvenuto', lang: 'Italian' },
  { text: 'Konnichiwa', sub: 'Yōkoso', lang: 'Japanese' },
  { text: 'Guten Tag', sub: 'Willkommen', lang: 'German' },
  { text: 'Olà', sub: 'Bem-vindo', lang: 'Portuguese' },
];

export const BootScreen: React.FC<BootScreenProps> = ({ onUnlock, isUnlocked }) => {
  const [bootStage, setBootStage] = useState<
    'apple-static' | 'logo-zoom' | 'greetings' | 'portfolio-welcome' | 'login-window'
  >('apple-static');

  const [glowZoomActive, setGlowZoomActive] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [greetingFade, setGreetingFade] = useState(true);
  const [welcomeReady, setWelcomeReady] = useState(false);
  const [timeStr, setTimeStr] = useState('4:39 PM');

  // Login States
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const touchStartY = useRef<number | null>(null);

  // Real-time Clock
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

  // Sequence Timeline
  useEffect(() => {
    if (!isUnlocked) {
      setBootStage('apple-static');
      setGlowZoomActive(false);
      setWelcomeReady(false);
      setGreetingIndex(0);
      setGreetingFade(true);
      setPassword('');
      setIsError(false);
      setErrorMessage('');

      // 1. Static logo for 2.0s
      const zoomTimer = setTimeout(() => {
        setBootStage('logo-zoom');
        setGlowZoomActive(true);
      }, 2000);

      // 2. Greetings sequence at 3.2s
      const greetingsTimer = setTimeout(() => {
        setBootStage('greetings');
      }, 3200);

      // 3. Move to portfolio welcome after all greetings run (1200ms per greeting)
      const welcomeTimer = setTimeout(() => {
        setBootStage('portfolio-welcome');
      }, 3200 + GREETINGS_LIST.length * 1200);

      return () => {
        clearTimeout(zoomTimer);
        clearTimeout(greetingsTimer);
        clearTimeout(welcomeTimer);
      };
    }
  }, [isUnlocked]);

  // Smooth Apple iOS style cross-fade between greetings
  useEffect(() => {
    if (bootStage === 'greetings') {
      const interval = setInterval(() => {
        // Trigger exit fade
        setGreetingFade(false);

        // Swap word halfway through transition, then trigger entrance fade
        setTimeout(() => {
          setGreetingIndex((prev) => (prev + 1) % GREETINGS_LIST.length);
          setGreetingFade(true);
        }, 280);
      }, 1200);

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
    <div
      id="boot-screen"
      className="fixed inset-0 z-50 flex flex-col justify-between select-none overflow-hidden font-sans bg-black text-white"
    >
      {/* ================= STAGES 1 & 2: LOGO & GLOW ================= */}
      {(bootStage === 'apple-static' || bootStage === 'logo-zoom') && (
        <div
          onClick={() => setBootStage('greetings')}
          className="relative w-full h-full flex flex-col items-center justify-center bg-black cursor-pointer overflow-hidden select-none"
          title="Click to continue"
        >
          <div
            className={`absolute rounded-full pointer-events-none transition-all duration-1200 ease-out ${
              glowZoomActive
                ? 'w-[900px] h-[900px] bg-radial from-white via-white/50 to-transparent blur-[80px] scale-[2.5] opacity-95'
                : 'w-[340px] h-[340px] bg-radial from-white/45 via-white/20 to-transparent blur-[45px] scale-100 opacity-80'
            }`}
          />

          <div
            className={`relative z-10 flex flex-col items-center justify-center transition-all duration-1200 ease-out ${
              glowZoomActive ? 'scale-[1.45] opacity-95' : 'scale-100 opacity-100'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <MacAppleIcon
                size={110}
                className="filter drop-shadow-[0_0_20px_rgba(255,255,255,0.75)] transition-transform duration-1000"
              />
            </div>

            <div
              className="relative z-0 mt-1 pointer-events-none select-none overflow-hidden"
              style={{ height: 60, width: 110 }}
            >
              <div
                className="transform scale-y-[-1] opacity-35 filter blur-[0.4px]"
                style={{
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 75%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 75%)',
                }}
              >
                <MacAppleIcon size={110} />
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 inset-x-0 flex justify-center text-[11px] text-white/30 font-mono tracking-wider">
            <span>Click to continue</span>
          </div>
        </div>
      )}

      {/* ================= STAGE 3: AUTHENTIC APPLE "HELLO" GREETINGS ================= */}
      {bootStage === 'greetings' && (
        <div
          onClick={() => setBootStage('portfolio-welcome')}
          className="relative w-full h-full flex flex-col items-center justify-center bg-black text-white cursor-pointer select-none overflow-hidden"
          title="Click to proceed"
        >
          {/* Minimal macOS Status Bar */}
          <div className="absolute top-0 inset-x-0 px-6 sm:px-10 py-5 flex items-center justify-between text-xs text-white/40 tracking-wider font-mono">
            <div className="flex items-center gap-2">
              <MacAppleIcon size={16} />
              <span className="text-[11px] font-medium text-white/60">macOS</span>
            </div>
            <div className="flex items-center gap-3">
              <Battery className="w-4 h-4 text-white/50" />
              <Wifi className="w-3.5 h-3.5 text-white/50" />
              <span className="text-[11px] font-medium text-white/70">{timeStr}</span>
            </div>
          </div>

          {/* Centered Smooth Typography Animation */}
          <div className="flex flex-col items-center justify-center text-center px-4">
            <div
              className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform flex flex-col items-center ${
                greetingFade
                  ? 'opacity-100 scale-100 translate-y-0 blur-0'
                  : 'opacity-0 scale-[0.96] translate-y-2 blur-[2px]'
              }`}
            >
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-[-0.04em] text-white font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','SF_Pro_Text','Helvetica_Neue',sans-serif]">
                {GREETINGS_LIST[greetingIndex].text}
              </h1>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base font-normal tracking-[0.06em] text-neutral-400">
                {GREETINGS_LIST[greetingIndex].sub}
              </p>
            </div>
          </div>

          {/* Bottom Indicators */}
          <div className="absolute bottom-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-1.5">
              {GREETINGS_LIST.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-400 ${
                    idx === greetingIndex
                      ? 'w-6 bg-white/90'
                      : 'w-1.5 bg-white/20'
                  }`}
                />
              ))}
            </div>
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
              <MacAppleIcon size={16} />
              <span className="text-[11px] font-medium text-white/80">macOS</span>
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
              <div className="absolute w-20 h-20 rounded-full bg-white/25 blur-xl"></div>
              <MacAppleIcon size={44} className="relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]" />
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

      {/* ================= STAGE 5: macOS LOGIN WINDOW ================= */}
      {bootStage === 'login-window' && (
        <div
          className="relative w-full h-full flex flex-col justify-between items-center p-4 sm:p-8 bg-black text-white select-none"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(30, 58, 138, 0.35) 0%, rgba(0, 0, 0, 0.98) 75%)`,
          }}
        >
          <div className="w-full flex items-center justify-between text-xs text-white/60 tracking-wider font-mono pt-1">
            <div className="flex items-center gap-2">
              <MacAppleIcon size={16} />
              <span className="text-[11px] font-medium text-white/80">macOS &bull; Login Window</span>
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
  );
};