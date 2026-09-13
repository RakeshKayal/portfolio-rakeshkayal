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

// Multilingual Greetings: "Hello", "Namaste", "Ciao", "Hola", "Bonjour" (0.9s duration each)
const GREETINGS_LIST = [
  { text: 'Hello', sub: 'Welcome', lang: 'English' },
  { text: 'Namaste', sub: 'नमस्ते', lang: 'Hindi' },
  { text: 'Bonjour', sub: 'Bienvenue', lang: 'French' },
  { text: 'Hola', sub: 'Bienvenido', lang: 'Spanish' },
  { text: 'Ciao', sub: 'Benvenuto', lang: 'Italian' },
  { text: 'Konnichiwa', sub: 'こんにちは', lang: 'Japanese' },
  { text: 'Guten Tag', sub: 'Willkommen', lang: 'German' },
  { text: 'Olà', sub: 'Bem-vindo', lang: 'Portuguese' }
];

export const BootScreen: React.FC<BootScreenProps> = ({ onUnlock, isUnlocked }) => {
  // Boot Sequence Stages:
  // 1. 'apple-static': Static Apple logo on pitch black background for 2 seconds (Image 2)
  // 2. 'logo-zoom': White glow emerges from background toward screen creating a zoom effect (1.2s)
  // 3. 'greetings': Displays each greeting for 0.9 seconds (900ms) one after another ("Hello", "Namaste", "Bonjour", "Hola", "Ciao")
  // 4. 'portfolio-welcome': "Apple MacBook Pro Max Web" -> "Welcome to Rakesh's Portfolio" -> "Backend Engineer / SDE" -> "Swipe up or click to open the page"
  // 5. 'login-window': macOS Login Window matching Image 1 without avatar
  const [bootStage, setBootStage] = useState<'apple-static' | 'logo-zoom' | 'greetings' | 'portfolio-welcome' | 'login-window'>('apple-static');

  // Animation flag for smooth emergence of the white glow
  const [glowZoomActive, setGlowZoomActive] = useState(false);

  // Greeting index changing every 0.9 seconds (900ms)
  const [greetingIndex, setGreetingIndex] = useState(0);

  // Guard to ensure portfolio-welcome is fully visible and not accidentally skipped
  const [welcomeReady, setWelcomeReady] = useState(false);

  // Time String for macOS Status Bar
  const [timeStr, setTimeStr] = useState('4:39 PM');

  // macOS Login States
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Touch handling for swipe up
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

  // Sequence Timeline:
  // 1. Static Apple logo for 2.0s
  // 2. Logo Zoom In with blooming white glow for 1.2s
  // 3. Greetings for 0.9s each one after another ("Hello", "Namaste", "Bonjour", "Hola", "Ciao" -> 4.5s total)
  // 4. Transition to "Apple MacBook Pro Max Web" -> "Welcome to Rakesh's Portfolio" -> "Backend Engineer / SDE" -> "Swipe up or click to open the page"
  useEffect(() => {
    if (!isUnlocked) {
      setBootStage('apple-static');
      setGlowZoomActive(false);
      setWelcomeReady(false);
      setGreetingIndex(0);
      setPassword('');
      setIsError(false);
      setErrorMessage('');

      // 1. Static logo for 2.0 seconds
      const zoomTimer = setTimeout(() => {
        setBootStage('logo-zoom');
        setGlowZoomActive(true);
      }, 2000);

      // 2. After zoom (2000ms + 1200ms = 3200ms), start multilingual greetings
      const greetingsTimer = setTimeout(() => {
        setBootStage('greetings');
      }, 3200);

      // 3. After all greetings cycle, transition to Portfolio Welcome
      const welcomeTimer = setTimeout(() => {
        setBootStage('portfolio-welcome');
      }, 3200 + GREETINGS_LIST.length * 900);

      return () => {
        clearTimeout(zoomTimer);
        clearTimeout(greetingsTimer);
        clearTimeout(welcomeTimer);
      };
    }
  }, [isUnlocked]);

  // Multilingual Greetings cycling every 0.9 seconds (900ms) one after another
  useEffect(() => {
    if (bootStage === 'greetings') {
      const interval = setInterval(() => {
        setGreetingIndex((prev) => (prev + 1) % GREETINGS_LIST.length);
      }, 900); // Exact 0.9 seconds per greeting
      return () => clearInterval(interval);
    }
  }, [bootStage]);

  // When portfolio-welcome stage appears, enable click/swipe after 300ms
  useEffect(() => {
    if (bootStage === 'portfolio-welcome') {
      const guardTimer = setTimeout(() => {
        setWelcomeReady(true);
      }, 300);
      return () => clearTimeout(guardTimer);
    } else {
      setWelcomeReady(false);
    }
  }, [bootStage]);

  // Advance from portfolio welcome to login window
  const handleProceedToLogin = () => {
    if (bootStage === 'portfolio-welcome' && !welcomeReady) {
      return;
    }
    playClickSound();
    setBootStage('login-window');
  };

  // Touch swipe up handler
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current !== null) {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (deltaY > 35) {
        // Swiped up!
        handleProceedToLogin();
      }
      touchStartY.current = null;
    }
  };

  // Visitor Access Login (1-click recruiter & guest entry)
  const handleVisitorAccessLogin = () => {
    playAppleBootChime();
    onUnlock('visitor');
  };

  // Auto-fill hint password
  const handleFillPassword = () => {
    // setPassword('Rakesh@2003');
    setIsError(false);
    setErrorMessage('');
    playClickSound();
  };

  // Admin Password Verification
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
    } catch (err: any) {
      playErrorSound();
      setIsError(true);
      setErrorMessage('Incorrect password for Administrator. Please check your input ');
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
      {/* =========================================================
          STAGE 1 & 2: APPLE LOGO WITH 2-SECOND STATIC DISPLAY & EMERGING WHITE GLOW ZOOM
          Exact reproduction of user's uploaded Image 2:
          - Pure black backdrop (#000000)
          - Official white Apple logo
          - Soft white radial halo centered behind the logo
          - Mirrored glassy reflection underneath on black reflective surface
          - 2s static, then white glow emerges toward screen with zoom
         ========================================================= */}
      {(bootStage === 'apple-static' || bootStage === 'logo-zoom') && (
        <div
          onClick={() => {
            // Allow user to click to immediately jump to greetings
            setBootStage('greetings');
          }}
          className="relative w-full h-full flex flex-col items-center justify-center bg-black cursor-pointer overflow-hidden select-none"
          title="Click to continue"
        >
          {/* Emerging White Glow from Background */}
          <div
            className={`absolute rounded-full pointer-events-none transition-all duration-1200 ease-out ${
              glowZoomActive
                ? 'w-[900px] h-[900px] bg-radial from-white via-white/50 to-transparent blur-[80px] scale-[2.5] opacity-95'
                : 'w-[340px] h-[340px] bg-radial from-white/45 via-white/20 to-transparent blur-[45px] scale-100 opacity-80'
            }`}
          />

          {/* Logo & Reflection Unit matching Image 2 */}
          <div
            className={`relative z-10 flex flex-col items-center justify-center transition-all duration-1200 ease-out ${
              glowZoomActive ? 'scale-[1.45] opacity-95' : 'scale-100 opacity-100'
            }`}
          >
            {/* Crisp Official Apple Logo with soft drop-glow */}
            <div className="relative flex items-center justify-center">
              <MacAppleIcon
                size={110}
                color="#ffffff"
                className="filter drop-shadow-[0_0_20px_rgba(255,255,255,0.75)] transition-transform duration-1000"
              />
            </div>

            {/* Inverted Glassy Mirror Reflection on dark reflective floor (Image 2) */}
            <div
              className="relative z-0 mt-1 pointer-events-none select-none overflow-hidden"
              style={{
                height: 60,
                width: 110,
              }}
            >
              <div
                className="transform scale-y-[-1] opacity-35 filter blur-[0.4px]"
                style={{
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 75%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 75%)',
                }}
              >
                <MacAppleIcon size={110} color="#ffffff" />
              </div>
            </div>
          </div>

          {/* Subtle Skip Label at bottom */}
          <div className="absolute bottom-6 inset-x-0 flex justify-center text-[11px] text-white/30 font-mono tracking-wider">
            <span>Click to continue</span>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 3: MULTILINGUAL GREETINGS
          "display all the greetings for 0.9 seconds each one after another, 
          one after another"
          "Hello", "Namaste", "Bonjour", "Hola", "Ciao" (0.9s duration each)
         ========================================================= */}
      {bootStage === 'greetings' && (
        <div
          onClick={() => {
            // Fast-forward to portfolio welcome
            setBootStage('portfolio-welcome');
          }}
          className="relative w-full h-full flex flex-col justify-between items-center p-6 sm:p-10 bg-black text-white cursor-pointer select-none overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.22) 0%, rgba(30, 58, 138, 0.35) 40%, rgba(0, 0, 0, 0.98) 80%)`,
          }}
          title="Click to proceed"
        >
          {/* Top Status */}
          <div className="w-full flex items-center justify-between text-xs text-white/60 tracking-wider font-mono pt-1">
            <div className="flex items-center gap-2">
              <MacAppleIcon size={16} color="#ffffff" />
              <span className="text-[11px] font-medium text-white/80">macOS Sequoia</span>
            </div>
            <div className="flex items-center gap-3">
              <Battery className="w-4 h-4 text-white/70" />
              <Wifi className="w-3.5 h-3.5 text-white/70" />
              <span className="text-[11px] font-medium text-white/90">{timeStr}</span>
            </div>
          </div>

          {/* Center Greeting Word (0.9s per item, transitioning one after another) */}
          <div className="my-auto flex flex-col items-center justify-center text-center px-4 w-full">
            <div className="mb-4 relative flex items-center justify-center">
              <div className="absolute w-24 h-24 rounded-full bg-white/20 blur-2xl"></div>
              <MacAppleIcon size={48} color="#ffffff" className="relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]" />
            </div>

            {/* 0.9s word with smooth fade-in zoom transition */}
            <div className="h-28 sm:h-36 flex flex-col items-center justify-center">
              <span
                key={greetingIndex}
                className="text-6xl sm:text-7xl md:text-8xl font-bold font-serif italic tracking-tight text-white drop-shadow-[0_0_45px_rgba(255,255,255,0.95)] animate-in fade-in zoom-in-95 duration-300"
              >
                {GREETINGS_LIST[greetingIndex].text}
              </span>
              <span
                key={`sub-${greetingIndex}`}
                className="text-sm sm:text-base font-mono tracking-widest text-sky-300/90 mt-2 uppercase animate-in fade-in duration-300"
              >
                {GREETINGS_LIST[greetingIndex].sub} &bull; {GREETINGS_LIST[greetingIndex].lang}
              </span>
            </div>

            {/* Language indicators ribbon */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {GREETINGS_LIST.map((g, idx) => {
                const isActive = idx === greetingIndex;
                return (
                  <span
                    key={g.text}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-white text-black font-semibold shadow-lg shadow-white/40 scale-105'
                        : 'bg-white/10 text-white/50 border border-white/10'
                    }`}
                  >
                    {g.text}
                  </span>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-2 text-[11px] text-white/50 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
              <span>Initializing macOS Portfolio Engine...</span>
            </div>
          </div>

          {/* Bottom Progress Bar */}
          <div className="w-full flex justify-center pb-4">
            <div className="w-48 h-1 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-900 ease-linear"
                style={{ width: `${((greetingIndex + 1) / GREETINGS_LIST.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 4: PORTFOLIO WELCOME MESSAGE
          - "Apple MacBook Pro Max Web" above
          - "Welcome to Rakesh's Portfolio" in center
          - "Backend Engineer / SDE" below center
          - "Swipe up or click to open the page" animated message at bottom
         ========================================================= */}
      {bootStage === 'portfolio-welcome' && (
        <div
          onClick={handleProceedToLogin}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-full flex flex-col justify-between items-center p-6 sm:p-10 bg-black text-white cursor-pointer transition-opacity duration-500 select-none opacity-100"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 40%, rgba(255, 255, 255, 0.16) 0%, rgba(15, 23, 42, 0.5) 45%, rgba(0, 0, 0, 0.98) 85%)`,
          }}
          title="Swipe up or click to open the page"
        >
          {/* Top Status Bar */}
          <div className="w-full flex items-center justify-between text-xs text-white/60 tracking-wider font-mono pt-1">
            <div className="flex items-center gap-2">
              <MacAppleIcon size={16} color="#ffffff" />
              <span className="text-[11px] font-medium text-white/80">macOS Sequoia</span>
            </div>
            <div className="flex items-center gap-3">
              <Battery className="w-4 h-4 text-white/70" />
              <Wifi className="w-3.5 h-3.5 text-white/70" />
              <span className="text-[11px] font-medium text-white/90">{timeStr}</span>
            </div>
          </div>

          {/* Center Content:
              1. "Apple MacBook Pro Max Web"
              2. "Welcome to Rakesh's Portfolio"
              3. "Backend Engineer / SDE"
          */}
          <div className="flex flex-col items-center justify-center text-center my-auto px-4 max-w-2xl w-full animate-in fade-in duration-700">
            {/* 1. Above Center: Apple MacBook Pro Max Web */}
            <div className="mb-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[11px] sm:text-xs font-mono tracking-[0.2em] text-white/90 uppercase shadow-lg">
              Apple MacBook Pro Max Web
            </div>

            {/* Apple Logo Icon with subtle halo */}
            <div className="my-2 relative flex items-center justify-center">
              <div className="absolute w-20 h-20 rounded-full bg-white/25 blur-xl"></div>
              <MacAppleIcon size={44} color="#ffffff" className="relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]" />
            </div>

            {/* 2. Center Headline: Welcome to Rakesh's Portfolio */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.35)] mt-4">
              Welcome to Rakesh&apos;s Portfolio
            </h1>

            {/* 3. Below Center: Backend Engineer / SDE */}
            <p className="mt-3 text-lg sm:text-xl md:text-2xl font-semibold text-sky-400 font-mono tracking-wide">
              Backend Engineer / SDE
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs text-white/60 font-mono bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Java &bull; Spring Boot &bull; FastAPI &bull; Distributed Systems</span>
            </div>
          </div>

          {/* 4. Bottom Animated Message: "Swipe up or click to open the page" */}
          <div className="w-full flex flex-col items-center gap-3 pb-4">
            <div className="flex flex-col items-center gap-1.5 animate-bounce text-white/90">
              <ChevronUp className="w-5 h-5 text-white/95" />
              <span className="text-xs sm:text-sm font-medium tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                Swipe up or click to open the page
              </span>
            </div>
            {/* iOS Home Indicator Bar */}
            <div className="w-36 h-1 rounded-full bg-white/80"></div>
          </div>
        </div>
      )}

      {/* =========================================================
          STAGE 4: macOS LOGIN WINDOW ONLY (Image 1 WITHOUT Avatar)
          Displays when someone clicks "swipe up" or clicks to open:
          - NO avatar (avatar removed as requested)
          - NO other page appears (direct login window)
          - Rakesh Kayal (Administrator)
          - Enter Password input with eye toggle & arrow submit
          - Password hint: Rakesh@2003
          - "Switch Account • Enter via Visitor Access"
         ========================================================= */}
      {bootStage === 'login-window' && (
        <div
          className="relative w-full h-full flex flex-col justify-between items-center p-4 sm:p-8 bg-black text-white select-none transition-opacity duration-300 opacity-100"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(30, 58, 138, 0.35) 0%, rgba(0, 0, 0, 0.98) 75%)`,
          }}
        >
          {/* macOS Top Status Bar (Matching Image 1) */}
          <div className="w-full flex items-center justify-between text-xs text-white/60 tracking-wider font-mono pt-1">
            <div className="flex items-center gap-2">
              <MacAppleIcon size={16} color="#ffffff" />
              <span className="text-[11px] font-medium text-white/80">macOS Sequoia &bull; Login Window</span>
            </div>
            <div className="flex items-center gap-3.5">
              <Battery className="w-4 h-4 text-white/70" />
              <Wifi className="w-3.5 h-3.5 text-white/70" />
              <span className="text-[11px] font-medium text-white/90">{timeStr}</span>
            </div>
          </div>

          {/* Center Login Container: NO AVATAR (Image 1 Direct) */}
          <div className="my-auto flex flex-col items-center text-center px-4 max-w-md w-full">
            {/* Name & Role Header */}
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Rakesh Kayal
            </h2>
            <span className="text-xs sm:text-sm text-sky-400 font-medium tracking-wide mt-1 mb-6">
              Administrator
            </span>

            {/* Password Input Capsule (Matching Image 1) */}
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

              {/* Password Hint with 1-click autofill */}
              <div className="text-[11px] text-white/50 flex items-center justify-center gap-1.5 pt-1">
                <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                <span>Password:</span>
                <button
                  type="button"
                  onClick={handleFillPassword}
                  className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-sky-300 font-mono text-xs transition-colors cursor-pointer border border-white/10"
                  title="Click to autofill"
                >
                  Nothing to share
                </button>
              </div>
            </form>

            {/* Sub-actions (Matching Image 1) */}
            <div className="mt-8 flex items-center gap-4 text-xs">
              <button
                type="button"
                onClick={handleVisitorAccessLogin}
                className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer font-sans"
              >
                Switch Account
              </button>
              <span className="text-white/20">&bull;</span>
              <button
                type="button"
                onClick={handleVisitorAccessLogin}
                className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer font-sans font-medium"
              >
                Enter via Visitor Access
              </button>
            </div>
          </div>

          {/* macOS Bottom Footer (Matching Image 1) */}
          <div className="w-full flex items-center justify-between text-[11px] text-white/40 tracking-wider font-mono pb-1">
            <span>Apple MacBook Pro Max Web</span>
            <span>Rakesh Kayal Portfolio</span>
          </div>
        </div>
      )}
    </div>
  );
};

