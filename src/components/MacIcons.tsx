import React from 'react';

// Authentic macOS Finder Icon (Two-Tone Smiling Face)
export const MacFinderIcon: React.FC<{ size?: number; className?: string }> = ({
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
      <linearGradient id="finderBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
      <linearGradient id="finderLeft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="finderRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    {/* Squircle base */}
    <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#finderBg)" stroke="#cbd5e1" strokeWidth="1" />

    {/* Left Face Halve */}
    <path
      d="M 12,24 C 12,17 17,12 24,12 L 50,12 L 50,88 L 24,88 C 17,88 12,83 12,76 Z"
      fill="url(#finderLeft)"
    />

    {/* Right Face Halve */}
    <path
      d="M 50,12 L 76,12 C 83,12 88,17 88,24 L 88,76 C 88,83 83,88 76,88 L 50,88 Z"
      fill="url(#finderRight)"
    />

    {/* Center Division Nose Line */}
    <path d="M 50,12 L 50,56 C 45,56 42,61 45,67 C 47,71 50,71 50,71 L 50,88" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Eyes */}
    <ellipse cx="32" cy="42" rx="4.5" ry="7" fill="#0f172a" />
    <ellipse cx="68" cy="42" rx="4.5" ry="7" fill="#0f172a" />

    {/* Iconic Finder Smile */}
    <path
      d="M 28,64 C 36,80 64,80 72,64"
      stroke="#0f172a"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// Authentic macOS Safari Compass Icon
export const MacSafariIcon: React.FC<{ size?: number; className?: string }> = ({
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
      <linearGradient id="safariBase" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
      <linearGradient id="safariDial" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="needleRed" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff4d4f" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
      <linearGradient id="needleWhite" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
    </defs>
    {/* Squircle base */}
    <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#safariBase)" stroke="#cbd5e1" strokeWidth="1" />

    {/* Blue Compass Dial */}
    <circle cx="50" cy="50" r="38" fill="url(#safariDial)" stroke="#ffffff" strokeWidth="1.5" />

    {/* Outer Dial Rings */}
    <circle cx="50" cy="50" r="33" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
    <circle cx="50" cy="50" r="28" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />

    {/* Dial Compass Ticks */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
      <line
        key={deg}
        x1="50"
        y1="14"
        x2="50"
        y2={deg % 90 === 0 ? "20" : "17"}
        stroke="#ffffff"
        strokeWidth={deg % 90 === 0 ? "1.8" : "1"}
        strokeLinecap="round"
        transform={`rotate(${deg} 50 50)`}
      />
    ))}

    {/* Compass Needle (Tilted ~45deg) */}
    <g transform="rotate(45 50 50)">
      {/* North Red Needle */}
      <polygon points="50,15 44,50 56,50" fill="url(#needleRed)" />
      {/* South White Needle */}
      <polygon points="50,85 44,50 56,50" fill="url(#needleWhite)" />
      {/* Center Pivot */}
      <circle cx="50" cy="50" r="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="1.5" fill="#dc2626" />
    </g>
  </svg>
);

// Authentic macOS System Settings Icon (Gears + Red Notification Badge)
export const MacSettingsIcon: React.FC<{ size?: number; showBadge?: boolean; className?: string }> = ({
  size = 48,
  showBadge = true,
  className = '',
}) => (
  <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="drop-shadow-md select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="settingsBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d1d5db" />
          <stop offset="50%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#6b7280" />
        </linearGradient>
        <linearGradient id="gearMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3f4f6" />
          <stop offset="50%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#4b5563" />
        </linearGradient>
      </defs>
      {/* Metallic Squircle */}
      <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#settingsBg)" stroke="#9ca3af" strokeWidth="1" />

      {/* Outer Gear */}
      <g transform="translate(50, 50)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <rect
            key={deg}
            x="-6"
            y="-38"
            width="12"
            height="14"
            rx="3"
            fill="url(#gearMetal)"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="30" fill="url(#gearMetal)" />
        <circle r="20" fill="#4b5563" />
        <circle r="12" fill="url(#gearMetal)" />
        <circle r="6" fill="#374151" />
      </g>
    </svg>

    {/* Red Notification Badge "1" */}
    {showBadge && (
      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white text-white font-bold text-[11px] flex items-center justify-center shadow-lg font-sans">
        1
      </span>
    )}
  </div>
);

// Authentic macOS Sky-Blue 3D Folder Icon
export const MacFolderIcon: React.FC<{ size?: number; className?: string; badge?: string }> = ({
  size = 48,
  className = '',
  badge,
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
      <linearGradient id="folderBack" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="folderFront" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#67e8f9" />
        <stop offset="40%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="folderPocket" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#bae6fd" />
        <stop offset="100%" stopColor="#7dd3fc" />
      </linearGradient>
    </defs>
    {/* Folder Back Tab */}
    <path
      d="M 12,24 C 12,19 16,15 21,15 L 42,15 C 47,15 50,18 53,22 L 56,26 L 81,26 C 86,26 90,30 90,35 L 90,80 C 90,85 86,89 81,89 L 19,89 C 14,89 10,85 10,80 Z"
      fill="url(#folderBack)"
    />

    {/* Folder Inner Pocket Highlight */}
    <path
      d="M 14,35 L 86,35 L 86,45 L 14,45 Z"
      fill="url(#folderPocket)"
      opacity="0.8"
    />

    {/* Folder Front Flap */}
    <path
      d="M 8,36 C 8,32 12,29 16,29 L 84,29 C 88,29 92,32 92,36 L 90,82 C 90,87 86,91 81,91 L 19,91 C 14,91 10,87 10,82 Z"
      fill="url(#folderFront)"
      stroke="#38bdf8"
      strokeWidth="0.8"
    />

    {/* Subtle Folder Lip Shadow */}
    <path d="M 10,36 L 90,36" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.5" />

    {/* Optional badge */}
    {badge === 'download' && (
      <g transform="translate(50, 60)">
        <circle r="12" fill="#0369a1" fillOpacity="0.6" />
        <path d="M 0,-6 L 0,4 M -4,0 L 0,4 L 4,0" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="-5" y1="7" x2="5" y2="7" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    )}
  </svg>
);

// Authentic macOS Mail Icon
export const MacMailIcon: React.FC<{ size?: number; className?: string }> = ({
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
      <linearGradient id="mailBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#1e40af" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#mailBg)" stroke="#38bdf8" strokeWidth="1" />

    {/* White Mail Envelope */}
    <g transform="translate(18, 25)">
      <rect width="64" height="50" rx="6" fill="#ffffff" />
      <path d="M 2,4 L 32,28 L 62,4" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 2,46 L 22,25 M 62,46 L 42,25" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

// Authentic macOS Terminal Icon
export const MacTerminalIcon: React.FC<{ size?: number; className?: string }> = ({
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
      <linearGradient id="termBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#27272a" />
        <stop offset="100%" stopColor="#09090b" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#termBg)" stroke="#3f3f46" strokeWidth="1.2" />

    {/* Prompt symbols */}
    <path d="M 24,34 L 42,50 L 24,66" stroke="#4ade80" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <line x1="48" y1="66" x2="74" y2="66" stroke="#f4f4f5" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

// Authentic macOS Launchpad Icon
export const MacLaunchpadIcon: React.FC<{ size?: number; className?: string }> = ({
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
      <linearGradient id="launchBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#launchBg)" stroke="#64748b" strokeWidth="1" />

    {/* 9 Colorful App Tiles */}
    {[
      { x: 22, y: 22, c: '#ef4444' },
      { x: 42, y: 22, c: '#f59e0b' },
      { x: 62, y: 22, c: '#10b981' },
      { x: 22, y: 42, c: '#06b6d4' },
      { x: 42, y: 42, c: '#3b82f6' },
      { x: 62, y: 42, c: '#8b5cf6' },
      { x: 22, y: 62, c: '#ec4899' },
      { x: 42, y: 62, c: '#14b8a6' },
      { x: 62, y: 62, c: '#f97316' },
    ].map((tile, i) => (
      <rect key={i} x={tile.x} y={tile.y} width="16" height="16" rx="4" fill={tile.c} />
    ))}
  </svg>
);

// Authentic macOS Siri / Apple Intelligence Icon
export const MacSiriIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = '',
}) => (
  <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
    <div className="absolute inset-0 rounded-[22px] bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600 shadow-md flex items-center justify-center overflow-hidden border border-white/20">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-300 via-purple-300 to-pink-300 animate-spin opacity-90 blur-[1px]"></div>
      <div className="absolute w-5 h-5 rounded-full bg-white/30 backdrop-blur-sm"></div>
    </div>
  </div>
);

// Authentic macOS Trash Can Icon
export const MacTrashIcon: React.FC<{ size?: number; className?: string }> = ({
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
      <linearGradient id="trashCan" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="24" rx="26" ry="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
    <path
      d="M 26,24 L 32,84 C 32,88 40,91 50,91 C 60,91 68,88 68,84 L 74,24 Z"
      fill="url(#trashCan)"
      fillOpacity="0.85"
      stroke="#94a3b8"
      strokeWidth="1.5"
    />
    <line x1="38" y1="28" x2="41" y2="86" stroke="#94a3b8" strokeWidth="1" />
    <line x1="50" y1="30" x2="50" y2="88" stroke="#94a3b8" strokeWidth="1" />
    <line x1="62" y1="28" x2="59" y2="86" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="48" cy="20" r="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
  </svg>
);

// Authentic macOS WhatsApp Messenger Icon
export const MacWhatsAppIcon: React.FC<{ size?: number; className?: string }> = ({
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
      <linearGradient id="waBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#25D366" />
        <stop offset="100%" stopColor="#128C7E" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#waBg)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    
    <path
      d="M50 21C34.5 21 22 33.1 22 48.1c0 5.4 1.6 10.4 4.3 14.7L22 79l17-4.4c4.1 2.2 8.8 3.5 13.8 3.5 15.5 0 28-12.1 28-27.1S65.5 21 50 21z"
      fill="#ffffff"
      fillOpacity="0.95"
    />
    <path
      d="M62.5 56.4c-.8-.4-4.7-2.3-5.4-2.6-.7-.3-1.3-.4-1.8.4-.5.8-2 2.6-2.5 3.1-.5.5-.9.6-1.7.2-.8-.4-3.4-1.3-6.5-4.1-2.4-2.1-4-4.8-4.5-5.6-.5-.8-.1-1.3.3-1.7.4-.4.8-.9 1.2-1.4.4-.5.5-.8.8-1.3.3-.5.1-1-.1-1.4-.2-.4-1.8-4.4-2.5-6-.7-1.6-1.4-1.3-1.9-1.4h-1.6c-.6 0-1.5.2-2.3 1.1-.8.8-3 2.9-3 7.1s3.1 8.3 3.5 8.8c.4.6 6.1 9.3 14.8 13.1 2.1.9 3.7 1.4 5 1.8 2.1.7 4 .6 5.5.4 1.7-.3 5.2-2.1 5.9-4.2.7-2.1.7-3.8.5-4.2-.2-.4-.8-.6-1.6-1z"
      fill="#128C7E"
    />
  </svg>
);

// 3D Isometric Neon Cube Icon
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

    <rect x="2" y="2" width="96" height="96" rx="26" fill="url(#cubeTileBg)" stroke="#3b4252" strokeWidth="1.2" />
    <rect x="5" y="5" width="90" height="90" rx="23" stroke="#1f242d" strokeWidth="1.5" />

    <polygon
      points="50,25 74,38 50,51 26,38"
      fill="url(#cubeTopFace)"
      stroke="#cbd5e1"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />

    <polygon points="26,38 50,51 50,75 26,62" fill="#131823" fillOpacity="0.8" />
    <polygon points="50,51 74,38 74,62 50,75" fill="#171b26" fillOpacity="0.8" />

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

    <circle cx="50" cy="51" r="5" fill="#ffffff" />
    <circle cx="50" cy="51" r="6" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" fill="none" />
  </svg>
);

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
        {/* Deep Groove 1: Center-left diagonal trench */}
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

        {/* Deep Groove 2: Curved center spine */}
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

        {/* Deep Groove 3: Lower petal swoosh */}
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

        {/* Deep Groove 4: Left horizontal wing split */}
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

        {/* ================= PCB Circuit Micro-Traces[cite: 5] ================= */}
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

// MacAppleIcon exported as the ceramic circuit board icon[cite: 5]
export const MacAppleIcon = MacAppleCircuitIcon;