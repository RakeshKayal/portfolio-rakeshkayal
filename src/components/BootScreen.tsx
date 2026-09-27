import React, { useState, useEffect } from 'react';

// Multilingual Greetings list matching the video flow
const GREETINGS_LIST = [
  { text: 'hello', fontClass: 'font-cursive' },
  { text: 'hallo', fontClass: 'font-cursive' },
  { text: 'مرحبا', fontClass: 'font-arabic' },
  { text: 'नमस्ते', fontClass: 'font-devanagari' },
  { text: 'bonjour', fontClass: 'font-cursive' },
  { text: 'hola', fontClass: 'font-cursive' },
  { text: 'ciao', fontClass: 'font-cursive' },
  { text: 'olá', fontClass: 'font-cursive' },
];

export const AppleGreetingScreen: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    // 0.9s per word transition with smooth crossfade
    const interval = setInterval(() => {
      setFade(false); // start fade out

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % GREETINGS_LIST.length);
        setFade(true); // fade in next greeting
      }, 250);
    }, 950);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Load cursive font matching the iconic Apple "hello" script */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Noto+Sans+Arabic:wght@600&family=Tiro+Devanagari+Hindi&display=swap');
        
        .font-cursive {
          font-family: 'Caveat', cursive, -apple-system, sans-serif;
        }
        .font-arabic {
          font-family: 'Noto Sans Arabic', sans-serif;
        }
        .font-devanagari {
          font-family: 'Tiro Devanagari Hindi', serif;
        }
      `}</style>

      <div
        onClick={onComplete}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black text-white select-none cursor-pointer overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(45, 55, 75, 0.45) 0%, rgba(13, 17, 24, 0.85) 50%, #000000 100%)',
        }}
      >
        {/* Top Spacer */}
        <div className="h-10" />

        {/* Center Cursive Word */}
        <div className="flex flex-col items-center justify-center my-auto">
          <span
            className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-medium tracking-wide transition-all duration-300 ease-out transform ${
              GREETINGS_LIST[index].fontClass
            } ${
              fade
                ? 'opacity-100 scale-100 blur-0'
                : 'opacity-0 scale-95 blur-[1px]'
            }`}
            style={{
              textShadow: '0 0 25px rgba(255, 255, 255, 0.45), 0 0 50px rgba(255, 255, 255, 0.2)',
            }}
          >
            {GREETINGS_LIST[index].text}
          </span>
        </div>

        {/* Bottom "CLICK ANYWHERE TO SKIP" matching the video */}
        <div className="pb-8 tracking-widest text-[10px] sm:text-[11px] font-sans font-semibold text-white/40 uppercase">
          CLICK ANYWHERE TO SKIP
        </div>
      </div>
    </>
  );
};