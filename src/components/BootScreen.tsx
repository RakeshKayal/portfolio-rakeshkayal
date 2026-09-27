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

// 3D Sculpted Ceramic Circuit Board Apple Icon[cite: 5]
export const MacAppleCircuitIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 1000 1000"
    className={`drop-shadow-2xl select-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Porcelain plate radial gradients */}
      <radialGradient id="porcelainTop" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="65%" stopColor="#f8f9fa" />
        <stop offset="100%" stopColor="#e9ecef" />
      </radialGradient>

      <linearGradient id="creaseShadow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d1d5db" />
        <stop offset="50%" stopColor="#9ca3af" />
        <stop offset="100%" stopColor="#6b7280" />
      </linearGradient>

      {/* Gold etched copper traces */}
      <linearGradient id="circuitGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="50%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>

      {/* Ambient plate underglow blur[cite: 5] */}
      <filter id="plateUnderglow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#ffffff" floodOpacity="0.8" />
        <feDropShadow dx="0" dy="16" stdDeviation="28" floodColor="#94a3b8" floodOpacity="0.35" />
      </filter>

      {/* Mask for Apple Silhouette */}
      <clipPath id="appleMask">
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
      </clipPath>
    </defs>

    {/* Main Apple Body & Leaf Group */}
    <g filter="url(#plateUnderglow)">
      {/* Leaf with internal circuitry[cite: 5] */}
      <g>
        <path
          d="M554.1 159.4c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"
          fill="url(#porcelainTop)"
          stroke="#e2e8f0"
          strokeWidth="6"
        />
        {/* Leaf Circuit Bus Lines[cite: 5] */}
        <path
          d="M480 120 L515 80 L545 40 M505 130 L535 90 L560 55 M530 135 L555 100 L575 75"
          stroke="url(#circuitGold)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />
        <circle cx="545" cy="40" r="6" fill="#b45309" />
        <circle cx="560" cy="55" r="5" fill="#b45309" />
        <circle cx="575" cy="75" r="5" fill="#b45309" />
      </g>

      {/* Segmented Apple Body */}
      <g clipPath="url(#appleMask)">
        {/* Base Porcelain Apple Slab */}
        <rect x="0" y="200" width="850" height="800" fill="url(#porcelainTop)" />

        {/* Outer Rim Bevel Glow */}
        <path
          d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2z"
          stroke="#ffffff"
          strokeWidth="24"
          fill="none"
        />

        {/* Sculpted Section Grooves[cite: 5] */}
        {/* Groove 1: Center-left diagonal trench */}
        <path
          d="M 520,280 C 440,380 340,550 300,740"
          stroke="url(#creaseShadow)"
          strokeWidth="28"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 520,280 C 440,380 340,550 300,740"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Groove 2: Curved center spine */}
        <path
          d="M 720,300 C 600,430 450,600 480,940"
          stroke="url(#creaseShadow)"
          strokeWidth="32"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 720,300 C 600,430 450,600 480,940"
          stroke="#ffffff"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />

        {/* Groove 3: Lower petal swoosh */}
        <path
          d="M 450,600 C 580,680 620,800 520,930"
          stroke="url(#creaseShadow)"
          strokeWidth="26"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 450,600 C 580,680 620,800 520,930"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Groove 4: Left horizontal wing split */}
        <path
          d="M 140,600 C 220,630 300,720 300,740"
          stroke="url(#creaseShadow)"
          strokeWidth="24"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 140,600 C 220,630 300,720 300,740"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* PCB Circuit Micro-Traces[cite: 5] */}
        {/* Top Left Quadrant Traces */}
        <g stroke="url(#circuitGold)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
          <path d="M 220,380 L 260,340 L 400,340 L 450,390" fill="none" />
          <path d="M 240,410 L 280,370 L 380,370 L 420,410" fill="none" />
          <path d="M 260,440 L 290,410 L 360,410 L 390,440" fill="none" />
          <path d="M 270,470 L 310,470 L 340,500 L 340,540" fill="none" />
          <circle cx="450" cy="390" r="7" fill="#b45309" />
          <circle cx="420" cy="410" r="6" fill="#b45309" />
          <circle cx="390" cy="440" r="5" fill="#b45309" />
        </g>

        {/* Center Diagonal Plate Traces[cite: 5] */}
        <g stroke="url(#circuitGold)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
          <path d="M 370,580 L 430,520 L 510,440 L 580,370" fill="none" />
          <path d="M 390,620 L 450,560 L 530,480 L 610,400" fill="none" />
          <path d="M 420,660 L 480,600 L 560,520 L 630,450" fill="none" />
          <circle cx="580" cy="370" r="7" fill="#b45309" />
          <circle cx="610" cy="400" r="6" fill="#b45309" />
          <circle cx="630" cy="450" r="6" fill="#b45309" />
        </g>

        {/* Lower Right Quadrant & Bite Traces[cite: 5] */}
        <g stroke="url(#circuitGold)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
          <path d="M 770,520 L 730,560 L 680,610 L 570,610 L 540,640" fill="none" />
          <path d="M 760,570 L 710,620 L 660,670 L 580,670 L 550,700" fill="none" />
          <path d="M 730,650 L 690,690 L 630,750 L 570,750" fill="none" />
          <path d="M 700,720 L 660,760 L 600,820 L 550,820" fill="none" />
          <circle cx="540" cy="640" r="7" fill="#b45309" />
          <circle cx="550" cy="700" r="6" fill="#b45309" />
          <circle cx="570" cy="750" r="6" fill="#b45309" />
          <circle cx="550" cy="820" r="5" fill="#b45309" />
        </g>

        {/* Bottom Left Petal Traces */}
        <g stroke="url(#circuitGold)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
          <path d="M 180,680 L 220,720 L 270,720 L 310,760" fill="none" />
          <path d="M 210,740 L 250,780 L 300,780 L 330,810" fill="none" />
          <path d="M 240,800 L 280,840 L 340,840" fill="none" />
          <circle cx="310" cy="760" r="6" fill="#b45309" />
          <circle cx="330" cy="810" r="5" fill="#b45309" />
        </g>

        {/* IC Pin Micro-pads[cite: 5] */}
        <g fill="#b45309" opacity="0.7">
          {[
            [350, 460], [358, 460], [366, 460], [374, 460],
            [350, 470], [358, 470], [366, 470], [374, 470],
            [590, 680], [598, 680], [606, 680], [614, 680],
            [590, 690], [598, 690], [606, 690], [614, 690],
          ].map(([x, y], idx) => (
            <rect key={idx} x={x} y={y} width="4" height="4" rx="1" />
          ))}
        </g>
      </g>
    </g>
  </svg>
);

// Backward-compatibility alias
export const MacCubeIcon = MacAppleCircuitIcon;

// Apple-style cursive greetings sequence[cite: 4]
const GREETINGS_SEQUENCE = [
  { text: 'hello', font: 'font-apple-script', dir: 'ltr' },
  { text: 'hallo', font: 'font-apple-script', dir: 'ltr' },
  { text: 'مرحبا', font: 'font-arabic-script', dir: 'rtl' },
  { text: 'नमस्ते', font: 'font-devanagari-script', dir: 'ltr' },
  { text: 'bonjour', font: 'font-apple-script', dir: 'ltr' },
  { text: 'hola', font: 'font-apple-script', dir: 'ltr' },
  { text: 'ciao', font: 'font-apple-script', dir: 'ltr' },
  { text: 'olá', font: 'font-apple-script', dir: 'ltr' },
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
  const [greetingAnim, setGreetingAnim] = useState<'fade-in' | 'visible' | 'fade-out'>('fade-in');
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

  // Overall Boot Sequence Timeline
  useEffect(() => {
    if (!isUnlocked) {
      setBootStage('cube-static');
      setGlowZoomActive(false);
      setWelcomeReady(false);
      setGreetingIndex(0);
      setGreetingAnim('fade-in');
      setPassword('');
      setIsError(false);
      setErrorMessage('');

      // 1. Static cube for 2.0s
      const zoomTimer = setTimeout(() => {
        setBootStage('logo-zoom');
        setGlowZoomActive(true);
      }, 2000);

      // 2. Start cursive greetings at 3.2s
      const greetingsTimer = setTimeout(() => {
        setBootStage('greetings');
      }, 3200);

      return () => {
        clearTimeout(zoomTimer);
        clearTimeout(greetingsTimer);
      };
    }
  }, [isUnlocked]);

  // Cursive Greeting Cycling Animation with authentic fluid hold & cross-fade[cite: 4]
  useEffect(() => {
    if (bootStage !== 'greetings') return;

    let isMounted = true;

    // Trigger Fade In
    setGreetingAnim('fade-in');

    const holdTimer = setTimeout(() => {
      if (!isMounted) return;
      setGreetingAnim('visible');
    }, 350);

    // Hold word for ~1.5s then fade out[cite: 4]
    const fadeOutTimer = setTimeout(() => {
      if (!isMounted) return;
      setGreetingAnim('fade-out');
    }, 1550);

    // Advance word after fade-out completes
    const nextWordTimer = setTimeout(() => {
      if (!isMounted) return;
      if (greetingIndex >= GREETINGS_SEQUENCE.length - 1) {
        // Automatically proceed to welcome screen once full loop ends
        setBootStage('portfolio-welcome');
      } else {
        setGreetingIndex((prev) => prev + 1);
      }
    }, 1900);

    return () => {
      isMounted = false;
      clearTimeout(holdTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(nextWordTimer);
    };
  }, [bootStage, greetingIndex]);

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

  const currentGreeting = GREETINGS_SEQUENCE[greetingIndex];

  if (isUnlocked) return null;

  return (
    <>
      {/* Handcrafted fluid script typography matching Apple's cursive handwriting[cite: 4] */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&family=Amiri:ital,wght@1,400;1,700&family=Kalam:wght@400;700&display=swap');

        .font-apple-script {
          font-family: 'Cedarville Cursive', cursive, -apple-system, sans-serif;
          font-weight: 400;
          letter-spacing: -0.01em;
        }

        .font-arabic-script {
          font-family: 'Amiri', serif;
          font-style: italic;
          letter-spacing: 0.02em;
        }

        .font-devanagari-script {
          font-family: 'Kalam', cursive, sans-serif;
          letter-spacing: 0.05em;
        }

        .apple-boot-spotlight {
          background: radial-gradient(
            circle at 50% 50%,
            #222a36 0%,
            #141923 35%,
            #0b0d13 65%,
            #050608 100%
          );
        }
      `}</style>

      <div
        id="boot-screen"
        className="fixed inset-0 z-50 flex flex-col justify-between select-none overflow-hidden font-sans bg-black text-white"
      >
        {/* ================= STAGE 1 & 2: CIRCUIT APPLE LOGO & BLOOM ================= */}
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
              <MacAppleCircuitIcon size={110} />

              {/* Inverted mirror floor reflection */}
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
                  <MacAppleCircuitIcon size={110} />
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 inset-x-0 flex justify-center text-[11px] text-white/30 font-mono tracking-wider">
              <span>Click to continue</span>
            </div>
          </div>
        )}

        {/* ================= STAGE 3: CURSIVE GREETING SCREEN[cite: 4] ================= */}
        {bootStage === 'greetings' && (
          <div
            onClick={() => setBootStage('portfolio-welcome')}
            className="relative w-full h-full flex flex-col justify-between items-center apple-boot-spotlight select-none cursor-pointer overflow-hidden text-white"
          >
            {/* Top Spacer */}
            <div className="h-14" />

            {/* Glowing Cursive Center Word[cite: 4] */}
            <div className="relative flex flex-col items-center justify-center my-auto px-6">
              {/* Soft specular ambient halo */}
              <div className="absolute w-[360px] h-[160px] bg-white/[0.07] rounded-full blur-[60px] pointer-events-none" />

              <span
                dir={currentGreeting.dir}
                className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white select-none transition-all duration-[450ms] ease-in-out transform ${
                  currentGreeting.font
                } ${
                  greetingAnim === 'fade-out'
                    ? 'opacity-0 scale-[0.98] blur-[2px]'
                    : greetingAnim === 'fade-in'
                    ? 'opacity-0 scale-[1.01] blur-[1px]'
                    : 'opacity-100 scale-100 blur-0'
                }`}
                style={{
                  textShadow:
                    '0 0 20px rgba(255, 255, 255, 0.4), 0 0 45px rgba(255, 255, 255, 0.15)',
                }}
              >
                {currentGreeting.text}
              </span>
            </div>

            {/* Exact Bottom Label from Video[cite: 4] */}
            <div className="pb-10 tracking-[0.25em] text-[11px] font-sans font-medium text-white/35 uppercase select-none">
              Click anywhere to skip
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
                <MacAppleCircuitIcon size={20} />
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
                <MacAppleCircuitIcon size={52} className="relative z-10" />
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
                <MacAppleCircuitIcon size={20} />
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